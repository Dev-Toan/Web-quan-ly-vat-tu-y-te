$(document).ready(function () {
  // Thiết lập DataTable để tạo bảng Vật tư
  var nhanSusTable = $("#nhanSusTable").DataTable({
    ajax: {
      url: "http://localhost:3000/nhanSus?_expand=phongBan",
      dataType: "json",
      dataSrc: "",
    },
    columns: [
      {
        data: "tenNhanSu",
        render: function (data) {
          return `<div style="font-weight: bolder; color: #005792">${data}</div>`;
        },
      },
      { data: "phongBan.tenPhongBan" },
      {
        data: "ngaySinh",
        render: function (data) {
          function convertDateFormat(oldFormat) {
            try {
              // Chuyển đổi chuỗi sang Date object
              const dateObject = new Date(oldFormat);
              // Lấy các phần ngày, tháng, năm
              const year = dateObject.getFullYear();
              const month = dateObject.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
              const day = dateObject.getDate();
              // Tạo chuỗi định dạng ngày mới
              const newFormat = `${pad(day)}/${pad(month)}/${year}`;
              return newFormat;
            } catch (err) {
              // Xử lý lỗi nếu định dạng ngày không hợp lệ
              console.error(`Lỗi định dạng ngày: ${oldFormat}`, err);
              return null;
            }
          }
          // Hàm bổ sung để định dạng số có một chữ số
          function pad(num) {
            return num.toString().padStart(2, "0");
          }
          return convertDateFormat(data);
        },
      },
      { data: "gioiTinh" },
      { data: "soDienThoai" },
      { data: "email" },
      { data: "chucVu" },
      { data: "queQuan" },
      {
        data: "id",
        orderable: false,
        render: function (data, type, row) {
          return `
                        <div class="btn-group">
                            <button 
                                type="button" 
                                class="btn btn-outline-primary btn-edit" 
                                data-bs-toggle="modal"
                                data-bs-target="#editVatTuModal"
                            ><i class="fa-solid fa-pen-to-square"></i></button>
                            <button 
                                type="button" 
                                class="btn btn-outline-danger btn-delete" 
                                data-bs-toggle="modal"
                                data-bs-target="#deleteVatTuModal"
                            ><i class="fa-solid fa-trash-can"></i></button>
                        </div>`;
        },
      },
    ],
    retrieve: true,
    processing: true,
    language: {
      info: "Trang _PAGE_/_PAGES_",
      search: "Tìm kiếm:",
      lengthMenu: "_MENU_ nhân sự trong 1 trang",
      zeroRecords: "Không có nhân sự nào",
      processing: "Đang tải...",
      loadingRecords: "Không có nhân sự nào",
    },
  });

  $.ajax({ url: "http://localhost:3000/phongBans" }).done(function (data) {
    var selector_html = "<option selected>Chọn phòng ban</option>";

    data.forEach((phongBan) => {
      selector_html += `<option value="${phongBan.id}">${phongBan.tenPhongBan}</option>`;
    });
    $("#phongBanSelector").html(selector_html);
    $("#phongBanSelectorAdd").html(selector_html);
  });

  $("#nhanSusTable tbody").on("click", "button", function () {
    var data_NS = nhanSusTable.row($(this).parents("tr")).data();
    // Lấy class để xem xem nút nào đã được bấm
    const buttonClass = $(this).attr("class");
    switch (buttonClass) {
      //  Trường hợp là nút Chỉnh sửa trong bảng
      case "btn btn-outline-primary btn-edit":
        console.log(data_NS);

        // Làm mới trạng thái nút Lưu
        $("#save-form-btn").removeAttr("disabled");
        $("#save-form-btn").html("Lưu");

        // Set giá trị mặc định cho các trường input
        $("#tenNhanSuInput").val(data_NS.tenNhanSu);
        $(`#phongBanSelector option`).removeAttr("selected");
        $(`#phongBanSelector option[value="${data_NS.phongBanId}"]`).attr(
          "selected",
          true
        );
        if (data_NS.gioiTinh === "Nam") {
          $("#nam").prop("checked", true);
        } else {
          $("#nu").prop("checked", true);
        }
        $("#ngaySinhInput").val(data_NS.ngaySinh);
        $("#soDienThoaiInput").val(data_NS.soDienThoai);
        $("#emailInput").val(data_NS.email);
        $("#chucVuInput").val(data_NS.chucVu);
        $("#queQuanInput").val(data_NS.queQuan);

        // Khi nhấn nút Lưu
        $("#save-form-btn").on("click", function () {
          $("#save-form-btn").attr("disabled", "disabled");
          $("#save-form-btn").html(
            '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>'
          );

          let gioiTinhRadio = "";
          if ($("#nam").prop("checked")) {
            gioiTinhRadio = "Nam";
          } else {
            gioiTinhRadio = "Nữ";
          }

          // Dùng ajax gọi API
          $.ajax({
            url: `http://localhost:3000/nhanSus/${data_NS.id}`,
            type: "PATCH",
            data: {
              tenNhanSu: $("#tenNhanSuInput").val(),
              phongBanId: $(`#phongBanSelector`).val(),
              gioiTinh: gioiTinhRadio,
              ngaySinh: $("#ngaySinhInput").val(),
              soDienThoai: $("#soDienThoaiInput").val(),
              email: $("#emailInput").val(),
              chucVu: $("#chucVuInput").val(),
              queQuan: $("#queQuanInput").val(),
            },
          })
            .done(function (ketqua) {
              console.log(ketqua);
            })
            .fail(function () {
              console.log("failed");
              $("#save-form-btn").removeAttr("disabled");
              $("#save-form-btn").html("Lưu");
            })
            .always(function () {
              nhanSusTable.ajax.reload(null, false);
            });
        });
        break;

      case "btn btn-outline-danger btn-delete":
        $("#tenNhanSuDelete").text(data_NS.tenNhanSu);
        $("#roleBadgeDelete").text(data_NS.role);
        $("#phongBanDelete").text(data_NS.phongBan.tenPhongBan);
        $("#ngaySinhDelete").text(data_NS.ngaySinh);
        $("#soDienThoaiDelete").text(data_NS.soDienThoai);
        $("#emailDelete").text(data_NS.email);
        $("#chucVuDelete").text(data_NS.chucVu);
        $("#queQuanDelete").text(data_NS.queQuan);

        $("#deleteBtnNs").on("click", function () {
          // Dùng ajax gọi API xóa
          $.ajax({
            url: `http://localhost:3000/nhanSus/${data_NS.id}`,
            type: "DELETE",
          });
        });
        break;

      default:
        break;
    }
  });

  // Validation functions
  function validateTenNhanSu(value) {
    if (!value || value.trim() === "") {
      $("#tenNhanSuAddInput").addClass("is-invalid");
      $("#tenNhanSuAddError").text("Tên nhân sự không được để trống");
      return false;
    }
    $("#tenNhanSuAddInput").removeClass("is-invalid");
    return true;
  }

  function validatePhongBan(value) {
    if (!value || value === "Chọn phòng ban") {
      $("#phongBanSelectorAdd").addClass("is-invalid");
      $("#phongBanAddError").text("Vui lòng chọn phòng ban");
      return false;
    }
    $("#phongBanSelectorAdd").removeClass("is-invalid");
    return true;
  }

  function validateNgaySinh(value) {
    if (!value) {
      $("#ngaySinhAddInput").addClass("is-invalid");
      $("#ngaySinhAddError").text("Ngày sinh không được để trống");
      return false;
    }
    $("#ngaySinhAddInput").removeClass("is-invalid");
    return true;
  }

  function validateSoDienThoai(value) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!value || !phoneRegex.test(value)) {
      $("#soDienThoaiAddInput").addClass("is-invalid");
      $("#soDienThoaiAddError").text("Số điện thoại phải có 10 chữ số");
      return false;
    }
    $("#soDienThoaiAddInput").removeClass("is-invalid");
    return true;
  }

  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      $("#emailAddInput").addClass("is-invalid");
      $("#emailAddError").text("Email không hợp lệ");
      return false;
    }
    $("#emailAddInput").removeClass("is-invalid");
    return true;
  }

  function validateChucVu(value) {
    if (!value || value.trim() === "") {
      $("#chucVuAddInput").addClass("is-invalid");
      $("#chucVuAddError").text("Chức vụ không được để trống");
      return false;
    }
    $("#chucVuAddInput").removeClass("is-invalid");
    return true;
  }

  function validateQueQuan(value) {
    if (!value || value.trim() === "") {
      $("#queQuanAddInput").addClass("is-invalid");
      $("#queQuanAddError").text("Quê quán không được để trống");
      return false;
    }
    $("#queQuanAddInput").removeClass("is-invalid");
    return true;
  }

  // Add input event listeners for real-time validation
  $("#tenNhanSuAddInput").on("input", function () {
    validateTenNhanSu($(this).val());
  });

  $("#phongBanSelectorAdd").on("change", function () {
    validatePhongBan($(this).val());
  });

  $("#ngaySinhAddInput").on("change", function () {
    validateNgaySinh($(this).val());
  });

  $("#soDienThoaiAddInput").on("input", function () {
    validateSoDienThoai($(this).val());
  });

  $("#emailAddInput").on("input", function () {
    validateEmail($(this).val());
  });

  $("#chucVuAddInput").on("input", function () {
    validateChucVu($(this).val());
  });

  $("#queQuanAddInput").on("input", function () {
    validateQueQuan($(this).val());
  });

  // Modify the add employee form submission
  $("#btn-openAddNhanVienModal").on("click", function () {
    // Reset form and validation states
    $("#addNhanVienModal form")[0].reset();
    $(".is-invalid").removeClass("is-invalid");
    $(".invalid-feedback").text("");

    // Làm mới trạng thái nút Lưu
    $("#add-form-btn").removeAttr("disabled");
    $("#add-form-btn").html("Lưu");

    // Khi nhấn nút Lưu
    $("#add-form-btn").on("click", function () {
      // Validate all fields
      const isTenNhanSuValid = validateTenNhanSu($("#tenNhanSuAddInput").val());
      const isPhongBanValid = validatePhongBan($("#phongBanSelectorAdd").val());
      const isNgaySinhValid = validateNgaySinh($("#ngaySinhAddInput").val());
      const isSoDienThoaiValid = validateSoDienThoai(
        $("#soDienThoaiAddInput").val()
      );
      const isEmailValid = validateEmail($("#emailAddInput").val());
      const isChucVuValid = validateChucVu($("#chucVuAddInput").val());
      const isQueQuanValid = validateQueQuan($("#queQuanAddInput").val());

      // Only proceed if all validations pass
      if (
        isTenNhanSuValid &&
        isPhongBanValid &&
        isNgaySinhValid &&
        isSoDienThoaiValid &&
        isEmailValid &&
        isChucVuValid &&
        isQueQuanValid
      ) {
        $("#add-form-btn").attr("disabled", "disabled");
        $("#add-form-btn").html(
          '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>'
        );

        let gioiTinhRadio = "";
        if ($("#namAdd").prop("checked")) {
          gioiTinhRadio = "Nam";
        } else {
          gioiTinhRadio = "Nữ";
        }

        // Dùng ajax gọi API
        $.ajax({
          url: `http://localhost:3000/nhanSus/`,
          type: "POST",
          data: {
            tenNhanSu: $("#tenNhanSuAddInput").val(),
            phongBanId: $(`#phongBanSelectorAdd`).val(),
            gioiTinh: gioiTinhRadio,
            ngaySinh: $("#ngaySinhAddInput").val(),
            soDienThoai: $("#soDienThoaiAddInput").val(),
            email: $("#emailAddInput").val(),
            chucVu: $("#chucVuAddInput").val(),
            queQuan: $("#queQuanAddInput").val(),
            tenTaiKhoan: "CHƯA CÓ",
            matKhau: "CHƯA CÓ",
            role: "user",
          },
        })
          .done(function (ketqua) {
            console.log(ketqua);
            // Close modal and reset form on success
            $("#addNhanVienModal").modal("hide");
            $("#addNhanVienModal form")[0].reset();
            nhanSusTable.ajax.reload(null, false);
          })
          .fail(function () {
            console.log("failed");
            $("#add-form-btn").removeAttr("disabled");
            $("#add-form-btn").html("Lưu");
          });
      }
    });
  });
});
