import os
import subprocess
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import get_db, engine, Base
from .models import Employer, Candidate, Job, Skill, CandidateSkill, JobSkill, Application
from .schemas import (
    SystemStats, JobSimple, JobDetail, CandidateSimple, CandidateDetail,
    MatchRequest, MatchResponse, BIDashboardData, EvaluationSummary
)
from .ml_service import matching_engine
from .bi_service import get_bi_dashboard_data
from .ground_truth import evaluate_matching_model

# Khởi tạo bảng nếu chưa có
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartHire Mini API",
    description="Hệ thống tìm việc thông minh tích hợp AI (CV Matching) và BI (Business Intelligence) - Group 8",
    version="1.0.0"
)

# Cấu hình CORS để frontend React kết nối mượt mà
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. HỆ THỐNG & TỔNG QUAN DATABASE (CHECKLIST 1)
# ==========================================
@app.get("/api/v1/system/overview", response_model=SystemStats, tags=["System"])
def get_system_overview(db: Session = Depends(get_db)):
    """
    Trả về số lượng bản ghi thực tế trong 7 bảng của SQLite database
    """
    total_candidates = db.query(Candidate).count()
    total_employers = db.query(Employer).count()
    total_jobs = db.query(Job).count()
    total_skills = db.query(Skill).count()
    total_candidate_skills = db.query(CandidateSkill).count()
    total_job_skills = db.query(JobSkill).count()
    total_applications = db.query(Application).count()

    return SystemStats(
        total_candidates=total_candidates,
        total_employers=total_employers,
        total_jobs=total_jobs,
        total_skills=total_skills,
        total_candidate_skills=total_candidate_skills,
        total_job_skills=total_job_skills,
        total_applications=total_applications
    )


# ==========================================
# 2. QUẢN LÝ DỮ LIỆU JOBS & CANDIDATES
# ==========================================
@app.get("/api/v1/jobs", response_model=List[JobSimple], tags=["Jobs"])
def list_jobs(db: Session = Depends(get_db)):
    """
    Lấy danh sách các tin tuyển dụng đang mở
    """
    jobs = db.query(Job).order_by(Job.id.asc()).all()
    result = []
    for j in jobs:
        emp_name = j.employer.name if j.employer else "Không xác định"
        result.append(
            JobSimple(
                id=j.id,
                title=j.title,
                salary_min=j.salary_min,
                salary_max=j.salary_max,
                min_experience_years=j.min_experience_years,
                posted_date=j.posted_date,
                employer_name=emp_name
            )
        )
    return result


@app.get("/api/v1/jobs/{job_id}", response_model=JobDetail, tags=["Jobs"])
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    """
    Lấy thông tin chi tiết một tin tuyển dụng theo ID
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin tuyển dụng")
    
    req_skills = [js.skill.name for js in job.skills if js.skill]
    emp_name = job.employer.name if job.employer else "Không xác định"

    return JobDetail(
        id=job.id,
        title=job.title,
        employer_id=job.employer_id,
        employer_name=emp_name,
        description=job.description,
        requirements=job.requirements,
        min_experience_years=job.min_experience_years,
        salary_min=job.salary_min,
        salary_max=job.salary_max,
        currency=job.currency,
        posted_date=job.posted_date,
        status=job.status,
        required_skills=req_skills
    )


@app.get("/api/v1/candidates", response_model=List[CandidateSimple], tags=["Candidates"])
def list_candidates(db: Session = Depends(get_db)):
    """
    Lấy danh sách các ứng viên mẫu
    """
    candidates = db.query(Candidate).order_by(Candidate.id.asc()).all()
    result = []
    for c in candidates:
        c_skills = [cs.skill.name for cs in c.skills if cs.skill]
        result.append(
            CandidateSimple(
                id=c.id,
                full_name=c.full_name,
                email=c.email,
                current_title=c.current_title,
                years_of_experience=c.years_of_experience,
                skills=c_skills
            )
        )
    return result


@app.get("/api/v1/candidates/{candidate_id}", response_model=CandidateDetail, tags=["Candidates"])
def get_candidate_detail(candidate_id: int, db: Session = Depends(get_db)):
    """
    Lấy chi tiết một ứng viên kèm nội dung CV mẫu
    """
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Không tìm thấy ứng viên")
    
    c_skills = [cs.skill.name for cs in cand.skills if cs.skill]
    return CandidateDetail(
        id=cand.id,
        full_name=cand.full_name,
        email=cand.email,
        phone=cand.phone,
        current_title=cand.current_title,
        years_of_experience=cand.years_of_experience,
        cv_text=cand.cv_text,
        skills=c_skills
    )


# ==========================================
# 3. AI/ML CV MATCHING (CHECKLIST 2)
# ==========================================
@app.post("/api/v1/matching/analyze", response_model=MatchResponse, tags=["AI Matching"])
def analyze_cv_matching(req: MatchRequest, db: Session = Depends(get_db)):
    """
    API Phân tích mức độ phù hợp giữa CV và JD:
    - Xử lý văn bản CV dạng text
    - Trích xuất kỹ năng bằng bộ từ điển chuẩn hóa regex
    - Vector hóa TF-IDF bằng vectorizer tham chiếu đã fit sẵn
    - Đo Cosine Similarity (trọng số mặc định 60%)
    - Đo tỷ lệ kỹ năng phù hợp (trọng số mặc định 40%)
    - Trả về Matching Score (0 - 100), kỹ năng trùng khớp và còn thiếu
    """
    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin tuyển dụng với ID đã chọn")

    # Lấy danh sách kỹ năng đã gán trong database
    predefined_skills = [js.skill.name for js in job.skills if js.skill]
    emp_name = job.employer.name if job.employer else "Không xác định"

    match_result = matching_engine.match_cv_to_job(
        cv_text=req.cv_text,
        job_description=job.description,
        job_requirements=job.requirements,
        predefined_job_skills=predefined_skills,
        weight_tfidf=req.weight_tfidf,
        weight_skills=req.weight_skills
    )

    return MatchResponse(
        job_id=job.id,
        job_title=job.title,
        employer_name=emp_name,
        matching_score=match_result["matching_score"],
        tfidf_similarity=match_result["tfidf_similarity"],
        skill_match_ratio=match_result["skill_match_ratio"],
        matched_skills=match_result["matched_skills"],
        missing_skills=match_result["missing_skills"],
        extracted_cv_skills=match_result["extracted_cv_skills"],
        required_job_skills=match_result["required_job_skills"],
        evaluation_comment=match_result["evaluation_comment"]
    )


# ==========================================
# 4. DASHBOARD BI (CHECKLIST 3)
# ==========================================
@app.get("/api/v1/bi/dashboard", response_model=BIDashboardData, tags=["BI Dashboard"])
def get_bi_analytics(db: Session = Depends(get_db)):
    """
    Trả về dữ liệu tính toán cho 3 nhóm biểu đồ BI:
    1. Số lượng ứng viên theo kỹ năng
    2. Xu hướng mức lương theo thời gian (từ các JD mô phỏng)
    3. Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (dựa trên phễu nhất quán)
    """
    return get_bi_dashboard_data(db)


# ==========================================
# 5. KIỂM THỬ & ĐÁNH GIÁ THỰC TẾ (CHECKLIST 4 & 5)
# ==========================================
@app.get("/api/v1/testing/evaluation", response_model=EvaluationSummary, tags=["Testing"])
def get_model_evaluation(
    threshold: float = Query(45.0, description="Ngưỡng phân loại nhị phân (Match nếu Score >= threshold)")
):
    """
    Thực hiện kiểm thử thực tế trên tập 12 cặp CV/JD được gán nhãn Ground Truth.
    Tính toán và trả về chính xác:
    - Confusion Matrix: TP, TN, FP, FN
    - Metrics thực đo: Accuracy, Precision, Recall, F1 Score
    - Chi tiết từng cặp kiểm thử
    """
    return evaluate_matching_model(matching_engine, threshold=threshold)


@app.get("/api/v1/testing/run-suite", tags=["Testing"])
def run_automated_test_suite():
    """
    Chạy trực tiếp pytest và trả về tóm tắt kết quả
    """
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    test_path = os.path.join(backend_dir, "tests", "test_system.py")
    
    try:
        res = subprocess.run(
            ["pytest", test_path, "-v", "--tb=short"],
            capture_output=True,
            text=True,
            timeout=30,
            cwd=backend_dir
        )
        return {
            "status": "success" if res.returncode == 0 else "failure",
            "return_code": res.returncode,
            "stdout": res.stdout,
            "stderr": res.stderr
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
