$(document).ready(function () {
    $("#confirm").click(function () {
        var sourceInputted = $("#source")[0];
        if (sourceInputted.files.length === 0) {
            alert("请选择html图纸文件！");
            return;
        }
        var sourceFile = sourceInputted.files[0];
        var fileReader = new FileReader();
        fileReader.readAsText(sourceFile);
        fileReader.onload = function () {
            var rawHtml = this.result;
            $("#output").val(rawHtml.substring(rawHtml.indexOf("<div id=\"main\">") + 15, rawHtml.length - 20));//有些图纸还带着 d="main"> 因为长度不一样
        }
    });
    // $("#selectAll").click(function () {
    //     var output = $("#output");
    //     if (output.val() === "") {
    //         alert("无内容！");
    //         return;
    //     }
    //     output.select();
    // });
    $("#copy").click(function () {
        var output = $("#output");
        if (output.val() === "") {
            alert("无内容！");
            return;
        }
        output.select();
        document.execCommand("copy");
        alert("已复制到剪切板");
    });
});