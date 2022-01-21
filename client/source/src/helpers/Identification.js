var App_ = require('./App');
var Array_ = require('./Array');
var CryptoJS = require('crypto-js');

exports.is_canvas_supported = () => {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

exports.device_id = new Promise((resolve, reject) => {
	let identify = {
		platform : navigator.platform,
		canvas : CryptoJS.SHA1(get_canvas_fingerprint().toString()).toString(),
		webgl : CryptoJS.SHA1(get_webgl_fingerprint().toString()).toString()
	};

	resolve(CryptoJS.SHA1(JSON.stringify(identify)).toString());
});

exports.device_type = new Promise((resolve, reject) => {
	var is_mobile = () => {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	};

	if (is_mobile()) {
		const userAgent = navigator.userAgent.toLowerCase();
		const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
		if (isTablet) {
			resolve('tablet');
		} else {
			resolve('mobile');
		}
	} else {
		navigator.getBattery().then(function(battery) {
			if (battery.charging && battery.chargingTime === 0) {
				resolve('desktop');
			} else {
				resolve('laptop');
			}
		});
	}
});

exports.is_private_browser = new Promise(async function(resolve, reject) {
	var is_private = false;
	if ('storage' in navigator && 'estimate' in navigator.storage) {
		const {usage, quota} = await navigator.storage.estimate();
		if (quota < 120000000) {
			is_private = true;
		} else {
			is_private = false;
		}

		resolve(is_private);
	} else if (window.webkitRequestFileSystem) {
		window.webkitRequestFileSystem(window.TEMPORARY, 1,function() {
			is_private = false;
		},function(e) {
			is_private = true;
		});

		resolve(is_private);
	} else if (is_IE10_or_later(window.navigator.userAgent)) {
		is_private = false;
		try {
			if (!window.indexedDB) {
				is_private = true;
			}
		} catch (e) {
			is_private = true;
		}

		resolve(is_private);
	} else if (window.localStorage && /Safari/.test(window.navigator.userAgent)) {
		try {
			window.localStorage.setItem('test', 1);
		} catch (e) {
			is_private = true;
		}

		if (typeof is_private === 'undefined') {
			is_private = false;
			window.localStorage.removeItem('test');
		}

		resolve(is_private);
	} else if (window.webkitRequestFileSystem) {
		window.webkitRequestFileSystem(window.TEMPORARY, 1,function() {
			is_private = false;
		},function(e) {
			is_private = true;
		});

		resolve(is_private);
	} else {
		if (window.indexedDB && /Firefox/.test(window.navigator.userAgent)) {
			var db;
			try {
				db = window.indexedDB.open('test');
			} catch (e) {
				is_private = true;
			}

			if (typeof is_private === 'undefined') {
				retry_check_private_browser(
					function isDone() {
						return db.readyState === 'done' ? true : false;
					}, function next(is_timeout) {
						if (!is_timeout) {
							is_private = db.result ? false : true;
						}
					});
			}

			resolve(is_private);
		}
	}

	resolve(is_private);
});

function retry_check_private_browser(isDone, next) {
	var current_trial = 0,
	max_retry = 50,
	interval = 10,
	is_timeout = false;
	var id = window.setInterval(function() {
		if (isDone()) {
			window.clearInterval(id);
			next(is_timeout);
		}

		if (current_trial++ > max_retry) {
			window.clearInterval(id);
			is_timeout = true;
			next(is_timeout);
		}
	},10);
}

function get_webgl_canvas() {
	var canvas = document.createElement('canvas');
	var gl = null;

	try {
		gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	} catch (e) {

	}

	if (!gl) {
		gl = null;
	}

	return gl;
}

function get_canvas_fingerprint(fake_font_canvas = false) {
	if (exports.is_canvas_supported()) {
		var result = [];
		var canvas = document.createElement('canvas');

		canvas.width = 2000;
		canvas.height = 200;
		canvas.style.display = 'inline';

		var ctx = canvas.getContext('2d');
		ctx.rect(0, 0, 10, 10);
		ctx.rect(2, 2, 6, 6);

		result.push('canvas_winding:'+((ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no'));

		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = '#f60';
		ctx.fillRect(125, 1, 62, 20);
		ctx.fillStyle = '#069';
		if (fake_font_canvas === false) {
			ctx.font = '11pt Arial';
		} else {
			ctx.font = '11pt no-real-font-123';
		}

		ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15);
		ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
		ctx.font = '18pt Arial';
		ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45);
		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = 'rgb(255,0,255)';
		ctx.beginPath();
		ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'rgb(0,255,255)';
		ctx.beginPath();
		ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'rgb(255,255,0)';
		ctx.beginPath();
		ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'rgb(255,0,255)';
		ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
		ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
		ctx.fill('evenodd');

		if (canvas.toDataURL) {
			result.push('canvas_fp:'+canvas.toDataURL());
		}

		return result;
	}
}

function get_webgl_fingerprint() {
	var gl;
	var fa2s = function (fa) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		return '[' + fa[0] + ', ' + fa[1] + ']';
	}

	var maxAnisotropy = function (gl) {
		var ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
		if (ext) {
			var anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);

			if (anisotropy === 0) {
				anisotropy = 2
			}

			return anisotropy;
		} else {
			return null;
		}
	}

	gl = get_webgl_canvas();

	if (!gl) {
		return null;
	}

	var result = [];
	var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
	var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
	var vertexPosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);

	var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);

	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	vertexPosBuffer.itemSize = 3;
	vertexPosBuffer.numItems = 3;

	var program = gl.createProgram();
	var vshader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(vshader, vShaderTemplate)
	gl.compileShader(vshader)

	var fshader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(fshader, fShaderTemplate);
	gl.compileShader(fshader);
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	gl.linkProgram(program);
	gl.useProgram(program);
	program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
	program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
	gl.enableVertexAttribArray(program.vertexPosArray);
	gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
	gl.uniform2f(program.offsetUniform, 1, 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);

	try {
		result.push(gl.canvas.toDataURL());
	} catch (e) {
		/* .toDataURL may be absent or broken (blocked by extension) */
	}

	result.push('extensions:' + (gl.getSupportedExtensions() || []).join(';'));
	result.push('webgl aliased line width range:' + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
	result.push('webgl aliased point size range:' + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
	result.push('webgl alpha bits:' + gl.getParameter(gl.ALPHA_BITS));
	result.push('webgl antialiasing:' + (gl.getContextAttributes().antialias ? 'yes' : 'no'));
	result.push('webgl blue bits:' + gl.getParameter(gl.BLUE_BITS));
	result.push('webgl depth bits:' + gl.getParameter(gl.DEPTH_BITS));
	result.push('webgl green bits:' + gl.getParameter(gl.GREEN_BITS));
	result.push('webgl max anisotropy:' + maxAnisotropy(gl));
	result.push('webgl max combined texture image units:' + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
	result.push('webgl max cube map texture size:' + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
	result.push('webgl max fragment uniform vectors:' + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
	result.push('webgl max render buffer size:' + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
	result.push('webgl max texture image units:' + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
	result.push('webgl max texture size:' + gl.getParameter(gl.MAX_TEXTURE_SIZE));
	result.push('webgl max varying vectors:' + gl.getParameter(gl.MAX_VARYING_VECTORS));
	result.push('webgl max vertex attribs:' + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
	result.push('webgl max vertex texture image units:' + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
	result.push('webgl max vertex uniform vectors:' + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
	result.push('webgl max viewport dims:' + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
	result.push('webgl red bits:' + gl.getParameter(gl.RED_BITS));
	result.push('webgl renderer:' + gl.getParameter(gl.RENDERER));
	result.push('webgl shading language version:' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	result.push('webgl stencil bits:' + gl.getParameter(gl.STENCIL_BITS));
	result.push('webgl vendor:' + gl.getParameter(gl.VENDOR));
	result.push('webgl version:' + gl.getParameter(gl.VERSION));

	try {
		var extensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
		if (extensionDebugRendererInfo) {
			result.push('webgl unmasked vendor:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL));
			result.push('webgl unmasked renderer:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL));
		}
	} catch (e) {

	}

	if (!gl.getShaderPrecisionFormat) {
		return result;
	}

	Array_.foreach(['FLOAT', 'INT'], function (numType) {
		Array_.foreach(['VERTEX', 'FRAGMENT'], function (shader) {
			Array_.foreach(['HIGH', 'MEDIUM', 'LOW'], function (numSize) {
				Array_.foreach(['precision', 'rangeMin', 'rangeMax'], function (key) {
					var format = gl.getShaderPrecisionFormat(gl[shader + '_SHADER'], gl[numSize + '_' + numType])[key];

					if (key !== 'precision') {
						key = 'precision ' + key;
					}

					var line = ['webgl ', shader.toLowerCase(), ' shader ', numSize.toLowerCase(), ' ', numType.toLowerCase(), ' ', key, ':', format].join('');
					result.push(line);
				});
			});
		});
	});

	return result;
}
