$(document).ready(function () {
  $("#loginBTN").on("click", function () {
    $("#failedLogin").attr("class", "alert alert-danger mt-4 d-none");
    $("#tenDangNhap").attr("class", "form-control");
    $("#tenDangNhap").val("");
    $("#matKhau").attr("class", "form-control");
    $("#matKhau").val("");
  });

  $("#tenDangNhap").on("keyup", function () {
    if ($(this).val().length === 0) {
      $(this).attr("class", "form-control is-invalid");
    } else {
      $(this).attr("class", "form-control");
    }
  });

  $("#matKhau").on("keyup", function () {
    if ($(this).val().length === 0) {
      $(this).attr("class", "form-control is-invalid");
    } else {
      $(this).attr("class", "form-control");
    }
  });

  $("#login-btn").on("click", function () {
    if ($("#tenDangNhap").val().length === 0) {
      $("#tenDangNhap").attr("class", "form-control is-invalid");
      return;
    }

    if ($("#matKhau").val().length === 0) {
      $("#matKhau").attr("class", "form-control is-invalid");
      return;
    }

    const username = $("#tenDangNhap").val();
    const matKhau = $("#matKhau").val();

    // Dùng ajax gọi API login
    $.ajax({
      url: `http://localhost:3000/nhanSus?tenTaiKhoan=${username}&matKhau=${matKhau}`,
      type: "GET",
    })
      .done(function (ketqua) {
        const taiKhoan = ketqua[0];
        if (taiKhoan !== undefined) {
          console.log(taiKhoan);
          if (taiKhoan.role === "admin") {
            localStorage.setItem("username", taiKhoan.tenNhanSu);
            localStorage.setItem("nhanSuId", taiKhoan.id);
            localStorage.removeItem("usernameUser", taiKhoan.tenNhanSu);
            localStorage.removeItem("nhanSuIdUser", taiKhoan.id);
            localStorage.removeItem("phongBan", taiKhoan.phongBanId);
            window.location.replace("./index.html");
          } else {
            localStorage.setItem("usernameUser", taiKhoan.tenNhanSu);
            localStorage.setItem("phongBan", taiKhoan.phongBanId);
            localStorage.setItem("nhanSuIdUser", taiKhoan.id);
            localStorage.removeItem("username");
            localStorage.removeItem("nhanSuId", taiKhoan.id);
            window.location.replace("./userIndex.html");
          }
        } else {
          $("#failedLogin").attr("class", "alert alert-danger mt-4");
          console.log("failed");
        }
      })
      .fail(function () {
        console.log("failed");
      });
  });
});
