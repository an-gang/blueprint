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
            var rawStr = this.result;
            var svgStr = rawStr.substring(rawStr.indexOf("<div id=\"main\">") + 15, rawStr.length - 20);//有些图纸还带着 d="main"> 因为长度不一样
            var $temp = $("#temp");
            //借用隐藏的div去除无效元素（即不显示的元素）以降低文件大小
            $temp.html(svgStr);
            $("g").each(function () {
                if($(this).attr("style")==="display: none;"){
                    $(this).remove();
                }
            });
            $("#output").val($temp.html());
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