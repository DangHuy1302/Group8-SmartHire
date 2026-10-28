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

Với ngưỡng phân loại nhị phân $\text{Threshold} = 45.0$ điểm (Matching Score $\ge 45.0 \implies \hat{y} = 1$, ngược lại $\hat{y} = 0$):

| Chỉ số đánh giá | Giá trị thực đo | Công thức toán học |
| :--- | :---: | :--- |
| **Accuracy (Độ chính xác)** | **91.7%** | $(TP + TN) / \text{Tổng mẫu} = (6 + 5) / 12$ |
| **Precision (Độ chuẩn xác)** | **100.0%** | $TP / (TP + FP) = 6 / (6 + 0)$ |
| **Recall (Độ bao phủ)** | **85.7%** | $TP / (TP + FN) = 6 / (6 + 1)$ |
| **F1-Score** | **92.3%** | $2 \times (\text{Precision} \times \text{Recall}) / (\text{Precision} + \text{Recall})$ |

#### Ma trận nhầm lẫn (Confusion Matrix):
- **True Positives (TP)** = 6: Dự đoán đúng ứng viên phù hợp (các vị trí Python Backend, Frontend React, Data Analyst, DevOps, Java, Fullstack).
- **True Negatives (TN)** = 5: Dự đoán đúng việc loại bỏ các hồ sơ không phù hợp (Kế toán ứng tuyển Backend, Designer ứng tuyển ML, Sinh viên chưa có kỹ năng ứng tuyển Senior DevOps, v.v.).
- **False Positives (FP)** = 0: Tuyệt đối không có trường hợp báo nhầm hồ sơ không đủ tiêu chuẩn thành đạt.
- **False Negatives (FN)** = 1: Ứng viên AI/ML bị chấm điểm cận dưới ngưỡng do JD yêu cầu thêm FastAPI mà CV chưa liệt kê rõ từ khóa này.

---

## V. HẠN CHẾ VÀ HƯỚNG CẢI THIỆN

### 5.1. Hạn chế hiện tại
1. Mô hình TF-IDF phân tích dựa trên tần suất từ vựng, chưa nắm bắt được các từ đồng nghĩa ngữ cảnh phức tạp nếu không có trong từ điển.
2. Từ điển kỹ năng yêu cầu cập nhật định kỳ khi công nghệ mới xuất hiện.
3. Trọng số cố định 60% TF-IDF / 40% Kỹ năng hiện tại là lựa chọn thiết kế ban đầu dựa trên phỏng đoán nghiệp vụ, chưa được tối ưu hóa tự động riêng cho từng nhóm nghề.

### 5.2. Hướng cải thiện tiếp theo
1. Nâng cấp mô hình biểu diễn văn bản sang Word2Vec, FastText hoặc mô hình nhúng câu nhẹ (MiniLM Sentence-Transformers) chạy offline.
2. Ứng dụng mô hình phân loại Logistic Regression hoặc SVM có giám sát để tự động học (tune) các trọng số tối ưu từ dữ liệu tuyển dụng lịch sử.
3. Bổ sung thêm trọng số kinh nghiệm (năm làm việc) và khoảng lương kỳ vọng vào công thức matching tổng thể.
