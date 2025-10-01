$(document).ready(function () {
  // Function to handle detail view for medical items
  function showVatTuDetail(
    tenVatTu,
    soLuong,
    danhMuc,
    moTa,
    thuongHieu,
    mauSac,
    anhVatTu
  ) {
    // Update modal content
    if (soLuong <= 0) {
      $("#vatTuHet").removeClass("d-none");
    } else {
      $("#vatTuHet").addClass("d-none");
    }

    $("#delete_tenVatTu").text(tenVatTu);
    $("#delete_soLuong").text("SL: " + soLuong);
    $("#delete_danhMuc").text(danhMuc);
    $("#delete_moTa").text(moTa);
    $("#delete_thuongHieu").text(thuongHieu);
    $("#delete_mauSac").text(mauSac);
    $("#delete_anhVatTu").attr("src", anhVatTu);
  }

  // Add click event listeners for all detail buttons
  // Bàn khám y tế
  $('.card:contains("Bàn khám y tế") .btn-outline-primary').on(
    "click",
    function () {
      showVatTuDetail(
        "Bàn khám y tế",
        0,
        "Vật tư không tiêu hao",
        "Dùng để khám bệnh nhân",
        "Paramount",
        "Xanh lá",
        "./scr/images/V28.jpg"
      );
    }
  );

  // Bình oxy
  $('.card:contains("Bình oxy") .btn-outline-primary').on("click", function () {
    showVatTuDetail(
      "Bình oxy",
      5,
      "Vật tư không tiêu hao",
      "Cung cấp oxy cho bệnh nhân",
      "Invacare",
      "Xanh dương",
      "./scr/images/V08.jpg"
    );
  });

  // Bông băng cuộn
  $('.card:contains("Bông băng cuộn") .btn-outline-primary').on(
    "click",
    function () {
      showVatTuDetail(
        "Bông băng cuộn",
        12,
        "Vật tư tiêu hao",
        "Dùng để băng bó vết thương lớn",
        "Covidien",
        "Trắng",
        "./scr/images/V44.jpg"
      );
    }
  );

  // Băng cá nhân
  $('.card:contains("Băng cá nhân") .btn-outline-primary').on(
    "click",
    function () {
      showVatTuDetail(
        "Băng cá nhân",
        21,
        "Vật tư tiêu hao",
        "Dùng để băng bó vết thương nhỏ",
        "3M",
        "Trắng",
        "./scr/images/V43.jfif"
      );
    }
  );

  // Handle modal closing
  $("#deleteVatTuModal").on("hidden.bs.modal", function () {
    // Reset modal content when it's closed
    $("#vatTuHet").addClass("d-none");
    $("#delete_tenVatTu").text("");
    $("#delete_soLuong").text("");
    $("#delete_danhMuc").text("");
    $("#delete_moTa").text("");
    $("#delete_thuongHieu").text("");
    $("#delete_mauSac").text("");
    $("#delete_anhVatTu").attr("src", "");
  });
});
