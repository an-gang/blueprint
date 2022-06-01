$(document).ready(function () {
    $("#login").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        $.post("/login",{username:username,password:password},function (data) {
            if (data.status==="success") {
                window.location.href = "index.html";
            } else {
                alert(data.message);
            }
        })
    });
});