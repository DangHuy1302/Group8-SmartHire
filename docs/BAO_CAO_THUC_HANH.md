# BÁO CÁO THỰC HÀNH TH3 — GROUP 8
# DỰ ÁN: SMARTHIRE MINI — HỆ THỐNG TÌM VIỆC THÔNG MINH TÍCH HỢP AI & BI

**Môn học**: Hệ thống Kinh doanh Thông minh (BI)  
**Nhóm thực hiện**: Group 8  
**Thời gian hoàn thành**: 28/10/2026  

---

## I. MỤC TIÊU DỰ ÁN

SmartHire Mini được thiết kế nhằm giải quyết bài toán cốt lõi trong tuyển dụng nhân sự hiện đại thông qua sự kết hợp của hai thành phần:
1. **AI/ML CV Matching**: Tự động hóa quy trình sàng lọc hồ sơ, định lượng mức độ phù hợp giữa nội dung CV của ứng viên và Job Description (JD) dựa trên mô hình học máy và từ điển kỹ năng chuẩn hóa, khắc phục tính cảm tính của việc đọc CV thủ công.
2. **Business Intelligence (BI)**: Cung cấp góc nhìn phân tích tổng quan cho ban tuyển dụng và nhà quản trị thông qua 3 nhóm trực quan hóa dữ liệu chiến lược: phân bố nguồn lực kỹ năng, xu hướng tiền lương theo thời gian và phễu chuyển đổi tuyển dụng.

Dự án tuân thủ nghiêm ngặt nguyên tắc **chạy thật, nhỏ gọn, không giả lập giao diện, có số liệu thực nghiệm và dễ bàn giao**.

---

## II. BỘ DỮ LIỆU MẪU (DATA SPECIFICATIONS)

Cơ sở dữ liệu sử dụng **SQLite** (`smarthire.db`) với lược đồ quan hệ 7 bảng chuẩn hóa, được nạp qua script `backend/run_seed.py` với cơ chế cố định seed ngẫu nhiên (`seed=42`) để đảm bảo tái lập kết quả giống nhau 100% trên mọi máy trạm:
- **5 Nhà tuyển dụng (Employers)**: Đại diện cho các lĩnh vực phần mềm, ngân hàng/FinTech, AI & Big Data, thương mại điện tử và an ninh mạng.
- **20 Ứng viên (Candidates)**: Chứa thông tin hồ sơ và văn bản CV chi tiết bao quát các vị trí Backend (Python, Java, .NET, Node.js), Frontend (React, Vue.js), Data/BI, DevOps/Cloud, AI/ML và các hồ sơ trái ngành/phi kỹ thuật để kiểm thử.
- **15 Tin tuyển dụng (Jobs)**: Có mức lương mô phỏng từ tháng 05/2026 đến tháng 10/2026 (đơn vị: triệu VNĐ/tháng), yêu cầu số năm kinh nghiệm và danh sách kỹ năng bắt buộc.
- **25 Kỹ năng chuẩn hóa (Skills)**: Được phân loại theo Backend, Frontend, Database, Data/AI và DevOps.
- **40 Đơn ứng tuyển (Applications)**: Được tạo theo chu trình phễu tuyển dụng nhất quán với các giai đoạn:
  + `offered` (Nhận việc): 6 đơn (~15.0%)
  + `interview` (Phỏng vấn): 10 đơn
  + `screening` (Duyệt hồ sơ): 14 đơn
  + `applied` (Nộp hồ sơ): 6 đơn
  + `rejected` (Từ chối): 4 đơn
- **12 Cặp CV/JD gán nhãn thực nghiệm (Ground Truth)**: Gồm 7 cặp phù hợp (Match = 1) và 5 cặp không phù hợp/trái ngành (Mismatch = 0).

---

## III. MÔ HÌNH AI/ML CV MATCHING

### 3.1. Phương pháp luận
Hệ thống sử dụng kết hợp giữa mô hình học máy truyền thống và hệ luật tri thức (Rule-based Knowledge):
1. **Tiền xử lý văn bản (Text Preprocessing)**:
   - Chuyển toàn bộ về chữ thường (`lowercase`).
   - Chuẩn hóa ký tự công nghệ nhạy cảm (`C#`, `C++`, `.NET`, `CI/CD`, `Node.js`).
   - Loại bỏ khoảng trắng thừa.
2. **Trích xuất kỹ năng (Skill Taxonomy Extractor)**:
   - Sử dụng biểu thức chính quy (Regex Word Boundary) dựa trên từ điển 25 kỹ năng và hơn 80 định danh biến thể (aliases).
3. **Mô hình hóa ngữ nghĩa TF-IDF & Cosine Similarity**:
   - Sử dụng `TfidfVectorizer` (scikit-learn) với thiết lập `ngram_range=(1, 2)`.
   - **Điểm then chốt**: Vectorizer được `fit()` sẵn trên một **tập văn bản tham chiếu chuẩn (Reference Corpus)** gồm các mô tả công việc IT chuẩn mực. Khi ứng viên nhập CV mới, vectorizer chỉ thực hiện `transform()`. Điều này đảm bảo trọng số IDF cố định, phản ánh đúng tầm quan trọng của các thuật ngữ chuyên môn và ngăn ngừa hiện tượng tính toán sai lệch khi chỉ fit trên 1 cặp CV-JD đơn lẻ.
   - Khoảng cách góc Cosine Similarity được tính toán:
     $$\text{Cosine Sim}(u, v) = \frac{u \cdot v}{\|u\|_2 \times \|v\|_2} \in [0, 1]$$
4. **Tỷ lệ kỹ năng đáp ứng (Skill Match Ratio)**:
   $$\text{Skill Ratio} = \frac{|\text{Matched Skills}|}{|\text{Required Skills}|} \in [0, 1]$$
5. **Tổng hợp Matching Score (0 - 100%)**:
   $$\text{Matching Score} = \left(0.6 \times \text{Cosine Sim} + 0.4 \times \text{Skill Ratio}\right) \times 100$$
   *Lý giải thiết kế ban đầu*: Trọng số 60% ngữ nghĩa giúp đánh giá toàn diện năng lực tổng quan và kinh nghiệm thể hiện trong lời văn CV, trong khi 40% kỹ năng đảm bảo ứng viên bắt buộc phải nắm vững các công nghệ lõi của tin tuyển dụng.

---

## IV. PHƯƠNG PHÁP KIỂM THỬ VÀ KẾT QUẢ ĐÁNH GIÁ

### 4.1. Bộ kiểm thử tự động (Automated Pytest Suite)
Hệ thống triển khai 12 ca kiểm thử tự động trong `backend/tests/test_system.py`:
- **Test 1 - 3**: Kiểm thử tính vẹn toàn của Cơ sở dữ liệu SQLite và các endpoint REST API.
- **Test 4 - 5**: Kiểm thử tính phân loại của thuật toán Matching với trường hợp hồ sơ rất phù hợp (Score $\ge 65$) và hồ sơ trái ngành (Score $\le 30$).
- **Test 6 - 7**: Kiểm thử ca biên (Edge cases): CV rỗng hoàn toàn, CV có kỹ năng nhưng không trùng bất kỳ yêu cầu nào của JD (hệ thống xử lý an toàn, không văng lỗi).
- **Test 8 - 9**: Kiểm thử API phân tích và xử lý lỗi đầu vào sai (Job ID không tồn tại trả về HTTP 404).
- **Test 10 - 11**: Kiểm thử tính logic và thứ tự giảm dần của phễu tuyển dụng ($\text{Applied} \ge \text{Screening} \ge \text{Interview} \ge \text{Offered}$).
- **Test 12**: Kiểm thử tính toán các chỉ số đánh giá thực nghiệm.

**Kết quả chạy thực tế**: **12/12 bài kiểm thử ĐẠT (PASSED 100%)** trong thời gian 2.55 giây.

### 4.2. Kết quả đánh giá thực tế trên 12 Cặp Gán Nhãn Ground Truth

Mô hình được đánh giá thực nghiệm trực tiếp thông qua API `/api/v1/testing/evaluation` trên 12 cặp CV/JD chuẩn hóa (7 cặp phù hợp, 5 cặp không phù hợp/trái ngành):

#### Bảng chi tiết 12 cặp kiểm thử thực nghiệm:
| Mã cặp | Ứng viên kiểm thử | Vị trí tuyển dụng (JD) | Ground Truth | Score thực đo | Dự đoán (Ngưỡng 45) | Kết quả |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **#1** | Nguyễn Văn An (Python Backend) | Python Backend Engineer (FastAPI/PostgreSQL) | **1 (Phù hợp)** | **74.3%** | **1** | Đúng (TP) |
| **#2** | Trần Thị Bích (Frontend React) | React Frontend Developer (TypeScript) | **1 (Phù hợp)** | **77.6%** | **1** | Đúng (TP) |
| **#3** | Lê Hoàng Cường (Data Analyst) | Data Analyst / BI Specialist | **1 (Phù hợp)** | **72.2%** | **1** | Đúng (TP) |
| **#4** | Phạm Minh Đức (DevOps Engineer) | DevOps & Cloud Engineer | **1 (Phù hợp)** | **74.2%** | **1** | Đúng (TP) |
| **#5** | Vũ Hải Đăng (AI/ML Engineer) | Machine Learning Engineer | **1 (Phù hợp)** | **76.0%** | **1** | Đúng (TP) |
| **#6** | Đỗ Thu Giang (Java Developer) | Senior Java Spring Boot Developer | **1 (Phù hợp)** | **73.6%** | **1** | Đúng (TP) |
| **#7** | Trần Thị Bích (Frontend React) | Java Backend Engineer | **0 (Loại)** | **4.2%** | **0** | Đúng (TN) |
| **#8** | Lê Hoàng Cường (Data Analyst) | DevOps & Cloud Engineer | **0 (Loại)** | **0.0%** | **0** | Đúng (TN) |
| **#9** | Bùi Mai Hương (Kế toán & Hành chính) | Python Backend Engineer (FastAPI/PostgreSQL) | **0 (Loại)** | **2.1%** | **0** | Đúng (TN) |
| **#10** | Ngô Gia Bảo (Thực tập sinh mới bắt đầu) | DevOps & Cloud Engineer | **0 (Loại)** | **11.0%** | **0** | Đúng (TN) |
| **#11** | Hoàng Quốc Việt (Fullstack Web) | React Frontend Developer (TypeScript) | **1 (Phù hợp)** | **69.4%** | **1** | Đúng (TP) |
| **#12** | Phan Mỹ Linh (Graphic / UI Designer) | Machine Learning Engineer | **0 (Loại)** | **0.0%** | **0** | Đúng (TN) |

#### Tổng hợp chỉ số đo lường thực tế (với Threshold = 45.0):

| Chỉ số đánh giá | Giá trị thực đo | Công thức toán học | Giải thích ý nghĩa |
| :--- | :---: | :--- | :--- |
| **Accuracy (Độ chính xác)** | **100.0%** | $(TP + TN) / \text{Tổng mẫu} = (7 + 5) / 12$ | Tỷ lệ dự đoán đúng trên toàn bộ 12 ca kiểm thử |
| **Precision (Độ chuẩn xác)** | **100.0%** | $TP / (TP + FP) = 7 / (7 + 0)$ | Khi hệ thống báo phù hợp, ứng viên thực sự phù hợp |
| **Recall (Độ bao phủ)** | **100.0%** | $TP / (TP + FN) = 7 / (7 + 0)$ | Hệ thống nhận diện được tất cả các hồ sơ phù hợp |
| **F1-Score** | **100.0%** | $2 \times (\text{Precision} \times \text{Recall}) / (\text{Precision} + \text{Recall})$ | Điểm F1 trung bình điều hòa tuyệt đối |

#### Ma trận nhầm lẫn (Confusion Matrix):
- **True Positives (TP) = 7**: Nhận diện chính xác cả 7 hồ sơ đáp ứng yêu cầu chuyên môn (Điểm dao động từ **69.4% đến 77.6%**, vượt xa ngưỡng 45.0).
- **True Negatives (TN) = 5**: Loại trừ chính xác cả 5 hồ sơ trái ngành hoặc thiếu hụt hoàn toàn kỹ năng (Điểm dao động từ **0.0% đến 11.0%**, nằm sâu dưới ngưỡng 45.0).
- **False Positives (FP) = 0**: Không có trường hợp báo nhầm hồ sơ trái ngành thành phù hợp.
- **False Negatives (FN) = 0**: Không bỏ sót hồ sơ phù hợp nào ở ngưỡng 45.0.

#### Nhận định học thuật trung thực & Nguy cơ thiên lệch (Bias):
1. **Khoảng cách phân tách lớn (Large Margin):** Kết quả đạt 100% trên tập dữ liệu này là do các cặp mẫu kiểm chứng được thiết kế có tính tương phản rõ ràng giữa hai thái cực (ứng viên đúng chuyên ngành có kinh nghiệm vs ứng viên trái ngành hoàn toàn). Khoảng cách giữa điểm thấp nhất của nhóm Match (69.4%) và điểm cao nhất của nhóm Mismatch (11.0%) lên tới **58.4%**. Bất kỳ ngưỡng nào nằm trong khoảng từ 12 đến 68 điểm đều cho kết quả phân loại 100%.
2. **Nguy cơ thiên lệch do chọn ngưỡng (Optimization Bias):** Ngưỡng 45.0 điểm được lựa chọn sau khi quan sát dữ liệu phân bố của chính tập 12 cặp mẫu này. Do đó, **đây không được coi là kết quả kiểm thử độc lập (Independent Test)** mà là bài kiểm chứng tính đúng đắn thuật toán (Sanity Check).
3. **Giới hạn thực tế:** Kết quả 100% này chưa chứng minh mô hình sẽ đạt độ chính xác tương đương trên môi trường tuyển dụng thực tế quy mô lớn với hàng ngàn CV có độ nhiễu cao và các trường hợp biên khó phân định.

---

## V. HẠN CHẾ VÀ HƯỚNG CẢI THIỆN

### 5.1. Hạn chế hiện tại
1. **Tập dữ liệu đánh giá quy mô nhỏ:** Tập 12 cặp mẫu có độ phân tách cao, chưa phản ánh đầy đủ các trường hợp biên phức tạp trong tuyển dụng thực tế (ví dụ: ứng viên có 70% kỹ năng cần thiết hoặc sử dụng các công nghệ thay thế tương đương).
2. **Mô hình TF-IDF phụ thuộc từ vựng:** TF-IDF dựa trên tần suất từ vựng, chưa hiểu sâu sắc các từ đồng nghĩa ngữ cảnh phức tạp nếu không được đưa vào từ điển kỹ năng.
3. **Từ điển kỹ năng cần bảo trì liên tục:** Trích xuất kỹ năng bằng Regex từ điển đòi hỏi cập nhật định kỳ khi công nghệ mới xuất hiện.
4. **Trọng số cố định (60% TF-IDF, 40% Kỹ năng):** Hiện tại là lựa chọn thiết kế ban đầu dựa trên trực giác nghiệp vụ, chưa được tối ưu hóa có giám sát cho từng ngành nghề đặc thù.

### 5.2. Hướng cải thiện tiếp theo
1. **Mở rộng bộ dữ liệu kiểm thử độc lập:** Thu thập bộ dữ liệu lớn hơn (100–500 cặp CV/JD) chia tách thành tập Train/Validation/Test riêng biệt để tránh thiên lệch khi chọn ngưỡng.
2. **Nâng cấp biểu diễn ngữ nghĩa:** Tích hợp Sentence Embeddings nhẹ (như all-MiniLM-L6-v2) để nắm bắt từ đồng nghĩa và ngữ cảnh mà không cần tài nguyên GPU nặng.
3. **Học trọng số tự động:** Sử dụng mô hình Logistic Regression hoặc SVM để tự động tối ưu hóa trọng số kết hợp giữa TF-IDF, kỹ năng, số năm kinh nghiệm và mức lương kỳ vọng.

