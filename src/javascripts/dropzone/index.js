import Dropzone from 'dropzone'
import EXIF from 'exif-js'

var detectVerticalSquash = function(img) {
	var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;

	iw = img.naturalWidth;
	ih = img.naturalHeight;
	canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = ih;
	ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	data = ctx.getImageData(0, 0, 1, ih).data;
	sy = 0;
	ey = ih;
	py = ih;

	while (py > sy) {
		alpha = data[(py - 1) * 4 + 3];

		if (alpha === 0) {
			ey = py;
		} else {
			sy = py;

		}
		py = (ey + sy) >> 1;
	}

	ratio = py / ih;

	if (ratio === 0) {
		return 1;
	} else {
		return ratio;
	}
};

var drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh, orientation, flip) {
	var vertSquashRatio = detectVerticalSquash(img);
	dh = dh / vertSquashRatio;
	ctx.translate(dx+dw/2, dy+dh/2);
	if (flip) ctx.scale(-1, 1);
	ctx.rotate(-orientation*Math.PI/180);
	dx = -dw/2;
	dy = -dh/2;

	return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};

Dropzone.autoDiscover = false
Dropzone.prototype.createThumbnailFromUrl = function(file, imageUrl, callback, crossOrigin) {
	var img = document.createElement("img");

	if (crossOrigin) {
		img.crossOrigin = crossOrigin;
	}

	img.onload = (function(_this) {
		return function() {
			var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3, orientation = 0, flip = false;

			EXIF.getData(img, function() {
				switch (parseInt(EXIF.getTag(this, "Orientation"))) {
					case 2: flip = true; break;
					case 3: orientation = 180; break;
					case 4: orientation = 180; flip = true; break;
					case 5: orientation = 270; flip = true; break;
					case 6: orientation = 270; break;
					case 7: orientation = 90; flip = true; break;
					case 8: orientation = 90; break;
				}
			});

			file.width = img.width;
			file.height = img.height;
			resizeInfo = _this.options.resize.call(_this, file);

			if (resizeInfo.trgWidth == null) {
				resizeInfo.trgWidth = resizeInfo.optWidth;
			}

			if (resizeInfo.trgHeight == null) {
				resizeInfo.trgHeight = resizeInfo.optHeight;
			}

			canvas = document.createElement("canvas");
			ctx = canvas.getContext("2d");
			canvas.width = resizeInfo.trgWidth;
			canvas.height = resizeInfo.trgHeight;

			drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight, orientation, flip);
			thumbnail = canvas.toDataURL("image/png");
			_this.emit("thumbnail", file, thumbnail);

			if (callback != null) {
				return callback();
			}
		};
	})(this);

	if (callback != null) {
		img.onerror = callback;
	}

	return img.src = imageUrl;
}

export default Dropzone
