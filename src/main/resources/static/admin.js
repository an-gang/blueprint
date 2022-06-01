$(document).ready(function () {
    $("#upload").click(function () {
        $("#main").attr("src","upload.html");
        return false;
    });

    $("#converter").click(function () {
        $("#main").attr("src","converter.html");
        return false;
    });

    $("#userManagement").click(function () {
        $("#main").attr("src","userManagement.html");
        return false;
    });

    $("#blueprintManagement").click(function () {
        $("#main").attr("src","blueprintManagement.html");
        return false;
    });

});