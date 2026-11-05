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

# Skill Gaps & Outline Schemas
class SkillGapItem(BaseModel):
    skill_name: str
    status_label: str = Field("Chưa tìm thấy minh chứng trong CV", description="Trạng thái nhận diện kỹ năng")
    importance: str = Field(..., description="Tầm quan trọng của kỹ năng đối với vị trí")
    evidence_suggestion: str = Field(..., description="Gợi ý bổ sung minh chứng nếu đã có kinh nghiệm")
    learning_path: str = Field(..., description="Lộ trình học tập / thực hành nếu chưa biết")

class CVSectionRecommendation(BaseModel):
    section_id: str
    section_name: str
    keep_advice: str = Field(..., description="Nên giữ những thông tin nào")
    priority_advice: str = Field(..., description="Nên ưu tiên thông tin nào cho JD đã chọn")
    evidence_advice: str = Field(..., description="Minh chứng cần bổ sung khi có kinh nghiệm thực tế")
    learning_caution: str = Field(..., description="Những kỹ năng cần tiếp tục học trước khi đưa vào CV")

# Matching Request and Response
class MatchRequest(BaseModel):
    cv_text: str = Field(..., description="Nội dung CV dạng văn bản")
    job_id: int = Field(..., description="ID của Job Description cần so khớp")
    weight_tfidf: float = Field(0.6, description="Trọng số TF-IDF Cosine Similarity (mặc định 60%)")
    weight_skills: float = Field(0.4, description="Trọng số Tỷ lệ kỹ năng phù hợp (mặc định 40%)")

class CustomJobMatchRequest(BaseModel):
    cv_text: str = Field(..., description="Nội dung CV dạng văn bản")
    job_title: str = Field(..., description="Tên vị trí tuyển dụng")
    employer_name: Optional[str] = Field("Doanh nghiệp tùy chỉnh", description="Tên công ty")
    description: str = Field(..., description="Mô tả công việc")
    required_skills: List[str] = Field(default=[], description="Danh sách kỹ năng yêu cầu")
    source_url: Optional[str] = Field(None, description="Nguồn JD (tùy chọn)")
    weight_tfidf: float = Field(0.6, description="Trọng số TF-IDF Cosine Similarity")
    weight_skills: float = Field(0.4, description="Trọng số Tỷ lệ kỹ năng phù hợp")

class MatchResponse(BaseModel):
    job_id: Optional[int] = Field(None, description="ID của Job nếu là JD mẫu trong database")
    job_title: str
    employer_name: str
    matching_score: float = Field(..., description="Điểm phù hợp tổng hợp (0 - 100)")
    tfidf_similarity: float = Field(..., description="Độ tương đồng văn bản TF-IDF Cosine (0 - 100)")
    skill_match_ratio: float = Field(..., description="Tỷ lệ kỹ năng đáp ứng (0 - 100)")
    matched_skills: List[str] = Field(..., description="Các kỹ năng trùng khớp")
    missing_skills: List[str] = Field(..., description="Các kỹ năng còn thiếu theo yêu cầu JD")
    extracted_cv_skills: List[str] = Field(..., description="Toàn bộ kỹ năng trích xuất được từ CV")
    required_job_skills: List[str] = Field(..., description="Toàn bộ kỹ năng yêu cầu trong JD")
    evaluation_comment: str = Field(..., description="Nhận xét sơ bộ mức độ phù hợp")
    inference_time_ms: float = Field(0.0, description="Thời gian thực thi thuật toán phân tích (mili-giây)")
    skill_gaps: List[SkillGapItem] = Field(default=[], description="Phân tích chi tiết khoảng trống kỹ năng nổi bật")
    cv_outline_recommendations: List[CVSectionRecommendation] = Field(default=[], description="Gợi ý cải thiện 6 phần cốt lõi của CV")
    is_custom_jd: bool = Field(False, description="Đánh dấu phân tích theo JD tùy chỉnh hay JD mẫu")

# File Upload Extraction Schema
class CVExtractResponse(BaseModel):
    text: str = Field(..., description="Nội dung văn bản trích xuất được")
    filename: str = Field(..., description="Tên tệp gốc đã tải lên")
    file_type: str = Field(..., description="Loại tệp (PDF hoặc DOCX)")
    char_count: int = Field(..., description="Tổng số ký tự")
    word_count: int = Field(..., description="Tổng số từ")
    status: str = Field("success", description="Trạng thái trích xuất")
    message: Optional[str] = Field(None, description="Thông điệp bổ sung")

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

class DomainStatItem(BaseModel):
    domain_name: str
    domain: Optional[str] = None
    job_count: int
    avg_salary_mid: float
    top_skills: List[str] = []

class BIDashboardData(BaseModel):
    total_candidates: int
    total_jobs: int
    total_employers: int
    total_applications: int
    avg_market_salary_mid: float
    median_salary_mid: float
    skill_distribution: List[SkillStatItem]
    salary_trends: List[SalaryTrendItem]
    funnel_stages: List[FunnelStageItem]
    domain_stats: List[DomainStatItem] = []
    bi_insights: List[str] = []
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
