/*!
 * ======================================================
 * FeedBack Template For MUI (http://dev.dcloud.net.cn/mui)
 * =======================================================
 * @version:1.0.0
 * @author:cuihongbao@dcloud.io
 */
(function () {
    var index = 1;
    var size = null;
    var imageIndexIdNum = 0;
    var starIndex = 0;
    var feedback = {
        question: document.getElementById('question'),
        contact: document.getElementById('contact'),
        imageList: document.getElementById('image-list'),
        submitBtn: document.getElementById('submit')
    };
    var url = "http://westudy.chinaxueyun.com/app/index.php?i=5&c=entry&op=feedback&do=self&m=chessroom";
    feedback.files = [];
    feedback.uploader = null;
    feedback.deviceInfo = null;
    mui.plusReady(function () {
        //设备信息，无需修改
        feedback.deviceInfo = {
            appid: plus.runtime.appid,
            imei: plus.device.imei, //设备标识
            images: feedback.files, //图片文件
            p: mui.os.android ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
            md: plus.device.model, //设备型号
            app_version: plus.runtime.version,
            plus_version: plus.runtime.innerVersion, //基座版本号
            os: mui.os.version,
            net: '' + plus.networkinfo.getCurrentType()
        }
    });
    /**
     *提交成功之后，恢复表单项
     */
    feedback.clearForm = function () {
        feedback.question.value = '';
        feedback.contact.value = '';
        feedback.imageList.innerHTML = '';
        //feedback.newPlaceholder();
        feedback.files = [];
        index = 0;
        size = 0;
        imageIndexIdNum = 0;
        starIndex = 0;
        //清除所有星标
        mui('.icons i').each(function (index, element) {
            if (element.classList.contains('mui-icon-star-filled')) {
                element.classList.add('mui-icon-star')
                element.classList.remove('mui-icon-star-filled')
            }
        })
    };
    /*	feedback.getFileInputArray = function() {
     return [].slice.call(feedback.imageList.querySelectorAll('.file'));
     };
     feedback.addFile = function(path) {
     feedback.files.push({name:"images"+index,path:path});
     index++;
     };*/
    /**
     * 初始化图片域占位
     */
    /*feedback.newPlaceholder = function() {
     var fileInputArray = feedback.getFileInputArray();
     if (fileInputArray &&
     fileInputArray.length > 0 &&
     fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
     return;
     };
     imageIndexIdNum++;
     var placeholder = document.createElement('div');
     placeholder.setAttribute('class', 'image-item space');
     //删除图片
     var closeButton = document.createElement('div');
     closeButton.setAttribute('class', 'image-close');
     closeButton.innerHTML = 'X';
     //小X的点击事件
     closeButton.addEventListener('tap', function(event) {
     setTimeout(function() {
     feedback.imageList.removeChild(placeholder);
     }, 0);
     return false;
     }, false);

     //
     var fileInput = document.createElement('div');
     fileInput.setAttribute('class', 'file');
     fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
     fileInput.addEventListener('tap', function(event) {
     var self = this;
     var index = (this.id).substr(-1);

     plus.gallery.pick(function(e) {
     //				console.log("event:"+e);
     var name = e.substr(e.lastIndexOf('/') + 1);
     console.log("name:"+name);

     plus.zip.compressImage({
     src: e,
     dst: '_doc/' + name,
     overwrite: true,
     quality: 50
     }, function(zip) {
     size += zip.size
     console.log("filesize:"+zip.size+",totalsize:"+size);
     if (size > (10*1024*1024)) {
     return mui.toast('文件超大,请重新选择~');
     }
     if (!self.parentNode.classList.contains('space')) { //已有图片
     feedback.files.splice(index-1,1,{name:"images"+index,path:e});
     } else { //加号
     placeholder.classList.remove('space');
     feedback.addFile(zip.target);
     feedback.newPlaceholder();
     }
     placeholder.style.backgroundImage = 'url(' + zip.target + ')';
     }, function(zipe) {
     mui.toast('压缩失败！')
     });



     }, function(e) {
     mui.toast(e.message);
     },{});
     }, false);
     placeholder.appendChild(closeButton);
     placeholder.appendChild(fileInput);
     feedback.imageList.appendChild(placeholder);
     };
     feedback.newPlaceholder();*/
    feedback.submitBtn.addEventListener('tap', function (event) {
        if (feedback.question.value == '' ||
            (feedback.contact.value != '' &&
            feedback.contact.value.search(/^(\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)|([1-9]\d{4,9})$/) != 0)) {
            return mui.toast('信息填写不符合规范');
        }
        if (feedback.question.value.length > 200 || feedback.contact.value.length > 200) {
            return mui.toast('信息超长,请重新填写~');
        }
        var photo = getImagesRes('photo[]');
        mui.post(url, {
            description: feedback.question.value,
            photo: photo,
            contact: feedback.contact.value,
            score: '' + starIndex
        }, function (data) {

            //console.log(data);
            if (data === 'success') {
                mui.alert("感谢反馈，点击确定关闭", "问题反馈", "确定", function () {
                    feedback.clearForm();
                    mui.back();
                });
            }
        }, 'json');
    })

    /*feedback.submitBtn.addEventListener('tap', function(event) {
     if (feedback.question.value == '' ||
     (feedback.contact.value != '' &&
     feedback.contact.value.search(/^(\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)|([1-9]\d{4,9})$/) != 0)) {
     return mui.toast('信息填写不符合规范');
     }
     if (feedback.question.value.length > 200 || feedback.contact.value.length > 200) {
     return mui.toast('信息超长,请重新填写~')
     }
     //判断网络连接
     /!*if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
     return mui.toast("连接网络失败，请稍后再试");
     }*!/
     feedback.send(mui.extend({}, feedback.deviceInfo, {
     content: feedback.question.value,
     contact: feedback.contact.value,
     images: feedback.files,
     score:''+starIndex
     }))
     }, false)
     feedback.send = function(content) {
     feedback.uploader = plus.uploader.createUpload(url, {
     method: 'POST'
     }, function(upload, status) {
     //			plus.nativeUI.closeWaiting()
     console.log("upload cb:"+upload.responseText);
     console.log("upload status:"+status);
     if(status==200){
     var data = JSON.parse(upload.responseText);
     //上传成功，重置表单
     if (data.ret === 0 && data.desc === 'Success') {
     console.log("upload success");
     }
     }else{
     console.log("upload fail");
     }
     });
     //添加上传数据
     mui.each(content, function(index, element) {
     if (index !== 'images') {
     //				console.log("addData:"+index+","+element);
     feedback.uploader.addData(index, element)
     }
     });
     //添加上传文件
     mui.each(feedback.files, function(index, element) {
     var f = feedback.files[index];
     //			console.log("addFile:"+JSON.stringify(f));
     feedback.uploader.addFile(f.path, {
     key: f.name
     });
     });

     //开始上传任务
     feedback.uploader.start();
     mui.alert("感谢反馈，点击确定关闭","问题反馈","确定",function () {
     feedback.clearForm();
     mui.back();
     });
     };*/

    //应用评分
    mui('.icons').on('tap', 'i', function () {
        var index = parseInt(this.getAttribute("data-index"));
        var parent = this.parentNode;
        var children = parent.children;
        if (this.classList.contains("mui-icon-star")) {
            for (var i = 0; i < index; i++) {
                children[i].classList.remove('mui-icon-star');
                children[i].classList.add('mui-icon-star-filled');
            }
        } else {
            for (var i = index; i < 5; i++) {
                children[i].classList.add('mui-icon-star')
                children[i].classList.remove('mui-icon-star-filled')
            }
        }
        starIndex = index;
    });
    //选择快捷输入
    mui('#popover').on('tap', 'li', function (e) {
        document.getElementById("question").value = document.getElementById("question").value + this.children[0].innerHTML;
        mui('#popover').popover('toggle')
    })

    //获取上传图片列表的值
    function getImagesRes(name) {
        var rdsObj = document.getElementsByName(name);
        var checkVal = new Array();
        var k = 0;
        for (i = 0; i < rdsObj.length; i++) {
            checkVal[k] = rdsObj[i].value;
            k++;
        }
        return checkVal;
    }

    //Webuploader上传示例

// 文件上传

// 图片上传demo
   /* jQuery(function () {
        var $ = jQuery,
            $list = $('#fileList'),
        // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,

        // 缩略图大小
            thumbnailWidth = 100 * ratio,
            thumbnailHeight = 100 * ratio,

        // Web Uploader实例
            uploader;

        // 初始化Web Uploader
        uploader = WebUploader.create({

            // 自动上传。
            auto: true,

            // swf文件路径
            swf: '{MODULE_URL}template/mobile/js/Uploader.swf',

            // 文件接收服务端。
            server: 'http://webuploader.duapp.com/server/fileupload.php',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#filePicker',

            // 只允许选择文件，可选。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/!*'
            }
        });

        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                    '<img>' +
                    '<div class="info">' + file.name + '</div>' +
                    '</div>'
                ),
                $img = $li.find('img');

            $list.append($li);

            // 创建缩略图
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr('src', src);
            }, thumbnailWidth, thumbnailHeight);
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                    .appendTo($li)
                    .find('span');
            }

            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file) {
            $('#' + file.id).addClass('upload-state-done');
        });

        // 文件上传失败，现实上传出错。
        uploader.on('uploadError', function (file) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
        });
    });*/
})();