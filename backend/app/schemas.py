from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict

# Skill schemas
class SkillBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    category: str

# Employer schemas
class EmployerBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    industry: str
    location: str
    website: Optional[str] = None

# Job schemas
class JobSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    salary_min: float
    salary_max: float
    min_experience_years: int
    posted_date: date
    employer_name: Optional[str] = None

class JobDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    employer_id: int
    employer_name: Optional[str] = None
    description: str
    requirements: str
    min_experience_years: int
    salary_min: float
    salary_max: float
    currency: str
    posted_date: date
    status: str
    required_skills: List[str] = []

# Candidate schemas
class CandidateSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    email: str
    current_title: str
    years_of_experience: int
    skills: List[str] = []

class CandidateDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    current_title: str
    years_of_experience: int
    cv_text: str
    skills: List[str] = []

# Matching Request and Response
class MatchRequest(BaseModel):
    cv_text: str = Field(..., description="Nội dung CV dạng văn bản")
    job_id: int = Field(..., description="ID của Job Description cần so khớp")
    weight_tfidf: float = Field(0.6, description="Trọng số TF-IDF Cosine Similarity (mặc định 60%)")
    weight_skills: float = Field(0.4, description="Trọng số Tỷ lệ kỹ năng phù hợp (mặc định 40%)")

class MatchResponse(BaseModel):
    job_id: int
    job_title: str
    employer_name: str
    matching_score: float = Field(..., description="Điểm phù hợp tổng hợp (0 - 100)")
    tfidf_similarity: float = Field(..., description="Độ tương đồng ngữ nghĩa TF-IDF Cosine (0 - 100)")
    skill_match_ratio: float = Field(..., description="Tỷ lệ kỹ năng đáp ứng (0 - 100)")
    matched_skills: List[str] = Field(..., description="Các kỹ năng trùng khớp")
    missing_skills: List[str] = Field(..., description="Các kỹ năng còn thiếu theo yêu cầu JD")
    extracted_cv_skills: List[str] = Field(..., description="Toàn bộ kỹ năng trích xuất được từ CV")
    required_job_skills: List[str] = Field(..., description="Toàn bộ kỹ năng yêu cầu trong JD")
    evaluation_comment: str = Field(..., description="Nhận xét sơ bộ mức độ phù hợp")

# BI Dashboard schemas
class SkillStatItem(BaseModel):
    skill_name: str
    category: str
    candidate_count: int

class SalaryTrendItem(BaseModel):
    period: str  # e.g., '2026-05', '2026-06'
    avg_salary_min: float
    avg_salary_max: float
    avg_salary_mid: float
    job_count: int

class FunnelStageItem(BaseModel):
    stage_key: str
    stage_name: str
    count: int
    conversion_rate_from_applied: float  # Tỷ lệ so với giai đoạn Ứng tuyển (%)
    step_conversion_rate: float          # Tỷ lệ so với bước trước đó (%)

class BIDashboardData(BaseModel):
    total_candidates: int
    total_jobs: int
    total_employers: int
    total_applications: int
    avg_market_salary_mid: float
    skill_distribution: List[SkillStatItem]
    salary_trends: List[SalaryTrendItem]
    funnel_stages: List[FunnelStageItem]
    salary_notes: str

# System overview / DB stats
class SystemStats(BaseModel):
    total_candidates: int
    total_employers: int
    total_jobs: int
    total_skills: int
    total_candidate_skills: int
    total_job_skills: int
    total_applications: int

# Testing Evaluation schemas
class LabeledPairResult(BaseModel):
    pair_id: int
    candidate_name: str
    job_title: str
    ground_truth: int       # 1: Phù hợp (Match), 0: Không phù hợp (Mismatch)
    calculated_score: float
    predicted_label: int    # 1 if score >= threshold else 0
    is_correct: bool

class EvaluationSummary(BaseModel):
    threshold: float
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    true_positives: int
    true_negatives: int
    false_positives: int
    false_negatives: int
    pairs: List[LabeledPairResult]
    methodology: str
    limitations: List[str]
