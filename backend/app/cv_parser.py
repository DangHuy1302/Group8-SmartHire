import io
import re
from typing import Tuple
from pypdf import PdfReader
from docx import Document

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Trích xuất văn bản từ tệp PDF bằng pypdf.
    Nếu file là dạng ảnh scan không có text layer, báo lỗi rõ ràng để thông báo cho người dùng.
    """
    reader = PdfReader(io.BytesIO(file_bytes))
    if len(reader.pages) == 0:
        raise ValueError("Tệp PDF không có trang nào.")

    extracted_pages = []
    for idx, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            extracted_pages.append(text.strip())

    full_text = "\n\n".join(extracted_pages).strip()
    
    if not full_text:
        raise ValueError(
            "Tệp PDF không có lớp văn bản (text layer) hoặc là file scan/ảnh chụp. "
            "Hệ thống hiện chưa hỗ trợ OCR, vui lòng chuyển đổi hoặc dán nội dung văn bản trực tiếp."
        )

    # Chuẩn hóa khoảng trắng dư thừa nhưng giữ cấu trúc dòng
    full_text = re.sub(r"[ \t]+", " ", full_text)
    full_text = re.sub(r"\n{3,}", "\n\n", full_text)
    return full_text


def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Trích xuất văn bản từ tệp DOCX bằng python-docx bao gồm các đoạn văn và bảng biểu.
    """
    doc = Document(io.BytesIO(file_bytes))
    extracted_lines = []

    # Đọc các đoạn văn
    for paragraph in doc.paragraphs:
        txt = paragraph.text.strip()
        if txt:
            extracted_lines.append(txt)

    # Đọc các ô trong bảng (nếu ứng viên kẻ bảng trong CV)
    for table in doc.tables:
        for row in table.rows:
            row_texts = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_texts:
                # Loại trừ trùng lặp nội dung ô merge
                unique_row = []
                for t in row_texts:
                    if not unique_row or t != unique_row[-1]:
                        unique_row.append(t)
                extracted_lines.append(" | ".join(unique_row))

    full_text = "\n\n".join(extracted_lines).strip()
    if not full_text:
        raise ValueError("Tệp DOCX rỗng hoặc không chứa nội dung văn bản có thể trích xuất.")

    full_text = re.sub(r"[ \t]+", " ", full_text)
    full_text = re.sub(r"\n{3,}", "\n\n", full_text)
    return full_text


def extract_text_from_cv_file(file_bytes: bytes, filename: str) -> Tuple[str, str]:
    """
    Phân loại và trích xuất văn bản CV dựa trên phần mở rộng tệp.
    Trả về: (văn_bản_trích_xuất, loại_file)
    """
    if len(file_bytes) > MAX_FILE_SIZE:
        raise ValueError("Dung lượng file vượt quá giới hạn 10MB. Vui lòng chọn tệp nhỏ hơn.")

    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes), "PDF"
    elif lower_name.endswith(".docx"):
        return extract_text_from_docx(file_bytes), "DOCX"
    elif lower_name.endswith(".doc"):
        raise ValueError("Định dạng .doc cũ không được hỗ trợ trực tiếp. Vui lòng lưu lại dưới định dạng .docx hoặc .pdf.")
    else:
        raise ValueError("Định dạng tệp không được hỗ trợ. Vui lòng chỉ tải lên tệp PDF (.pdf) hoặc Word (.docx).")

