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
    //初始化参数
    var scale = 1;
    var x = 0;
    var y = 0;
    var displaying = "front";
    var net = "";
    var refdes = "";
    var number = "";
    var rotate = 0;
    var isTextShowed = false;

    //不需要有svg就能激活的基本功能，仅在页面初始化时执行一次
    function activeFunctions() {
        var blueprintDiv = $("#blueprint");
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
                if (scale !== 1) {
                    scale--;
                }
            }
            svgElement.attr("transform", "scale(" + scale + ") translate(0,0) rotate(" + rotate + ")");
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
            svgElement.attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ") rotate(" + rotate + ")");
            if (isTextShowed) {
                showText();
            }
        });
        //拖拽
        blueprintDiv.mousedown(function (event) {
            var lastPageX = event.pageX;
            var lastPageY = event.pageY;
            blueprintDiv.bind("mouseup", function () {
                $(this).unbind('mousemove');
                $(this).unbind('mouseup');
                if (isTextShowed) {
                    showText();
                }
            });
            blueprintDiv.bind("mousemove", function (event) {
                x += event.pageX - lastPageX;
                y += event.pageY - lastPageY;
                blueprintDiv.find("svg").eq(0).attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ") rotate(" + rotate + ")");
                lastPageX = event.pageX;
                lastPageY = event.pageY;
            });
        });
        //切换正反面
        $("#switch").click(function () {
            if (displaying === "front") {
                if (svgSourceBack !== undefined) {
                    //初始化参数
                    scale = 1;
                    x = 0;
                    y = 0;
                    rotate = 0;
                    displaying = "back";

                    $("#searchText").val("");
                    blueprintDiv.html(svgSourceBack);
                    activeExtraFunctions();
                    if (net !== "") {
                        highlightConnection(net, refdes, number);
                    }
                } else {
                    $("#cover").show();
                    var id = setInterval(function () {
                        if (svgSourceBack !== undefined) {
                            clearInterval(id);
                            //初始化参数
                            scale = 1;
                            x = 0;
                            y = 0;
                            rotate = 0;
                            displaying = "back";

                            $("#searchText").val("");
                            blueprintDiv.html(svgSourceBack);
                            activeExtraFunctions();
                            if (net !== "") {
                                highlightConnection(net, refdes, number);
                            }
                            $("#cover").hide();
                        }
                    }, 50);
                }
            } else {
                //初始化参数
                scale = 1;
                x = 0;
                y = 0;
                rotate = 0;
                displaying = "front";

                $("#searchText").val("");
                blueprintDiv.html(svgSourceFront);
                activeExtraFunctions();
                if (net !== "") {
                    highlightConnection(net, refdes, number);
                }
            }
        });
        //禁用默认右键菜单
        document.oncontextmenu = function () {
            return false;
        };
        //双击清空颜色
        blueprintDiv.dblclick(function () {
            net = "";
            $("#searchText").val("");
            clearColor();
        });
        //旋转功能
        $("#rotateLeft").click(function () {
            rotate -= 90;
            blueprintDiv.children(":first").attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ") rotate(" + rotate + ")");
        });
        $("#rotateRight").click(function () {
            rotate += 90;
            blueprintDiv.children(":first").attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ") rotate(" + rotate + ")");
        });
        //显示元器件名称
        $("#showText").click(function () {
            isTextShowed = !isTextShowed;
            if (isTextShowed) {
                showText();
                $("#showText").text("隐藏名称");
            } else {
                $("text").remove();
                $("#showText").text("显示名称（卡顿）");
            }
        });
        activeExtraFunctions();
    }

    //必须先有svg后才能激活的功能，该方法每次切换正反面后都要再次调用
    function activeExtraFunctions() {
        bindCircleFunctions();
        //搜索功能
        $("#searchSignalOn").click(function () {
            if ($("#searchSignalOn").prop("checked")) {
                $("#search").val("搜索信号");
            } else {
                $("#search").val("搜索元件");
            }
        });
        var componentList = [];
        $("polygon").each(function () {
            componentList.push($(this).attr("refdes"));
        });
        $("#search").click(function () {
            clearColor();
            var svgElement = $("#blueprint").children(":first");
            var searchText = $("#searchText").val();
            if ($("#searchSignalOn").prop("checked")) {
                $("circle[net*='" + searchText + "'i]").css("fill", '#66FF00');
            } else {
                for (var i = 0; i < componentList.length; i++) {
                    if (componentList[i].toUpperCase() === searchText.toUpperCase()) {
                        svgElement.attr("transform", "scale(1) translate(0,0) rotate(" + rotate + ")");
                        var $component = $("polygon[refdes='" + componentList[i] + "']");
                        var originalOffset = $component.offset();
                        x = ($(window).width() / 2 - originalOffset.left) * scale;
                        y = ($(window).height() / 2 - originalOffset.top) * scale;
                        svgElement.attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ") rotate(" + rotate + ")");
                        $component.css("fill", '#cd3811');
                        break;
                    }
                }
            }
        });
        $('#searchText').bind('keypress', function (event) {
            if (event.keyCode === 13) {
                $("#search").click();
            }
        });
    }

    function clearColor() {
        //清空选择点
        $("circle").css("fill", "");
        //清空选择框
        $("polygon").css("fill", '').css("stroke", "");
    }

    function bindCircleFunctions() {
        //鼠标悬浮显示点位信息
        var circleElements = $("circle");
        circleElements.on("mouseover", function (e) {
            $("body").append("<div id='tip_div' style='color:rgb(255,255,0);font-size: 8px;font-weight: bold'>" +
                "脚位：" + $(this).attr("number") + "<br>" +
                $(this).attr('net') + "<br>" +
                "位置：" + $(this).parent().find("polygon").attr("refdes") + "</div>");
            $("#tip_div").css({
                "top": (e.pageY + 10) + "px",
                "position": "absolute",
                "left": (e.pageX + 20) + "px"
            }).show("fast")
        }).mouseout(function () {
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
                    "[Pin]: " + $(this).attr("number") + "\n" +
                    "[Net]: " + $(this).attr("net"))
            }
            //鼠标左键单击显示连接点
            if (e.which === 1) {
                clearColor();
                net = $(this).attr("net");
                refdes = $(this).attr("refdes");
                number = $(this).attr("number");
                highlightConnection(net, refdes, number);
            }
        });
    }

    function highlightConnection(net, refdes, number) {
        $("circle[net='" + net + "']").each(function () {
            $(this).css("fill", "rgb(255, 255, 0)");
            $(this).parent().find("polygon").css({"stroke": "rgb(255, 255, 0)"})
        });

        var selectedPolygon = $("polygon[refdes='" + refdes + "']");
        selectedPolygon.css("stroke", "red");
        selectedPolygon.parent().children("circle[number='" + number + "']").css("fill", "red");
    }

    function showText() {
        //显示元器件名称，并保存所有名称以供搜索
        $("text").remove();
        var blueprintDiv = $("#blueprint");
        var flip = blueprintDiv.children(":first").children(":first").attr("transform");
        flip = flip.substring(6, flip.length - 1).split(",");
        $("polygon").each(function () {
            if (isVisible($(this))) {
                var points = $(this).attr("points").split(" ");
                var topLeft = points[0].split(",");
                var bottomRight = points[2].split(",");
                var centerX = parseFloat(topLeft[0]) + (parseFloat(bottomRight[0]) - parseFloat(topLeft[0])) / 2;
                var centerY = parseFloat(topLeft[1]) + (parseFloat(bottomRight[1]) - parseFloat(topLeft[1])) / 2;
                var width = Math.abs(parseFloat(bottomRight[0]) - parseFloat(topLeft[0]));
                var height = Math.abs(parseFloat(bottomRight[1]) - parseFloat(topLeft[1]));
                var fontSize = 1;
                if (width > height) {
                    fontSize = height * 0.17;
                    if (fontSize < 10) {
                        fontSize *= 2.5;
                    } else if (fontSize < 25) {
                        fontSize *= 1.9;
                    } else if (fontSize < 10) {
                        fontSize *= 2.5;
                    } else if (fontSize < 5) {
                        fontSize *= 4;
                    }
                    if (fontSize * scale > 50) {
                        //修正镜面翻转
                        if (parseInt(flip[0]) > 0 && parseInt(flip[1]) > 0) {
                            $(this).before("<text x='" + centerX + "' y='" + centerY + "' style='font-size: " + fontSize + "px' class='horizontalText'>" + $(this).attr("refdes") + "</text>");
                        } else if (parseInt(flip[0]) < 0 && parseInt(flip[1]) > 0) {
                            $(this).before("<text x='" + centerX + "' y='" + centerY + "' style='font-size: " + fontSize + "px' class='horizontalTextRotateX'>" + $(this).attr("refdes") + "</text>");
                        } else if (parseInt(flip[0]) > 0 && parseInt(flip[1]) < 0) {
                            $(this).before("<text x='" + centerX + "' y='" + centerY + "' style='font-size: " + fontSize + "px' class='horizontalTextRotateY'>" + $(this).attr("refdes") + "</text>");
                        } else if (parseInt(flip[0]) < 0 && parseInt(flip[1]) < 0) {
                            $(this).before("<text x='" + centerX + "' y='" + centerY + "' style='font-size: " + fontSize + "px' class='horizontalTextRotateXY'>" + $(this).attr("refdes") + "</text>");
                        }
                    }
                } else {
                    fontSize = width * 0.17;
                    if (fontSize < 10) {
                        fontSize *= 2.5;
                    } else if (fontSize < 25) {
                        fontSize *= 1.9;
                    } else if (fontSize < 10) {
                        fontSize *= 2.5;
                    } else if (fontSize < 5) {
                        fontSize *= 4;
                    }
                    if (fontSize * scale > 50) {
                        //修正镜面翻转
                        if (parseInt(flip[0]) > 0 && parseInt(flip[1]) > 0) {
                            $(this).before("<text x='" + centerX + "' y='" + centerY + "' style='font-size: " + fontSize + "px' class='verticalTextr'>" + $(this).attr("refdes") + "</text>");
                        } else if (parseInt(flip[0]) < 0 && parseInt(flip[1]) > 0) {
                            $(this).before("<text x='" + centerX + "' y='" + centerY + "' style='font-size: " + fontSize + "px' class='verticalTextRotateX'>" + $(this).attr("refdes") + "</text>");
                        } else if (parseInt(flip[0]) > 0 && parseInt(flip[1]) < 0) {
                            $(this).before("<text x='" + centerX + "' y='" + centerY + "' style='font-size: " + fontSize + "px' class='verticalTextRotateY'>" + $(this).attr("refdes") + "</text>");
                        } else if (parseInt(flip[0]) < 0 && parseInt(flip[1]) < 0) {
                            $(this).before("<text x='" + centerX + "' y='" + centerY + "' style='font-size: " + fontSize + "px' class='verticalTextRotateXY'>" + $(this).attr("refdes") + "</text>");
                        }
                    }
                }
            }
        });
        blueprintDiv.html(blueprintDiv.html());//强制重新渲染，否则只append对svg标签无效，不会渲染
        //重新加载事件
        bindCircleFunctions();
    }

    function isVisible($element) {
        var offset = $element.offset();
        return offset.left >= -1 && offset.left < $(window).width() && offset.top >= -1 && offset.top < $(window).height();
    }

});