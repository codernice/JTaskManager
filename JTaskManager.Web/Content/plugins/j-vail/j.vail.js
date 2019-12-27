function vail() {
    var isVail = false;
    $(".vail input").each(function () {
        var vail = $(this).attr("vail");
        if (vail == "require") {
            if ($(this).val() == "") {
                $(this).addClass("border-color-red");
                isVail = true;
            }
            else {
                $(this).removeClass("border-color-red");
            }
        }
    });
    $(".vail select").each(function () {
        var vail = $(this).attr("vail");
        if (vail == "require") {
            if ($(this).val() == "") {
                $(this).addClass("border-color-red");
                isVail = true;
            }
            else {
                $(this).removeClass("border-color-red");
            }
        }
    });
    if (isVail) {
        return false;
    }
    return true;
}