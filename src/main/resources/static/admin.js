$(document).ready(function () {
    $("#confirm").click(function () {
        var inputName = $("#name");
        var inputFront = $("#front")[0];
        var inputBack = $("#back")[0];
        if (inputName.val() === "") {
            alert("请填写图纸名称！");
            return;
        }
        if (inputFront.files.length === 0) {
            alert("请选择正面图纸文件！");
            return;
        }
        if (inputBack.files.length === 0) {
            alert("请选择反面图纸文件！");
            return;
        }
        $("#cover").show();
        var fileReader = new FileReader();
        fileReader.readAsText(inputFront.files[0]);
        fileReader.onload = function () {
            var zip = new JSZip();
            zip.file("front", this.result);//正面字符串格式内容
            //压缩正面
            zip.generateAsync({
                type: "base64",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            }).then(function (zippedFront) {
                fileReader = new FileReader();
                fileReader.readAsText(inputBack.files[0]);
                fileReader.onload = function () {
                    var zip = new JSZip();
                    zip.file("back", this.result);//反面字符串格式内容
                    //压缩反面
                    zip.generateAsync({
                        type: "base64",
                        compression: "DEFLATE",
                        compressionOptions: {
                            level: 9
                        }
                    }).then(function (zippedBack) {
                        var data = {
                            name: inputName.val(),
                            front: zippedFront,
                            back: zippedBack
                        };
                        console.log(data);
                        $.post("/uploadBlueprint", data, function (data) {
                            alert(data);
                            $("#cover").hide();
                        })
                    });
                }
            });
        };
    });
});