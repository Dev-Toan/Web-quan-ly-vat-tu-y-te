# Hệ Thống Quản Lý Vật Tư Y Tế

## 📋 Mô tả dự án

Hệ thống quản lý vật tư y tế là một ứng dụng web được phát triển để quản lý và kiểm soát vật tư y tế trong các cơ sở y tế. Hệ thống cung cấp giao diện thân thiện cho cả quản trị viên và người dùng thông thường.

## ✨ Tính năng chính

### 🔐 Phân quyền người dùng
- **Quản trị viên (Admin)**: Toàn quyền quản lý hệ thống
- **Người dùng (User)**: Xem và yêu cầu vật tư

### 📦 Quản lý vật tư
- Thêm, sửa, xóa vật tư y tế
- Nhập/xuất kho vật tư
- Upload và quản lý hình ảnh vật tư
- Phân loại theo danh mục (Vật tư tiêu hao/Không tiêu hao)
- Theo dõi số lượng tồn kho

### 👥 Quản lý nhân sự
- Quản lý thông tin nhân viên
- Phân quyền tài khoản
- Quản lý phòng ban

### 📊 Báo cáo và thống kê
- Biểu đồ thống kê theo tháng
- Xuất báo cáo Excel
- Lịch sử nhập/xuất vật tư
- Duyệt yêu cầu từ người dùng

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (jQuery)
- **Backend**: JSON Server (Fake REST API)
- **UI Framework**: Bootstrap 5.3.3
- **Charts**: Chart.js
- **Icons**: Font Awesome 6.5.2
- **Excel Export**: SheetJS (xlsx)

## 📁 Cấu trúc thư mục

```
projectfinal/
├── bootstrap-5.3.3-dist/     # Bootstrap framework
├── data/                     # Dữ liệu CSV gốc
│   ├── danhMucs.csv
│   ├── nhanSus.csv
│   ├── phongBans.csv
│   ├── vatTus.csv
│   └── lichSus.csv
├── pages/                    # Trang admin
│   ├── vatTus/
│   ├── nhanSus/
│   ├── phongBans/
│   ├── taiKhoans/
│   ├── lichSus/
│   └── lichSuYeuCaus/
├── userPages/               # Trang người dùng
│   ├── vatTus/
│   └── phongBans/
├── scr/images/              # Hình ảnh
├── requests/                # File test API
├── db.json                  # Database JSON
├── package.json             # Dependencies
├── convert-csv-to-json.js   # Script chuyển đổi CSV
├── home.html               # Trang đăng nhập
├── index.html              # Trang admin
├── userIndex.html          # Trang người dùng
└── README.md               # File hướng dẫn
```
## 📸 Screenshots



## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn
- Trình duyệt web hiện đại

### Bước 1: Cài đặt dependencies

```bash
# Di chuyển đến thư mục dự án
cd D:\webnangcao\projectfinal

# Cài đặt dependencies
npm install
```

**Lưu ý**: Nếu gặp lỗi PowerShell Execution Policy trên Windows:
```powershell
# Mở PowerShell với quyền Administrator và chạy:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Bước 2: Khởi động API Server

```bash
# Chạy json-server để tạo fake API
npx json-server --watch db.json --port 3000
```

API sẽ chạy tại: `http://localhost:3000`

### Bước 3: Mở giao diện web

**Cách 1: Mở trực tiếp file**
- Bấm đúp chuột vào file `home.html`

**Cách 2: Sử dụng http-server**
```bash
# Mở terminal mới và chạy:
npx http-server -p 8080 -c-1
```
Truy cập: `http://127.0.0.1:8080/home.html`

**Cách 3: Sử dụng Live Server (VS Code)**
- Cài đặt extension "Live Server"
- Click chuột phải vào `home.html` → "Open with Live Server"

## 🔑 Tài khoản đăng nhập

### Tài khoản Admin
| Tên đăng nhập | Mật khẩu | Vai trò |
|---------------|----------|---------|
| `lcthanh` | `1722` | Quản trị viên |
| `pvha` | `123` | Quản trị viên |
| `doanh` | `123` | Quản trị viên |

### Tài khoản User
| Tên đăng nhập | Mật khẩu | Vai trò |
|---------------|----------|---------|
| `haquan` | `quan123` | Người dùng |
| `nthoa` | `1722` | Người dùng |

## 📡 API Endpoints

Hệ thống cung cấp các API endpoints sau:

- `GET /vatTus` - Lấy danh sách vật tư
- `GET /nhanSus` - Lấy danh sách nhân sự
- `GET /phongBans` - Lấy danh sách phòng ban
- `GET /danhMucs` - Lấy danh sách danh mục
- `GET /lichSus` - Lấy lịch sử nhập/xuất
- `GET /lichSuYeuCaus` - Lấy lịch sử yêu cầu

**Ví dụ sử dụng:**
```bash
# Lấy tất cả vật tư
GET http://localhost:3000/vatTus

# Phân trang
GET http://localhost:3000/vatTus?_page=1&_per_page=10

# Tìm kiếm
GET http://localhost:3000/vatTus?tenVatTu_like=áo
```

## 🔧 Cấu hình và tùy chỉnh

### Thay đổi port API
```bash
npx json-server --watch db.json --port 4000
```

### Thêm dữ liệu mới
Chỉnh sửa file `db.json` hoặc sử dụng script chuyển đổi:
```bash
# Cài đặt csv-parser
npm install csv-parser

# Chuyển đổi CSV sang JSON
node convert-csv-to-json.js
```

## 🐛 Xử lý sự cố

### Lỗi thường gặp

**1. Lỗi "Cannot GET /"**
- Kiểm tra json-server đang chạy ở port 3000
- Truy cập `http://localhost:3000` để kiểm tra

**2. Đăng nhập không được**
- Kiểm tra API server đang chạy
- Kiểm tra tên đăng nhập/mật khẩu chính xác
- Mở Developer Tools (F12) để xem lỗi

**3. Không load được dữ liệu**
- Kiểm tra kết nối API: `http://localhost:3000/vatTus`
- Kiểm tra file `db.json` có tồn tại

**4. Lỗi CORS**
- Sử dụng Live Server hoặc http-server thay vì mở file trực tiếp

## 📝 Ghi chú phát triển

### Cấu trúc dữ liệu

**Vật tư (vatTus):**
```json
{
  "id": 1,
  "tenVatTu": "Áo bác sĩ",
  "moTaVatTu": "Đồng phục bác sĩ",
  "danhMucId": "1",
  "soLuongTonKho": "98",
  "thuongHieu": "Đồng phục y tế",
  "mauSac": "Trắng",
  "anhVatTu": "../../scr/images/1.jpg"
}
```

**Nhân sự (nhanSus):**
```json
{
  "id": 1,
  "tenNhanSu": "Hoàng Anh Quân",
  "phongBanId": "2",
  "gioiTinh": "Nam",
  "ngaySinh": "1981-02-20",
  "soDienThoai": "0342276578",
  "email": "anhquan@gmail.com",
  "chucVu": "Bác sĩ",
  "queQuan": "Cát Bà- Hải Phòng",
  "tenTaiKhoan": "haquan",
  "matKhau": "quan123",
  "role": "user"
}
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm thông tin.

## 📞 Liên hệ

- **Email**: Group20@gmail.com
- **Điện thoại**: 033889986
- **Địa chỉ**: Hà Nội, Việt Nam

## 🙏 Lời cảm ơn

Cảm ơn tất cả những người đã đóng góp vào dự án này!

---

**Lưu ý**: Đây là dự án demo sử dụng JSON Server làm fake API. Trong môi trường production, cần thay thế bằng backend thực tế.
