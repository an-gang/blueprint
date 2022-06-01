$(document).ready(function () {
    $.post("/getBlueprintList", {}, function (data) {
        if (data.status === "success") {
            var list = $("#listOfBlueprint");
            list.html("");
            for (var i = 0; i < data.data.length; i++) {
                list.append("<a href='/viewer.html?name="+data.data[i].name+"'>" + data.data[i].name + "</a><br><br>")
            }
            $.post("/getCurrentUser",{},function (data) {
                if(data!=="unLogged"){
                    $("#login").text("当前用户："+data);
                    $("#login").bind("click",function () {
                        return false;
                    })
                }
            });
        } else {
            alert("服务器异常");
        }
    });

});