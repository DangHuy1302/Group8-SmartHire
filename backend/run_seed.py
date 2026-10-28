import os
import sys

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.seed_data import seed_database

if __name__ == "__main__":
    print("Bắt đầu khởi tạo và nạp dữ liệu mẫu SmartHire Mini...")
    seed_database()
    print("Hoàn tất!")
