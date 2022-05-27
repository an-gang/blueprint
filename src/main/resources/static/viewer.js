$(document).ready(function () {
    var name = window.location.href.substring(window.location.href.lastIndexOf("?name=") + 6);
    name = "B360M-BASALT_1.04";//TODO
    $.post("http://localhost:8080/getFrontByName", {name: name}, function (data) {
        var zip = new JSZip();
        zip.loadAsync(data, {base64: true}).then(function (unZipObject) {
            unZipObject.file("front").async("string").then(function (content) {
                var blueprintDiv = $("#blueprint");
                //加载正面
                blueprintDiv.append(content);
                var svgElement = blueprintDiv.find("svg").eq(0);
                //初始化参数
                var scale = 1;
                var x = 0;
                var y = 0;
                //鼠标位置缩放
                svgElement.mousewheel(function (event, delta) {
                    // 鼠标位置图片坐标 = 鼠标位置屏幕坐标 - 图片偏移
                    var pictureX = event.pageX - svgElement.offset().left;
                    console.log("原始屏坐=" + event.pageX)
                    console.log("原始图坐=" + pictureX)
                    var pictureY = event.pageY - svgElement.offset().top;
                    // 图片坐标相对于图片比率 = 图片坐标 * 当前宽高
                    var ratioX = pictureX / ($(window).width() * scale);
                    console.log("ratio=" + ratioX)
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
                    console.log("新图坐=" + pictureX);
                    // 新屏幕坐标 = 新图片坐标 + 新偏移
                    console.log("图片偏移=" + svgElement.offset().left);
                    var scaledScreenX = pictureX + svgElement.offset().left;
                    var scaledScreenY = pictureY + svgElement.offset().top;
                    console.log("新屏坐=" + scaledScreenX)
                    // 图片修正 = 当前目标点位置 - 新目标点位置 ---- 先变translate再变scale
                    // 或者
                    // 图片修正 = (当前目标点位置 - 新目标点位置)/scale ---- 先变scale再变translate
                    // translate的值会自动乘以scale所以要提前除一下来抵消，或者选择先变translate再变scale
                    x = event.pageX - scaledScreenX;
                    y = event.pageY - scaledScreenY;
                    console.log("scale(" + scale + ") translate(" + x + "," + y + ") rotate(0)");
                    svgElement.attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ") rotate(0)");
                })
                //拖拽
                svgElement.mousedown(function (event) {

                })



                // $("svg").mousedown(function(e){
                //     deltax = (event.clientX - $(this).offset().left - (this.getBoundingClientRect().width - width)/2)
                //     deltay = (event.clientY - $(this).offset().top - (this.getBoundingClientRect().height - height)/2)
                //
                //     $(document).bind('mousemove',start)
                //     $(document).bind('mouseup',end)
                //     return false
                // });
                //
                // //开始拖动
                // function start(event){
                //     x = (event.clientX - deltax) / scale
                //     y = (event.clientY - deltay) / scale
                //
                //     document.getElementsByTagName("svg")[0].setAttribute('transform', `scale(${scale}) translate(${x}, ${y}) rotate(${rotate})`);
                //     return false
                // }
                // //结束拖动
                // function end(event){
                //     $(this).unbind('mousemove')
                //     $(this).unbind('mouseup')
                // }

            });
        });
    });

});