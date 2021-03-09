/*!
 * Cropper v3.0.0
 */

layui.config({
	base: '/dsfa/res/libs/cropper/' //layui自定义layui组件目录
}).define(['jquery', 'layer', 'cropper'], function(exports) {
	var $ = layui.jquery,
		layer = layui.layer;


	var obj = {
		render: function(e) {
			var self = this,
				elem = e.evt ? e.evt.target : e.elem,
				saveW = e.saveW,
				saveH = e.saveH,
				mark = e.mark,
				area = e.area,
				url = e.url,
				done = e.done,
				id = e.id,
				imgurl = e.imgurl,
				filename = e.filename,
				aspectRatio = e.aspectRatio,
				autoCropArea = e.autoCropArea,
				imgtype = e.imgtype,
				content = $(".showImgEdit#imgEdit_" + id),
				$image = $(".showImgEdit#imgEdit_" + id + " .readyimg img"),
				preview = ".showImgEdit#imgEdit_" + id + " .img-preview",
				options = {
					preview: preview,
					viewMode: 1,
					aspectRatio: aspectRatio,
					autoCropArea: autoCropArea
				};

			if ($image.cropper) {
				var index = layer.open({
					title: "图片剪裁",
					type: 1,
					content: $(".showImgEdit#imgEdit_" + id),
					area: area,
					success: function() {
						if ($(".layui-layer-shade").attr("times") != index) {
							$(".layui-layer-shade").remove()
						}
						// $image.cropper('replace', imgurl)
						// $image.cropper('clear');
						// $image.cropper(options);
						$image.attr('src', imgurl).cropper(options);
					},
					cancel: function(index) {
						layer.close(index);
						if ($(".layui-layer-shade").attr("times") != index) {
							$(".layui-layer-shade").remove()
						}
						$(content).css("display", "none")
						$image.cropper('destroy');
					}
				});
			}
			$(".showImgEdit#imgEdit_" + id + " .layui-btn").on('click', function() {
				var event = $(this).attr("cropper-event");
				//监听确认保存图像
				if (event === 'confirmSave') {
					if ($image.hasClass('cropper-hidden')) {
						var data = $image.cropper("getCroppedCanvas", {
							maxWidth: 4096,
							maxHeight: 4096
						})
						var blob = processData(data.toDataURL(imgtype));
						var formData = new FormData();
						formData.append('file', blob, filename);
						$.ajax({
							method: "post",
							url: url, //用于文件上传的服务器端请求地址
							data: formData,
							async: false,
							processData: false,
							contentType: false,
							beforeSend: function(xhr) {
								var headerParam = dsf.getCookie("XSRF-TOKEN") || "";
								xhr.setRequestHeader("X-XSRF-TOKEN", headerParam);
							},
							success: function(result) {
								console.log('result', result)
								if (typeof result === 'string') {
									var result = JSON.parse(result)
								}
								if (result.success) {
									layer.closeAll();
									$(content).css("display", "none")
									return done(result.data);
								} else {
									dsf.layer.message("修改失败", false)
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								return false
							},
							complete: function() {
								$image.cropper('destroy');
							}
						});
					}

					//监听旋转
				} else if (event === 'rotate') {
					var option = $(this).attr('data-option');
					$image.cropper('rotate', option);
					//重设图片
				} else if (event === 'reset') {
					$image.cropper('reset');
				} else if (event === 'scaleBig') {
					$image.cropper('scale', 1);
				} else if (event === 'scaleSmall') {
					$image.cropper('scale', -1);
				} else if (event === 'zoomBig') {
					$image.cropper('zoom', 2);
				} else if (event === 'zoomSmall') {
					$image.cropper('zoom', -2);
				}
			});
		}

	};
	exports('croppers', obj);
});
/* 使用二进制方式处理dataUrl  --处理ie 无法兼容‘对象不支持“toBlob”属性或方法’*/
function processData(dataUrl) {
	var binaryString = window.atob(dataUrl.split(',')[1]);
	var arrayBuffer = new ArrayBuffer(binaryString.length);
	var intArray = new Uint8Array(arrayBuffer);
	for (var i = 0, j = binaryString.length; i < j; i++) {
		intArray[i] = binaryString.charCodeAt(i);
	}

	var data = [intArray],
		blob;

	try {
		blob = new Blob(data);
	} catch (e) {
		window.BlobBuilder = window.BlobBuilder ||
			window.WebKitBlobBuilder ||
			window.MozBlobBuilder ||
			window.MSBlobBuilder;
		if (e.name === 'TypeError' && window.BlobBuilder) {
			var builder = new BlobBuilder();
			builder.append(arrayBuffer);
			blob = builder.getBlob(imgType); // imgType为上传文件类型，即 file.type
		} else {
			console.log('版本过低，不支持上传图片');
		}
	}
	return blob;
}
