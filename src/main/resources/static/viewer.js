$(document).ready(function () {
    var name = window.location.href.substring(window.location.href.lastIndexOf("?name=") + 6);
    document.title = name;
    var svgSourceFront;
    var svgSourceBack;
    $.post("/getFrontByName", {name: name}, function (data) {
        var zip = new JSZip();
        zip.loadAsync(data, {base64: true}).then(function (unZippedObject) {
            unZippedObject.file("front").async("string").then(function (svgSource) {
                //加载正面
                $("#blueprint").html(svgSource);
                activeFunctions();
                $("#cover").hide();
                svgSourceFront = svgSource;
                $.post("/getBackByName", {name: name}, function (data) {
                    var zip = new JSZip();
                    zip.loadAsync(data, {base64: true}).then(function (unZippedObject) {
                        unZippedObject.file("back").async("string").then(function (svgSource) {
                            svgSourceBack = svgSource;
                        });
                    });
                });
            });
        });
    });

    //不需要有svg就能激活的基本功能，仅在页面初始化时执行一次
    function activeFunctions() {
        var blueprintDiv = $("#blueprint");
        //初始化参数
        var scale = 1;
        var x = 0;
        var y = 0;
        var displaying = "front";
        //鼠标位置缩放
        blueprintDiv.mousewheel(function (event, delta) {
            var svgElement = blueprintDiv.find("svg").eq(0);
            // 鼠标位置图片坐标 = 鼠标位置屏幕坐标 - 图片偏移
            var pictureX = event.pageX - svgElement.offset().left;
            var pictureY = event.pageY - svgElement.offset().top;
            // 图片坐标相对于图片比率 = 图片坐标 * 当前宽高
            var ratioX = pictureX / ($(window).width() * scale);
            var ratioY = pictureY / ($(window).height() * scale);
            // 更新缩放比率-------
            if (delta > 0) {
                scale++;
            } else {
                // if (scale === 1) {
                //     scale = 1;
                //     // x = 0;
                //     // y = 0;
                //     svgElement.attr("transform", "scale(1) translate(0,0) rotate(0)");
                //     return;
                // } else {
                //     scale--;
                // }
                if (scale !== 1) {
                    scale--;
                }
            }
            svgElement.attr("transform", "scale(" + scale + ") translate(0,0) rotate(0)");
            // 新图片坐标 = 比率 * 新宽高
            pictureX = ratioX * ($(window).width() * scale);
            pictureY = ratioY * ($(window).height() * scale);
            // 新屏幕坐标 = 新图片坐标 + 新偏移
            var scaledScreenX = pictureX + svgElement.offset().left;
            var scaledScreenY = pictureY + svgElement.offset().top;
            // 图片修正 = 当前目标点位置 - 新目标点位置 ---- 先变translate再变scale
            // 或者
            // 图片修正 = (当前目标点位置 - 新目标点位置)/scale ---- 先变scale再变translate
            // translate的值会自动乘以scale所以要提前除一下来抵消，或者选择先变translate再变scale
            x = event.pageX - scaledScreenX;
            y = event.pageY - scaledScreenY;
            svgElement.attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ") rotate(0)");
        });
        //拖拽
        blueprintDiv.mousedown(function (event) {
            var lastPageX = event.pageX;
            var lastPageY = event.pageY;
            blueprintDiv.bind("mousemove", function (event) {
                x += event.pageX - lastPageX;
                y += event.pageY - lastPageY;
                blueprintDiv.find("svg").eq(0).attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ") rotate(0)");
                lastPageX = event.pageX;
                lastPageY = event.pageY;
            });
            blueprintDiv.bind("mouseup", function () {
                $(this).unbind('mousemove');
                $(this).unbind('mouseup');
            })
        });
        //切换正反面
        $("#switch").click(function () {
            if (displaying === "front") {
                if (svgSourceBack !== undefined) {
                    //初始化参数
                    scale = 1;
                    x = 0;
                    y = 0;
                    displaying = "back";

                    blueprintDiv.html(svgSourceBack);
                    activeExtraFunctions();
                } else {
                    $("#cover").show();
                    var id = setInterval(function () {
                        if (svgSourceBack !== undefined) {
                            clearInterval(id);
                            //初始化参数
                            scale = 1;
                            x = 0;
                            y = 0;
                            displaying = "back";

                            blueprintDiv.html(svgSourceBack);
                            activeExtraFunctions();
                            $("#cover").hide();
                        }
                    }, 50);
                }
            } else {
                //初始化参数
                scale = 1;
                x = 0;
                y = 0;
                displaying = "front";

                blueprintDiv.html(svgSourceFront);
                activeExtraFunctions();
            }
        });
        //禁用默认右键菜单
        document.oncontextmenu = function () {
            return false;
        };
        //双击清空颜色
        blueprintDiv.dblclick(function () {
            clearColor();
        });
        //搜索功能
        $("#search").click(function () {
            $("circle").css("fill", '');
            $("polygon").css("fill", '');
            var searchText = $("#searchText").val();
            var fuzzySearch = document.getElementById("fuzzySearch").checked;
            if (searchText != '') {
                if (fuzzySearch) {
                    $("circle[net*='" + searchText + "'i]").css("fill", '#66FF00');
                    $("polygon[refdes*='" + searchText + "'i]").css("stroke", '#66FF00');
                } else {
                    $("circle[net='" + searchText + "'i]").css("fill", '#66FF00');
                    $("polygon[refdes='" + searchText + "'i]").css("stroke", '#66FF00');
                }
            }
        });
        $('#searchText').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#search").click();
            }
        });

        activeExtraFunctions();
    }

    //必须现有svg后才能激活的功能，该方法每次切换正反面后都要再次调用
    function activeExtraFunctions() {
        var circleElements = $("circle");
        //鼠标悬浮显示点位信息
        circleElements.on("mouseover", function (e) {
            $("body").append("<div id='tip_div' style='color:rgb(255,255,0);font-size: 8px;font-weight: bold'>" +
                "pin: " + $(this).attr("pin") + "<br>" +
                $(this).attr('net') + "<br>" +
                "refdes: " + $(this).parent().find("polygon").attr("refdes") + "</div>");
            $("#tip_div").css({
                "top": (e.pageY + 10) + "px",
                "position": "absolute",
                "left": (e.pageX + 20) + "px"
            }).show("fast")
        }).mouseout(function () {
            this.title = this.Mytitle;
            $("#tip_div").remove()
        }).mousemove(function (e) {
            $("#tip_div").css({"top": (e.pageY + 10) + "px", "position": "absolute", "left": (e.pageX + 20) + "px"})
        });
        //左键单击显示连接点和右键单击显示详细信息
        circleElements.mousedown(function (e) {
            //鼠标右键单击显示详细信息
            if (e.which === 3) {
                alert("[Ref]: " + $(this).parent().attr("id") + "\n" +
                    $(this).parent().attr("bom") + "\n" +
                    "[Pin]: " + $(this).attr("pin") + "\n" +
                    "[Net]: " + $(this).attr("net"))
            }
            //鼠标左键单击显示连接点
            if (e.which === 1) {
                clearColor();
                var net = $(this).attr("net");
                $("circle[net='" + net + "']").each(function () {
                    $(this).css("fill", "rgb(170, 170, 0)");
                    $(this).parent().children(":first").css({"stroke": "rgb(246, 246, 0)"})
                });

                $(this).css("fill", "red");
                $("polygon[refdes='" + $(this).attr("refdes") + "']").css("stroke", "red")
            }
        });
    }

    function clearColor() {
        //清空选择点
        $("circle").css("fill", "");
        //清空选择框
        $("polygon").css("stroke", "");
    }
});