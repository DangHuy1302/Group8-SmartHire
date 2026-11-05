from typing import List, Dict, Optional

# CƠ SỞ TRI THỨC KỸ NĂNG (RULE-BASED KNOWLEDGE BASE)
# Cung cấp lý do tầm quan trọng, cách bổ sung minh chứng và lộ trình học tập thực tế
SKILL_INSIGHTS_DB: Dict[str, Dict[str, str]] = {
    "Docker": {
        "importance": "Đóng gói ứng dụng và bảo đảm môi trường chạy đồng nhất từ máy tính lập trình đến môi trường triển khai thực tế.",
        "evidence": "Nêu tên dự án đã tự tay viết Dockerfile, docker-compose.yml hoặc tối ưu dung lượng image (multi-stage build).",
        "learning_path": "Thực hành containerize một ứng dụng web nhỏ, chạy cùng cơ sở dữ liệu và push image lên Docker Hub."
    },
    "Kubernetes": {
        "importance": "Điều phối, mở rộng và quản lý vòng đời cụm container trong các hệ thống microservices quy mô lớn.",
        "evidence": "Mô tả kinh nghiệm cấu hình Deployment, Service, ConfigMap, Ingress hoặc vận hành cụm K8s (k3s, Minikube, GKE/EKS).",
        "learning_path": "Học kiến trúc Pod/Deployment qua Minikube hoặc Kind, thực hành deploy ứng dụng và tìm hiểu chứng chỉ CKA."
    },
    "CI/CD": {
        "importance": "Tự động hóa quy trình kiểm thử (test), đóng gói và triển khai phần mềm liên tục, giảm thiểu lỗi thủ công.",
        "evidence": "Đính kèm link repository có workflow GitHub Actions, GitLab CI hoặc Jenkinsfile tự động chạy test khi tạo Pull Request.",
        "learning_path": "Thiết lập một GitHub Actions pipeline tự động chạy linter, unit test và build container cho project cá nhân."
    },
    "FastAPI": {
        "importance": "Framework hiện đại cho Python với tốc độ thực thi cao, hỗ trợ bất đồng bộ (async/await) và tự động sinh Swagger docs.",
        "evidence": "Trình bày các REST API endpoints đã xây dựng, cách tổ chức Pydantic models, Dependency Injection và tối ưu truy vấn.",
        "learning_path": "Đọc tài liệu chính thức của FastAPI, xây dựng dự án CRUD bất đồng bộ kết nối SQLAlchemy và PostgreSQL."
    },
    "Django": {
        "importance": "Framework Python toàn diện 'batteries-included', phổ biến cho các ứng dụng web doanh nghiệp có xác thực và ORM mạnh mẽ.",
        "evidence": "Nêu rõ kinh nghiệm với Django ORM, Django REST framework (DRF), quản trị migration và hệ thống phân quyền.",
        "learning_path": "Xây dựng dự án thương mại điện tử hoặc cổng thông tin với DRF, tối ưu N+1 query với select_related/prefetch_related."
    },
    "Python": {
        "importance": "Ngôn ngữ đa năng cốt lõi cho Backend, Data Engineering, AI/ML và tự động hóa hệ thống.",
        "evidence": "Làm nổi bật các đoạn mã sạch, sử dụng type hints, generator, xử lý đa luồng/bất đồng bộ và tuân thủ chuẩn PEP 8.",
        "learning_path": "Nâng cao kiến thức lập trình hướng đối tượng (OOP), design patterns và giải thuật qua LeetCode/HackerRank."
    },
    "React": {
        "importance": "Thư viện UI phổ biến hàng đầu để phát triển ứng dụng Single Page Application (SPA) tương tác cao.",
        "evidence": "Trình bày việc tổ chức component, custom hooks, quản lý state (Context/Redux/Zustand) và tối ưu render.",
        "learning_path": "Thực hành xây dựng dashboard tương tác bằng React + Vite, xử lý responsive và kết nối REST API bất đồng bộ."
    },
    "TypeScript": {
        "importance": "Cung cấp hệ thống static typing chặt chẽ cho JavaScript, hạn chế lỗi runtime trong dự án quy mô lớn.",
        "evidence": "Nêu việc định nghĩa Interfaces, Generics, Type Utility và cấu hình tsconfig nghiêm ngặt trong dự án thực tế.",
        "learning_path": "Chuyển đổi một dự án JavaScript sang TypeScript, áp dụng strict mode và làm quen với Discriminated Unions."
    },
    "Next.js": {
        "importance": "Framework React hỗ trợ Server-Side Rendering (SSR), Static Site Generation (SSG) và tối ưu SEO vượt trội.",
        "evidence": "Mô tả việc xây dựng ứng dụng với App Router, Server Components, Server Actions và tối ưu hóa hình ảnh/font.",
        "learning_path": "Xây dựng một website tin tức hoặc blog với SSR, caching và deploy lên nền tảng đám mây."
    },
    "Tailwind CSS": {
        "importance": "Framework CSS Utility-first giúp xây dựng giao diện hiện đại, chuẩn responsive và tùy biến nhanh chóng.",
        "evidence": "Nêu kinh nghiệm thiết kế UI tương thích đa thiết bị (mobile/tablet/desktop) và xây dựng design system nhất quán.",
        "learning_path": "Thiết kế lại một landing page chuyên nghiệp bằng Tailwind, áp dụng dark mode và responsive breakpoints."
    },
    "Vue.js": {
        "importance": "Framework Frontend tiến bộ, cú pháp trực quan, mạnh mẽ trong các hệ sinh thái doanh nghiệp vừa và lớn.",
        "evidence": "Trình bày việc dùng Composition API, Pinia/Vuex quản lý state và Vue Router cho định tuyến ứng dụng.",
        "learning_path": "Học Composition API với `<script setup>`, xây dựng ứng dụng CRUD và kết nối backend API."
    },
    "PostgreSQL": {
        "importance": "Hệ quản trị CSDL quan hệ mã nguồn mở mạnh mẽ, bảo đảm tính toàn vẹn dữ liệu ACID và hỗ trợ JSONB phong phú.",
        "evidence": "Nêu kinh nghiệm thiết kế schema chuẩn hóa, đánh chỉ mục (B-Tree/GIN indexing), tối ưu EXPLAIN ANALYZE và transaction.",
        "learning_path": "Thực hành thiết kế CSDL 3NF, viết câu lệnh JOIN phức tạp, stored procedures và cấu hình replication cơ bản."
    },
    "MySQL": {
        "importance": "RDBMS phổ biến trong các ứng dụng web truyền thống và kiến trúc LAMP/LEMP.",
        "evidence": "Mô tả kỹ năng phân tích chỉ mục, tối ưu hóa câu truy vấn chậm (slow query log) và quản lý khóa ngoại.",
        "learning_path": "Tìm hiểu engine InnoDB, cơ chế locking và thực hành tối ưu hóa truy vấn với bảng dữ liệu lớn."
    },
    "Redis": {
        "importance": "In-memory key-value data store dùng cho caching tốc độ cao, quản lý session và message broker.",
        "evidence": "Nêu kịch bản ứng dụng Redis làm cache layer giảm tải CSDL hoặc dùng làm rate limiter, pub/sub.",
        "learning_path": "Cài đặt Redis, ứng dụng các cấu trúc dữ liệu String, Hash, Sorted Set để làm caching và leaderboards."
    },
    "MongoDB": {
        "importance": "CSDL NoSQL dạng tài liệu (Document-oriented), linh hoạt cho dữ liệu phi cấu trúc và thay đổi nhanh.",
        "evidence": "Trình bày việc thiết kế document schema, Aggregation Framework và tối ưu hóa index trên các trường lồng nhau.",
        "learning_path": "Thực hành xây dựng API với Mongoose/PyMongo, áp dụng Aggregation Pipeline cho báo cáo thống kê."
    },
    "AWS": {
        "importance": "Nền tảng điện toán đám mây số 1 thị trường cung cấp hạ tầng IaaS/PaaS/SaaS toàn diện.",
        "evidence": "Nêu các dịch vụ AWS đã trực tiếp sử dụng (EC2, S3, RDS, Lambda, CloudFront, IAM) và cách phân quyền bảo mật.",
        "learning_path": "Đăng ký tài khoản AWS Free Tier, triển khai ứng dụng web lên EC2 + RDS và ôn luyện chứng chỉ AWS Certified Cloud Practitioner."
    },
    "Git": {
        "importance": "Hệ thống quản lý phiên bản phân tán bắt buộc đối với mọi kỹ sư phần mềm làm việc nhóm.",
        "evidence": "Cung cấp link trang cá nhân GitHub/GitLab có commit history đều đặn, mô tả quy trình Git Flow / Pull Request.",
        "learning_path": "Thành thạo các lệnh branch, merge, rebase, cherry-pick và giải quyết merge conflict khi làm việc nhóm."
    },
    "Linux": {
        "importance": "Hệ điều hành tiêu chuẩn chạy hầu hết các máy chủ server, cloud và container hiện nay.",
        "evidence": "Nêu khả năng thao tác terminal, viết Bash script tự động hóa, cấu hình systemd service và quản trị quyền user/file.",
        "learning_path": "Cài đặt máy ảo Ubuntu Server, thực hành cấu hình Nginx reverse proxy và quản lý firewall UFW."
    },
    "Machine Learning": {
        "importance": "Nền tảng xây dựng các thuật toán dự báo, nhận dạng và trích xuất thông tin tự động từ dữ liệu.",
        "evidence": "Mô tả bài toán đã giải quyết (phân loại, hồi quy, gom cụm), tập dữ liệu sử dụng và độ đo đánh giá (Precision, Recall, F1, RMSE).",
        "learning_path": "Học quy trình chuẩn CRISP-DM: Khám phá dữ liệu (EDA), tiền xử lý, huấn luyện mô hình Scikit-learn và đánh giá chéo (Cross-validation)."
    },
    "Scikit-learn": {
        "importance": "Thư viện Python tiêu chuẩn cho thuật toán học máy cổ điển (TF-IDF, Regression, Random Forest, SVM).",
        "evidence": "Nêu việc xây dựng Pipeline xử lý đặc trưng, vector hóa văn bản và tối ưu siêu tham số (GridSearchCV).",
        "learning_path": "Thực hành xây dựng mô hình phân loại văn bản hoặc dự báo giá nhà từ khâu xử lý dữ liệu đến xuất mô hình."
    },
    "Business Intelligence": {
        "importance": "Chuyển hóa dữ liệu thô thành thông tin quản trị chiến lược qua các bảng điều khiển (Dashboards) tương tác.",
        "evidence": "Trình bày kinh nghiệm xây dựng báo cáo phân tích phễu, xu hướng kinh doanh và số liệu trực quan cho ban lãnh đạo.",
        "learning_path": "Thực hành phân tích dữ liệu bán hàng/tuyển dụng, xây dựng các biểu đồ KPI, phễu chuyển đổi và biểu đồ xu hướng thời gian."
    },
    "SQL": {
        "importance": "Kỹ năng nền tảng bắt buộc để truy vấn, biến đổi và tổng hợp dữ liệu từ mọi hệ thống cơ sở dữ liệu.",
        "evidence": "Làm nổi bật khả năng viết truy vấn phức tạp sử dụng CTE (Common Table Expressions), Window Functions và Aggregate.",
        "learning_path": "Luyện tập các bài toán SQL trung cấp - nâng cao trên LeetCode/StrataScratch với GROUP BY, HAVING và WINDOW functions."
    },
    "RESTful API": {
        "importance": "Kiến trúc giao tiếp chuẩn mực kết nối giữa Client (Web/Mobile) và Server Backend.",
        "evidence": "Nêu rõ việc thiết kế API tuân thủ chuẩn REST (HTTP methods, status codes, cấu trúc URL tài nguyên, phân trang, xử lý lỗi).",
        "learning_path": "Thiết kế một API service hoàn chỉnh có tài liệu OpenAPI/Swagger, xử lý authentication bằng JWT và validation dữ liệu đầu vào."
    }
}


def generate_skill_gaps(
    missing_skills: List[str],
    job_title: str,
    max_gaps: int = 5
) -> List[Dict[str, str]]:
    """
    Tự động xác định 3-5 Skill Gaps nổi bật từ danh sách kỹ năng chưa nhận diện trong CV.
    - Không bịa thêm kỹ năng nếu missing_skills có ít hơn 3.
    - Ghi nhận trạng thái trung thực: 'Chưa tìm thấy minh chứng trong CV'.
    - Dùng rule-based knowledge base thực tế để đưa ra lý do và gợi ý hành động.
    """
    if not missing_skills:
        return []

    # Giới hạn tối đa max_gaps (mặc định 3-5)
    selected_skills = missing_skills[:max_gaps]
    gaps: List[Dict[str, str]] = []

    for sk in selected_skills:
        info = SKILL_INSIGHTS_DB.get(sk)
        if info:
            importance = info["importance"]
            evidence = info["evidence"]
            learning = info["learning_path"]
        else:
            importance = f"Là kỹ năng công nghệ được yêu cầu trực tiếp trong JD cho vị trí '{job_title}'."
            evidence = f"Nếu bạn đã từng áp dụng {sk}, hãy bổ sung tên đồ án/dự án cụ thể và bối cảnh sử dụng vào phần Dự án hoặc Kinh nghiệm làm việc."
            learning = f"Nghiên cứu tài liệu chính thức của {sk}, thực hành bài tập cơ bản và đính kèm link minh chứng mã nguồn vào CV."

        gaps.append({
            "skill_name": sk,
            "status_label": "Chưa tìm thấy minh chứng trong CV",
            "importance": importance,
            "evidence_suggestion": evidence,
            "learning_path": learning
        })

    return gaps


def generate_cv_outline_recommendations(
    cv_skills: List[str],
    matched_skills: List[str],
    missing_skills: List[str],
    job_title: str,
    employer_name: str
) -> List[Dict[str, str]]:
    """
    Gợi ý cải thiện 6 phần cốt lõi của CV dựa trên vị trí tuyển dụng đã chọn:
    1. Thông tin cá nhân
    2. Tóm tắt nghề nghiệp
    3. Kỹ năng chuyên môn
    4. Dự án nổi bật
    5. Kinh nghiệm làm việc
    6. Học vấn và chứng chỉ
    
    Tuân thủ nguyên tắc:
    - Không bịa thông tin giả mạo.
    - Không tự động đưa kỹ năng còn thiếu vào danh sách kỹ năng có sẵn.
    """
    matched_str = ", ".join(matched_skills[:4]) if matched_skills else "các công nghệ nền tảng của bạn"
    missing_str = ", ".join(missing_skills[:3]) if missing_skills else "công nghệ nâng cao khác"

    return [
        {
            "section_id": "contact_info",
            "section_name": "1. Thông tin cá nhân & Liên hệ",
            "keep_advice": "Họ và tên, email chuyên nghiệp, số điện thoại, địa bàn cư trú (Thành phố) và liên kết hồ sơ LinkedIn hoặc GitHub/Portfolio.",
            "priority_advice": f"Đối với ứng tuyển vị trí '{job_title}', đường dẫn GitHub hoặc Portfolio là minh chứng đắt giá nhất để nhà tuyển dụng tại {employer_name} kiểm tra chất lượng mã nguồn thực tế.",
            "evidence_advice": "Đảm bảo tài khoản GitHub có README cá nhân chỉn chu, hiển thị các repository công khai liên quan.",
            "learning_caution": "Không đưa thông tin cá nhân nhạy cảm không liên quan (CMND/CCCD, ngày sinh chi tiết, tình trạng hôn nhân, địa chỉ nhà riêng)."
        },
        {
            "section_id": "professional_summary",
            "section_name": "2. Tóm tắt nghề nghiệp (Professional Summary)",
            "keep_advice": "3-4 câu súc tích định vị bản thân: Số năm kinh nghiệm, vị trí chuyên môn hiện tại và thế mạnh công nghệ cốt lõi.",
            "priority_advice": f"Điều chỉnh câu mở đầu để hướng thẳng vào vị trí '{job_title}'. Làm nổi bật ngay những năng lực trùng khớp bạn đang có ({matched_str}).",
            "evidence_advice": "Thay vì viết chung chung như 'chăm chỉ, ham học hỏi', hãy nêu định lượng: 'Kỹ sư phần mềm với kinh nghiệm xây dựng REST API chịu tải và tối ưu hiệu năng cơ sở dữ liệu'.",
            "learning_caution": "Tuyệt đối không nhận mình là chuyên gia (Senior/Expert) ở các kỹ năng bạn chưa thành thạo."
        },
        {
            "section_id": "technical_skills",
            "section_name": "3. Kỹ năng chuyên môn (Technical Skills)",
            "keep_advice": f"Giữ nguyên các kỹ năng bạn đã thực sự sử dụng ({matched_str}), phân chia khoa học theo nhóm: Ngôn ngữ lập trình, Frameworks, CSDL & Công cụ.",
            "priority_advice": "Đẩy các kỹ năng phù hợp với JD lên vị trí đầu tiên trong từng nhóm để người duyệt hồ sơ nhận thấy sự tương thích ngay trong 6 giây đầu tiên.",
            "evidence_advice": "Kèm theo mức độ thành thạo hoặc thời gian sử dụng thực tế (ví dụ: Python (2 năm), FastAPI, PostgreSQL).",
            "learning_caution": f"Đối với các kỹ năng chưa có minh chứng ({missing_str}): KHÔNG copy vào danh sách kỹ năng có sẵn nếu chưa học. Hãy dành thời gian thực hành trước khi cập nhật."
        },
        {
            "section_id": "featured_projects",
            "section_name": "4. Dự án nổi bật (Featured Projects)",
            "keep_advice": "2-3 dự án tiêu biểu nhất (đồ án tốt nghiệp, pet-project, dự án thực tập hoặc sản phẩm thực tế) có sử dụng ngăn xếp công nghệ liên quan.",
            "priority_advice": f"Ưu tiên làm nổi bật các dự án giải quyết bài toán tương tự yêu cầu của vị trí '{job_title}'. Nêu rõ việc ứng dụng {matched_str}.",
            "evidence_advice": "Trình bày theo mô hình STAR/CAR: Bối cảnh dự án -> Vai trò đảm nhiệm -> Công nghệ sử dụng -> Kết quả đạt được (số lượng API, người dùng, hiệu năng). Kèm link demo/GitHub.",
            "learning_caution": "Chỉ liệt kê dự án mà bạn thực sự hiểu rõ kiến trúc và có thể tự tin trả lời phỏng vấn chi tiết từng dòng code."
        },
        {
            "section_id": "work_experience",
            "section_name": "5. Kinh nghiệm làm việc (Work Experience)",
            "keep_advice": "Lịch sử công tác theo thứ tự thời gian đảo ngược: Chức danh, tên doanh nghiệp, thời gian và các gạch đầu dòng trách nhiệm chính.",
            "priority_advice": "Nhấn mạnh các đầu việc thực tế liên quan trực tiếp đến tin tuyển dụng hiện tại.",
            "evidence_advice": "Sử dụng các động từ hành động mạnh (Xây dựng, Tối ưu, Tích hợp, Triển khai) kết hợp số liệu minh chứng (giảm 30% thời gian phản hồi, tự động hóa quy trình test).",
            "learning_caution": "Nếu chưa có kinh nghiệm doanh nghiệp chính thức, hãy tập trung làm dày dặn phần Dự án thực chiến, hoạt động nghiên cứu hoặc đồ án môn học thay vì để trống."
        },
        {
            "section_id": "education_certifications",
            "section_name": "6. Học vấn và Chứng chỉ (Education & Certifications)",
            "keep_advice": "Bằng cấp đại học/cao đẳng chuyên ngành liên quan (CNTT, Phần mềm, Hệ thống thông tin...), năm tốt nghiệp và điểm GPA (nếu từ Khá/Giỏi).",
            "priority_advice": "Làm nổi bật các chứng chỉ chuyên ngành uy tín hoặc khóa học chuyên sâu liên quan đến công nghệ trong JD.",
            "evidence_advice": "Cung cấp mã xác thực chứng chỉ (Credential ID) hoặc đường dẫn kiểm tra chứng chỉ trực tuyến nếu có.",
            "learning_caution": "Không đưa vào các chứng chỉ tham gia hội thảo ngắn hạn không liên quan hoặc chứng chỉ chưa hoàn thành."
        }
    ]

