from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, 
    DateTime, Date, ForeignKey
)
from sqlalchemy.orm import relationship
from .database import Base

class Employer(Base):
    __tablename__ = "employers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    industry = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    website = Column(String(200), nullable=True)

    jobs = relationship("Job", back_populates="employer", cascade="all, delete-orphan")


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    years_of_experience = Column(Integer, default=0)
    current_title = Column(String(100), nullable=False)
    cv_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    skills = relationship("CandidateSkill", back_populates="candidate", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)
    category = Column(String(50), nullable=False)  # e.g., 'Backend', 'Frontend', 'Data/AI', 'DevOps', 'Database'

    candidate_associations = relationship("CandidateSkill", back_populates="skill")
    job_associations = relationship("JobSkill", back_populates="skill")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employer_id = Column(Integer, ForeignKey("employers.id"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)
    min_experience_years = Column(Integer, default=0)
    salary_min = Column(Float, nullable=False)  # Triệu VNĐ
    salary_max = Column(Float, nullable=False)  # Triệu VNĐ
    currency = Column(String(10), default="VND")
    posted_date = Column(Date, default=date.today)
    status = Column(String(20), default="Open")  # Open, Closed

    employer = relationship("Employer", back_populates="jobs")
    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    candidate_id = Column(Integer, ForeignKey("candidates.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    proficiency_level = Column(Integer, default=3)  # 1 to 5

    candidate = relationship("Candidate", back_populates="skills")
    skill = relationship("Skill", back_populates="candidate_associations")


class JobSkill(Base):
    __tablename__ = "job_skills"

    job_id = Column(Integer, ForeignKey("jobs.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    is_required = Column(Boolean, default=True)

    job = relationship("Job", back_populates="skills")
    skill = relationship("Skill", back_populates="job_associations")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    applied_date = Column(DateTime, default=datetime.utcnow)
    # Các giai đoạn chuẩn trong phễu tuyển dụng:
    # 'applied' (Nộp hồ sơ), 'screening' (Duyệt hồ sơ), 'interview' (Phỏng vấn), 'offered' (Nhận việc), 'rejected' (Bị từ chối)
    stage = Column(String(30), nullable=False, default="applied")
    match_score = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)

    candidate = relationship("Candidate", back_populates="applications")
    job = relationship("Job", back_populates="applications")

