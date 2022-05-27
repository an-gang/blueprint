$(document).ready(function () {
    $.post("/getBlueprintList", {}, function (data) {
        if (data.status === "success") {
            var list = $("#listOfBlueprint");
            list.html("");
            for (var i = 0; i < data.data.length; i++) {
                list.append("<a href='/viewer.html?name="+data.data[i].name+"'>" + data.data[i].name + "</a><br><br>")
            }
        } else {
            alert("服务器异常");
        }
    })

});