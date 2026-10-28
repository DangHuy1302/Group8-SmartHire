# KỊCH BẢN VÀ HƯỚNG DẪN QUAY VIDEO DEMO TH3
## DỰ ÁN: SMARTHIRE MINI — GROUP 8
**Thời lượng dự kiến**: 11 – 13 phút (Đạt chuẩn yêu cầu 10 – 15 phút)  
**Mục tiêu**: Hướng dẫn chi tiết từng phút, từng thao tác chuột, lời thuyết minh và bằng chứng cần đưa lên màn hình để bất kỳ thành viên nào trong nhóm cũng có thể tự tin quay video đạt điểm tối đa cho cả 5 Checklist.

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
   - Mở thêm 1 tab phụ: `http://127.0.0.1:8000/docs` (Swagger API để minh chứng backend chạy thật).
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
   - Rê chuột qua 5 ô số liệu: 20 Ứng viên, 5 Nhà tuyển dụng, 15 Tin tuyển dụng, 40 Đơn ứng tuyển, 28 Kỹ năng.
   - Bấm nút **"Đồng bộ DB"** để thấy animation xoay nhẹ, chứng minh dữ liệu được lấy từ API thời gian thực.
3. Cuộn tiếp xuống phần **Sơ đồ kiến trúc 3 tầng (Architecture)**: Rê chuột giải thích Frontend (React), Backend (FastAPI + Scikit-learn), Data Layer (SQLite).
4. Cuộn xuống phần **Sơ đồ ERD trực quan (Visual ERD Flow)**: 
   - Chỉ vào các khối bảng và đường nối quan hệ:
     + `employers` $\xrightarrow{\text{1-N}}$ `jobs`
     + `candidates` $\xrightarrow{\text{1-N}}$ `candidate_skills` $\xleftarrow{\text{1-N}}$ `skills` (Quan hệ N-N)
     + `jobs` $\xrightarrow{\text{1-N}}$ `job_skills` $\xleftarrow{\text{1-N}}$ `skills` (Quan hệ N-N)
     + `candidates` $\xrightarrow{\text{1-N}}$ `applications` $\xleftarrow{\text{1-N}}$ `jobs`
   - Chỉ vào bảng chi tiết 7 thực thể với các khóa chính PK và khóa ngoại FK được thiết kế đối chiếu chính xác với SQLAlchemy models.

#### Lời thoại thuyết minh (Đọc tự tin, rõ ràng):
> *"Kính chào Thầy và các bạn! Hôm nay, đại diện cho **Group 8**, em xin phép trình bày và minh chứng sản phẩm bài thực hành TH3 với đề tài: **SmartHire Mini — Hệ thống tìm việc thông minh tích hợp AI và BI**.*
>
> *Đầu tiên là **Checklist 1: Yêu cầu hệ thống và Database**. Hệ thống phục vụ hai nhóm đối tượng chính là Ứng viên tìm việc và Nhà tuyển dụng. Toàn bộ kiến trúc được xây dựng theo mô hình 3 tầng độc lập:*
> - *Tầng Frontend viết bằng React, TypeScript, Vite và Tailwind CSS.*
> - *Tầng Backend xử lý bằng FastAPI của Python, tích hợp thư viện Scikit-learn để tính toán và SQLAlchemy kết nối cơ sở dữ liệu.*
> - *Tầng dữ liệu sử dụng SQLite gọn nhẹ với file `smarthire.db`.*
>
> *Như Thầy có thể quan sát trực tiếp trên màn hình, cơ sở dữ liệu đã được nạp bộ dữ liệu mẫu chuẩn hóa với 20 ứng viên chi tiết, 5 nhà tuyển dụng, 15 tin tuyển dụng với mức lương trải dài từ tháng 5 đến tháng 10 năm 2026, 40 đơn ứng tuyển phân bổ trong phễu và 28 kỹ năng công nghệ chuẩn hóa.*
>
> *Về mặt thiết kế cơ sở dữ liệu, ERD của hệ thống gồm đúng 7 thực thể liên kết với nhau qua các khóa chính, khóa ngoại chặt chẽ. Hệ thống thể hiện rõ ràng các mối quan hệ 1-N và N-N giữa ứng viên, việc làm, kỹ năng và đơn ứng tuyển. Toàn bộ cấu trúc này đối chiếu chính xác với SQLAlchemy models và SQLite schema thực tế."*

---

### PHẦN 2: MINH CHỨNG AI/ML CV MATCHING (CHECKLIST 2)
⏱ **Thời lượng**: Phút 02:30 – Phút 05:30 (3.0 phút)  
🖥 **Màn hình mở**: Bấm chuyển sang **Tab 2: 2. AI CV Matching**

#### Thao tác trên màn hình:
1. **Ca 1 (Hồ sơ rất phù hợp — Strong Match)**:
   - Tại ô chọn JD, chọn Job **#1 — Senior Python Backend Engineer**.
   - Tại ô "Mẫu có sẵn", chọn ứng viên **Nguyễn Văn An (Backend Developer)**.
   - Thấy nội dung CV được tự động điền: *"Kỹ sư Backend 3 năm kinh nghiệm lập trình Python, FastAPI..."*
   - Rê chuột vào phần **Trọng số thử nghiệm**: Chỉ vào thanh trượt (60% Độ tương đồng văn bản TF-IDF + Cosine Similarity và 40% Tỷ lệ kỹ năng).
   - Nhấn nút **"Phân tích mức độ phù hợp"**.
   - **Bằng chứng xuất hiện**: Thanh điểm Matching Score hiện ra rất cao (74.3%), màu xanh lá cây; Độ tương đồng văn bản (TF-IDF + Cosine Similarity) hiện rõ; Tỷ lệ kỹ năng hiện rõ; Thời gian suy luận hiển thị **Inference time: ~2ms – 10ms**; Hộp "Kỹ năng phù hợp" hiển thị màu xanh: *Python, FastAPI, PostgreSQL, Docker, Git, RESTful API*; Hộp "Kỹ năng còn thiếu" trống hoặc ít.
2. **Ca 2 (Hồ sơ trái ngành — Mismatch)**:
   - Giữ nguyên Job #1 (Python Backend).
   - Tại ô ứng viên mẫu, chọn **Bùi Mai Hương (Senior Accountant)** (Kế toán tổng hợp).
   - Nhấn nút **"Phân tích mức độ phù hợp"**.
   - **Bằng chứng xuất hiện**: Matching Score tụt xuống thấp (2.1%), thanh điểm màu đỏ; Tỷ lệ kỹ năng 0%; Kỹ năng phù hợp trống; Kỹ năng còn thiếu hiển thị toàn bộ kỹ năng yêu cầu. Nhận xét hệ thống chuyển thành *"Không phù hợp (Mismatch)"*.
3. **Ca 3 (Kiểm thử trường hợp biên — Empty CV)**:
   - Xóa sạch nội dung CV trong ô textarea.
   - Nhấn nút phân tích.
   - Hệ thống thông báo lỗi validation rõ ràng: *"Vui lòng nhập nội dung văn bản CV để thực hiện phân tích"*, bảo đảm tính ổn định và an toàn của hệ thống.

#### Lời thoại thuyết minh:
> *"Tiếp theo, em xin chuyển sang **Checklist 2: Mô hình AI/ML CV Matching**.*
>
> *Xin nhấn mạnh rằng: Hệ thống của nhóm hoàn toàn sử dụng thuật toán Machine Learning truyền thống dựa trên toán học xác suất và tần suất từ vựng (Scikit-learn), **tuyệt đối không phải là một giao diện giả lập và không gọi sai là Deep Learning hay LLM**.*
>
> *Quy trình xử lý gồm 4 bước:*
> 1. *Chuẩn hóa văn bản và trích xuất kỹ năng bằng bộ từ điển Regex chuẩn hóa.*
> 2. *Vector hóa văn bản bằng TF-IDF. Điểm then chốt trong thiết kế của nhóm là **Vectorizer được fit sẵn trên một tập văn bản tham chiếu chuẩn (Reference Corpus)** của ngành phần mềm. Điều này giúp trọng số IDF cố định và khách quan, tránh việc fit cục bộ trên từng CV làm mất tính nhất quán.*
> 3. *Đo độ tương đồng văn bản bằng Cosine Similarity.*
> 4. *Kết hợp với tỷ lệ kỹ năng đáp ứng theo công thức trọng số ban đầu: 60% độ tương đồng văn bản TF-IDF và 40% tỷ lệ kỹ năng cốt lõi.*
>
> *Bây giờ em sẽ thực hiện phân tích mẫu: Khi chọn tin tuyển dụng **Python Backend** và chọn ứng viên **Nguyễn Văn An**, nhấn 'Phân tích' — Backend FastAPI tính toán tức thì chỉ trong **vài mili-giây**, trả về Matching Score 74.3%, chỉ rõ các kỹ năng trùng khớp như Python, FastAPI, PostgreSQL và đưa ra đánh giá Rất phù hợp.*
>
> *Ngược lại, khi chọn hồ sơ kế toán của ứng viên **Bùi Mai Hương** ứng tuyển vào vị trí lập trình, Matching Score lập tức giảm xuống chỉ còn 2.1%, kỹ năng đáp ứng là 0% và hệ thống cảnh báo Mismatch rõ ràng.*
>
> *Khi để trống CV, hệ thống kiểm tra validation và cảnh báo lỗi thân thiện mà không bị văng hệ thống."*

---

### PHẦN 3: MINH CHỨNG DASHBOARD BI (CHECKLIST 3)
⏱ **Thời lượng**: Phút 05:30 – Phút 08:30 (3.0 phút)  
🖥 **Màn hình mở**: Bấm chuyển sang **Tab 3: 3. Dashboard BI**

#### Thao tác trên màn hình:
1. Rê chuột qua 5 thẻ KPI trên cùng (20 ứng viên, 15 tin tuyển dụng, 5 nhà tuyển dụng, 40 đơn ứng tuyển).
   - Chỉ vào ô thứ 5: **Lương thị trường (Mid): 31.2 tr/tháng** và **Lương trung vị: 28.0 tr/tháng**.
2. Rê chuột vào phần **Nhận xét BI tự động (Automated Rule-Based Insights)**:
   - Đọc 3 nhận xét do backend tự động sinh từ dữ liệu thật (Cảnh báo lệch cung-cầu kỹ năng, So sánh Mean vs Median, Đánh giá hiệu suất phễu).
3. Cuộn đến **Nhóm 1 — Tương quan Cung & Cầu kỹ năng**:
   - Thao tác click vào các nút lọc: **Backend**, **Frontend**, **Data/AI**, **DevOps**, rồi quay lại **Tất cả**. Biểu đồ cập nhật mượt mà theo từng danh mục.
   - Rê chuột vào cột xanh (Cung - Ứng viên) và cột vàng (Cầu - Việc làm) để thấy tooltip so sánh.
   - Chỉ vào ghi chú quan hệ N-N (một ứng viên có nhiều kỹ năng nên tổng tỷ lệ không nhất thiết là 100%).
4. Cuộn đến **Phân bố việc làm & Mức lương theo Chuyên môn (Domain Breakdown)**:
   - Chỉ vào ComposedChart kết hợp cột (Số lượng tin tuyển dụng) và đường (Mức lương trung bình Mid).
   - Giải thích: Nhóm Data/AI có mức lương cao nhất (36.7 tr), trong khi Backend chiếm số lượng tuyển nhiều nhất (6 jobs).
5. Cuộn đến **Nhóm 2 — Xu hướng mức lương theo thời gian**:
   - Rê chuột vào đường AreaChart và 2 đường nét đứt (Lương Min, Lương Mid, Lương Max).
   - Rê chuột vào hộp chú thích toán học: Giải thích rõ Lương trung bình Mean (31.2 tr) tính từ trung điểm các khoảng lương `(min + max) / 2` và Lương trung vị Median (28.0 tr).
6. Cuộn đến **Nhóm 3 — Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (Recruitment Funnel)**:
   - Rê chuột qua 4 khối giai đoạn: 1. Nộp hồ sơ (40 đơn, 100%), 2. Duyệt hồ sơ (30 đơn, 75.0%), 3. Phỏng vấn (16 đơn, 40.0%), 4. Nhận việc (6 đơn, 15.0%).
   - Chỉ vào biểu đồ thanh ngang Recharts biểu diễn tỷ lệ phần trăm chuyển đổi lũy tiến.
   - Nhấn mạnh nguyên tắc tính toán phễu nhất quán (không lấy trạng thái rời rạc).

#### Lời thoại thuyết minh:
> *"Em xin chuyển sang **Checklist 3: Dashboard BI (Business Intelligence)**.*
>
> *Toàn bộ dữ liệu hiển thị trên Dashboard này đều được tính toán tổng hợp trực tiếp từ cơ sở dữ liệu SQLite thông qua API `/api/v1/bi/dashboard` và hiển thị bằng thư viện biểu đồ **Recharts** hiện đại. Hệ thống đáp ứng đầy đủ 3 nhóm biểu đồ bắt buộc và các tính năng nâng cấp chuyên sâu:*
>
> *Đầu tiên, hệ thống cung cấp **Hộp nhận xét BI tự động (Automated Insights)** được sinh bằng quy tắc từ dữ liệu thật, giúp phát hiện ngay các bất cân xứng cung cầu và đánh giá tỷ lệ chuyển đổi.*
>
> *Thứ nhất là **Biểu đồ tương quan Cung - Cầu kỹ năng**: Cho phép so sánh trực quan giữa số lượng ứng viên sở hữu kỹ năng và số lượng việc làm yêu cầu. Người dùng có thể tương tác lọc nhanh theo các chuyên ngành như Backend, Frontend, Data/AI, DevOps.*
>
> *Thứ hai là **Biểu đồ phân bố việc làm và mức lương theo chuyên môn**: Giúp nhà quản trị thấy rõ nhóm Data/AI có mức lương dẫn đầu thị trường với 36.7 triệu đồng, trong khi Backend chiếm tỷ trọng tuyển dụng lớn nhất.*
>
> *Thứ ba là **Biểu đồ xu hướng mức lương theo thời gian**: Nhóm xin giải thích rõ ràng về mặt toán học: Mức lương trung bình thị trường 31.2 triệu được tính từ trung điểm khoảng lương `(min + max)/2` của 15 tin tuyển dụng mô phỏng giai đoạn 05/2026 - 10/2026. Mức lương trung vị là 28.0 triệu, phản ánh mức đãi ngộ thực tế không bị ảnh hưởng bởi các vị trí cao cấp.*
>
> *Thứ tư là **Biểu đồ tỷ lệ chuyển đổi phễu tuyển dụng**: Nhóm áp dụng logic phễu nhất quán: từ 40 đơn nộp ban đầu (100%), có 30 ứng viên vượt qua vòng duyệt hồ sơ (75%), 16 ứng viên tiến tới vòng phỏng vấn (40%) và cuối cùng có 6 ứng viên chính thức nhận việc thành công (15%)."*

---

### PHẦN 4: MINH CHỨNG KIỂM THỬ & ĐÁNH GIÁ THỰC TẾ (CHECKLIST 4 & 5)
⏱ **Thời lượng**: Phút 08:30 – Phút 11:30 (3.0 phút)  
🖥 **Màn hình mở**: Bấm chuyển sang **Tab 4: 4. Kiểm thử & Đánh giá**

#### Thao tác trên màn hình:
1. Rê chuột vào 4 ô chỉ số thực nghiệm đo trực tiếp từ API backend: **Accuracy (100.0%)**, **Precision (100.0%)**, **Recall (100.0%)**, **F1-Score (100.0%)**.
2. Rê chuột vào **Ma trận nhầm lẫn (Confusion Matrix)**: Chỉ rõ TP = 7, TN = 5, FP = 0, FN = 0.
3. Kéo thử thanh trượt **Ngưỡng (Threshold)**:
   - Tại ngưỡng 45: Toàn bộ 12 ca đều đúng (7 Match có điểm từ 69.4%–77.6% $\ge 45$; 5 Mismatch có điểm từ 0.0%–11.0% $< 45$).
   - Kéo thử lên mức 70: Thấy điểm cặp #11 (69.4%) rơi xuống dưới ngưỡng, Recall giảm xuống 85.7% và F1 cập nhật tức thì. Sau đó kéo lại về 45.
4. Cuộn xuống **Bảng chi tiết 12 cặp kiểm thử thực nghiệm**: Rê chuột qua các dòng, chỉ vào cột Ground Truth và Score thực tế.
5. Cuộn xuống phần **Bộ kiểm thử hệ thống (Automated Pytest Suite)**:
   - Nhấn nút **"Chạy kiểm thử trực tiếp"** màu tím.
   - Chờ 2 giây: Khung Terminal màu đen xuất hiện với dòng chữ xanh lá: `12 passed in ...s`, Exit code: 0.
6. Rê chuột vào hộp lưu ý màu vàng: Đọc phần nhận định về tính khách quan và hạn chế của tập benchmark nhỏ.

#### Lời thoại thuyết minh:
> *"Tiếp theo là **Checklist 4 và Checklist 5: Kiểm thử và Đánh giá hệ thống**.*
>
> *Để đảm bảo tính trung thực và khoa học, nhóm cam kết **không bịa đặt bất kỳ con số đánh giá nào** và toàn bộ số liệu đều được tính toán động từ backend. Nhóm đã xây dựng tập kiểm thử thực nghiệm gồm **12 cặp CV/JD được gán nhãn Ground Truth thực tế** (7 cặp Match và 5 cặp Mismatch).*
>
> *Khi thiết lập ngưỡng phân loại nhị phân mặc định ở mức 45 điểm:*
> - *Cả 7 ứng viên phù hợp đều đạt Matching Score từ 69.4% đến 77.6% (vượt ngưỡng 45), cho ra **7 True Positives**.*
> - *Cả 5 ứng viên trái ngành hoặc thiếu kỹ năng chỉ đạt Matching Score từ 0.0% đến 11.0% (nằm sâu dưới ngưỡng 45), cho ra **5 True Negatives**.*
> - *Không có ca báo nhầm (FP = 0) và không bỏ sót hồ sơ nào (FN = 0).*
> - *Do đó, trên tập 12 mẫu kiểm chứng này, các chỉ số đạt **Accuracy 100%, Precision 100%, Recall 100% và F1-Score 100%**.*
>
> *Tuy nhiên, nhóm xin giải thích rõ ràng về mặt học thuật: **Kết quả 100% này đạt được trên bộ 12 mẫu benchmark có độ tương phản kỹ năng cao**. Việc xác định ngưỡng 45 dựa trên quan sát phân bố của chính tập dữ liệu này tiềm ẩn nguy cơ **thiên lệch tối ưu (optimization bias)**. Đây là bài kiểm chứng tính đúng đắn thuật toán (Sanity Check), chưa phải là kiểm thử trên tập dữ liệu thực tế quy mô lớn vốn có nhiều độ nhiễu và ca biên phức tạp hơn.*
>
> *Đặc biệt, hệ thống tích hợp sẵn bộ kiểm thử tự động gồm **12 test cases** viết bằng `pytest` kiểm tra toàn diện từ cấu trúc database, logic phễu đến các trường hợp biên như CV rỗng hay kỹ năng không trùng khớp. Em xin bấm nút 'Chạy kiểm thử trực tiếp' ngay tại giao diện: như Thầy thấy, toàn bộ 12/12 bài test đều vượt qua (PASSED 100%) mà không có bất kỳ lỗi nào."*

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
> - *Bộ tài liệu báo cáo `BAO_CAO_THUC_HANH.md`, sơ đồ kiến trúc `ARCHITECTURE_AND_ERD.md` và hướng dẫn kịch bản quay video.*
> - *Dự án hoàn toàn chạy offline trên máy trạm Windows, không lưu trữ khóa API hay dữ liệu cá nhân nhạy cảm.*
>
> *Trên đây là toàn bộ phần trình bày minh chứng hoàn thành đầy đủ 5 checklist của **Group 8** cho đề tài SmartHire Mini. Nhóm em xin chân thành cảm ơn Thầy đã theo dõi và lắng nghe!"*

---

## III. MẸO QUAN TRỌNG ĐỂ ĐẠT ĐIỂM TỐI ĐA KHI QUAY
1. **Nói chậm rãi, tự tin**: Tránh đọc quá nhanh; di chuyển con trỏ chuột đến đúng vị trí biểu đồ hoặc số liệu đang nói để người xem dễ quan sát.
2. **Không bỏ qua bằng chứng**: Khi nói đến F1-Score 100% (trên 12 mẫu) hay 12 test cases, bắt buộc phải để màn hình hiển thị bảng số liệu hoặc bấm nút chạy test để có bằng chứng chạy thật.
3. **Thời gian chuẩn**: Căn đồng hồ sao cho video kết thúc trong khoảng từ 11 đến 13 phút.
