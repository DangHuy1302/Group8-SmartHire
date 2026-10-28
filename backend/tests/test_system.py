import pytest
import os
import sys
from fastapi.testclient import TestClient

# Thêm đường dẫn backend vào sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
from app.database import SessionLocal
from app.models import Candidate, Employer, Job, Skill, Application
from app.ml_service import matching_engine
from app.ground_truth import evaluate_matching_model

client = TestClient(app)

# ----------------------------------------------------
# 1. KIỂM THỬ DATABASE & SEED DATA
# ----------------------------------------------------
def test_database_record_counts():
    """Test 1: Kiểm tra đúng số lượng bản ghi tối thiểu theo yêu cầu đề bài"""
    db = SessionLocal()
    try:
        candidates_count = db.query(Candidate).count()
        employers_count = db.query(Employer).count()
        jobs_count = db.query(Job).count()
        applications_count = db.query(Application).count()
        skills_count = db.query(Skill).count()

        assert candidates_count >= 20, f"Mong đợi ít nhất 20 ứng viên, thực tế: {candidates_count}"
        assert employers_count >= 5, f"Mong đợi ít nhất 5 nhà tuyển dụng, thực tế: {employers_count}"
        assert jobs_count >= 15, f"Mong đợi ít nhất 15 tin tuyển dụng, thực tế: {jobs_count}"
        assert applications_count >= 40, f"Mong đợi ít nhất 40 đơn ứng tuyển, thực tế: {applications_count}"
        assert skills_count >= 20, f"Mong đợi ít nhất 20 kỹ năng chuẩn hóa, thực tế: {skills_count}"
    finally:
        db.close()


def test_system_overview_api():
    """Test 2: Kiểm tra API /api/v1/system/overview trả về dữ liệu đúng chuẩn"""
    response = client.get("/api/v1/system/overview")
    assert response.status_code == 200
    data = response.json()
    assert "total_candidates" in data
    assert "total_employers" in data
    assert "total_jobs" in data
    assert "total_skills" in data
    assert "total_applications" in data
    assert data["total_candidates"] >= 20
    assert data["total_applications"] >= 40


def test_jobs_and_candidates_list_api():
    """Test 3: Kiểm tra API danh sách Jobs và Candidates"""
    resp_jobs = client.get("/api/v1/jobs")
    assert resp_jobs.status_code == 200
    jobs = resp_jobs.json()
    assert len(jobs) >= 15
    assert "title" in jobs[0]
    assert "salary_min" in jobs[0]

    resp_cands = client.get("/api/v1/candidates")
    assert resp_cands.status_code == 200
    cands = resp_cands.json()
    assert len(cands) >= 20
    assert "full_name" in cands[0]
    assert "skills" in cands[0]


# ----------------------------------------------------
# 2. KIỂM THỬ AI/ML CV MATCHING ENGINE
# ----------------------------------------------------
def test_ai_matching_strong_match():
    """Test 4: Trường hợp CV rất phù hợp với JD (Python Backend vs Python Backend)"""
    cv = "Lập trình viên Backend có kinh nghiệm với Python, FastAPI, PostgreSQL, Docker, Git và RESTful API."
    jd_desc = "Cần tuyển kỹ sư Backend Python phát triển hệ thống API hiệu năng cao."
    jd_req = "Yêu cầu Python, FastAPI, PostgreSQL, Docker, Git."
    skills = ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"]

    result = matching_engine.match_cv_to_job(cv, jd_desc, jd_req, skills)
    
    assert result["matching_score"] >= 65.0, f"Điểm mong đợi >= 65, thực tế: {result['matching_score']}"
    assert result["skill_match_ratio"] >= 80.0
    assert "Python" in result["matched_skills"]
    assert "FastAPI" in result["matched_skills"]


def test_ai_matching_mismatch():
    """Test 5: Trường hợp CV trái ngành (Kế toán vs Tuyển dụng DevOps)"""
    cv = "Nhân viên kế toán tổng hợp, kê khai thuế, phần mềm Excel và MISA, lập báo cáo tài chính."
    jd_desc = "Tuyển kỹ sư DevOps quản trị cụm Kubernetes và đám mây AWS."
    jd_req = "Yêu cầu Linux, Docker, Kubernetes, CI/CD, AWS."
    skills = ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS"]

    result = matching_engine.match_cv_to_job(cv, jd_desc, jd_req, skills)
    
    assert result["matching_score"] <= 30.0, f"Điểm trái ngành mong đợi <= 30, thực tế: {result['matching_score']}"
    assert len(result["matched_skills"]) == 0
    assert len(result["missing_skills"]) == 5


def test_ai_matching_empty_cv_edge_case():
    """Test 6: Kiểm thử biên - CV rỗng (Empty CV text)"""
    cv = ""
    jd_desc = "Tuyển kỹ sư phần mềm React và TypeScript."
    jd_req = "Yêu cầu React, TypeScript, HTML/CSS."
    skills = ["React", "TypeScript", "HTML/CSS"]

    result = matching_engine.match_cv_to_job(cv, jd_desc, jd_req, skills)
    
    # Không crash, trả về kết quả hợp lệ với điểm 0
    assert result["matching_score"] == 0.0
    assert result["tfidf_similarity"] == 0.0
    assert result["skill_match_ratio"] == 0.0
    assert len(result["matched_skills"]) == 0
    assert len(result["extracted_cv_skills"]) == 0


def test_ai_matching_zero_skill_overlap_edge_case():
    """Test 7: Kiểm thử biên - CV có kỹ năng nhưng hoàn toàn không trùng với JD"""
    cv = "Chuyên viên thiết kế đồ họa sử dụng Figma, Photoshop, Adobe Illustrator vẽ minh họa."
    jd_desc = "Tuyển kỹ sư Java Spring Boot microservices."
    jd_req = "Yêu cầu Java, Spring Boot, MySQL, RESTful API."
    skills = ["Java", "Spring Boot", "MySQL", "RESTful API"]

    result = matching_engine.match_cv_to_job(cv, jd_desc, jd_req, skills)
    
    assert result["skill_match_ratio"] == 0.0
    assert len(result["matched_skills"]) == 0
    assert result["matching_score"] < 25.0


def test_matching_api_endpoint():
    """Test 8: Kiểm thử API /api/v1/matching/analyze đầy đủ"""
    payload = {
        "cv_text": "Kỹ sư Backend 3 năm kinh nghiệm với Python, FastAPI, PostgreSQL và Docker.",
        "job_id": 1,
        "weight_tfidf": 0.6,
        "weight_skills": 0.4
    }
    response = client.post("/api/v1/matching/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "matching_score" in data
    assert "tfidf_similarity" in data
    assert "skill_match_ratio" in data
    assert "matched_skills" in data
    assert "missing_skills" in data
    assert data["job_id"] == 1


def test_matching_api_nonexistent_job():
    """Test 9: Xử lý dữ liệu đầu vào sai - Job ID không tồn tại (trả về 404)"""
    payload = {
        "cv_text": "Lập trình viên bất kỳ",
        "job_id": 99999,
        "weight_tfidf": 0.6,
        "weight_skills": 0.4
    }
    response = client.post("/api/v1/matching/analyze", json=payload)
    assert response.status_code == 404


# ----------------------------------------------------
# 3. KIỂM THỬ BI DASHBOARD VÀ TÍNH NHẤT QUÁN CỦA PHỄU
# ----------------------------------------------------
def test_bi_dashboard_api_and_data_integrity():
    """Test 10: Kiểm thử BI Dashboard API và cấu trúc 3 nhóm dữ liệu"""
    response = client.get("/api/v1/bi/dashboard")
    assert response.status_code == 200
    data = response.json()

    # Nhóm 1: Thống kê kỹ năng
    assert "skill_distribution" in data
    assert len(data["skill_distribution"]) > 0
    assert data["skill_distribution"][0]["candidate_count"] > 0

    # Nhóm 2: Xu hướng lương
    assert "salary_trends" in data
    assert len(data["salary_trends"]) >= 3
    for trend in data["salary_trends"]:
        assert trend["avg_salary_min"] <= trend["avg_salary_max"]
        assert trend["avg_salary_mid"] > 0

    # Nhóm 3: Phễu tuyển dụng
    assert "funnel_stages" in data
    assert len(data["funnel_stages"]) == 4


def test_bi_recruitment_funnel_monotonicity():
    """Test 11: Kiểm thử tính nhất quán logic của phễu tuyển dụng (số lượng giảm dần qua các bước)"""
    response = client.get("/api/v1/bi/dashboard")
    data = response.json()
    stages = data["funnel_stages"]

    applied = stages[0]["count"]
    screening = stages[1]["count"]
    interview = stages[2]["count"]
    offered = stages[3]["count"]

    assert applied >= screening, f"Số nộp đơn ({applied}) phải >= số qua lọc hồ sơ ({screening})"
    assert screening >= interview, f"Số qua lọc ({screening}) phải >= số phỏng vấn ({interview})"
    assert interview >= offered, f"Số phỏng vấn ({interview}) phải >= số nhận việc ({offered})"


# ----------------------------------------------------
# 4. KIỂM THỬ ĐÁNH GIÁ MÔ HÌNH VỚI GROUND TRUTH
# ----------------------------------------------------
def test_evaluation_metrics_and_no_faking():
    """Test 12: Đánh giá thực nghiệm mô hình trên 12 cặp gán nhãn, đo Precision, Recall, F1 thật"""
    eval_res = evaluate_matching_model(matching_engine, threshold=45.0)
    
    assert eval_res["accuracy"] >= 70.0, f"Độ chính xác thực tế phải >= 70%, đo được: {eval_res['accuracy']}%"
    assert eval_res["precision"] > 0.0
    assert eval_res["recall"] > 0.0
    assert eval_res["f1_score"] > 0.0
    assert len(eval_res["pairs"]) == 12

    # Tổng TP + TN + FP + FN phải bằng đúng 12
    total_samples = (
        eval_res["true_positives"] + eval_res["true_negatives"] +
        eval_res["false_positives"] + eval_res["false_negatives"]
    )
    assert total_samples == 12

