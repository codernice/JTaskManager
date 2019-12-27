function vail() {
    var isVail = false;
    $(".modal-body input").each(function () {
        var vail = $(this).attr("vail");
        if (vail == "require") {
            if ($(this).val() == "") {
                $(this).addClass("require");
                isVail = true;
            }
            else {
                $(this).removeClass("require");
            }
        }
    });
    if (isVail) {
        return false;
    }
    return true;
}