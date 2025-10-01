$(document).ready(function () {
  // Thiết lập DataTable để tạo bảng Vật tư
  var vatTusTable = $("#vatTusTable").DataTable({
    ajax: {
      url: "http://localhost:3000/lichSuYeuCaus?_expand=nhanSu",
      dataType: "json",
      dataSrc: "",
    },
    columns: [
      {
        data: "tieuDe",
        render: function (data) {
          return `
                        <div style="font-weight: bolder; margin-left: 10px;">
                            ${data}
                        </div>`;
        },
      },
      { data: "nhanSu.tenNhanSu" },
      {
        data: "chiTiet",
        orderable: false,
        render: function (data) {
          const arrStr = data.split("/_");
          let result = "";
          for (let i = 0; i < arrStr.length; i++) {
            if (arrStr[i] !== "") {
              result += `<div class="my-2">${arrStr[i]}</div>`;
            }
          }
          return `
                        <div class="p-2">
                            ${result}
                        </div>`;
        },
      },
      {
        data: "thoiGianThucHien",
        type: "date-euro",
        render: function (data) {
          const d = new Date(parseInt(data));

          let hour = d.getHours().toString();
          if (d.getHours() <= 9) {
            hour = "0" + hour;
          }

          let min = d.getMinutes().toString();
          if (d.getMinutes() <= 9) {
            min = "0" + min;
          }

          let sec = d.getSeconds().toString();
          if (d.getSeconds() <= 9) {
            sec = "0" + sec;
          }

          let date = d.getDate().toString();
          if (d.getDate() <= 9) {
            date = "0" + date;
          }

          let month = (d.getMonth() + 1).toString();
          if (d.getMonth() + 1 <= 9) {
            month = "0" + month;
          }

          const result = `${date}/${month}/${d.getFullYear()} ${hour}:${min}:${sec}`;

          return `<div style="color: blue;">${result}</div>`;
        },
      },
      {
        data: "trangThai",
      },
      {
        data: "id",
        orderable: false,
        render: function () {
          return `
                        <div class="btn-group">
                            <button 
                                type="button" 
                                class="btn btn-outline-success btn-edit" 
                                
                            ><i class="fa-solid fa-check"></i></button>
                            <button 
                                type="button" 
                                class="btn btn-outline-danger btn-delete" 
                                data-bs-toggle="modal"
                                data-bs-target="#deletePhongBanModal"
                            ><i class="fa-solid fa-ban"></i></button>
                        </div>`;
        },
      },
    ],
    retrieve: true,
    processing: true,
    order: [[3, "desc"]],
    language: {
      info: "Trang _PAGE_/_PAGES_",
      search: "Tìm kiếm:",
      lengthMenu: "_MENU_ lịch sử trong 1 trang",
      zeroRecords: "Không có lịch sử nào",
      processing: "Đang tải...",
      loadingRecords: "Không có lịch sử nào",
    },
  });
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Format dates for input fields (YYYY-MM-DD)
  $("#startDate").val(thirtyDaysAgo.toISOString().split("T")[0]);
  $("#endDate").val(today.toISOString().split("T")[0]);

  // Function to convert date string to timestamp (start of day)
  function dateToTimestamp(dateStr) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  // Function to filter table by date range
  function filterByDateRange() {
    const startDate = dateToTimestamp($("#startDate").val());
    const endDate = dateToTimestamp($("#endDate").val());

    // Add 24 hours to end date to include the entire day
    const endDatePlusDay = endDate + 24 * 60 * 60 * 1000;

    // Custom filtering function
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      const rowData = vatTusTable.row(dataIndex).data();
      const rowTimestamp = parseInt(rowData.thoiGianThucHien);
      return rowTimestamp >= startDate && rowTimestamp <= endDatePlusDay;
    });

    // Apply the filter
    vatTusTable.draw();

    // Remove the custom filtering function
    $.fn.dataTable.ext.search.pop();
  }

  // Add click event listener to filter button
  $("#filterBtn").on("click", function () {
    filterByDateRange();
  });

  // Add change event listeners to date inputs
  $("#startDate, #endDate").on("change", function () {
    const startDate = $("#startDate").val();
    const endDate = $("#endDate").val();

    // Validate date range
    if (startDate && endDate && startDate > endDate) {
      alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
      $(this).val("");
      return;
    }
  });
  $("#vatTusTable tbody").on("click", "button", function () {
    var data_VT = vatTusTable.row($(this).parents("tr")).data();
    // Lấy class để xem xem nút nào đã được bấm
    const buttonClass = $(this).attr("class");
    switch (buttonClass) {
      //  Trường hợp là nút Chỉnh sửa trong bảng
      case "btn btn-outline-success btn-edit":
        console.log(data_VT);

        // // Làm mới trạng thái nút Lưu
        // $('#save-form-btn').removeAttr('disabled')
        // $('#save-form-btn').html('Lưu')

        // // Set giá trị mặc định cho các trường input
        // $('#tenVatTuInput').val(data_VT.tenVatTu)
        // $('#moTaTextarea').val(data_VT.moTaVatTu)
        // $(`#danhMucSelector option`).removeAttr("selected");
        // $(`#danhMucSelector option[value="${data_VT.danhMucId}"]`).attr("selected", true);
        // $('#soLuongInput').val(data_VT.soLuongTonKho)
        // $('#thuongHieuInput').val(data_VT.thuongHieu)
        // $('#mauSacInput').val(data_VT.mauSac)
        // $('#selectedImage').attr('src', `${data_VT.anhVatTu}`)

        // // Nhấn nút Xóa ảnh
        // $('#reset_img_btn').on('click', function () {
        //     $('#selectedImage').attr('src', `../../scr/images/khong_co_anh.png`)
        //     // var filename = $('#uploadImg[type=file]').val().split('\\').pop();
        //     // console.log(filename == '')
        // })

        // $('#uploadImg').on('change', function () {
        //     var filename = $('#uploadImg[type=file]').val().split('\\').pop()
        //     if (filename)
        //         $('#selectedImage').attr('src', `../../scr/images/${filename}`)

        // })
        // // Khi nhấn nút Lưu
        // $('#save-form-btn').on('click', function () {
        //     $('#save-form-btn').attr('disabled', 'disabled')
        //     $('#save-form-btn').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>')

        //     // Dùng ajax gọi API
        //     $.ajax({
        //         url: `http://localhost:3000/vatTus/${data_VT.id}`,
        //         type: 'PUT',
        //         data: {
        //             tenVatTu: $('#tenVatTuInput').val(),
        //             moTaVatTu: $('#moTaTextarea').val(),
        //             danhMucId: $(`#danhMucSelector`).val(),
        //             soLuongTonKho: $('#soLuongInput').val(),
        //             thuongHieu: $('#thuongHieuInput').val(),
        //             mauSac: $('#mauSacInput').val(),
        //             anhVatTu: $('#selectedImage').attr('src')
        //         }
        //     })
        //         .done(function (ketqua) {
        //             console.log(ketqua)
        //         })
        //         .fail(function () {
        //             console.log('failed')
        //             $('#save-form-btn').removeAttr('disabled')
        //             $('#save-form-btn').html('Lưu')
        //         })
        //         .always(function () {
        //             vatTusTable.ajax.reload(null, false);
        //         })
        // })

        // Dùng ajax gọi API
        $.ajax({
          url: `http://localhost:3000/lichSuYeuCaus/${data_VT.id}`,
          type: "PATCH",
          data: {
            trangThai: "Đã duyệt",
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

        break;

      case "btn btn-outline-danger btn-delete":
        $.ajax({
          url: `http://localhost:3000/lichSuYeuCaus/${data_VT.id}`,
          type: "PATCH",
          data: {
            trangThai: "Đã từ chối",
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
        break;
    }
  });


//xuat excel
$('#btnExportExcelChoDuyet').on('click',function(){
  //lay toan bo du lieu hien tai cua databale
  var data = vatTusTable.rows().data().toArray();

  //chuyen du lieu thanh array 2 chieu de xuat excel
  var exportData= [
      ["Tiêu đề","Người thực hiện","Nội dung","Thời gian","Trạng thái"]// tiêu đề cột
  ];

  data.forEach(function(row){
      exportData.push([
          row.tieuDe,
          row.nhanSu.tenNhanSu,
          row.chiTiet,
          new Date(parseInt(row.thoiGianThucHien)).toLocaleString(),
          row.trangThai
      ]);
  });

  // tao workbook
  var worksheet = XLSX.utils.aoa_to_sheet(exportData);
  var workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "YeuCauChoDuyet");

  //xuat file
  XLSX.writeFile(workbook, "YeuCauChoDuyet.xlsx");
});
});
