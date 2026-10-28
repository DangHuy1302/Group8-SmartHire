# SmartHire Mini — Hệ thống tìm việc thông minh tích hợp AI và BI

**Tên nhóm**: Group 8  
**Đề tài**: Bài thực hành TH3 — Hệ thống Kinh doanh Thông minh  
**Hạn nộp**: 08/11/2026 lúc 06:28  

---

## 📌 GIỚI THIỆU DỰ ÁN

**SmartHire Mini** là hệ thống phần mềm hoàn chỉnh, gọn nhẹ kết hợp giữa trí tuệ nhân tạo (Machine Learning) và kinh doanh thông minh (BI) để giải quyết bài toán tuyển dụng:
1. **AI/ML CV Matching**: Trích xuất kỹ năng bằng bộ từ điển Regex chuẩn hóa, vector hóa văn bản bằng TF-IDF dựa trên tập tham chiếu nền, đo độ tương đồng Cosine Similarity (60%) và tỷ lệ kỹ năng đáp ứng (40%) để tính Matching Score khách quan.
2. **Dashboard BI**: Trực quan hóa dữ liệu tuyển dụng qua 3 nhóm biểu đồ chuyên sâu: phân bố nhân lực theo kỹ năng, xu hướng tiền lương theo thời gian và phễu chuyển đổi tuyển dụng nhất quán.
3. **Kiểm thử & Đánh giá**: Tích hợp 12 bài kiểm thử tự động `pytest` và đánh giá các chỉ số Accuracy, Precision, Recall, F1 trên tập 12 cặp CV/JD gán nhãn thực nghiệm.

---

## 🛠 CÔNG NGHỆ SỬ DỤNG

- **Backend**: FastAPI (Python 3.10+ / 3.14), SQLAlchemy ORM, Uvicorn, Pydantic V2.
- **Machine Learning**: Scikit-learn (`TfidfVectorizer`, `cosine_similarity`), NumPy.
- **Database**: SQLite (`backend/smarthire.db`) — lưu trữ cục bộ, không cần cài server RDBMS.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide-react.
- **Trực quan hóa**: Recharts.
- **Kiểm thử**: Pytest, HTTPX.

---

## 📁 CẤU TRÚC THƯ MỤC

```text
Group8-SmartHire/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py         # Cấu hình kết nối SQLite
│   │   ├── models.py           # 7 thực thể SQLAlchemy (ERD)
│   │   ├── schemas.py          # Pydantic Schemas request/response
│   │   ├── ml_service.py       # Engine TF-IDF + Cosine Sim + Skill Extractor
│   │   ├── bi_service.py       # Tính toán BI: Skills, Salaries, Funnel
│   │   ├── seed_data.py        # Seed 20 ứng viên, 5 NTD, 15 jobs, 40 apps
│   │   ├── ground_truth.py     # 12 cặp CV/JD có nhãn Ground Truth
│   │   └── main.py             # FastAPI REST endpoints
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_system.py      # 12 bài kiểm thử tự động pytest
│   ├── run_seed.py             # Script nạp database độc lập
│   └── smarthire.db            # Cơ sở dữ liệu SQLite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx      # Thanh điều hướng 4 màn hình
│   │   │   ├── OverviewTab.tsx # Màn hình 1: Tổng quan, ERD & DB Stats
│   │   │   ├── MatchingTab.tsx # Màn hình 2: AI CV Matching
│   │   │   ├── DashboardTab.tsx# Màn hình 3: Dashboard BI (3 nhóm biểu đồ)
│   │   │   └── TestingTab.tsx  # Màn hình 4: Test cases & F1 Evaluation
│   │   ├── services/
│   │   │   └── api.ts          # Axios API client
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docs/
│   ├── ARCHITECTURE_AND_ERD.md # Sơ đồ kiến trúc & ERD
│   ├── BAO_CAO_THUC_HANH.md    # Báo cáo kết quả đánh giá thực tế
│   └── HUONG_DAN_QUAY_VIDEO.md # Kịch bản 12 phút chi tiết từng phút
├── requirements.txt
├── setup.bat                   # Cài đặt tự động 1 click trên Windows
├── start.bat                   # Khởi chạy toàn bộ hệ thống
└── README.md
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY TRÊN WINDOWS

### Cách 1: Chạy tự động bằng Batch Script (Khuyên dùng)

1. Nhấp đúp vào **`setup.bat`** để tạo môi trường ảo Python, cài đặt dependencies và nạp dữ liệu mẫu SQLite.
2. Nhấp đúp vào **`start.bat`** để khởi động đồng thời cả Backend và Frontend.
3. Mở trình duyệt web truy cập:
   - **Giao diện người dùng**: [http://localhost:3000](http://localhost:3000)
   - **Tài liệu API Swagger**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Cách 2: Chạy thủ công từng bước

#### 1. Khởi động Backend
```powershell
# Tạo môi trường ảo và cài đặt thư viện
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Nạp dữ liệu mẫu vào SQLite
python backend\run_seed.py

# Khởi chạy server FastAPI
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Khởi động Frontend
```powershell
cd frontend
npm install
npm run dev
```

---

## 🧪 CHẠY BỘ KIỂM THỬ (AUTOMATED TESTING)

Chạy 12 bài kiểm thử tự động trực tiếp qua terminal:
```powershell
.\venv\Scripts\python -m pytest backend/tests/test_system.py -v
```
Hoặc truy cập **Màn hình 4** trên giao diện web và bấm nút **"Chạy kiểm thử trực tiếp"**.

---

## 📊 KẾT QUẢ ĐÁNH GIÁ THỰC TẾ (GROUND TRUTH EVALUATION)

Đánh giá thực nghiệm qua API `/api/v1/testing/evaluation` trên 12 cặp CV/JD chuẩn hóa (7 cặp phù hợp Match, 5 cặp không phù hợp Mismatch) với ngưỡng mặc định Threshold = 45.0 điểm:
- **Accuracy (Độ chính xác)**: **100.0%** (12/12 cặp dự đoán đúng)
- **Precision (Độ chuẩn xác)**: **100.0%**
- **Recall (Độ bao phủ)**: **100.0%**
- **F1-Score**: **100.0%**
- **Confusion Matrix**: TP = 7, TN = 5, FP = 0, FN = 0.

> ⚠️ **Lưu ý khoa học**: Kết quả 100% đạt được trên tập benchmark kiểm chứng 12 cặp mẫu do các ca phù hợp (điểm 69.4%–77.6%) và trái ngành (điểm 0.0%–11.0%) có độ tương phản kỹ năng rất rõ nét. Ngưỡng 45.0 được xác định dựa trên phân bố của chính tập dữ liệu này nên tiềm ẩn nguy cơ thiên lệch tối ưu (optimization bias). Đây là bài kiểm chứng thuật toán (Sanity Check), chưa phản ánh đầy đủ độ nhiễu trên dữ liệu tuyển dụng thực tế quy mô lớn.

---

## 📹 HƯỚNG DẪN QUAY VIDEO DEMO

Xem chi tiết từng phút, câu thoại thuyết minh và thao tác tại:  
👉 **[`docs/HUONG_DAN_QUAY_VIDEO.md`](docs/HUONG_DAN_QUAY_VIDEO.md)**

---

## 👥 THÀNH VIÊN GROUP 8
- Toàn bộ thành viên Group 8 tham gia thiết kế, lập trình backend, frontend, mô hình ML, kiểm thử và quay video demo.
- Dự án sẵn sàng bàn giao qua GitHub, không chứa mã bí mật hoặc API keys nhạy cảm.

