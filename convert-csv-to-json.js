const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Đường dẫn đến các file
const danhMucsCsvPath = path.join(__dirname, 'data', 'danhMucs.csv');
const nhanSusCsvPath = path.join(__dirname, 'data', 'nhanSus.csv');
const phongBansCsvPath = path.join(__dirname, 'data', 'phongBans.csv');
const vatTusCsvPath = path.join(__dirname, 'data', 'vatTus.csv');
const lichSusCsvPath = path.join(__dirname, 'data', 'lichSus.csv');
const jsonFilePath = path.join(__dirname, 'db.json');

// Đọc file db.json hiện tại
let dbData = {};
try {
  dbData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
} catch (error) {
  console.log('Tạo file db.json mới');
  dbData = {
    vatTus: [],
    danhMucs: [],
    nhanSus: [],
    phongBans: [],
    lichSus: [],
    lichSuYeuCaus: []
  };
}

// Hàm đọc và chuyển đổi file CSV
function convertCsvToJson(csvPath, processRow) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(processRow(row));
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Chuyển đổi danh mục
async function convertDanhMucs() {
  try {
    const danhMucs = await convertCsvToJson(danhMucsCsvPath, (row) => ({
      id: parseInt(row.id),
      tenDanhMuc: row.tenDanhMuc
    }));
    dbData.danhMucs = danhMucs;
    console.log(`Đã chuyển đổi ${danhMucs.length} danh mục`);
  } catch (error) {
    console.error('Lỗi khi chuyển đổi danh mục:', error);
  }
}

// Chuyển đổi nhân sự
async function convertNhanSus() {
  try {
    const nhanSus = await convertCsvToJson(nhanSusCsvPath, (row) => ({
      id: parseInt(row.id),
      phongBanId: parseInt(row.phongBanId),
      tenNhanSu: row.tenNhanSu,
      gioiTinh: row.gioiTinh,
      ngaySinh: row.ngaySinh,
      soDienThoai: row.soDienThoai,
      email: row.email,
      chucVu: row.chucVu,
      queQuan: row.queQuan,
      tenTaiKhoan: row.tenTaiKhoan,
      matKhau: row.matKhau,
      role: row.role
    }));
    dbData.nhanSus = nhanSus;
    console.log(`Đã chuyển đổi ${nhanSus.length} nhân sự`);
  } catch (error) {
    console.error('Lỗi khi chuyển đổi nhân sự:', error);
  }
}

// Chuyển đổi phòng ban
async function convertPhongBans() {
  try {
    const phongBans = await convertCsvToJson(phongBansCsvPath, (row) => ({
      id: parseInt(row.id),
      tenPhongBan: row.tenPhongBan,
      chuyenNganh: row.chuyenNganh,
      vatTuChoMuon: row.vatTuChoMuon,
      vatTuHienTai: row.vatTuHienTai
    }));
    dbData.phongBans = phongBans;
    console.log(`Đã chuyển đổi ${phongBans.length} phòng ban`);
  } catch (error) {
    console.error('Lỗi khi chuyển đổi phòng ban:', error);
  }
}

// Chuyển đổi vật tư
async function convertVatTus() {
  try {
    const vatTus = await convertCsvToJson(vatTusCsvPath, (row) => ({
      id: parseInt(row.id),
      danhMucId: parseInt(row.danhMucId),
      tenVatTu: row.tenVatTu,
      anhVatTu: row.anhVatTu,
      moTaVatTu: row.moTaVatTu,
      soLuongTonKho: parseInt(row.soLuongTonKho),
      thuongHieu: row.thuongHieu,
      mauSac: row.mauSac
    }));
    dbData.vatTus = vatTus;
    console.log(`Đã chuyển đổi ${vatTus.length} vật tư`);
  } catch (error) {
    console.error('Lỗi khi chuyển đổi vật tư:', error);
  }
}

// Chuyển đổi lịch sử
async function convertLichSus() {
  try {
    const lichSus = await convertCsvToJson(lichSusCsvPath, (row) => ({
      id: parseInt(row.id),
      nhanSuId: parseInt(row.nhanSuId),
      tieuDe: row.tieuDe,
      thoiGianThucHien: parseInt(row.thoiGianThucHien),
      chiTiet: row.chiTiet
    }));
    dbData.lichSus = lichSus;
    console.log(`Đã chuyển đổi ${lichSus.length} lịch sử`);
  } catch (error) {
    console.error('Lỗi khi chuyển đổi lịch sử:', error);
  }
}

// Thực hiện chuyển đổi tất cả
async function convertAll() {
  try {
    await convertDanhMucs();
    await convertNhanSus();
    await convertPhongBans();
    await convertVatTus();
    await convertLichSus();

    // Ghi lại vào file db.json
    fs.writeFileSync(jsonFilePath, JSON.stringify(dbData, null, 2), 'utf8');
    console.log('Chuyển đổi dữ liệu từ CSV sang JSON thành công!');
  } catch (error) {
    console.error('Lỗi khi chuyển đổi dữ liệu:', error);
  }
}

// Chạy chuyển đổi
convertAll(); 