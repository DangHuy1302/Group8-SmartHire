import os
import sys
import time
import subprocess
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import get_db, engine, Base
from .models import Employer, Candidate, Job, Skill, CandidateSkill, JobSkill, Application
from .schemas import (
    SystemStats, JobSimple, JobDetail, CandidateSimple, CandidateDetail,
    MatchRequest, MatchResponse, CustomJobMatchRequest, CVExtractResponse,
    BIDashboardData, EvaluationSummary, SkillGapItem, CVSectionRecommendation
)
from .ml_service import matching_engine
from .bi_service import get_bi_dashboard_data
from .ground_truth import evaluate_matching_model
from .cv_parser import extract_text_from_cv_file
from .skill_gap_service import generate_skill_gaps, generate_cv_outline_recommendations

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
# 3. AI/ML CV MATCHING, UPLOAD & SKILL GAPS (CHECKLIST 2 & NÂNG CẤP)
# ==========================================
@app.post("/api/v1/cv/extract-text", response_model=CVExtractResponse, tags=["AI Matching"])
async def extract_cv_text_from_file(file: UploadFile = File(...)):
    """
    Trích xuất nội dung văn bản thực sự từ file CV dạng PDF hoặc DOCX.
    - Không lưu trữ tệp vào database để bảo mật dữ liệu cá nhân.
    - Phát hiện file PDF scan không có text layer để thông báo rõ ràng cho người dùng.
    """
    filename = file.filename or "uploaded_cv"
    lower_name = filename.lower()
    if not (lower_name.endswith(".pdf") or lower_name.endswith(".docx")):
        raise HTTPException(
            status_code=400,
            detail="Định dạng tệp không được hỗ trợ. Vui lòng chỉ tải lên tệp PDF (.pdf) hoặc Word (.docx)."
        )

    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Tệp tải lên rỗng (0 bytes).")
        
        extracted_text, file_type = extract_text_from_cv_file(content, filename)
        
        if not extracted_text or not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Tệp không chứa văn bản trích xuất được. Nếu là file scan/ảnh chụp, vui lòng dán nội dung trực tiếp."
            )

        words = len(extracted_text.split())
        chars = len(extracted_text)

        return CVExtractResponse(
            text=extracted_text,
            filename=filename,
            file_type=file_type,
            char_count=chars,
            word_count=words,
            status="success",
            message=f"Đã trích xuất thành công {words} từ ({chars} ký tự) từ tệp {file_type}."
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi đọc file: {str(e)}")


@app.post("/api/v1/matching/analyze", response_model=MatchResponse, tags=["AI Matching"])
def analyze_cv_matching(req: MatchRequest, db: Session = Depends(get_db)):
    """
    API Phân tích mức độ phù hợp giữa CV và JD mẫu trong Database:
    - Xử lý văn bản CV dạng text
    - Trích xuất kỹ năng bằng bộ từ điển chuẩn hóa regex
    - Vector hóa TF-IDF bằng vectorizer tham chiếu đã fit sẵn
    - Đo Cosine Similarity (trọng số mặc định 60%)
    - Đo tỷ lệ kỹ năng phù hợp (trọng số mặc định 40%)
    - Tự động sinh phân tích khoảng trống kỹ năng (Skill Gaps)
    - Tự động gợi ý cải thiện 6 phần cốt lõi của Outline CV
    """
    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin tuyển dụng với ID đã chọn")

    # Lấy danh sách kỹ năng đã gán trong database
    predefined_skills = [js.skill.name for js in job.skills if js.skill]
    emp_name = job.employer.name if job.employer else "Không xác định"

    start_perf = time.perf_counter()
    match_result = matching_engine.match_cv_to_job(
        cv_text=req.cv_text,
        job_description=job.description,
        job_requirements=job.requirements,
        predefined_job_skills=predefined_skills,
        weight_tfidf=req.weight_tfidf,
        weight_skills=req.weight_skills
    )
    inference_ms = round((time.perf_counter() - start_perf) * 1000.0, 2)

    # Sinh phân tích khoảng trống kỹ năng (Skill Gaps) và gợi ý cải thiện CV Outline
    gaps_raw = generate_skill_gaps(match_result["missing_skills"], job.title, max_gaps=5)
    outline_raw = generate_cv_outline_recommendations(
        cv_skills=match_result["extracted_cv_skills"],
        matched_skills=match_result["matched_skills"],
        missing_skills=match_result["missing_skills"],
        job_title=job.title,
        employer_name=emp_name
    )

    skill_gaps = [SkillGapItem(**g) for g in gaps_raw]
    outline_recs = [CVSectionRecommendation(**o) for o in outline_raw]

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
        evaluation_comment=match_result["evaluation_comment"],
        inference_time_ms=inference_ms,
        skill_gaps=skill_gaps,
        cv_outline_recommendations=outline_recs,
        is_custom_jd=False
    )


@app.post("/api/v1/matching/analyze-custom", response_model=MatchResponse, tags=["AI Matching"])
def analyze_custom_cv_matching(req: CustomJobMatchRequest):
    """
    API Phân tích mức độ phù hợp giữa CV và JD Tùy Chỉnh do người dùng tự nhập:
    - Đưa trực tiếp nội dung JD tùy chỉnh vào mô hình ML thực tế (TF-IDF + Skill Taxonomy)
    - Tự động sinh phân tích khoảng trống kỹ năng (Skill Gaps)
    - Tự động gợi ý cải thiện Outline CV theo đúng vị trí tùy chỉnh
    """
    if not req.job_title.strip():
        raise HTTPException(status_code=400, detail="Vui lòng nhập tên vị trí tuyển dụng.")
    if not req.description.strip():
        raise HTTPException(status_code=400, detail="Vui lòng nhập mô tả yêu cầu công việc của JD.")

    emp_name = req.employer_name.strip() if req.employer_name else "Doanh nghiệp tuyển dụng"

    start_perf = time.perf_counter()
    match_result = matching_engine.match_cv_to_job(
        cv_text=req.cv_text,
        job_description=req.description,
        job_requirements=f"Vị trí: {req.job_title}\nKỹ năng yêu cầu: {', '.join(req.required_skills)}",
        predefined_job_skills=req.required_skills,
        weight_tfidf=req.weight_tfidf,
        weight_skills=req.weight_skills
    )
    inference_ms = round((time.perf_counter() - start_perf) * 1000.0, 2)

    gaps_raw = generate_skill_gaps(match_result["missing_skills"], req.job_title, max_gaps=5)
    outline_raw = generate_cv_outline_recommendations(
        cv_skills=match_result["extracted_cv_skills"],
        matched_skills=match_result["matched_skills"],
        missing_skills=match_result["missing_skills"],
        job_title=req.job_title,
        employer_name=emp_name
    )

    skill_gaps = [SkillGapItem(**g) for g in gaps_raw]
    outline_recs = [CVSectionRecommendation(**o) for o in outline_raw]

    return MatchResponse(
        job_id=None,
        job_title=req.job_title,
        employer_name=emp_name,
        matching_score=match_result["matching_score"],
        tfidf_similarity=match_result["tfidf_similarity"],
        skill_match_ratio=match_result["skill_match_ratio"],
        matched_skills=match_result["matched_skills"],
        missing_skills=match_result["missing_skills"],
        extracted_cv_skills=match_result["extracted_cv_skills"],
        required_job_skills=match_result["required_job_skills"],
        evaluation_comment=match_result["evaluation_comment"],
        inference_time_ms=inference_ms,
        skill_gaps=skill_gaps,
        cv_outline_recommendations=outline_recs,
        is_custom_jd=True
    )


# ==========================================
# 4. DASHBOARD BI (CHECKLIST 3)
# ==========================================
@app.get("/api/v1/bi/dashboard", response_model=BIDashboardData, tags=["BI Dashboard"])
def get_bi_analytics(
    category: Optional[str] = Query(None, description="Lọc kỹ năng theo nhóm danh mục"),
    db: Session = Depends(get_db)
):
    """
    Trả về dữ liệu tính toán cho 3 nhóm biểu đồ BI chính + biểu đồ phân bố nhóm chuyên môn:
    1. Số lượng ứng viên theo kỹ năng (hỗ trợ lọc danh mục)
    2. Xu hướng mức lương theo thời gian (từ các JD mô phỏng)
    3. Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (dựa trên phễu nhất quán)
    4. Phân bố việc làm và mức lương theo nhóm chuyên môn
    5. Nhận xét BI tự động sinh bằng quy tắc từ số liệu thật
    """
    return get_bi_dashboard_data(db, category_filter=category)


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


@app.api_route("/api/v1/testing/run-suite", methods=["GET", "POST"], tags=["Testing"])
def run_automated_test_suite():
    """
    Chạy trực tiếp pytest trong môi trường phát triển cục bộ và trả về tóm tắt kết quả
    """
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    test_path = os.path.join(backend_dir, "tests", "test_system.py")
    python_exe = sys.executable
    
    try:
        res = subprocess.run(
            [python_exe, "-m", "pytest", test_path, "-v", "--tb=short"],
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

