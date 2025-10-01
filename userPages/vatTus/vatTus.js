$(document).ready(function () {
  // Thiết lập DataTable để tạo bảng Vật tư
  var vatTusTable = $("#vatTusTable").DataTable({
    ajax: {
      url: "http://localhost:3000/vatTus?_expand=danhMuc",
      dataType: "json",
      dataSrc: "",
    },
    columns: [
      {
        data: "id",
        render: function (data) {
          return `<div style="text-align: center;">${data}</div>`;
        },
      },
      { data: "tenVatTu" },
      {
        data: "anhVatTu",
        orderable: false,
        render: function (data, type, row) {
          return `<img src="${data}" alt="Ảnh của ${row.tenVatTu}" width="100px" />`;
        },
      },
      { data: "danhMuc.tenDanhMuc" },
      { data: "moTaVatTu" },
      {
        data: "soLuongTonKho",
        render: function (data) {
          return `<span style="margin-right: 20px; font-size: 15px;">${data}</span>`;
        },
      },
      { data: "thuongHieu" },
      { data: "mauSac" },
      // {
      //     data: 'id',
      //     orderable: false,
      //     render: function () {
      //         return `
      //             <div class="btn-group">
      //                 <button
      //                     type="button"
      //                     class="btn btn-outline-primary btn-edit"
      //                     data-bs-toggle="modal"
      //                     data-bs-target="#editVatTuModal"
      //                 ><i class="fa-solid fa-pen-to-square"></i></button>
      //                 <button
      //                     type="button"
      //                     class="btn btn-outline-danger btn-delete"
      //                     data-bs-toggle="modal"
      //                     data-bs-target="#deleteVatTuModal"
      //                 ><i class="fa-solid fa-trash-can"></i></button>
      //             </div>`
      //     }
      // }
    ],
    retrieve: true,
    processing: true,
    language: {
      info: "Trang _PAGE_/_PAGES_",
      search: "Tìm kiếm:",
      lengthMenu: "_MENU_ vật tư trong 1 trang",
      zeroRecords: "Không có vật tư nào",
      processing: "Đang tải...",
      loadingRecords: "Không có vật tư nào",
    },
  });
  $("#btn-openNhapVTModal").on("click", function () {
    // Làm mới trạng thái nút Nhập
    $("#btn-chonVT").removeAttr("disabled");
    $("#btn-nhapVatTu").removeAttr("disabled");
    $("#btn-nhapVatTu").html(
      '<i class="fa-solid fa-check-double me-2"></i>Nhập'
    );
    $("#nguoiThucHienInput").attr(
      "value",
      localStorage.getItem("usernameUser")
    );
  });
  $("#vatTusTable tbody").on("click", "button", function () {
    var data_VT = vatTusTable.row($(this).parents("tr")).data();
    // Lấy class để xem xem nút nào đã được bấm
    const buttonClass = $(this).attr("class");
    switch (buttonClass) {
      //  Trường hợp là nút Chỉnh sửa trong bảng
      case "btn btn-outline-primary btn-edit":
        console.log(data_VT);

        // Làm mới trạng thái nút Lưu
        $("#save-form-btn").removeAttr("disabled");
        $("#save-form-btn").html("Lưu");

        // Set giá trị mặc định cho các trường input
        $("#tenVatTuInput").val(data_VT.tenVatTu);
        $("#moTaTextarea").val(data_VT.moTaVatTu);
        $(`#danhMucSelector option`).removeAttr("selected");
        $(`#danhMucSelector option[value="${data_VT.danhMucId}"]`).attr(
          "selected",
          true
        );
        $("#soLuongInput").val(data_VT.soLuongTonKho);
        $("#thuongHieuInput").val(data_VT.thuongHieu);
        $("#mauSacInput").val(data_VT.mauSac);
        $("#selectedImage").attr("src", `${data_VT.anhVatTu}`);

        // Nhấn nút Xóa ảnh
        $("#reset_img_btn").on("click", function () {
          $("#selectedImage").attr("src", `../../scr/images/khong_co_anh.png`);
          // var filename = $('#uploadImg[type=file]').val().split('\\').pop();
          // console.log(filename == '')
        });

        $("#uploadImg").on("change", function () {
          var filename = $("#uploadImg[type=file]").val().split("\\").pop();
          if (filename)
            $("#selectedImage").attr("src", `../../scr/images/${filename}`);
        });
        // Khi nhấn nút Lưu
        $("#save-form-btn").on("click", function () {
          $("#save-form-btn").attr("disabled", "disabled");
          $("#save-form-btn").html(
            '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>'
          );

          // Dùng ajax gọi API
          $.ajax({
            url: `http://localhost:3000/vatTus/${data_VT.id}`,
            type: "PUT",
            data: {
              tenVatTu: $("#tenVatTuInput").val(),
              moTaVatTu: $("#moTaTextarea").val(),
              danhMucId: $(`#danhMucSelector`).val(),
              soLuongTonKho: $("#soLuongInput").val(),
              thuongHieu: $("#thuongHieuInput").val(),
              mauSac: $("#mauSacInput").val(),
              anhVatTu: $("#selectedImage").attr("src"),
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
              vatTusTable.ajax.reload(null, false);
            });
        });
        break;

      case "btn btn-outline-danger btn-delete":
        $("#delete_anhVatTu").attr("src", data_VT.anhVatTu);
        $("#delete_tenVatTu").text(data_VT.tenVatTu);
        $("#delete_soLuong").text(`SL: ${data_VT.soLuongTonKho}`);
        $("#delete_danhMuc").text(data_VT.danhMuc.tenDanhMuc);
        $("#delete_moTa").text(data_VT.moTaVatTu);
        $("#delete_thuongHieu").text(data_VT.thuongHieu);
        $("#delete_mauSac").text(data_VT.mauSac);

        $("#delete-btn").on("click", function () {
          // Dùng ajax gọi API xóa
          $.ajax({
            url: `http://localhost:3000/vatTus/${data_VT.id}`,
            type: "DELETE",
          });
        });

        break;

      default:
        break;
    }
  });

  // ============================================================ //
  // ADD VẬT TƯ
  // ============================================================ //
  $("#btn-openAddVatTuModal").on("click", function () {
    // Làm mới trạng thái nút Lưu
    $("#add-form-btn").removeAttr("disabled");
    $("#add-form-btn").html("Lưu");

    // Nhấn nút Xóa ảnh
    $("#reset_img_btnAdd").on("click", function () {
      $("#selectedImageAdd").attr("src", `../../scr/images/khong_co_anh.png`);
      // var filename = $('#uploadImg[type=file]').val().split('\\').pop();
      // console.log(filename == '')
    });

    $("#uploadImgAdd").on("change", function () {
      var filename = $("#uploadImgAdd[type=file]").val().split("\\").pop();
      if (filename)
        $("#selectedImageAdd").attr("src", `../../scr/images/${filename}`);
    });
    // Khi nhấn nút Lưu
    $("#add-form-btn").on("click", function () {
      $("#add-form-btn").attr("disabled", "disabled");
      $("#add-form-btn").html(
        '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>'
      );

      // Dùng ajax gọi API
      $.ajax({
        url: `http://localhost:3000/vatTus/`,
        type: "POST",
        data: {
          tenVatTu: $("#tenVatTuInputAdd").val(),
          moTaVatTu: $("#moTaTextareaAdd").val(),
          danhMucId: $(`#danhMucSelectorAdd`).val(),
          soLuongTonKho: $("#soLuongInputAdd").val(),
          thuongHieu: $("#thuongHieuInputAdd").val(),
          mauSac: $("#mauSacInputAdd").val(),
          anhVatTu: $("#selectedImageAdd").attr("src"),
        },
      })
        .done(function (ketqua) {
          console.log(ketqua);
        })
        .fail(function () {
          console.log("failed");
          $("#add-form-btn").removeAttr("disabled");
          $("#add-form-btn").html("Lưu");
        })
        .always(function () {
          vatTusTable.ajax.reload(null, false);
        });
    });
  });

  // ============================================================ //
  // NHẬP VẬT TƯ
  // ============================================================ //
  var nhapVatTuTable = $("#nhapVatTuTable").DataTable({
    ajax: {
      url: "http://localhost:3000/vatTus?_expand=danhMuc",
      dataType: "json",
      dataSrc: "",
    },
    columns: [
      {
        data: "id",
        orderable: false,
        className: "select-checkbox",
        render: function () {
          return "";
        },
      },
      {
        data: "tenVatTu",
        render: function (data) {
          return `<span style="font-weight: bolder;">${data}</span>`;
        },
      },
      {
        data: "anhVatTu",
        orderable: false,
        render: function (data, type, row) {
          return `<img src="${data}" alt="Ảnh của ${row.tenVatTu}" width="100px" />`;
        },
      },
      { data: "danhMuc.tenDanhMuc" },
      { data: "moTaVatTu" },
      {
        data: "soLuongTonKho",
        render: function (data) {
          return `<span style="margin-right: 20px; font-weight: bold; font-size: 15px;">${data}</span>`;
        },
      },
      { data: "thuongHieu" },
      { data: "mauSac" },
    ],
    select: true,
    order: [[1, "asc"]],
    scrollCollapse: true,
    scrollX: true,
    // scrollY: 300,
    retrieve: true,
    processing: true,
    language: {
      info: "Trang _PAGE_/_PAGES_",
      search: "Tìm kiếm:",
      lengthMenu: "_MENU_ vật tư trong 1 trang",
      zeroRecords: "Không có vật tư nào",
      processing: "Đang tải...",
      loadingRecords: "Không có vật tư nào",
    },
  });

  $("#btn-openNhapVTModal").on("click", function () {
    $("#nhapVatTuModal").modal("show");
  });

  // Xử lý khi chọn xong vật tư
  $("#btn-chonVT").on("click", function () {
    const selectedData = nhapVatTuTable.rows({ selected: true }).data();
    let table_html = "";

    for (let i = 0; i < selectedData.length; i++) {
      table_html += `
                <tr id="${selectedData[i].id}">
                    <td>${selectedData[i].tenVatTu}</td>
                    <td><img src="${selectedData[i].anhVatTu}" alt="Ảnh của ${selectedData[i].tenVatTu}" width="100px" /></td>
                    <td>SL : <input type="number" style="width: 100px; display: inline-block;" class="form-control" id="soluongNhap_VT${selectedData[i].id}" value="1" /></td>
                    <td><button type="button" class="btn btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button></td>
                </tr>`;
    }

    $("#vatTuDaChonTable tbody").html(table_html);
  });

  // Xử lý khi xóa vật tư đã chọn
  $("#vatTuDaChonTable tbody").on("click", "button", function () {
    $(this).parents("tr").remove();

    if (!$("#vatTuDaChonTable tbody tr").length) {
      const tbody_html = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 20px;">
                        CHƯA CÓ VẬT TƯ NÀO
                    </td>
                </tr>`;
      $("#vatTuDaChonTable tbody").html(tbody_html);
    }
  });

  $("#tieuDeNhapInput").on("keyup", function () {
    if ($(this).val().length === 0) {
      $(this).attr("class", "form-control is-invalid");
    } else {
      $(this).attr("class", "form-control");
    }
  });

  // Khi nhấn nút Nhập
  $("#btn-nhapVatTu").on("click", function () {
    const VT_count = $("#vatTuDaChonTable tbody tr button").length;
    if (VT_count === 0) {
      return;
    }
    if (!$("#tieuDeNhapInput").val()) {
      $("#tieuDeNhapInput").attr("class", "form-control is-invalid");
      return;
    }

    $("#btn-chonVT").attr("disabled", "disabled");
    $("#btn-nhapVatTu").attr("disabled", "disabled");
    $("#btn-nhapVatTu").html(
      '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang nhập...</span>'
    );

    const d = new Date();
    let lichSus_data = {
      nhanSuId: localStorage.getItem("nhanSuIdUser"),
      tieuDe: $("#tieuDeNhapInput").val(),
      thoiGianThucHien: d.getTime(),
      trangThai: "Đang chờ",
    };
    let chiTiet = "";
    let sum_SL = 0;
    for (let i = 1; i <= VT_count; i++) {
      const row = $(`#vatTuDaChonTable tbody tr:nth-child(${i})`);
      const VT_id = parseInt(row.attr("id"));
      const VT_SL = parseInt(row.find("input").val());
      const SL_cu = parseInt(
        nhapVatTuTable.row((idx, data) => data.id === VT_id).data()
          .soLuongTonKho
      );
      const tenVT = nhapVatTuTable
        .row((idx, data) => data.id === VT_id)
        .data().tenVatTu;
      sum_SL += VT_SL;
      // // Dùng ajax gọi API để thêm số lượng từng vật tư đã chọn
      // $.ajax({
      //     url: `http://localhost:3000/vatTus/${VT_id}`,
      //     type: 'PATCH',
      //     data: {
      //         soLuongTonKho: SL_cu + VT_SL
      //     }
      // })
      //     .done(function (ketqua) {
      //         console.log(ketqua)
      //     })
      //     .fail(function () {
      //         console.log('failed')
      //         $('#btn-chonVT').removeAttr('disabled')
      //         $('#btn-nhapVatTu').removeAttr('disabled')
      //         $('#btn-nhapVatTu').html('<i class="fa-solid fa-check-double me-2"></i>Nhập')
      //     })
      //     .always(function () {
      //         vatTusTable.ajax.reload(null, false);
      //     })
      chiTiet += `Yêu cầu ${tenVT} - SL: ${VT_SL}/_`;
    }
    chiTiet += `Tổng số ${sum_SL} vật tư`;

    lichSus_data.chiTiet = chiTiet;
    console.log(lichSus_data);

    // Gọi Ajax để thêm lịch sử Nhập
    $.ajax({
      url: `http://localhost:3000/lichSuYeuCaus/`,
      type: "POST",
      data: lichSus_data,
    })
      .done(function (ketqua) {
        console.log(ketqua);
      })
      .fail(function () {
        console.log("failed");
        $("#btn-chonVT").removeAttr("disabled");
        $("#btn-nhapVatTu").removeAttr("disabled");
        $("#btn-nhapVatTu").html(
          '<i class="fa-solid fa-check-double me-2"></i>Nhập'
        );
      })
      .always(function () {
        vatTusTable.ajax.reload(null, false);
      });
  });

  // ============================================================ //
  // XUẤT VẬT TƯ
  // ============================================================ //
  var xuatVatTuTable = $("#xuatVatTuTable").DataTable({
    ajax: {
      url: "http://localhost:3000/vatTus?_expand=danhMuc",
      dataType: "json",
      dataSrc: "",
    },
    columns: [
      {
        data: "id",
        orderable: false,
        className: "select-checkbox",
        render: function () {
          return "";
        },
      },
      {
        data: "tenVatTu",
        render: function (data) {
          return `<span style="font-weight: bolder;">${data}</span>`;
        },
      },
      {
        data: "anhVatTu",
        orderable: false,
        render: function (data, type, row) {
          return `<img src="${data}" alt="Ảnh của ${row.tenVatTu}" width="100px" />`;
        },
      },
      { data: "danhMuc.tenDanhMuc" },
      { data: "moTaVatTu" },
      {
        data: "soLuongTonKho",
        render: function (data) {
          return `<span style="margin-right: 20px; font-weight: bold; font-size: 15px;">${data}</span>`;
        },
      },
      { data: "thuongHieu" },
      { data: "mauSac" },
    ],
    select: true,
    order: [[1, "asc"]],
    scrollCollapse: true,
    scrollX: true,
    // scrollY: 300,
    retrieve: true,
    processing: true,
    language: {
      info: "Trang _PAGE_/_PAGES_",
      search: "Tìm kiếm:",
      lengthMenu: "_MENU_ vật tư trong 1 trang",
      zeroRecords: "Không có vật tư nào",
      processing: "Đang tải...",
      loadingRecords: "Không có vật tư nào",
    },
  });

  // ajax để lấy selector phòng ban
  $.ajax({ url: "http://localhost:3000/phongBans" }).done(function (data) {
    var selector_html = "<option selected>Chọn phòng ban</option>";

    data.forEach((phongBan) => {
      selector_html += `<option value="${phongBan.id}" data-Sl="${phongBan.vatTuChoMuon}">${phongBan.tenPhongBan}</option>`;
    });
    $("#phongBanSelector").html(selector_html);
  });

  $("#btn-openXuatVTModal").on("click", function () {
    // Làm mới trạng thái nút Nhập
    $("#btn-chonVTXuat").removeAttr("disabled");
    $("#btn-xuatVatTu").removeAttr("disabled");
    $("#btn-xuatVatTu").html(
      '<i class="fa-solid fa-angles-down me-1"></i>Xuất'
    );
  });

  // $('#nhapVatTuModal').modal('show')
  $("#btn-chonXongXuat").on("click", function () {
    const selectedData = xuatVatTuTable.rows({ selected: true }).data();
    let table_html = "";
    for (let i = 0; i < selectedData.length; i++) {
      table_html += `
                <tr id="${selectedData[i].id}">
                    <td>${selectedData[i].tenVatTu}</td>
                    <td><img src="${selectedData[i].anhVatTu}" alt="Ảnh của ${selectedData[i].tenVatTu}" width="100px" /></td>
                    <td>SL : <input type="number" style="width: 100px; display: inline-block;" class="form-control" id="soluongNhap_VT${selectedData[i].id}" value="1" /></td>
                    <td><button type="button" class="btn btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button></td>
                </tr>`;
    }
    $("#vatTuDaChonXuatTable tbody").html(table_html);
  });

  // Nhấn nút xóa
  $("#vatTuDaChonXuatTable tbody").on("click", "button", function () {
    $(this).parents("tr").remove();

    // Check nếu xóa hết vật tư rồi thì Hiển thị CHƯA CÓ VẬT TƯ NÀO
    if (!$("#vatTuDaChonXuatTable tbody tr").length) {
      const tbody_html = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        CHƯA CÓ VẬT TƯ NÀO
                    </td>
                </tr>`;
      $("#vatTuDaChonXuatTable tbody").html(tbody_html);
    }
  });

  $("#tieuDeXuatInput").on("keyup", function () {
    if ($(this).val().length === 0) {
      $(this).attr("class", "form-control is-invalid");
    } else {
      $(this).attr("class", "form-control");
    }
  });

  // Khi nhấn nút Xuất
  $("#btn-xuatVatTu").on("click", function () {
    const VT_count = $("#vatTuDaChonXuatTable tbody tr button").length;
    if (VT_count === 0) {
      return;
    }
    if (!$("#tieuDeXuatInput").val()) {
      $("#tieuDeXuatInput").attr("class", "form-control is-invalid");
      return;
    }

    $("#btn-chonVTXuat").attr("disabled", "disabled");
    $("#btn-xuatVatTu").attr("disabled", "disabled");
    $("#btn-xuatVatTu").html(
      '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang nhập...</span>'
    );

    const d = new Date();
    let lichSus_data = {
      nhanSuId: localStorage.getItem("nhanSuId"),
      tieuDe: $("#tieuDeXuatInput").val(),
      thoiGianThucHien: d.getTime(),
    };
    let chiTiet = "";
    let sum_SL = 0;
    for (let i = 1; i <= VT_count; i++) {
      const row = $(`#vatTuDaChonXuatTable tbody tr:nth-child(${i})`);
      const VT_id = parseInt(row.attr("id"));
      const VT_SL = parseInt(row.find("input").val());
      const SL_cu = parseInt(
        xuatVatTuTable.row((idx, data) => data.id === VT_id).data()
          .soLuongTonKho
      );
      const tenVT = xuatVatTuTable
        .row((idx, data) => data.id === VT_id)
        .data().tenVatTu;
      sum_SL += VT_SL;

      // Dùng ajax gọi API để thêm số lượng từng vật tư đã chọn
      $.ajax({
        url: `http://localhost:3000/vatTus/${VT_id}`,
        type: "PATCH",
        data: {
          soLuongTonKho: SL_cu - VT_SL,
        },
      })
        .done(function (ketqua) {
          console.log(ketqua);
        })
        .fail(function () {
          console.log("failed");
          $("#btn-chonVTXuat").removeAttr("disabled");
          $("#btn-xuatVatTu").removeAttr("disabled");
          $("#btn-xuatVatTu").html(
            '<i class="fa-solid fa-angles-down me-1"></i>Xuất'
          );
        })
        .always(function () {
          vatTusTable.ajax.reload(null, false);
        });
      chiTiet += `Xuất ${tenVT} - SL: ${VT_SL}/_`;
    }
    chiTiet += `Tổng số ${sum_SL} vật tư`;

    lichSus_data.chiTiet = chiTiet;
    console.log(lichSus_data);

    // Gọi Ajax để thêm lịch sử hoạt động
    $.ajax({
      url: `http://localhost:3000/lichSus/`,
      type: "POST",
      data: lichSus_data,
    })
      .done(function (ketqua) {
        console.log(ketqua);
      })
      .fail(function () {
        console.log("failed");
        $("#btn-chonVTXuat").removeAttr("disabled");
        $("#btn-xuatVatTu").removeAttr("disabled");
        $("#btn-xuatVatTu").html(
          '<i class="fa-solid fa-angles-down me-1"></i>Xuất'
        );
      })
      .always(function () {
        vatTusTable.ajax.reload(null, false);
      });

    // ajax cập nhật số lượng vật tư của phòng ban
    $.ajax({
      url: `http://localhost:3000/phongBans/${$("#phongBanSelector").val()}`,
      type: "PATCH",
      data: {
        vatTuChoMuon:
          parseInt($("#phongBanSelector option:checked").attr("data-SL")) +
          sum_SL,
      },
    })
      .done(function (ketqua) {
        console.log(ketqua);
      })
      .fail(function () {
        console.log("failed");
        $("#btn-chonVTXuat").removeAttr("disabled");
        $("#btn-xuatVatTu").removeAttr("disabled");
        $("#btn-xuatVatTu").html(
          '<i class="fa-solid fa-angles-down me-1"></i>Xuất'
        );
      })
      .always(function () {
        vatTusTable.ajax.reload(null, false);
      });
  });

  // Thiết lập DataTable cho bảng Lịch sử yêu cầu
  var lichSuYeuCauTable = $("#lichSuYeuCauTable").DataTable({
    ajax: {
      url: "http://localhost:3000/lichSuYeuCaus",
      dataType: "json",
      dataSrc: "",
    },
    columns: [
      {
        data: "id",
        render: function (data) {
          return `<div style="text-align: center;">${data}</div>`;
        },
      },
      { data: "tieuDe" },
      { data: "chiTiet" },
      {
        data: "thoiGianThucHien",
        render: function (data) {
          return new Date(data).toLocaleString();
        },
      },
      {
        data: "trangThai",
        render: function (data) {
          let badgeClass = "bg-secondary";
          let statusText = "Chờ duyệt";

          if (data === "Đã duyệt") {
            badgeClass = "bg-success";
            statusText = "Đã duyệt";
          } else if (data === "Từ chối") {
            badgeClass = "bg-danger";
            statusText = "Từ chối";
          }

          return `<span class="badge ${badgeClass}">${statusText}</span>`;
        },
      },
    ],
    retrieve: true,
    processing: true,
    language: {
      info: "Trang _PAGE_/_PAGES_",
      search: "Tìm kiếm:",
      lengthMenu: "_MENU_ yêu cầu trong 1 trang",
      zeroRecords: "Không có yêu cầu nào",
      processing: "Đang tải...",
      loadingRecords: "Không có yêu cầu nào",
    },
  });

  // Mở modal lịch sử yêu cầu
  $("#btn-openLichSuYeuCauModal").on("click", function () {
    $("#lichSuYeuCauModal").modal("show");
  });

  // Xuất Excel
  $('#btn-UserexportExcelVatTu').on('click', function() {
    // Lấy toàn bộ dữ liệu hiện tại của datatable
    var data = vatTusTable.rows().data().toArray();

    // Chuyển dữ liệu thành array 2 chiều để xuất Excel
    var exportData = [
      ["ID", "Tên vật tư", "Danh mục", "Mô tả", "Số lượng tồn kho", "Thương hiệu", "Màu sắc"] // Tiêu đề cột
    ];

    data.forEach(function(row) {
      exportData.push([
        row.id,
        row.tenVatTu,
        row.danhMuc.tenDanhMuc,
        row.moTaVatTu,
        row.soLuongTonKho,
        row.thuongHieu,
        row.mauSac
      ]);
    });

    // Tạo workbook
    var worksheet = XLSX.utils.aoa_to_sheet(exportData);
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách vật tư");

    // Xuất file
    XLSX.writeFile(workbook, "DanhSachVatTu.xlsx");
  });
});
