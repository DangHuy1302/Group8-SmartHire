from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from .models import Candidate, Job, Employer, Application, Skill, CandidateSkill, JobSkill
from .schemas import (
    BIDashboardData, SkillStatItem, SalaryTrendItem, FunnelStageItem, DomainStatItem
)

def get_bi_dashboard_data(db: Session, category_filter: Optional[str] = None) -> BIDashboardData:
    """
    Tính toán các chỉ số Business Intelligence trực tiếp từ SQLite Database:
    1. Phân bố ứng viên theo kỹ năng (có thể lọc theo nhóm danh mục).
    2. Xu hướng mức lương trung bình theo thời gian (từ tin tuyển dụng mô phỏng).
    3. Tỷ lệ chuyển đổi qua phễu tuyển dụng thực tế (dựa trên chu trình phễu nhất quán).
    4. Phân bố việc làm và lương theo nhóm chuyên môn (Domain Stats).
    5. Các nhận xét BI được sinh tự động bằng quy tắc từ số liệu thật (Rule-based Insights).
    """
    # 1. KPIs tổng quan
    total_candidates = db.query(Candidate).count()
    total_jobs = db.query(Job).count()
    total_employers = db.query(Employer).count()
    total_applications = db.query(Application).count()

    jobs = db.query(Job).order_by(Job.posted_date.asc()).all()

    # Tính trung điểm khoảng lương từng job: mid = (min + max) / 2
    all_job_mids = sorted([(j.salary_min + j.salary_max) / 2.0 for j in jobs])
    
    # Lương trung bình thị trường (Arithmetic Mean của các trung điểm):
    avg_mid_salary = sum(all_job_mids) / len(all_job_mids) if all_job_mids else 0.0
    
    # Lương trung vị thị trường (Median của các trung điểm):
    if len(all_job_mids) == 0:
        median_salary = 0.0
    elif len(all_job_mids) % 2 == 1:
        median_salary = all_job_mids[len(all_job_mids) // 2]
    else:
        median_salary = (all_job_mids[len(all_job_mids) // 2 - 1] + all_job_mids[len(all_job_mids) // 2]) / 2.0

    # 2. Nhóm 1: Số lượng ứng viên theo kỹ năng (có hỗ trợ lọc theo danh mục)
    skill_query = (
        db.query(
            Skill.name.label("skill_name"),
            Skill.category.label("category"),
            func.count(CandidateSkill.candidate_id).label("candidate_count")
        )
        .join(CandidateSkill, Skill.id == CandidateSkill.skill_id)
    )
    
    if category_filter and category_filter != "All":
        skill_query = skill_query.filter(Skill.category == category_filter)
        
    skill_stats_query = (
        skill_query
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

    # 3. Nhóm 2: Xu hướng mức lương theo thời gian (dữ liệu mô phỏng theo tháng 05/2026 - 10/2026)
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
    all_apps = db.query(Application).all()
    total_applied = len(all_apps)
    passed_screening = sum(1 for a in all_apps if a.stage in ["screening", "interview", "offered"])
    reached_interview = sum(1 for a in all_apps if a.stage in ["interview", "offered"])
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

    # 5. Biểu đồ bổ sung: Phân bố việc làm & mức lương trung bình theo nhóm chuyên môn (Domain)
    domain_rules = {
        "Backend": ["Backend", "Java", ".NET", "Node.js", "Python"],
        "Frontend": ["Frontend", "React", "Vue"],
        "Data / AI": ["Data", "Machine Learning", "AI", "BI"],
        "DevOps / Cloud": ["DevOps", "Cloud", "SRE", "Security"]
    }
    domain_stats: List[DomainStatItem] = []
    for d_name, keywords in domain_rules.items():
        d_jobs = [j for j in jobs if any(kw.lower() in j.title.lower() for kw in keywords)]
        if d_jobs:
            d_mid = sum((j.salary_min + j.salary_max) / 2.0 for j in d_jobs) / len(d_jobs)
            d_skills: List[str] = []
            for j in d_jobs:
                for js in j.skills:
                    if js.skill and js.skill.name not in d_skills:
                        d_skills.append(js.skill.name)
            domain_stats.append(DomainStatItem(
                domain_name=d_name,
                domain=d_name,
                job_count=len(d_jobs),
                avg_salary_mid=round(d_mid, 1),
                top_skills=d_skills[:4]
            ))

    # 6. Phần nhận xét BI sinh tự động bằng quy tắc từ số liệu thật (Rule-based Insights)
    bi_insights: List[str] = []
    
    # Insight 1: Kỹ năng phổ biến nhất
    if skill_distribution:
        top_skill = skill_distribution[0]
        bi_insights.append(
            f"Kỹ năng dẫn đầu nguồn cung là '{top_skill.skill_name}' với {top_skill.candidate_count} ứng viên sở hữu "
            f"({round(top_skill.candidate_count / total_candidates * 100)}% tổng số hồ sơ). "
            f"Lưu ý: Một ứng viên có thể sở hữu nhiều kỹ năng (quan hệ N–N)."
        )
        
    # Insight 2: Xu hướng tiền lương
    if len(salary_trends) >= 2:
        first_t = salary_trends[0]
        last_t = salary_trends[-1]
        diff_pct = round(((last_t.avg_salary_mid - first_t.avg_salary_mid) / first_t.avg_salary_mid) * 100, 1)
        direction = "tăng" if diff_pct >= 0 else "giảm"
        bi_insights.append(
            f"Mức lương trung bình (trung điểm min-max) có xu hướng {direction} {abs(diff_pct)}% "
            f"từ {first_t.avg_salary_mid} tr/tháng ({first_t.period}) đến {last_t.avg_salary_mid} tr/tháng ({last_t.period})."
        )
        
    # Insight 3: Hiệu suất phễu tuyển dụng
    offered_rate = funnel_stages[3].conversion_rate_from_applied
    screening_rate = funnel_stages[1].step_conversion_rate
    interview_to_offer = funnel_stages[3].step_conversion_rate
    bi_insights.append(
        f"Hiệu suất chuyển đổi toàn phễu đạt {offered_rate}% (từ {total_applied} đơn ứng tuyển nộp ban đầu chọn ra được {accepted_offer} nhân sự nhận việc). "
        f"Trong đó, tỷ lệ sàng lọc hồ sơ đạt {screening_rate}% và tỷ lệ ứng viên phỏng vấn được nhận việc đạt {interview_to_offer}%."
    )

    salary_notes = (
        "Lưu ý học thuật: Dữ liệu tiền lương được tổng hợp từ 15 tin tuyển dụng mô phỏng giai đoạn 05/2026 – 10/2026. "
        "Đơn vị tính: Triệu VNĐ/tháng (Gross). "
        "Mức lương trung bình thị trường (31.2 tr) là trung bình cộng số học của các trung điểm (salary midpoint = (min + max)/2), "
        f"trong khi mức lương trung vị (median midpoint) thực tế đạt {round(median_salary, 1)} tr/tháng."
    )

    return BIDashboardData(
        total_candidates=total_candidates,
        total_jobs=total_jobs,
        total_employers=total_employers,
        total_applications=total_applications,
        avg_market_salary_mid=round(avg_mid_salary, 1),
        median_salary_mid=round(median_salary, 1),
        skill_distribution=skill_distribution,
        salary_trends=salary_trends,
        funnel_stages=funnel_stages,
        domain_stats=domain_stats,
        bi_insights=bi_insights,
        salary_notes=salary_notes
    )
