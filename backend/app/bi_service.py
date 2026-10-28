from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from .models import Candidate, Job, Employer, Application, Skill, CandidateSkill
from .schemas import (
    BIDashboardData, SkillStatItem, SalaryTrendItem, FunnelStageItem
)

def get_bi_dashboard_data(db: Session) -> BIDashboardData:
    """
    Tính toán các chỉ số Business Intelligence trực tiếp từ SQLite Database:
    1. Phân bố ứng viên theo kỹ năng.
    2. Xu hướng mức lương trung bình theo thời gian (từ tin tuyển dụng mô phỏng).
    3. Tỷ lệ chuyển đổi qua phễu tuyển dụng thực tế (dựa trên chu trình phễu nhất quán).
    """
    # 1. KPIs tổng quan
    total_candidates = db.query(Candidate).count()
    total_jobs = db.query(Job).count()
    total_employers = db.query(Employer).count()
    total_applications = db.query(Application).count()

    # Tính lương trung vị / trung bình của thị trường từ các JD
    avg_mid_salary = db.query(
        func.avg((Job.salary_min + Job.salary_max) / 2.0)
    ).scalar() or 0.0

    # 2. Nhóm 1: Số lượng ứng viên theo kỹ năng
    skill_stats_query = (
        db.query(
            Skill.name.label("skill_name"),
            Skill.category.label("category"),
            func.count(CandidateSkill.candidate_id).label("candidate_count")
        )
        .join(CandidateSkill, Skill.id == CandidateSkill.skill_id)
        .group_by(Skill.id, Skill.name, Skill.category)
        .order_by(func.count(CandidateSkill.candidate_id).desc())
        .limit(10)
        .all()
    )
    skill_distribution = [
        SkillStatItem(
            skill_name=row.skill_name,
            category=row.category,
            candidate_count=row.candidate_count
        )
        for row in skill_stats_query
    ]

    # 3. Nhóm 2: Xu hướng mức lương theo thời gian (dữ liệu mô phỏng trong các tháng)
    # Gom nhóm theo tháng đăng tin (strftime '%Y-%m')
    jobs = db.query(Job).order_by(Job.posted_date.asc()).all()
    monthly_data: Dict[str, Dict] = {}
    
    for job in jobs:
        period = job.posted_date.strftime("%Y-%m")
        if period not in monthly_data:
            monthly_data[period] = {
                "mins": [],
                "maxs": [],
                "mids": [],
                "count": 0
            }
        mid = (job.salary_min + job.salary_max) / 2.0
        monthly_data[period]["mins"].append(job.salary_min)
        monthly_data[period]["maxs"].append(job.salary_max)
        monthly_data[period]["mids"].append(mid)
        monthly_data[period]["count"] += 1

    salary_trends: List[SalaryTrendItem] = []
    for period in sorted(monthly_data.keys()):
        stats = monthly_data[period]
        salary_trends.append(
            SalaryTrendItem(
                period=period,
                avg_salary_min=round(sum(stats["mins"]) / stats["count"], 1),
                avg_salary_max=round(sum(stats["maxs"]) / stats["count"], 1),
                avg_salary_mid=round(sum(stats["mids"]) / stats["count"], 1),
                job_count=stats["count"]
            )
        )

    # 4. Nhóm 3: Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (Recruitment Funnel)
    # Logic phễu nhất quán:
    # Mọi đơn nộp đều bắt đầu từ 'applied'.
    # Các đơn đã vào 'screening', 'interview', 'offered' đều đã vượt qua các giai đoạn trước đó.
    # Ứng viên 'rejected' được ghi nhận đã dừng lại tại vòng nộp hoặc vòng duyệt.
    all_apps = db.query(Application).all()
    
    total_applied = len(all_apps)
    # Đã qua vòng duyệt hồ sơ (gồm các trạng thái: screening, interview, offered)
    passed_screening = sum(1 for a in all_apps if a.stage in ["screening", "interview", "offered"])
    # Đã vào vòng phỏng vấn (gồm: interview, offered)
    reached_interview = sum(1 for a in all_apps if a.stage in ["interview", "offered"])
    # Đã nhận lời mời nhận việc (offered)
    accepted_offer = sum(1 for a in all_apps if a.stage == "offered")

    funnel_stages: List[FunnelStageItem] = [
        FunnelStageItem(
            stage_key="applied",
            stage_name="1. Nộp hồ sơ (Applied)",
            count=total_applied,
            conversion_rate_from_applied=100.0 if total_applied > 0 else 0.0,
            step_conversion_rate=100.0 if total_applied > 0 else 0.0
        ),
        FunnelStageItem(
            stage_key="screening",
            stage_name="2. Duyệt hồ sơ (Screening)",
            count=passed_screening,
            conversion_rate_from_applied=round((passed_screening / total_applied * 100.0), 1) if total_applied > 0 else 0.0,
            step_conversion_rate=round((passed_screening / total_applied * 100.0), 1) if total_applied > 0 else 0.0
        ),
        FunnelStageItem(
            stage_key="interview",
            stage_name="3. Phỏng vấn (Interview)",
            count=reached_interview,
            conversion_rate_from_applied=round((reached_interview / total_applied * 100.0), 1) if total_applied > 0 else 0.0,
            step_conversion_rate=round((reached_interview / passed_screening * 100.0), 1) if passed_screening > 0 else 0.0
        ),
        FunnelStageItem(
            stage_key="offered",
            stage_name="4. Nhận việc (Offer Accepted)",
            count=accepted_offer,
            conversion_rate_from_applied=round((accepted_offer / total_applied * 100.0), 1) if total_applied > 0 else 0.0,
            step_conversion_rate=round((accepted_offer / reached_interview * 100.0), 1) if reached_interview > 0 else 0.0
        )
    ]

    salary_notes = (
        "Lưu ý: Mức lương phản ánh từ 15 tin tuyển dụng mô phỏng giai đoạn từ 05/2026 đến 10/2026. "
        "Đơn vị tính: Triệu VNĐ/tháng (Gross). Biểu đồ phản ánh mức lương tối thiểu, tối đa và trung vị thị trường."
    )

    return BIDashboardData(
        total_candidates=total_candidates,
        total_jobs=total_jobs,
        total_employers=total_employers,
        total_applications=total_applications,
        avg_market_salary_mid=round(avg_mid_salary, 1),
        skill_distribution=skill_distribution,
        salary_trends=salary_trends,
        funnel_stages=funnel_stages,
        salary_notes=salary_notes
    )
