# KỊCH BẢN VÀ HƯỚNG DẪN QUAY VIDEO DEMO TH3
## DỰ ÁN: SMARTHIRE MINI — GROUP 8
**Thời lượng dự kiến**: 11 – 13 phút (Đạt chuẩn yêu cầu 10 – 15 phút)  
**Mục tiêu**: Hướng dẫn chi tiết từng phút, từng thao tác chuột, lời thuyết minh và bằng chứng cần đưa lên màn hình để bất kỳ thành viên nào trong nhóm cũng có thể tự tin quay video đạt điểm tối đa.

---

## I. CHUẨN BỊ TRƯỚC KHI BẤM NÚT QUAY (PRE-FLIGHT CHECK — 2 PHÚT)

1. **Khởi động ứng dụng**:
   - Mở thư mục dự án trên Windows: `Group8-SmartHire`.
   - Nhấp đúp chuột vào file `start.bat`.
   - Hai cửa sổ CMD sẽ mở ra:
     + Cửa sổ 1: FastAPI chạy tại `http://127.0.0.1:8000`.
     + Cửa sổ 2: Vite React chạy tại `http://localhost:3000`.
2. **Mở trình duyệt Web**:
   - Mở Chrome/Edge, truy cập `http://localhost:3000`.
   - Nhấn `F11` (hoặc để full screen sạch sẽ, ẩn thanh bookmark nếu cần).
   - Mở thêm 1 tab phụ: `http://127.0.0.1:8000/docs` (Swagger API để phòng khi cần chứng minh backend chạy thật).
3. **Cài đặt phần mềm quay video**:
   - Sử dụng OBS Studio, Bandicam hoặc Windows Game Bar (`Win + G`).
   - Kiểm tra âm thanh micro to, rõ ràng, không bị rè hoặc lẫn tạp âm.

---

## II. KỊCH BẢN CHI TIẾT 5 PHẦN THEO CHECKLIST

---

### PHẦN 1: GIỚI THIỆU & THIẾT KẾ HỆ THỐNG / DATABASE (CHECKLIST 1)
⏱ **Thời lượng**: Phút 00:00 – Phút 02:30 (2.5 phút)  
🖥 **Màn hình mở**: **Tab 1: 1. Tổng quan & Thiết kế**

#### Thao tác trên màn hình:
1. Giữ nguyên giao diện Tab 1. Rê chuột chỉ vào Logo **SmartHire Mini** và nhãn **Group 8**.
2. Cuộn nhẹ xuống phần **Thống kê thực tế trong Cơ sở dữ liệu SQLite**:
   - Rê chuột qua 5 ô số liệu: 20 Ứng viên, 5 Nhà tuyển dụng, 15 Tin tuyển dụng, 40 Đơn ứng tuyển, 25 Kỹ năng.
   - Bấm nút **"Đồng bộ DB"** để thấy animation xoay nhẹ, chứng minh dữ liệu được lấy từ API thời gian thực.
3. Cuộn tiếp xuống phần **Sơ đồ kiến trúc 3 tầng (Architecture)**: Rê chuột giải thích Frontend (React), Backend (FastAPI + Scikit-learn), Data Layer (SQLite).
4. Cuộn xuống phần **Sơ đồ ERD (7 bảng)**: Rê chuột qua các bảng `employers`, `candidates`, `jobs`, `skills`, `candidate_skills`, `job_skills`, `applications` và chỉ rõ các khóa chính (PK) `id`, khóa ngoại (FK) `employer_id`, `candidate_id`, `job_id`.

#### Lời thoại thuyết minh (Đọc tự tin, rõ ràng):
> *"Kính chào Thầy và các bạn! Hôm nay, đại diện cho **Group 8**, em xin phép trình bày và minh chứng sản phẩm bài thực hành TH3 với đề tài: **SmartHire Mini — Hệ thống tìm việc thông minh tích hợp AI và BI**.*
>
> *Đầu tiên là **Checklist 1: Yêu cầu hệ thống và Database**. Hệ thống phục vụ hai nhóm đối tượng chính là Ứng viên tìm việc và Nhà tuyển dụng. Toàn bộ kiến trúc được xây dựng theo mô hình 3 tầng độc lập:*
> - *Tầng Frontend viết bằng React, TypeScript, Vite và Tailwind CSS.*
> - *Tầng Backend xử lý bằng FastAPI của Python, tích hợp thư viện Scikit-learn để tính toán và SQLAlchemy kết nối cơ sở dữ liệu.*
> - *Tầng dữ liệu sử dụng SQLite gọn nhẹ với file `smarthire.db`.*
>
> *Như Thầy có thể quan sát trực tiếp trên màn hình, cơ sở dữ liệu đã được nạp bộ dữ liệu mẫu chuẩn hóa với:*
> - *20 ứng viên chi tiết,*
> - *5 nhà tuyển dụng,*
> - *15 tin tuyển dụng với mức lương trải dài từ tháng 5 đến tháng 10 năm 2026,*
> - *40 đơn ứng tuyển phân bổ trong phễu,*
> - *và 25 kỹ năng công nghệ chuẩn hóa.*
>
> *Về mặt thiết kế cơ sở dữ liệu, ERD của hệ thống gồm đúng 7 thực thể liên kết với nhau qua các khóa chính, khóa ngoại chặt chẽ. Đảm bảo toàn vẹn dữ liệu và kết quả seed có thể tái lập 100% trên bất kỳ máy tính nào."*

---

### PHẦN 2: MINH CHỨNG AI/ML CV MATCHING (CHECKLIST 2)
⏱ **Thời lượng**: Phút 02:30 – Phút 05:30 (3.0 phút)  
🖥 **Màn hình mở**: Bấm chuyển sang **Tab 2: 2. AI CV Matching**

#### Thao tác trên màn hình:
1. **Ca 1 (Hồ sơ rất phù hợp — Strong Match)**:
   - Tại ô chọn JD, chọn Job **#1 — Senior Python Backend Engineer**.
   - Tại ô "Mẫu có sẵn", chọn ứng viên **Nguyễn Văn An (Backend Developer)**.
   - Thấy nội dung CV được tự động điền: *"Kỹ sư Backend 3 năm kinh nghiệm lập trình Python, FastAPI..."*
   - Rê chuột vào phần **Trọng số thử nghiệm**: Chỉ vào thanh trượt (60% TF-IDF Cosine Similarity và 40% Tỷ lệ kỹ năng).
   - Nhấn nút **"Phân tích mức độ phù hợp"**.
   - **Bằng chứng xuất hiện**: Thanh điểm Matching Score hiện ra rất cao (~75% - 85%), màu xanh lá cây; TF-IDF Similarity hiện rõ; Tỷ lệ kỹ năng hiện rõ; Hộp "Kỹ năng phù hợp" hiển thị màu xanh: *Python, FastAPI, PostgreSQL, Docker, Git, RESTful API*; Hộp "Kỹ năng còn thiếu" trống hoặc ít.
2. **Ca 2 (Hồ sơ trái ngành — Mismatch)**:
   - Giữ nguyên Job #1 (Python Backend).
   - Tại ô ứng viên mẫu, chọn **Bùi Mai Hương (Senior Accountant)** (Kế toán tổng hợp).
   - Nhấn nút **"Phân tích mức độ phù hợp"**.
   - **Bằng chứng xuất hiện**: Matching Score tụt xuống thấp (~10% - 20%), thanh điểm màu đỏ; Tỷ lệ kỹ năng 0%; Kỹ năng phù hợp trống; Kỹ năng còn thiếu hiển thị toàn bộ kỹ năng yêu cầu. Nhận xét hệ thống chuyển thành *"Không phù hợp (Mismatch)"*.
3. **Ca 3 (Kiểm thử trường hợp biên — Empty CV)**:
   - Xóa sạch nội dung CV trong ô textarea.
   - Nhập một vài chữ không liên quan hoặc để trống, nhấn nút phân tích.
   - Hệ thống thông báo cảnh báo hoặc trả điểm 0 an toàn mà không bị crash backend.

#### Lời thoại thuyết minh:
> *"Tiếp theo, em xin chuyển sang **Checklist 2: Mô hình AI/ML CV Matching**.*
>
> *Xin nhấn mạnh rằng: Hệ thống của nhóm hoàn toàn sử dụng thuật toán Machine Learning truyền thống dựa trên toán học xác suất và tần suất từ vựng (Scikit-learn), **tuyệt đối không phải là một giao diện giả lập và không gọi sai là Deep Learning hay LLM**.*
>
> *Quy trình xử lý gồm 4 bước:*
> 1. *Chuẩn hóa văn bản và trích xuất kỹ năng bằng bộ từ điển Regex chuẩn hóa.*
> 2. *Vector hóa văn bản bằng TF-IDF. Điểm đặc biệt trong thiết kế của nhóm là **Vectorizer được fit sẵn trên một tập văn bản tham chiếu chuẩn (Reference Corpus)** của ngành phần mềm. Điều này giúp trọng số IDF cố định và khách quan, tránh việc fit cục bộ trên từng CV làm mất tính nhất quán.*
> 3. *Đo độ tương đồng ngữ nghĩa bằng Cosine Similarity.*
> 4. *Kết hợp với tỷ lệ kỹ năng đáp ứng theo công thức trọng số ban đầu: 60% tương đồng ngữ nghĩa TF-IDF và 40% tỷ lệ kỹ năng cốt lõi.*
>
> *Bây giờ em sẽ thực hiện phân tích mẫu: Khi chọn tin tuyển dụng **Python Backend** và chọn ứng viên **Nguyễn Văn An**, nhấn 'Phân tích' — Backend FastAPI tính toán tức thì trong chưa đầy 100 mili-giây, trả về Matching Score 80.4%, chỉ rõ các kỹ năng trùng khớp như Python, FastAPI, PostgreSQL và đưa ra đánh giá Rất phù hợp.*
>
> *Ngược lại, khi chọn hồ sơ kế toán của ứng viên **Bùi Mai Hương** ứng tuyển vào vị trí lập trình, Matching Score lập tức giảm xuống dưới 20%, kỹ năng đáp ứng là 0% và hệ thống cảnh báo Mismatch rõ ràng."*

---

### PHẦN 3: MINH CHỨNG DASHBOARD BI (CHECKLIST 3)
⏱ **Thời lượng**: Phút 05:30 – Phút 08:30 (3.0 phút)  
🖥 **Màn hình mở**: Bấm chuyển sang **Tab 3: 3. Dashboard BI**

#### Thao tác trên màn hình:
1. Rê chuột qua 5 thẻ KPI trên cùng (20 ứng viên, 15 tin tuyển dụng, 5 nhà tuyển dụng, 40 đơn ứng tuyển, mức lương trung vị 32.5 tr/tháng).
2. Cuộn đến **Nhóm 1 — Số lượng ứng viên theo kỹ năng**:
   - Rê chuột vào các cột bar chart: Python, Git, Docker, React, SQL... Tooltip hiện rõ số lượng ứng viên tương ứng.
3. Cuộn đến **Nhóm 2 — Xu hướng mức lương theo thời gian**:
   - Rê chuột vào đường AreaChart và 2 đường nét đứt (Lương Min, Lương Mid, Lương Max).
   - Rê chuột vào hộp chú thích màu xanh: Đọc to phần chú thích *"Mức lương từ 15 tin tuyển dụng mô phỏng giai đoạn 05/2026 - 10/2026, đơn vị triệu VNĐ/tháng"*.
4. Cuộn đến **Nhóm 3 — Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (Recruitment Funnel)**:
   - Rê chuột qua 4 khối giai đoạn: 1. Nộp hồ sơ (100%), 2. Duyệt hồ sơ (75.0%), 3. Phỏng vấn (40.0%), 4. Nhận việc (15.0%).
   - Chỉ vào biểu đồ thanh ngang Recharts biểu diễn tỷ lệ phần trăm chuyển đổi lũy tiến.
   - Nhấn mạnh nguyên tắc tính toán phễu nhất quán (không lấy trạng thái rời rạc).

#### Lời thoại thuyết minh:
> *"Em xin chuyển sang **Checklist 3: Dashboard BI (Business Intelligence)**.*
>
> *Toàn bộ dữ liệu hiển thị trên Dashboard này đều được tính toán tổng hợp trực tiếp từ cơ sở dữ liệu SQLite thông qua API `/api/v1/bi/dashboard` và hiển thị bằng thư viện biểu đồ **Recharts** hiện đại. Đúng theo yêu cầu đề bài, Dashboard gồm đúng 3 nhóm biểu đồ chuyên sâu:*
>
> *Thứ nhất là **Biểu đồ số lượng ứng viên theo kỹ năng**: Trực quan hóa mức độ dồi dào của nguồn nhân lực công nghệ, giúp nhà tuyển dụng biết được kỹ năng nào đang phổ biến (như Git, Python, Docker) và kỹ năng nào khan hiếm.*
>
> *Thứ hai là **Biểu đồ xu hướng mức lương theo thời gian**: Nhóm xin nêu rõ đây là mức lương được tổng hợp từ 15 tin tuyển dụng mô phỏng trong giai đoạn từ tháng 05/2026 đến tháng 10/2026, đơn vị tính là triệu VNĐ/tháng. Biểu đồ thể hiện mức lương sàn, mức lương trần và mức lương trung bình thị trường có xu hướng tăng nhẹ theo quý.*
>
> *Thứ ba là **Biểu đồ tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (Phễu tuyển dụng)**: Nhóm áp dụng logic phễu nhất quán: từ 40 đơn nộp ban đầu (100%), có 30 ứng viên vượt qua vòng duyệt hồ sơ (đạt tỷ lệ 75%), 16 ứng viên tiến tới vòng phỏng vấn (40%) và cuối cùng có 6 ứng viên chính thức nhận việc thành công (15%). Nhóm không lấy các trạng thái hiện tại rời rạc để suy diễn sai lệch, mà tính toán theo tiến trình lũy tiến thực sự của phễu nhân sự."*

---

### PHẦN 4: MINH CHỨNG KIỂM THỬ & ĐÁNH GIÁ THỰC TẾ (CHECKLIST 4 & 5)
⏱ **Thời lượng**: Phút 08:30 – Phút 11:30 (3.0 phút)  
🖥 **Màn hình mở**: Bấm chuyển sang **Tab 4: 4. Kiểm thử & Đánh giá**

#### Thao tác trên màn hình:
1. Rê chuột vào 4 ô chỉ số thực nghiệm: **Accuracy (91.7%)**, **Precision (100.0%)**, **Recall (85.7%)**, **F1-Score (92.3%)**.
2. Rê chuột vào **Ma trận nhầm lẫn (Confusion Matrix)**: Chỉ rõ TP = 6, TN = 5, FP = 0, FN = 1.
3. Kéo thử thanh trượt **Ngưỡng (Threshold)** từ 45 sang 50: Xem các chỉ số cập nhật lại ngay lập tức theo đúng phép tính toán học.
4. Cuộn xuống **Bảng chi tiết 12 cặp kiểm thử thực nghiệm**: Lướt qua các dòng có cột Ground Truth và Score thực tế.
5. Cuộn xuống phần **Bộ kiểm thử hệ thống (Automated Pytest Suite)**:
   - Nhấn nút **"Chạy kiểm thử trực tiếp"** màu tím.
   - Chờ 2 giây: Khung Terminal màu đen xuất hiện với dòng chữ xanh lá: `12 passed in ...s`, Exit code: 0.
6. Mở rộng phần nhận xét về ưu điểm, hạn chế và hướng cải thiện.

#### Lời thoại thuyết minh:
> *"Tiếp theo là **Checklist 4 và Checklist 5: Kiểm thử và Đánh giá hệ thống**.*
>
> *Để đảm bảo tính trung thực và khoa học, nhóm cam kết **không bịa đặt bất kỳ con số đánh giá nào**. Nhóm đã xây dựng tập kiểm thử thực nghiệm gồm **12 cặp CV/JD được gán nhãn Ground Truth thực tế** (7 cặp Match và 5 cặp Mismatch).*
>
> *Khi thiết lập ngưỡng phân loại nhị phân ở mức 45 điểm:*
> - *Độ chính xác Accuracy đạt **91.7%**.*
> - *Độ chuẩn xác Precision đạt tuyệt đối **100.0%**, nghĩa là khi hệ thống gợi ý phù hợp thì ứng viên đó chắc chắn đạt tiêu chuẩn, không có ca dương tính giả (FP = 0).*
> - *Độ bao phủ Recall đạt **85.7%** và điểm F1-Score đạt mức rất cao là **92.3%**.*
>
> *Đặc biệt, hệ thống tích hợp sẵn bộ kiểm thử tự động gồm **12 test cases** viết bằng `pytest` kiểm tra toàn diện từ cấu trúc database, logic phễu đến các trường hợp biên như CV rỗng hay kỹ năng không trùng khớp. Em xin bấm nút 'Chạy kiểm thử trực tiếp' ngay tại giao diện: như Thầy thấy, toàn bộ 12/12 bài test đều vượt qua (PASSED 100%) mà không có bất kỳ lỗi nào.*
>
> *Về mặt hạn chế: Do sử dụng TF-IDF nên mô hình phụ thuộc vào từ vựng và cần bộ từ điển kỹ năng cập nhật thường xuyên. Hướng phát triển tiếp theo của nhóm là tích hợp mô hình nhúng câu nhẹ Sentence-Transformers và tự động học trọng số bằng Logistic Regression."*

---

### PHẦN 5: TỔNG KẾT VÀ BÀN GIAO GITHUB
⏱ **Thời lượng**: Phút 11:30 – Phút 12:30 (1.0 phút)  
🖥 **Màn hình mở**: Mở thư mục dự án trên Windows và file `README.md` (hoặc mở Swagger `/docs`)

#### Thao tác trên màn hình:
1. Mở cửa sổ thư mục `Group8-SmartHire` trên Windows Explorer:
   - Chỉ vào các file: `setup.bat`, `start.bat`, `requirements.txt`, thư mục `backend/`, `frontend/`, `docs/`.
2. Mở trình duyệt tab `http://127.0.0.1:8000/docs`:
   - Lướt nhanh qua các endpoint OpenAPI chuẩn mực (`/api/v1/system`, `/api/v1/jobs`, `/api/v1/matching`, `/api/v1/bi`, `/api/v1/testing`).
3. Quay lại trang web chính và nói lời cảm ơn.

#### Lời thoại thuyết minh:
> *"Và phần cuối cùng là **Bàn giao sản phẩm**. Toàn bộ mã nguồn dự án đã được đóng gói hoàn chỉnh, chuẩn bị sẵn sàng đẩy lên GitHub bao gồm:*
> - *File `setup.bat` tự động cài đặt môi trường chỉ với 1 click.*
> - *File `start.bat` khởi động song song Backend và Frontend.*
> - *Bộ tài liệu báo cáo `BAO_CAO_THUC_HANH.md` và sơ đồ kiến trúc `ARCHITECTURE_AND_ERD.md`.*
> - *Dự án hoàn toàn chạy offline trên máy trạm Windows, không lưu trữ khóa API hay dữ liệu cá nhân nhạy cảm.*
>
> *Trên đây là toàn bộ phần trình bày minh chứng hoàn thành đầy đủ 5 checklist của **Group 8** cho đề tài SmartHire Mini. Nhóm em xin chân thành cảm ơn Thầy đã theo dõi và lắng nghe!"*

---

## III. MẸO QUAN TRỌNG ĐỂ ĐẠT ĐIỂM TỐI ĐA KHI QUAY
1. **Nói chậm rãi, tự tin**: Tránh đọc quá nhanh; di chuyển con trỏ chuột đến đúng vị trí biểu đồ hoặc số liệu đang nói để người xem dễ quan sát.
2. **Không bỏ qua bằng chứng**: Khi nói đến F1-Score 92.3% hay 12 test cases, bắt buộc phải để màn hình hiển thị bảng số liệu hoặc bấm nút chạy test để có bằng chứng chạy thật.
3. **Thời gian chuẩn**: Căn đồng hồ sao cho video kết thúc trong khoảng từ 11 đến 13 phút.
