$(document).ready(function () {
    // Thiết lập DataTable để tạo bảng Phòng ban
    var phongBansTable = $('#phongBansTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/phongBans',
            dataType: "json",
            dataSrc: '',
        },
        columns: [
            { data: 'tenPhongBan' },
            { data: 'chuyenNganh' },
            {
                data: 'vatTuChoMuon',
                render: function (data) {
                    return `<span style="font-weight: bolder; font-size: 15px; margin-right: 25px;">${data}</span>`
                }
            },
            {
                data: 'vatTuHienTai',
                render: function (data) {
                    return `<span style="font-weight: bolder; font-size: 15px; margin-right: 25px;">${data}</span>`
                }
            },
            // {
            //     data: 'id',
            //     orderable: false,
            //     render: function () {
            //         return `
            //             <div class="btn-group">
            //                 <button 
            //                     type="button" 
            //                     class="btn btn-outline-success btn-edit" 
            //                     data-bs-toggle="modal"
            //                     data-bs-target="#editPhongBanModal"
            //                 ><i class="fa-solid fa-check"></i></button>
            //                 <button 
            //                     type="button" 
            //                     class="btn btn-outline-danger btn-delete" 
            //                     data-bs-toggle="modal"
            //                     data-bs-target="#deletePhongBanModal"
            //                 ><i class="fa-solid fa-ban"></i></button>
            //             </div>`
            //     }
            // }
        ],
        retrieve: true,
        processing: true,
        language: {
            info: 'Trang _PAGE_/_PAGES_',
            search: 'Tìm kiếm:',
            lengthMenu: '_MENU_ phòng ban trong 1 trang',
            zeroRecords: 'Không có phòng ban nào',
            processing: 'Đang tải...',
            loadingRecords: 'Không có phòng ban nào'
        },
    });

    $('#phongBansTable tbody').on('click', 'button', function () {
        var data_PB = phongBansTable.row($(this).parents('tr')).data();
        // Lấy class để xem xem nút nào đã được bấm
        const buttonClass = $(this).attr('class');
        switch (buttonClass) {
            //  Trường hợp là nút Chỉnh sửa trong bảng
            case 'btn btn-outline-primary btn-edit':
                console.log(data_PB);

                // Làm mới trạng thái nút Lưu
                $('#save-form-btn').removeAttr('disabled')
                $('#save-form-btn').html('Lưu')

                // Set giá trị mặc định cho các trường input
                $('#tenPhongBanInput').val(data_PB.tenPhongBan)
                $('#chuyenNganhInput').val(data_PB.chuyenNganh)
                $('#vatTuChoMuonInput').val(data_PB.vatTuChoMuon)
                $('#vatTuHienTaiInput').val(data_PB.vatTuHienTai)

                // Khi nhấn nút Lưu
                $('#save-form-btn').on('click', function () {
                    $('#save-form-btn').attr('disabled', 'disabled')
                    $('#save-form-btn').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>')

                    // Dùng ajax gọi API
                    $.ajax({
                        url: `http://localhost:3000/phongBans/${data_PB.id}`,
                        type: 'PUT',
                        data: {
                            tenPhongBan: $('#tenPhongBanInput').val(),
                            chuyenNganh: $('#chuyenNganhInput').val(),
                            vatTuChoMuon: $(`#vatTuChoMuonInput`).val(),
                            vatTuHienTai: $('#vatTuHienTaiInput').val(),
                        }
                    })
                        .done(function (ketqua) {
                            console.log(ketqua)
                        })
                        .fail(function () {
                            console.log('failed')
                            $('#save-form-btn').removeAttr('disabled')
                            $('#save-form-btn').html('Lưu')
                        })
                        .always(function () {
                            phongBansTable.ajax.reload(null, false);
                        })
                })
                break

            case 'btn btn-outline-danger btn-delete':

                break
            default:
                break
        }
    });

    // ============================================================ //
    // NHẬP VẬT TƯ
    // ============================================================ //
    var nhapVatTuTable = $('#nhapVatTuTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/vatTus?_expand=danhMuc',
            dataType: "json",
            dataSrc: '',
        },
        columns: [
            {
                data: 'id',
                orderable: false,
                className: 'select-checkbox',
                render: function () {
                    return ''
                }
            },
            {
                data: 'tenVatTu',
                render: function (data) {
                    return `<span style="font-weight: bolder;">${data}</span>`
                }
            },
            {
                data: 'anhVatTu',
                orderable: false,
                render: function (data, type, row) {
                    return `<img src="${data}" alt="Ảnh của ${row.tenVatTu}" width="100px" />`;
                }
            },
            { data: 'danhMuc.tenDanhMuc' },
            { data: 'moTaVatTu' },
            {
                data: 'soLuongTonKho',
                render: function (data) {
                    return `<span style="margin-right: 20px; font-weight: bold; font-size: 15px;">${data}</span>`
                }
            },
            { data: 'thuongHieu' },
            { data: 'mauSac' },
        ],
        select: true,
        order: [[1, 'asc']],
        scrollCollapse: true,
        scrollX: true,
        // scrollY: 300,
        retrieve: true,
        processing: true,
        language: {
            info: 'Trang _PAGE_/_PAGES_',
            search: 'Tìm kiếm:',
            lengthMenu: '_MENU_ vật tư trong 1 trang',
            zeroRecords: 'Không có vật tư nào',
            processing: 'Đang tải...',
            loadingRecords: 'Không có vật tư nào'
        },
    });

    $('#btn-openNhapVTModal').on('click', function () {
        // Làm mới trạng thái nút Nhập
        $('#btn-chonVT').removeAttr('disabled')
        $('#btn-nhapVatTu').removeAttr('disabled')
        $('#btn-nhapVatTu').html('<i class="fa-solid fa-check-double me-2"></i>Nhập')
        $('#nguoiThucHienInput').attr('value', localStorage.getItem('usernameUser'))
        var data_PB = phongBansTable.row((idx, PB) => PB.id === parseInt(localStorage.getItem('phongBan'))).data()
        $('#phongBanYeuCauInput').attr('value', data_PB.tenPhongBan)
    })

    // $('#nhapVatTuModal').modal('show')
    $('#btn-chonXong').on('click', function () {
        // nhapVatTuTable.rows().deselect()
        // nhapVatTuTable.rows((idx, data) => data.id === 28).select()

        const selectedData = nhapVatTuTable.rows({ selected: true }).data()
        let table_html = ''
        for (let i = 0; i < selectedData.length; i++) {
            table_html += `
                <tr id="${selectedData[i].id}">
                    <td>${selectedData[i].tenVatTu}</td>
                    <td><img src="${selectedData[i].anhVatTu}" alt="Ảnh của ${selectedData[i].tenVatTu}" width="100px" /></td>
                    <td>SL : <input type="number" style="width: 100px; display: inline-block;" class="form-control" id="soluongNhap_VT${selectedData[i].id}" value="1" /></td>
                    <td><button type="button" class="btn btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button></td>
                </tr>`
        }
        $('#vatTuDaChonTable tbody').html(table_html)
    })

    // Nhấn nút xóa
    $('#vatTuDaChonTable tbody').on('click', 'button', function () {
        $(this).parents('tr').remove()

        // Check nếu xóa hết vật tư rồi thì Hiển thị CHƯA CÓ VẬT TƯ NÀO
        if (!$('#vatTuDaChonTable tbody tr').length) {
            const tbody_html = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        CHƯA CÓ VẬT TƯ NÀO
                    </td>
                </tr>`
            $('#vatTuDaChonTable tbody').html(tbody_html)
        }
    })

    $("#tieuDeNhapInput").on("keyup", function () {
        if ($(this).val().length === 0) {
            $(this).attr('class', 'form-control is-invalid')
        }
        else {
            $(this).attr('class', 'form-control')
        }
    });

    // Khi nhấn nút Nhập
    $('#btn-nhapVatTu').on('click', function () {
        const VT_count = $('#vatTuDaChonTable tbody tr button').length
        if (VT_count === 0) {
            return
        }
        if (!$('#tieuDeNhapInput').val()) {
            $('#tieuDeNhapInput').attr('class', 'form-control is-invalid')
            return
        }

        $('#btn-chonVT').attr('disabled', 'disabled')
        $('#btn-nhapVatTu').attr('disabled', 'disabled')
        $('#btn-nhapVatTu').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang nhập...</span>')

        const d = new Date()
        let lichSus_data = {
            nhanSuId: localStorage.getItem('nhanSuIdUser'),
            tieuDe: $('#tieuDeNhapInput').val(),
            thoiGianThucHien: d.getTime(),
            trangThai: 'Đang chờ',
        }
        let chiTiet = ''
        let sum_SL = 0
        for (let i = 1; i <= VT_count; i++) {
            const row = $(`#vatTuDaChonTable tbody tr:nth-child(${i})`)
            const VT_id = parseInt(row.attr('id'))
            const VT_SL = parseInt(row.find('input').val())
            const SL_cu = parseInt(nhapVatTuTable.row((idx, data) => data.id === VT_id).data().soLuongTonKho)
            const tenVT = nhapVatTuTable.row((idx, data) => data.id === VT_id).data().tenVatTu
            sum_SL += VT_SL
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
            chiTiet += `Yêu cầu ${tenVT} - SL: ${VT_SL}/_`
        }
        chiTiet += `Tổng số ${sum_SL} vật tư`

        lichSus_data.chiTiet = chiTiet
        console.log(lichSus_data)

        // Gọi Ajax để thêm lịch sử Nhập
        $.ajax({
            url: `http://localhost:3000/lichSuYeuCaus/`,
            type: 'POST',
            data: lichSus_data
        })
            .done(function (ketqua) {
                console.log(ketqua)
            })
            .fail(function () {
                console.log('failed')
                $('#btn-chonVT').removeAttr('disabled')
                $('#btn-nhapVatTu').removeAttr('disabled')
                $('#btn-nhapVatTu').html('<i class="fa-solid fa-check-double me-2"></i>Nhập')
            })
            .always(function () {
                vatTusTable.ajax.reload(null, false);
            })
    })
})
