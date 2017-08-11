<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>图片上传</title>
    <link rel="stylesheet" href="css/mobile-uploadImg.css">

    <script src="js/jquery-1.9.0.js"></script>
    <script src="js/mobile-uploadCompresserImg.js"></script>
    <script src="js/mobile-uploadImg.js"></script>

</head>
<body style="background: #f5f5f5;">
<div style="margin:20px 10px;">
    <form method="post" action="">
        <div id="uploadImgForm">
            <div class="mbupload_frame">
                <div class="mbupload_photoList">
                    <ul>
                        <li class="mbupload_on mbupload_addPic mbupload_addImg"></li>
                    </ul>
                    <p class="mbupload_textTip mbupload_f12">还可上传<span class="mbupload_onlyUploadNum"></span>张照片呦~</p>
                </div>
                <div class="mbupload_bgimg">
                    <div class="iconSendImg mbupload_addImg" style="background:url(images/upload_carbg.png) no-repeat 50% 50%;"></div>
                </div>
            </div>
        </div>

        <div style="margin-top:20px;">
            <div id="uploadImgForm2" class="uploadImgStyle2">
                <div class="mbupload_frame">
                    <div class="mbupload_photoList">
                        <ul>
                            <li class="mbupload_on mbupload_addPic mbupload_addImg"></li>
                        </ul>
                        <p class="mbupload_textTip mbupload_f12">还可上传<span class="mbupload_onlyUploadNum"></span>张照片呦~</p>
                    </div>
                    <div class="mbupload_bgimg">
                        <div class="iconSendImg mbupload_addImg" style="background:url(images/upload_licensebg.png) no-repeat 50% 50%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<script type="text/javascript">
    var objUploadImgForm = {};
	objUploadImgForm.uploadUrl = "<?php echo('http://'.$_SERVER['HTTP_HOST'].'/uploads.php') ?>";//上传图片的地址
    objUploadImgForm.formHtmlId = "#uploadImgForm";//上传图片的ID
	objUploadImgForm.maxUpload = 20;//上传图片的最大张数
	objUploadImgForm.uploadMaxW = 2000; //生成图片的最大宽度
	objUploadImgForm.uploadMaxH = 2000; //生成图片的最大高度
	objUploadImgForm.uploadQuality = 1; //目标jpg图片输出质量
	objUploadImgForm.uploadPicSize = 8;//上传限制图片大小(MB)  默认8M
	objUploadImgForm.uploadPicMore = true;//是否允许多图上传  默认单张上传
	objUploadImgForm.onceMaxUpload = 10;//多图上传时，一次上传的最大张数 默认10
	objUploadImgForm.uploadDefaultImgUrl = "images/defaultImg.png";//压缩图片时的默认图片地址
    mobileUploadImg(objUploadImgForm);
</script>

<script type="text/javascript">
    var objUploadImgForm2 = {};
    objUploadImgForm2.uploadUrl = "<?php echo('http://'.$_SERVER['HTTP_HOST'].'/uploads.php') ?>";//上传图片的地址
    objUploadImgForm2.formHtmlId = "#uploadImgForm2";//上传图片的ID
    objUploadImgForm2.maxUpload = 1;//上传图片的最大张数
    objUploadImgForm2.uploadMaxW = 800; //生成图片的最大宽度
    objUploadImgForm2.uploadMaxH = 800; //生成图片的最大高度
    objUploadImgForm2.uploadQuality = 1; //目标jpg图片输出质量
    objUploadImgForm2.uploadPicSize = 8;//上传限制图片大小(MB)  默认8M
    objUploadImgForm2.uploadPicMore = true;//是否允许多图上传  默认单张上传
    objUploadImgForm2.onceMaxUpload = 10;//多图上传时，一次上传的最大张数 默认10
    objUploadImgForm2.uploadDefaultImgUrl = "images/defaultImg.png";//压缩图片时的默认图片地址
    mobileUploadImg(objUploadImgForm2);
</script>
</body>
</html>