import random
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import (
    Employer, Candidate, Skill, Job, CandidateSkill, JobSkill, Application
)
from .ml_service import matching_engine

def seed_database():
    """
    Tạo cấu trúc bảng và nạp bộ dữ liệu mẫu chuẩn hóa:
    - 5 Nhà tuyển dụng (Employers)
    - 20 Ứng viên (Candidates) với CV mẫu chi tiết
    - 15 Tin tuyển dụng (Jobs) với mức lương mô phỏng từ tháng 05/2026 - 10/2026
    - Danh mục 25 kỹ năng chuẩn hóa (Skills)
    - Bảng liên kết candidate_skills và job_skills
    - 40 Đơn ứng tuyển (Applications) phân bổ theo phễu tuyển dụng
    """
    # Khởi tạo bảng nếu chưa có
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        print("[SEED] Khởi tạo danh mục kỹ năng chuẩn hóa...")
        skills_data = [
            # Backend
            ("Python", "Backend"), ("FastAPI", "Backend"), ("Django", "Backend"), 
            ("Node.js", "Backend"), ("Java", "Backend"), ("Spring Boot", "Backend"), 
            ("C#", "Backend"), (".NET", "Backend"), ("Golang", "Backend"),
            # Frontend
            ("React", "Frontend"), ("TypeScript", "Frontend"), ("JavaScript", "Frontend"), 
            ("HTML/CSS", "Frontend"), ("Tailwind CSS", "Frontend"), ("Vue.js", "Frontend"),
            # Database
            ("SQL", "Database"), ("PostgreSQL", "Database"), ("MySQL", "Database"), 
            ("SQLite", "Database"), ("MongoDB", "Database"), ("Redis", "Database"),
            # Data / AI
            ("Machine Learning", "Data/AI"), ("Scikit-learn", "Data/AI"), 
            ("Pandas", "Data/AI"), ("NumPy", "Data/AI"), ("Data Analysis", "Data/AI"), 
            ("Business Intelligence", "Data/AI"),
            # DevOps
            ("Git", "DevOps"), ("Docker", "DevOps"), ("Kubernetes", "DevOps"), 
            ("CI/CD", "DevOps"), ("Linux", "DevOps"), ("AWS", "DevOps"),
            ("RESTful API", "Backend")
        ]
        skill_objs = {}
        for name, category in skills_data:
            s = Skill(name=name, category=category)
            db.add(s)
            db.flush()
            skill_objs[name] = s

        print("[SEED] Khởi tạo 5 nhà tuyển dụng...")
        employers_data = [
            ("TechNova Solutions", "Software & Cloud Services", "Hà Nội", "https://technova.io"),
            ("FinVina Analytics", "FinTech & Banking", "TP. Hồ Chí Minh", "https://finvina.vn"),
            ("NexGen AI Labs", "Artificial Intelligence & Big Data", "Đà Nẵng", "https://nexgenai.ai"),
            ("Global Retail Connect", "E-Commerce & Supply Chain", "Hà Nội", "https://globalretail.com"),
            ("CyberShield Security", "Cybersecurity & DevOps", "TP. Hồ Chí Minh", "https://cybershield.vn")
        ]
        employer_objs = []
        for name, ind, loc, web in employers_data:
            emp = Employer(name=name, industry=ind, location=loc, website=web)
            db.add(emp)
            db.flush()
            employer_objs.append(emp)

        print("[SEED] Khởi tạo 15 tin tuyển dụng (Jobs)...")
        # Phân bổ từ tháng 5/2026 đến 10/2026 để có dữ liệu chuỗi thời gian xu hướng lương
        jobs_spec = [
            (0, "Senior Python Backend Engineer", 
             "Thiết kế và xây dựng hệ sinh thái microservices chịu tải lớn bằng Python và FastAPI.",
             "Tối thiểu 3 năm kinh nghiệm với Python, FastAPI, PostgreSQL, Docker, Git, RESTful API.", 
             3, 28.0, 45.0, date(2026, 5, 10), ["Python", "FastAPI", "PostgreSQL", "Docker", "Git", "RESTful API"]),
            
            (0, "React Frontend Developer", 
             "Phát triển giao diện web portal hiện đại, responsive và trực quan cho người dùng doanh nghiệp.",
             "Thành thạo React, TypeScript, HTML/CSS, Tailwind CSS, kết nối RESTful API, quản lý mã nguồn Git.",
             2, 18.0, 30.0, date(2026, 5, 20), ["React", "TypeScript", "HTML/CSS", "Tailwind CSS", "Git", "RESTful API"]),
             
            (1, "Senior Data Analyst / BI Specialist", 
             "Phân tích dữ liệu vận hành giao dịch tài chính, trực quan hóa Dashboard phục vụ ban điều hành.",
             "Thành thạo SQL truy vấn nâng cao, Python phân tích (Pandas, NumPy), xây dựng Business Intelligence Dashboard.",
             3, 22.0, 38.0, date(2026, 6, 5), ["SQL", "Python", "Pandas", "NumPy", "Data Analysis", "Business Intelligence"]),
             
            (1, "Java Spring Boot Developer", 
             "Xây dựng hạ tầng thanh toán lõi ngân hàng số, tối ưu hóa giao dịch tài chính quy mô lớn.",
             "Nắm vững Java, Spring Boot, MySQL, RESTful API, Docker, Git. Khả năng thiết kế CSDL quan hệ.",
             2, 20.0, 35.0, date(2026, 6, 18), ["Java", "Spring Boot", "MySQL", "RESTful API", "Docker", "Git"]),
             
            (2, "Machine Learning Engineer", 
             "Nghiên cứu, huấn luyện và triển khai các thuật toán học máy phân tích dữ liệu và phân loại hành vi.",
             "Thành thạo Python, Machine Learning, Scikit-learn, Pandas, NumPy, xây dựng API suy luận mô hình.",
             2, 25.0, 42.0, date(2026, 7, 2), ["Python", "Machine Learning", "Scikit-learn", "Pandas", "NumPy", "FastAPI"]),
             
            (2, "Full-stack Web Developer (Node.js/React)", 
             "Xây dựng toàn diện ứng dụng web từ giao diện người dùng đến dịch vụ backend và cơ sở dữ liệu.",
             "Kinh nghiệm làm việc với Node.js, React, TypeScript, MongoDB, Docker, Git.",
             2, 20.0, 34.0, date(2026, 7, 22), ["Node.js", "React", "TypeScript", "MongoDB", "Docker", "Git"]),
             
            (3, "DevOps & Cloud Engineer", 
             "Thiết lập và vận hành cụm Kubernetes, xây dựng hệ thống CI/CD tự động hóa trên hạ tầng AWS.",
             "Thành thạo Linux, Docker, Kubernetes, CI/CD, AWS, Git. Tư duy tự động hóa hạ tầng.",
             3, 30.0, 50.0, date(2026, 8, 8), ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git"]),
             
            (3, "Data Engineer / SQL Developer", 
             "Thiết kế kiến trúc kho dữ liệu, viết pipeline ETL xử lý dữ liệu bán lẻ đa kênh hàng ngày.",
             "Thành thạo SQL, Python, PostgreSQL, Data Analysis, tối ưu hóa câu lệnh truy vấn phức tạp.",
             2, 20.0, 36.0, date(2026, 8, 25), ["SQL", "Python", "PostgreSQL", "Data Analysis", "Linux"]),
             
            (4, "Junior Backend Developer (Python)", 
             "Tham gia phát triển các module API dịch vụ bảo mật thông tin và cảnh báo lỗ hổng hệ thống.",
             "Nắm chắc cú pháp Python, SQLite, RESTful API, Git. Chăm chỉ, ham học hỏi và tư duy logic.",
             1, 14.0, 22.0, date(2026, 9, 3), ["Python", "SQLite", "RESTful API", "Git"]),
             
            (4, "Lead Security & Cloud Architect", 
             "Đảm bảo an toàn thông tin hạ tầng đám mây doanh nghiệp, giám sát container và tự động hóa bảo mật.",
             "Tối thiểu 5 năm kinh nghiệm với Linux, AWS, Docker, Kubernetes, CI/CD.",
             5, 45.0, 70.0, date(2026, 9, 15), ["Linux", "AWS", "Docker", "Kubernetes", "CI/CD"]),
             
            (0, "Frontend Engineer (Vue.js/TypeScript)", 
             "Phát triển ứng dụng quản trị dữ liệu khách hàng sử dụng kiến trúc Vue.js hiện đại.",
             "Thành thạo Vue.js, TypeScript, HTML/CSS, Tailwind CSS, kết nối API.",
             2, 18.0, 28.0, date(2026, 9, 28), ["Vue.js", "TypeScript", "HTML/CSS", "Tailwind CSS", "Git"]),
             
            (1, "Senior .NET Core Engineer", 
             "Nâng cấp hệ thống quản lý tín dụng nội bộ sang kiến trúc microservices nền tảng .NET Core.",
             "Thành thạo C#, .NET, SQL, Docker, Git. Khả năng thiết kế kiến trúc phân tán.",
             4, 32.0, 48.0, date(2026, 10, 5), ["C#", ".NET", "SQL", "Docker", "Git"]),
             
            (2, "AI Data Specialist & Prompt Engineer", 
             "Thu thập, tiền xử lý và gán nhãn tập dữ liệu huấn luyện mô hình trí tuệ nhân tạo.",
             "Kỹ năng Python, Data Analysis, Pandas, hiểu biết căn bản về Machine Learning.",
             1, 16.0, 26.0, date(2026, 10, 12), ["Python", "Data Analysis", "Pandas", "Machine Learning"]),
             
            (3, "E-commerce Backend Developer (Node.js)", 
             "Tối ưu hóa giỏ hàng và xử lý thanh toán thời gian thực cho hệ thống thương mại điện tử.",
             "Thành thạo Node.js, Redis, MongoDB, RESTful API, Git.",
             2, 19.0, 32.0, date(2026, 10, 20), ["Node.js", "Redis", "MongoDB", "RESTful API", "Git"]),
             
            (4, "Site Reliability Engineer (SRE)", 
             "Giám sát độ sẵn sàng hệ thống 99.99%, trực ca và khắc phục sự cố hạ tầng trên đám mây.",
             "Kinh nghiệm vững chắc với Linux, Docker, Kubernetes, CI/CD, Git.",
             3, 28.0, 45.0, date(2026, 10, 26), ["Linux", "Docker", "Kubernetes", "CI/CD", "Git"])
        ]

        job_objs = []
        for emp_idx, title, desc, req, exp, s_min, s_max, p_date, skills_list in jobs_spec:
            job = Job(
                employer_id=employer_objs[emp_idx].id,
                title=title,
                description=desc,
                requirements=req,
                min_experience_years=exp,
                salary_min=s_min,
                salary_max=s_max,
                currency="VND",
                posted_date=p_date,
                status="Open"
            )
            db.add(job)
            db.flush()
            job_objs.append(job)

            # Gán JobSkill
            for sname in skills_list:
                if sname in skill_objs:
                    js = JobSkill(job_id=job.id, skill_id=skill_objs[sname].id, is_required=True)
                    db.add(js)

        print("[SEED] Khởi tạo 20 ứng viên (Candidates)...")
        candidates_raw = [
            ("Nguyễn Văn An", "an.nguyen@email.vn", "0901234567", 3, "Backend Developer",
             "Kỹ sư Backend 3 năm kinh nghiệm lập trình Python, FastAPI, Django. Thành thạo xây dựng RESTful API, thiết kế CSDL PostgreSQL và SQLite, container hóa ứng dụng với Docker, sử dụng Git quản lý phiên bản.",
             ["Python", "FastAPI", "PostgreSQL", "SQLite", "Docker", "Git", "RESTful API"]),

            ("Trần Thị Bích", "bich.tran@email.vn", "0902345678", 2, "Frontend Developer",
             "Lập trình viên Frontend 2 năm kinh nghiệm chuyên sâu về React, TypeScript, JavaScript, HTML/CSS và Tailwind CSS. Xây dựng giao diện responsive, tối ưu UX, kết nối RESTful API và làm việc nhóm qua Git.",
             ["React", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS", "Git", "RESTful API"]),

            ("Lê Hoàng Cường", "cuong.le@email.vn", "0903456789", 4, "Senior Data Analyst",
             "Chuyên gia phân tích dữ liệu 4 năm kinh nghiệm với SQL, Python, Pandas, NumPy và Business Intelligence. Khả năng mô hình hóa số liệu kinh doanh, xây dựng Dashboard trực quan và đề xuất chiến lược dựa trên dữ liệu.",
             ["SQL", "Python", "Pandas", "NumPy", "Data Analysis", "Business Intelligence"]),

            ("Phạm Minh Đức", "duc.pham@email.vn", "0904567890", 4, "DevOps Engineer",
             "Kỹ sư DevOps 4 năm kinh nghiệm thực chiến quản trị Linux, thiết lập cụm Docker, Kubernetes, tự động hóa CI/CD và vận hành hạ tầng đám mây AWS. Thành thạo GitOps và giải pháp giám sát hệ thống.",
             ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git"]),

            ("Vũ Hải Đăng", "dang.vu@email.vn", "0905678901", 3, "Machine Learning Engineer",
             "Kỹ sư AI/ML 3 năm kinh nghiệm ứng dụng Python, Scikit-learn, Pandas, NumPy và Machine Learning để huấn luyện mô hình dự đoán. Tích hợp mô hình vào API ứng dụng thực tế bằng FastAPI.",
             ["Python", "Machine Learning", "Scikit-learn", "Pandas", "NumPy", "FastAPI"]),

            ("Đỗ Thu Giang", "giang.do@email.vn", "0906789012", 3, "Java Backend Developer",
             "Lập trình viên Java 3 năm kinh nghiệm với Spring Boot, MySQL, RESTful API và Docker. Thiết kế kiến trúc dịch vụ chịu tải tốt, tối ưu hóa truy vấn cơ sở dữ liệu quan hệ và làm việc chuẩn Git flow.",
             ["Java", "Spring Boot", "MySQL", "RESTful API", "Docker", "Git"]),

            ("Hoàng Quốc Việt", "viet.hoang@email.vn", "0907890123", 2, "Full-stack Developer",
             "Lập trình viên Full-stack thành thạo Node.js, React, TypeScript, MongoDB và Git. Đã tham gia phát triển 4 dự án web thương mại điện tử với trải nghiệm người dùng mượt mà và API ổn định.",
             ["Node.js", "React", "TypeScript", "MongoDB", "Git", "HTML/CSS"]),

            ("Bùi Mai Hương", "huong.bui@email.vn", "0908901234", 5, "Senior Accountant",
             "Chuyên viên kế toán tổng hợp 5 năm kinh nghiệm quản lý tài chính, hạch toán sổ sách bằng Excel và phần mềm kế toán. Kỹ năng giao tiếp và soạn thảo báo cáo tài chính chuyên nghiệp.",
             []),

            ("Ngô Gia Bảo", "bao.ngo@email.vn", "0909012345", 1, "Junior Python Developer",
             "Lập trình viên mới tốt nghiệp nắm vững kiến thức căn bản về Python, SQLite, RESTful API và Git. Đam mê học hỏi công nghệ mới, có tinh thần trách nhiệm và làm việc nhóm tốt.",
             ["Python", "SQLite", "RESTful API", "Git"]),

            ("Phan Mỹ Linh", "linh.phan@email.vn", "0910123456", 3, "UI/UX Designer",
             "Nhà thiết kế giao diện sáng tạo chuyên về Figma, Adobe XD, Photoshop. Có hiểu biết cơ bản về HTML/CSS nhưng chuyên sâu vào trải nghiệm người dùng và thiết kế nhận diện thương hiệu.",
             ["HTML/CSS"]),

            ("Dương Thanh Tùng", "tung.duong@email.vn", "0911234567", 5, "Cloud Infrastructure Lead",
             "Kỹ sư trưởng hạ tầng đám mây với 5 năm kinh nghiệm chuyên sâu về Linux, Docker, Kubernetes, CI/CD và AWS. Thiết kế giải pháp phân tán chịu lỗi cao cho các tập đoàn tài chính.",
             ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git"]),

            ("Võ Ngọc Ánh", "anh.vo@email.vn", "0912345678", 2, "Frontend Vue Developer",
             "Lập trình viên Frontend 2 năm kinh nghiệm với Vue.js, TypeScript, HTML/CSS và Tailwind CSS. Xây dựng Dashboard báo cáo trực quan cho khối bán lẻ, tích hợp API mượt mà.",
             ["Vue.js", "TypeScript", "HTML/CSS", "Tailwind CSS", "Git"]),

            ("Trịnh Tuấn Kiệt", "kiet.trinh@email.vn", "0913456789", 4, ".NET Software Engineer",
             "Kỹ sư phần mềm .NET 4 năm kinh nghiệm với C#, .NET Core, SQL Server và Docker. Phát triển ứng dụng quản lý doanh nghiệp ERP quy mô lớn, tuân thủ nguyên lý SOLID.",
             ["C#", ".NET", "SQL", "Docker", "Git"]),

            ("Mai Xuân Hùng", "hung.mai@email.vn", "0914567890", 2, "Data Engineer",
             "Kỹ sư dữ liệu 2 năm kinh nghiệm sử dụng SQL, Python, PostgreSQL và Linux. Xây dựng pipeline trích xuất nạp dữ liệu ETL tự động cho doanh nghiệp vận tải.",
             ["SQL", "Python", "PostgreSQL", "Linux", "Data Analysis"]),

            ("Lý Bảo Trân", "tran.ly@email.vn", "0915678901", 1, "Junior Data Analyst",
             "Nhà phân tích dữ liệu trẻ tuổi thành thạo SQL truy vấn, Excel nâng cao, Python Pandas và Business Intelligence. Khát khao phát triển trong lĩnh vực phân tích kinh doanh thông minh.",
             ["SQL", "Python", "Pandas", "Business Intelligence", "Data Analysis"]),

            ("Đinh Trọng Nghĩa", "nghia.dinh@email.vn", "0916789012", 3, "Node.js Backend Developer",
             "Kỹ sư Backend 3 năm kinh nghiệm chuyên về Node.js, Express, MongoDB, Redis và RESTful API. Tối ưu hóa thông lượng xử lý sự kiện thời gian thực và quản lý container Docker.",
             ["Node.js", "MongoDB", "Redis", "RESTful API", "Docker", "Git"]),

            ("Cao Thùy Trang", "trang.cao@email.vn", "0917890123", 2, "AI & Data Specialist",
             "Chuyên viên xử lý dữ liệu AI sử dụng Python, Pandas, NumPy, Scikit-learn. Tham gia làm sạch và tiền xử lý hơn 100,000 mẫu dữ liệu huấn luyện mô hình.",
             ["Python", "Pandas", "NumPy", "Scikit-learn", "Machine Learning"]),

            ("Nguyễn Đình Khôi", "khoi.nguyen@email.vn", "0918901234", 3, "SRE & Systems Engineer",
             "Kỹ sư đảm bảo độ tin cậy hệ thống 3 năm kinh nghiệm với Linux, Docker, Kubernetes, CI/CD và Git. Giám sát tự động hóa cảnh báo và giảm thiểu thời gian chết của dịch vụ.",
             ["Linux", "Docker", "Kubernetes", "CI/CD", "Git"]),

            ("Hà Phương Thảo", "thao.ha@email.vn", "0919012345", 2, "Frontend React Developer",
             "Lập trình viên React 2 năm kinh nghiệm với React, TypeScript, HTML/CSS, Tailwind CSS và RESTful API. Yêu thích tối ưu hóa hiệu năng web và trải nghiệm người dùng.",
             ["React", "TypeScript", "HTML/CSS", "Tailwind CSS", "RESTful API"]),

            ("Tạ Quang Huy", "huy.ta@email.vn", "0920123456", 3, "Python Backend Engineer",
             "Lập trình viên Python 3 năm kinh nghiệm với Python, FastAPI, PostgreSQL, Redis và Docker. Thiết kế API chuẩn OpenAPI và viết kiểm thử tự động toàn diện.",
             ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Git", "RESTful API"])
        ]

        candidate_objs = []
        for full_name, email, phone, exp, title, cv_text, skills_list in candidates_raw:
            cand = Candidate(
                full_name=full_name,
                email=email,
                phone=phone,
                years_of_experience=exp,
                current_title=title,
                cv_text=cv_text,
                created_at=datetime.utcnow() - timedelta(days=random.randint(10, 180))
            )
            db.add(cand)
            db.flush()
            candidate_objs.append(cand)

            # Gán CandidateSkill
            for sname in skills_list:
                if sname in skill_objs:
                    cs = CandidateSkill(
                        candidate_id=cand.id,
                        skill_id=skill_objs[sname].id,
                        proficiency_level=random.randint(3, 5)
                    )
                    db.add(cs)

        print("[SEED] Khởi tạo đúng 40 đơn ứng tuyển (Applications) phân bổ theo phễu tuyển dụng...")
        # Thiết kế phân bổ thực tế cho phễu chuyển đổi:
        # Tổng: 40 đơn
        # - offered (Nhận việc): 6 đơn (~15%)
        # - interview (Đang ở vòng phỏng vấn): 10 đơn
        # - screening (Đang ở vòng duyệt hồ sơ): 14 đơn
        # - applied (Mới nộp đơn): 6 đơn
        # - rejected (Bị từ chối): 4 đơn
        # Nhờ vậy:
        # Tổng applied = 40
        # Vượt qua screening = 6 (offered) + 10 (interview) + 14 (screening) = 30 đơn (75.0%)
        # Đạt tới interview = 6 (offered) + 10 (interview) = 16 đơn (40.0%)
        # Đạt tới offer = 6 đơn (15.0%)
        
        stages_plan = (
            ["offered"] * 6 +
            ["interview"] * 10 +
            ["screening"] * 14 +
            ["applied"] * 6 +
            ["rejected"] * 4
        )
        random.seed(42)  # Cố định seed ngẫu nhiên để tái lập kết quả 100%
        random.shuffle(stages_plan)

        # 40 cặp ghép giữa candidate và job
        app_pairs = []
        used_pairs = set()
        while len(app_pairs) < 40:
            c_idx = random.randint(0, len(candidate_objs) - 1)
            j_idx = random.randint(0, len(job_objs) - 1)
            pair = (c_idx, j_idx)
            if pair not in used_pairs:
                used_pairs.add(pair)
                app_pairs.append(pair)

        for i, (c_idx, j_idx) in enumerate(app_pairs):
            cand = candidate_objs[c_idx]
            job = job_objs[j_idx]
            stage = stages_plan[i]
            
            # Tính matching score thật
            match_res = matching_engine.match_cv_to_job(
                cv_text=cand.cv_text,
                job_description=job.description,
                job_requirements=job.requirements
            )
            score = match_res["matching_score"]

            app = Application(
                candidate_id=cand.id,
                job_id=job.id,
                applied_date=datetime.utcnow() - timedelta(days=random.randint(2, 60)),
                stage=stage,
                match_score=score,
                notes=f"Đơn nộp tự động. Giai đoạn hiện tại: {stage}. Điểm AI Matching: {score}."
            )
            db.add(app)

        db.commit()
        print("[SEED] Hoàn thành nạp dữ liệu mẫu thành công!")
        print(f"       + 5 Employers")
        print(f"       + 15 Jobs")
        print(f"       + 20 Candidates")
        print(f"       + 40 Applications")
        print(f"       + 25 Skills")
    except Exception as e:
        db.rollback()
        print(f"[SEED ERROR] Lỗi nạp dữ liệu: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
