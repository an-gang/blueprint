$(document).ready(function () {
    $("#upload").click(function () {
        $("#main").attr("src","upload.html");
    });

    $("#converter").click(function () {
        $("#main").attr("src","converter.html");
    });

    $("#userManagement").click(function () {
        $("#main").attr("src","userManagement.html");
    });

    $("#blueprintManagement").click(function () {
        $("#main").attr("src","blueprintManagement.html");
    });

});