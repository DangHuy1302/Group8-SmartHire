import re
from typing import List, Set, Dict, Tuple, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# BỘ TỪ ĐIỂN KỸ NĂNG CHUẨN HÓA (SKILL TAXONOMY)
# Bao gồm tên chuẩn và các bí danh / biến thể thường gặp trong CV và JD
SKILL_DICTIONARY: Dict[str, List[str]] = {
    # Backend
    "Python": ["python", "python3", "py"],
    "FastAPI": ["fastapi", "fast api"],
    "Django": ["django"],
    "Flask": ["flask"],
    "Node.js": ["nodejs", "node.js", "node js", "node"],
    "Java": ["java", "core java"],
    "Spring Boot": ["spring boot", "springboot", "spring framework"],
    "C#": ["c#", "csharp", "c sharp"],
    ".NET": [".net", "dotnet", ".net core", "asp.net"],
    "Golang": ["golang", "go lang", "go language"],
    
    # Frontend
    "React": ["react", "react.js", "reactjs"],
    "TypeScript": ["typescript", "ts"],
    "JavaScript": ["javascript", "js", "ecmascript"],
    "HTML/CSS": ["html", "css", "html5", "css3"],
    "Tailwind CSS": ["tailwind", "tailwind css", "tailwindcss"],
    "Vue.js": ["vue", "vue.js", "vuejs"],
    "Next.js": ["nextjs", "next.js"],
    
    # Database
    "SQL": ["sql", "rdbms", "relational database"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MySQL": ["mysql"],
    "SQLite": ["sqlite", "sqlite3"],
    "MongoDB": ["mongodb", "mongo"],
    "Redis": ["redis"],
    
    # Data & AI / ML
    "Machine Learning": ["machine learning", "ml", "statistical learning"],
    "Scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Data Analysis": ["data analysis", "data analytics", "phan tich du lieu"],
    "Business Intelligence": ["business intelligence", "bi", "power bi", "tableau"],
    "Deep Learning": ["deep learning", "neural networks"],
    
    # DevOps & Tools
    "Git": ["git", "github", "gitlab"],
    "Docker": ["docker", "containerization"],
    "Kubernetes": ["kubernetes", "k8s"],
    "CI/CD": ["ci/cd", "ci cd", "continuous integration"],
    "Linux": ["linux", "ubuntu", "centos"],
    "AWS": ["aws", "amazon web services"],
    "RESTful API": ["restful api", "rest api", "restful", "api development"]
}

# TẬP VĂN BẢN NỀN THAM CHIẾU (REFERENCE CORPUS)
# Đảm bảo TfidfVectorizer được fit trước trên không gian từ vựng chuẩn ngành công nghệ thông tin/tuyển dụng,
# tránh việc chỉ fit cục bộ trên cặp CV-JD đơn lẻ khiến trọng số IDF mất tính nhất quán.
REFERENCE_CORPUS: List[str] = [
    "Tuyển dụng kỹ sư Backend Python FastAPI Django xây dựng hệ thống RESTful API cơ sở dữ liệu PostgreSQL SQLite Docker Git",
    "Tuyển lập trình viên Frontend React TypeScript HTML CSS Tailwind CSS giao diện người dùng tối ưu hóa hiệu năng",
    "Chuyên viên Data Analysis Business Intelligence SQL Python Pandas NumPy trực quan hóa dữ liệu Dashboard phân tích",
    "Vị trí Machine Learning Engineer Scikit-learn huấn luyện mô hình dự đoán xử lý ngôn ngữ tự nhiên phân loại dữ liệu",
    "Full-stack Developer thành thạo Node.js Express React JavaScript MongoDB Redis thiết kế hệ thống phần mềm",
    "Kỹ sư DevOps Docker Kubernetes CI/CD triển khai ứng dụng Linux AWS tự động hóa quy trình phần mềm",
    "Java Backend Developer Spring Boot Microservices MySQL Hibernate tối ưu hóa truy vấn SQL kiểm thử unit test",
    "Lập trình viên .NET C# ASP.NET Core SQL Server phát triển ứng dụng doanh nghiệp bảo mật hệ thống",
    "Senior Data Analyst Power BI SQL phân tích số liệu kinh doanh dự báo xu hướng báo cáo quản trị BI",
    "Software Engineer phát triển sản phẩm công nghệ phần mềm thuật toán cấu trúc dữ liệu giải quyết vấn đề"
]

class CVMatchingEngine:
    def __init__(self):
        # Thiết kế bộ TfidfVectorizer với từ vựng 1-gram và 2-gram (ngram_range)
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            stop_words=None,  # Để hỗ trợ cả tiếng Anh lẫn tiếng Việt
            max_features=2000
        )
        # Fit trên tập văn bản tham chiếu chuẩn
        self.vectorizer.fit(REFERENCE_CORPUS)

    @staticmethod
    def clean_text(text: str) -> str:
        """
        Chuẩn hóa văn bản:
        - Chuyển thành chữ thường
        - Loại bỏ ký tự đặc biệt gây nhiễu, giữ lại các ký tự biểu diễn công nghệ (+, #, ., /)
        - Chuẩn hóa khoảng trắng
        """
        if not text:
            return ""
        text = text.lower()
        # Giữ chữ, số, tiếng Việt và các ký tự công nghệ phổ biến như c++, c#, .net, ci/cd, node.js
        text = re.sub(r"[^\w\s\+\#\.\/\-]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    @staticmethod
    def extract_skills(text: str) -> List[str]:
        """
        Trích xuất kỹ năng dựa trên từ điển chuẩn hóa và quy tắc biểu thức chính quy (Regex).
        Xử lý cẩn thận các trường hợp nhạy cảm như 'C', 'C++', 'C#', '.NET', 'Go', 'R'.
        """
        if not text:
            return []
        
        cleaned = text.lower()
        found_skills: Set[str] = set()

        for canonical_name, aliases in SKILL_DICTIONARY.items():
            for alias in aliases:
                # Tạo regex an toàn: nếu alias chứa ký tự đặc biệt (+, #, .), escape nó
                pattern = r"(?<!\w)" + re.escape(alias) + r"(?!\w)"
                if re.search(pattern, cleaned):
                    found_skills.add(canonical_name)
                    break

        return sorted(list(found_skills))

    def calculate_tfidf_similarity(self, text_a: str, text_b: str) -> float:
        """
        Tính Cosine Similarity giữa 2 văn bản dựa trên vectorizer đã fit sẵn trên tập tham chiếu.
        Trả về giá trị từ 0.0 đến 1.0 (sau đó nhân 100).
        """
        clean_a = self.clean_text(text_a)
        clean_b = self.clean_text(text_b)

        if not clean_a or not clean_b:
            return 0.0

        # Transform 2 văn bản bằng vectorizer nền
        vectors = self.vectorizer.transform([clean_a, clean_b])
        sim_matrix = cosine_similarity(vectors[0:1], vectors[1:2])
        score = float(sim_matrix[0][0])
        return max(0.0, min(1.0, score))

    def match_cv_to_job(
        self,
        cv_text: str,
        job_description: str,
        job_requirements: str,
        predefined_job_skills: Optional[List[str]] = None,
        weight_tfidf: float = 0.6,
        weight_skills: float = 0.4
    ) -> Dict:
        """
        Quy trình matching hoàn chỉnh:
        1. Trích xuất kỹ năng từ CV và JD.
        2. Đo độ tương đồng ngữ nghĩa TF-IDF Cosine Similarity (trọng số 60%).
        3. Đo tỷ lệ kỹ năng đáp ứng Skill Match Ratio (trọng số 40%).
        4. Tổng hợp thành Matching Score (0 - 100).
        5. Liệt kê matched_skills và missing_skills.
        """
        # Kết hợp nội dung JD
        full_jd_text = f"{job_description}\n{job_requirements}"
        
        # 1. Trích xuất kỹ năng
        cv_skills = self.extract_skills(cv_text)
        
        # Nếu có danh sách kỹ năng đã gán trong database thì hợp nhất với kỹ năng trích xuất từ văn bản JD
        jd_skills_extracted = self.extract_skills(full_jd_text)
        required_skills_set = set(jd_skills_extracted)
        if predefined_job_skills:
            required_skills_set.update(predefined_job_skills)
        required_skills = sorted(list(required_skills_set))

        # 2. Tính tập giao (matched) và tập thiếu (missing)
        cv_skills_set = set(cv_skills)
        matched_skills = sorted(list(cv_skills_set.intersection(required_skills_set)))
        missing_skills = sorted(list(required_skills_set.difference(cv_skills_set)))

        # 3. Tính tỷ lệ kỹ năng phù hợp
        if len(required_skills) > 0:
            skill_match_ratio = len(matched_skills) / len(required_skills)
        else:
            # Nếu JD không yêu cầu kỹ năng cụ thể nào, đánh giá trung tính
            skill_match_ratio = 1.0 if len(cv_skills) > 0 else 0.5

        # 4. Tính TF-IDF Cosine Similarity
        tfidf_sim = self.calculate_tfidf_similarity(cv_text, full_jd_text)

        # 5. Tổng hợp Matching Score theo trọng số (mặc định 60% TF-IDF, 40% Kỹ năng)
        # Lưu ý: Đây là lựa chọn thiết kế ban đầu kết hợp giữa độ tương đồng ngữ nghĩa tổng thể và độ khớp kỹ năng cốt lõi.
        total_score = (weight_tfidf * tfidf_sim + weight_skills * skill_match_ratio) * 100.0
        total_score = round(max(0.0, min(100.0, total_score)), 1)

        # 6. Đưa ra nhận xét định tính
        if total_score >= 75.0:
            comment = "Rất phù hợp (Strong Match) — Ứng viên đáp ứng phần lớn yêu cầu trọng tâm và kỹ năng cốt lõi."
        elif total_score >= 50.0:
            comment = "Khá phù hợp (Potential Match) — Cần bổ sung hoặc phỏng vấn sâu thêm một số kỹ năng còn thiếu."
        elif total_score >= 30.0:
            comment = "Ít phù hợp (Low Match) — Trùng khớp một phần ngữ cảnh nhưng thiếu nhiều kỹ năng quan trọng."
        else:
            comment = "Không phù hợp (Mismatch) — Hồ sơ và yêu cầu công việc thuộc các lĩnh vực hoặc kỹ năng khác nhau."

        return {
            "matching_score": total_score,
            "tfidf_similarity": round(tfidf_sim * 100.0, 1),
            "skill_match_ratio": round(skill_match_ratio * 100.0, 1),
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "extracted_cv_skills": cv_skills,
            "required_job_skills": required_skills,
            "evaluation_comment": comment
        }

# Global singleton engine
matching_engine = CVMatchingEngine()
