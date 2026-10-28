from typing import List, Dict

# Bộ 12 cặp CV / JD mẫu được gán nhãn Ground Truth (1: Phù hợp, 0: Không phù hợp)
# Được xây dựng để đánh giá khách quan độ chính xác của hệ thống AI Matching
LABELED_EVALUATION_PAIRS: List[Dict] = [
    {
        "pair_id": 1,
        "candidate_name": "Nguyễn Văn An (Python Backend)",
        "cv_text": "Kỹ sư Backend 3 năm kinh nghiệm với Python, FastAPI, Django. Thành thạo xây dựng RESTful API, tối ưu hóa cơ sở dữ liệu PostgreSQL và SQLite. Sử dụng Git, Docker triển khai container, kiểm thử tự động pytest.",
        "job_title": "Python Backend Engineer (FastAPI/PostgreSQL)",
        "job_description": "Tìm kiếm kỹ sư Backend Python phát triển dịch vụ API tốc độ cao bằng FastAPI và PostgreSQL.",
        "job_requirements": "Thành thạo Python, FastAPI, RESTful API, PostgreSQL, Docker, Git. Có tư duy viết code sạch và tối ưu hiệu năng.",
        "predefined_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Git", "RESTful API"],
        "ground_truth": 1  # Match
    },
    {
        "pair_id": 2,
        "candidate_name": "Trần Thị Bích (Frontend React)",
        "cv_text": "Lập trình viên Frontend 2 năm kinh nghiệm React, TypeScript, JavaScript, HTML/CSS, Tailwind CSS. Tối ưu trải nghiệm người dùng responsive, kết nối RESTful API, quản lý mã nguồn bằng Git.",
        "job_title": "React Frontend Developer (TypeScript)",
        "job_description": "Xây dựng giao diện ứng dụng web hiện đại bằng React và Tailwind CSS.",
        "job_requirements": "Kinh nghiệm thực tế với React, TypeScript, HTML/CSS, Tailwind CSS, Git. Hiểu biết về RESTful API.",
        "predefined_skills": ["React", "TypeScript", "HTML/CSS", "Tailwind CSS", "Git", "RESTful API"],
        "ground_truth": 1  # Match
    },
    {
        "pair_id": 3,
        "candidate_name": "Lê Hoàng Cường (Data Analyst)",
        "cv_text": "Chuyên viên phân tích dữ liệu thành thạo SQL, Python, Pandas, NumPy, Business Intelligence. Kinh nghiệm xây dựng dashboard trực quan hóa, phân tích xu hướng kinh doanh, xử lý dữ liệu lớn.",
        "job_title": "Data Analyst / BI Specialist",
        "job_description": "Phân tích số liệu vận hành và trực quan hóa báo cáo quản trị BI cho doanh nghiệp.",
        "job_requirements": "Thành thạo SQL truy vấn dữ liệu, Python phân tích (Pandas, NumPy), xây dựng Business Intelligence Dashboard.",
        "predefined_skills": ["SQL", "Python", "Pandas", "NumPy", "Data Analysis", "Business Intelligence"],
        "ground_truth": 1  # Match
    },
    {
        "pair_id": 4,
        "candidate_name": "Phạm Minh Đức (DevOps Engineer)",
        "cv_text": "Kỹ sư DevOps 4 năm kinh nghiệm quản trị hạ tầng Linux, triển khai Docker, Kubernetes, tự động hóa quy trình CI/CD. Vận hành dịch vụ đám mây AWS và quản lý cấu hình bằng Git.",
        "job_title": "DevOps & Cloud Engineer",
        "job_description": "Quản trị hệ thống Cloud, thiết lập đường ống CI/CD và cụm Kubernetes.",
        "job_requirements": "Yêu cầu kinh nghiệm vững vàng với Linux, Docker, Kubernetes, CI/CD, Git, AWS.",
        "predefined_skills": ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git"],
        "ground_truth": 1  # Match
    },
    {
        "pair_id": 5,
        "candidate_name": "Vũ Hải Đăng (AI/ML Engineer)",
        "cv_text": "Kỹ sư Machine Learning nghiên cứu và ứng dụng Python, Scikit-learn, Pandas, NumPy, Deep Learning. Xây dựng pipeline tiền xử lý dữ liệu, huấn luyện mô hình phân loại và tích hợp API suy luận.",
        "job_title": "Machine Learning Engineer",
        "job_description": "Nghiên cứu phát triển mô hình Machine Learning dự đoán và phân loại dữ liệu người dùng.",
        "job_requirements": "Thành thạo Python, Machine Learning, Scikit-learn, Pandas, NumPy. Có khả năng đưa mô hình vào phục vụ thực tế.",
        "predefined_skills": ["Python", "Machine Learning", "Scikit-learn", "Pandas", "NumPy"],
        "ground_truth": 1  # Match
    },
    {
        "pair_id": 6,
        "candidate_name": "Đỗ Thu Giang (Java Developer)",
        "cv_text": "Lập trình viên Java 3 năm kinh nghiệm phát triển hệ thống doanh nghiệp với Spring Boot, MySQL, RESTful API. Hiểu biết cơ chế ORM Hibernate, kiểm thử unit test và quản lý phiên bản Git.",
        "job_title": "Senior Java Spring Boot Developer",
        "job_description": "Phát triển hệ thống microservices phục vụ thanh toán trực tuyến.",
        "job_requirements": "Yêu cầu nắm vững Java, Spring Boot, MySQL, RESTful API, Git. Khả năng làm việc nhóm tốt.",
        "predefined_skills": ["Java", "Spring Boot", "MySQL", "RESTful API", "Git"],
        "ground_truth": 1  # Match
    },
    {
        "pair_id": 7,
        "candidate_name": "Trần Thị Bích (Frontend React)",
        "cv_text": "Lập trình viên Frontend chuyên về React, TypeScript, JavaScript, HTML/CSS, Tailwind CSS. Giao diện người dùng web, không có kinh nghiệm với backend hệ thống lớn.",
        "job_title": "Java Backend Engineer",
        "job_description": "Xây dựng kiến trúc xử lý backend phân tán bằng ngôn ngữ Java và Spring Boot.",
        "job_requirements": "Bắt buộc có kinh nghiệm sâu về Java, Spring Boot, MySQL, RESTful API. Tối ưu kiến trúc backend.",
        "predefined_skills": ["Java", "Spring Boot", "MySQL", "RESTful API"],
        "ground_truth": 0  # Mismatch (Frontend ứng tuyển Backend Java)
    },
    {
        "pair_id": 8,
        "candidate_name": "Lê Hoàng Cường (Data Analyst)",
        "cv_text": "Chuyên viên phân tích dữ liệu với SQL, Python, Pandas, NumPy, Business Intelligence Dashboard. Chuyên môn về số liệu và báo cáo tài chính.",
        "job_title": "DevOps & Cloud Engineer",
        "job_description": "Quản trị hạ tầng máy chủ Linux và cụm điều phối Kubernetes trên nền tảng AWS.",
        "job_requirements": "Yêu cầu thành thạo Linux, Docker, Kubernetes, CI/CD, AWS.",
        "predefined_skills": ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS"],
        "ground_truth": 0  # Mismatch (Data Analyst ứng tuyển DevOps)
    },
    {
        "pair_id": 9,
        "candidate_name": "Bùi Mai Hương (Kế toán & Hành chính)",
        "cv_text": "Nhân viên kế toán tổng hợp 5 năm kinh nghiệm quản lý thu chi, lập báo cáo tài chính, kê khai thuế bằng Excel và phần mềm kế toán MISA. Kỹ năng giao tiếp và soạn thảo hợp đồng.",
        "job_title": "Python Backend Engineer (FastAPI/PostgreSQL)",
        "job_description": "Phát triển hệ thống dịch vụ dữ liệu bằng Python và FastAPI.",
        "job_requirements": "Thành thạo lập trình Python, FastAPI, PostgreSQL, Docker, Git.",
        "predefined_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
        "ground_truth": 0  # Mismatch (Khác ngành hoàn toàn)
    },
    {
        "pair_id": 10,
        "candidate_name": "Ngô Gia Bảo (Thực tập sinh mới bắt đầu)",
        "cv_text": "Sinh viên năm nhất ngành khoa học máy tính đang tìm hiểu căn bản về máy tính, tin học văn phòng Word và PowerPoint. Mong muốn học hỏi kinh nghiệm.",
        "job_title": "DevOps & Cloud Engineer",
        "job_description": "Vận hành hệ thống chịu tải cao với Kubernetes và hạ tầng đám mây AWS.",
        "job_requirements": "Tối thiểu 3 năm kinh nghiệm với Docker, Kubernetes, CI/CD, Linux, AWS.",
        "predefined_skills": ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS"],
        "ground_truth": 0  # Mismatch (Thiếu toàn bộ kỹ năng kỹ thuật yêu cầu)
    },
    {
        "pair_id": 11,
        "candidate_name": "Hoàng Quốc Việt (Fullstack Web)",
        "cv_text": "Kỹ sư phần mềm Fullstack có thế mạnh Frontend với React, TypeScript, JavaScript, HTML/CSS, Tailwind CSS và Backend cơ bản với Node.js, RESTful API, Git.",
        "job_title": "React Frontend Developer (TypeScript)",
        "job_description": "Xây dựng các module web app trực quan phục vụ người dùng cuối.",
        "job_requirements": "Thành thạo React, TypeScript, HTML/CSS, Tailwind CSS, Git.",
        "predefined_skills": ["React", "TypeScript", "HTML/CSS", "Tailwind CSS", "Git"],
        "ground_truth": 1  # Match
    },
    {
        "pair_id": 12,
        "candidate_name": "Phan Mỹ Linh (Graphic / UI Designer)",
        "cv_text": "Nhà thiết kế đồ họa sáng tạo với Figma, Adobe Photoshop, Illustrator. Thiết kế nhận diện thương hiệu, banner quảng cáo và giao diện wireframe người dùng.",
        "job_title": "Machine Learning Engineer",
        "job_description": "Nghiên cứu và huấn luyện mô hình Machine Learning phân tích dữ liệu lớn.",
        "job_requirements": "Nắm vững Python, Machine Learning, Scikit-learn, Pandas, NumPy.",
        "predefined_skills": ["Python", "Machine Learning", "Scikit-learn", "Pandas", "NumPy"],
        "ground_truth": 0  # Mismatch (Designer ứng tuyển ML Engineer)
    }
]

def evaluate_matching_model(engine, threshold: float = 45.0) -> Dict:
    """
    Chạy đánh giá thực nghiệm mô hình trên 12 cặp đã gán nhãn:
    - Tính Matching Score thực tế cho từng cặp.
    - So sánh với ngưỡng phân loại (threshold) để đưa ra nhãn dự đoán (1: Match, 0: Mismatch).
    - Tính ma trận nhầm lẫn (TP, TN, FP, FN).
    - Tính các chỉ số Accuracy, Precision, Recall, F1 theo công thức toán học chuẩn xác.
    """
    tp = 0
    tn = 0
    fp = 0
    fn = 0
    evaluated_pairs = []

    for item in LABELED_EVALUATION_PAIRS:
        res = engine.match_cv_to_job(
            cv_text=item["cv_text"],
            job_description=item["job_description"],
            job_requirements=item["job_requirements"],
            predefined_job_skills=item["predefined_skills"]
        )
        score = res["matching_score"]
        pred = 1 if score >= threshold else 0
        gt = item["ground_truth"]

        is_correct = (pred == gt)
        if pred == 1 and gt == 1:
            tp += 1
        elif pred == 0 and gt == 0:
            tn += 1
        elif pred == 1 and gt == 0:
            fp += 1
        elif pred == 0 and gt == 1:
            fn += 1

        evaluated_pairs.append({
            "pair_id": item["pair_id"],
            "candidate_name": item["candidate_name"],
            "job_title": item["job_title"],
            "ground_truth": gt,
            "calculated_score": score,
            "predicted_label": pred,
            "is_correct": is_correct
        })

    total = len(LABELED_EVALUATION_PAIRS)
    accuracy = (tp + tn) / total if total > 0 else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    return {
        "threshold": threshold,
        "accuracy": round(accuracy * 100.0, 1),
        "precision": round(precision * 100.0, 1),
        "recall": round(recall * 100.0, 1),
        "f1_score": round(f1 * 100.0, 1),
        "true_positives": tp,
        "true_negatives": tn,
        "false_positives": fp,
        "false_negatives": fn,
        "pairs": evaluated_pairs,
        "methodology": (
            "Sử dụng tập kiểm thử 12 cặp CV/JD được gán nhãn thực tế đại diện cho các vị trí: Backend, "
            "Frontend, Data/BI, DevOps, Machine Learning và các trường hợp trái ngành/mất cân xứng kỹ năng. "
            f"Ngưỡng quyết định nhị phân được đặt tại {threshold} điểm (Matching Score >= {threshold} được coi là phù hợp)."
        ),
        "limitations": [
            "Mô hình TF-IDF dựa trên tần suất từ vựng, chưa hiểu sâu sắc các từ đồng nghĩa chưa có trong từ điển.",
            "Phương pháp trích xuất kỹ năng bằng Regex từ điển có thể bị giới hạn nếu ứng viên dùng thuật ngữ viết tắt quá đặc thù.",
            "Trọng số cố định (60% TF-IDF, 40% Kỹ năng) là giả định thiết kế ban đầu, có thể tinh chỉnh theo từng nhóm ngành nghề."
        ]
    }
