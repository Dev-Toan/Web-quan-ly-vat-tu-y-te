$(document).ready(function () {
  // Thiết lập DataTable để tạo bảng Phòng ban
  var phongBansTable = $("#phongBansTable").DataTable({
    ajax: {
      url: "http://localhost:3000/phongBans",
      dataType: "json",
      dataSrc: "",
    },
    columns: [
      { data: "tenPhongBan" },
      { data: "chuyenNganh" },
      {
        data: "vatTuChoMuon",
        render: function (data) {
          return `<span style="font-weight: bolder; font-size: 15px; margin-right: 25px;">${data}</span>`;
        },
      },
      {
        data: "vatTuHienTai",
        render: function (data) {
          return `<span style="font-weight: bolder; font-size: 15px; margin-right: 25px;">${data}</span>`;
        },
      },
      {
        data: "id",
        orderable: false,
        render: function () {
          return `
                        <div class="btn-group">
                            <button 
                                type="button" 
                                class="btn btn-outline-primary btn-edit" 
                                data-bs-toggle="modal"
                                data-bs-target="#editPhongBanModal"
                            ><i class="fa-solid fa-pen-to-square"></i></button>
                            <button 
                                type="button" 
                                class="btn btn-outline-danger btn-delete" 
                                data-bs-toggle="modal"
                                data-bs-target="#deletePhongBanModal"
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
      lengthMenu: "_MENU_ phòng ban trong 1 trang",
      zeroRecords: "Không có phòng ban nào",
      processing: "Đang tải...",
      loadingRecords: "Không có phòng ban nào",
    },
  });

  // Validation functions
  function validateTenPhongBan(value) {
    if (!value || value.trim() === "") {
      $(".helperTextTenPhongBan")
        .text("Tên phòng ban không được để trống")
        .removeClass("d-none");
      return false;
    }
    $(".helperTextTenPhongBan").addClass("d-none");
    return true;
  }

  function validateChuyenNganh(value) {
    if (!value || value.trim() === "") {
      $(".helperTextChuyenNganh")
        .text("Chuyên ngành không được để trống")
        .removeClass("d-none");
      return false;
    }
    $(".helperTextChuyenNganh").addClass("d-none");
    return true;
  }

  function validateVatTuChoMuon(value) {
    if (value === "" || isNaN(value) || value < 0) {
      $(".helperTextMuonVatTu")
        .text("Vật tư cho mượn phải là số không âm")
        .removeClass("d-none");
      return false;
    }
    $(".helperTextMuonVatTu").addClass("d-none");
    return true;
  }

  function validateVatTuHienTai(value) {
    if (value === "" || isNaN(value) || value < 0) {
      $(".helperTextVatTuHienTai")
        .text("Vật tư hiện tại phải là số không âm")
        .removeClass("d-none");
      return false;
    }
    $(".helperTextVatTuHienTai").addClass("d-none");
    return true;
  }

  // Add input event listeners for real-time validation
  $("#tenPhongBanInputAdd").on("input", function () {
    validateTenPhongBan($(this).val());
  });

  $("#chuyenNganhInputAdd").on("input", function () {
    validateChuyenNganh($(this).val());
  });

  $("#vatTuChoMuonInputAdd").on("input", function () {
    validateVatTuChoMuon($(this).val());
  });

  $("#vatTuHienTaiInputAdd").on("input", function () {
    validateVatTuHienTai($(this).val());
  });

  // Khi nhấn nút Lưu
  $("#add-form-btn").on("click", function () {
    const tenPhongBan = $("#tenPhongBanInputAdd").val();
    const chuyenNganh = $("#chuyenNganhInputAdd").val();
    const vatTuChoMuon = $("#vatTuChoMuonInputAdd").val();
    const vatTuHienTai = $("#vatTuHienTaiInputAdd").val();

    // Validate all fields
    const isTenPhongBanValid = validateTenPhongBan(tenPhongBan);
    const isChuyenNganhValid = validateChuyenNganh(chuyenNganh);
    const isVatTuChoMuonValid = validateVatTuChoMuon(vatTuChoMuon);
    const isVatTuHienTaiValid = validateVatTuHienTai(vatTuHienTai);

    // Only proceed if all validations pass
    if (
      isTenPhongBanValid &&
      isChuyenNganhValid &&
      isVatTuChoMuonValid &&
      isVatTuHienTaiValid
    ) {
      $("#add-form-btn").html(
        '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>'
      );

      // Dùng ajax gọi API
      $.ajax({
        url: `http://localhost:3000/phongBans/`,
        type: "POST",
        data: {
          tenPhongBan: tenPhongBan,
          chuyenNganh: chuyenNganh,
          vatTuChoMuon: vatTuChoMuon,
          vatTuHienTai: vatTuHienTai,
        },
      })
        .done(function (ketqua) {
          console.log(ketqua);
          // Reset form and close modal on success
          $("#addNhanVienModal").modal("hide");
          phongBansTable.ajax.reload(null, false);
          // Reset form fields
          $("#tenPhongBanInputAdd").val("");
          $("#chuyenNganhInputAdd").val("");
          $("#vatTuChoMuonInputAdd").val("");
          $("#vatTuHienTaiInputAdd").val("");
        })
        .fail(function () {
          console.log("failed");
          $("#add-form-btn").removeAttr("disabled");
          $("#add-form-btn").html("Thêm");
        })
        .always(function () {
          $("#add-form-btn").html("Thêm");
        });
    }
  });

  $("#phongBansTable tbody").on("click", "button", function () {
    var data_PB = phongBansTable.row($(this).parents("tr")).data();
    // Lấy class để xem xem nút nào đã được bấm
    const buttonClass = $(this).attr("class");
    switch (buttonClass) {
      //  Trường hợp là nút Chỉnh sửa trong bảng
      case "btn btn-outline-primary btn-edit":
        console.log(data_PB);

        // Làm mới trạng thái nút Lưu
        $("#save-form-btn").removeAttr("disabled");
        $("#save-form-btn").html("Lưu");

        // Set giá trị mặc định cho các trường input
        $("#tenPhongBanInput").val(data_PB.tenPhongBan);
        $("#chuyenNganhInput").val(data_PB.chuyenNganh);
        $("#vatTuChoMuonInput").val(data_PB.vatTuChoMuon);
        $("#vatTuHienTaiInput").val(data_PB.vatTuHienTai);

        // Khi nhấn nút Lưu
        $("#save-form-btn").on("click", function () {
          $("#save-form-btn").attr("disabled", "disabled");
          $("#save-form-btn").html(
            '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>'
          );

          // Dùng ajax gọi API
          $.ajax({
            url: `http://localhost:3000/phongBans/${data_PB.id}`,
            type: "PUT",
            data: {
              tenPhongBan: $("#tenPhongBanInput").val(),
              chuyenNganh: $("#chuyenNganhInput").val(),
              vatTuChoMuon: $(`#vatTuChoMuonInput`).val(),
              vatTuHienTai: $("#vatTuHienTaiInput").val(),
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
            .always(function () {});
        });
        break;

      case "btn btn-outline-danger btn-delete":
        $("#delete-form-btn").on("click", function () {
          $.ajax({
            url: `http://localhost:3000/phongBans/${data_PB.id}`,
            type: "DELETE",
          })
            .done(function (ketqua) {
              console.log(ketqua);
            })
            .fail(function () {
              console.log("failed");
            })
            .always(function () {
              phongBansTable.ajax.reload(null, false);
            });
        });
        break;
    }
  });
});
