/*========include:ntesquote-2.0.js========*/
// Author: Chunlai
// Create Time: 2011.2.22
// LastModify: 2011.7.18
// Last: 增加loadAll方式加载数据. 目前这个版本主要供财经频道使用

// 通用实时报价接口
var ntesQuote = {
	// 格式化字符串
	formatString : function(txt) {
	},
	// 按全角长度获取子串, widthString('UT中文', 2) = 'UT中';
	widthString : function(txt, count) {
	},
	// dom raedy函数
	ready : function(fn) {
	},
	// 导入js让其自动执行
	importJs : function(url, callback, callbackflag) {
	},
	// 简化getElementById
	get : function(elem) {
	},
	// 查找元素 options = {parent:"mytable", tag:"span", css:"", attr:"_quote_", attrValue:"price"};
	find : function(options) {
	},
	// 获取URL参数
	getParameter : function(name) {
	},
	// 去除字符串前后空格
	trim : function(txt) {
	},
	// 是否ie
	isIE : false,
	cssColor : function(val) {
	},
	// 定时器对象
	jcron : {},
	// 缓存cron配置key:value = type:cronObj
	cronCache : {},
	intervalCache : {},
	// 设置数据更新定时器
	setCrontab : function(type, cronText) {
	},

	// 属性
	quoteMark : "_ntesquote_",
	minorMark : "_minorquote_",
	cRed : "cRed",
	cGreen : "cGreen",
	cBlack : "",
	address : "http://api.money.126.net/data/feed/",
	timer : null,
	timeout : 10000,
	inited : false,
	refreshed : false,

	//私有属性和方法
	// 载入次数
	_loadCount : 0,
	_codes : null,
	// 页面代码集合
	_codeMap : {},
	// 外部加载的数据集合
	_quoteMap : {},
	// 上一次加载的数据集合
	_preQuoteMap : {},
	// 页面的报价html集合
	_elemsMap : {},
	// 记录某种type类型的上次执行时间
	_typeTimeMap : {},
	_fillElems : function(parentElem) {
	},

	// 事件
	beforeDataParsing : function() {
	},
	afterDataParsing : function() {
	},
	beforePageRending : function() {
	},
	afterPageRending : function() {
	},
	// 事件集合
	beforePageRendingEvents : [],
	afterPageRendingEvents : [],
	// 将类css标记转换为meta object
	toMeta : function(s) {
	},
	// 呈现html元素及绑定的数据
	defaultFormat : function(code, meta, elem, quoteData) {
	},

	//处理函数
	_beforeHandler : {},
	// fun=function(code, meta, elem, quoteData)
	addBeforeHandler : function(key, fun) {
	},
	_formatHandler : {},
	// fun=function(code, meta, elem, quoteData)
	addFormatHandler : function(key, fun) {
	},
	_afterHandler : {},
	// fun=function(code, meta, elem, quoteData)
	addAfterHandler : function(key, fun) {
	},

	//获取页面中的Code集合
	getCodes : function() {
	},
	// 获取已加载报价的Code集合
	getQuoteCodes : function(type) {
	},
	// 枚举页面代码 fn:functon(code){}
	eachCode : function(fn) {
	},
	// 枚举报价数据 fn:function(code, quoteData){}
	eachQuote : function(fn) {
	},
	// 枚举html元素及绑定的数据 fn:function(code, meta, elem, quoteData){}
	eachElement : function(fn) {
	},

	getQuote : function(code) {
	},
	getPreQuote : function(code) {
	},

	remove : function(codes) {
	},

	// 数据加载
	init : function(options) {
	},
	receiveQuote : function(quoteList) {
	},
	refresh : function(elem) {
	},
	// 载入codes的报价信息，如果codes为空，则载入当前页面全部代码
	loadOnce : function(codes) {
	},
	loadData : function() {
	},

	// 版本
	version : 1.0
};

// 上面为报价接口
//==============这是分界线1==============
// 下面为接口具体实现

(function(quote) {

	quote.formatString = function(str) {
		for (var i = 1; i < arguments.length; i++) {
			str = str.replace(new RegExp("\\{" + (i - 1) + "\\}", "gm"), arguments[i]);
		};
		return str;
	};

	quote.widthString = function(s, count) {
		if (!s)
			return s;
		var num = count * 2, index = 0, i = 0;
		for (; i < s.length; i++) {
			var step = (s.charCodeAt(i) > 0 && s.charCodeAt(i) < 255) ? 1 : 2;
			if (index + step > num) {
				break;
			}
			index += step;
		}
		return s.substr(0, i);
	};

	quote.ready = function(fn) {
		if (/(?!.*?compatible|.*?webkit)^mozilla|opera/i.test(navigator.userAgent)) {
			document.addEventListener("DOMContentLoaded", fn, false);
		} else {
			window.setTimeout(fn, 0);
		}
	};
	/**
	 * 导入js让其自动执行
	 *@param url 要导入的script地址
	 *@param callback (可选) 载入script完成后触发的回调
	 *@param callbackflag (可选) 设定callback的参数
	 */
	quote.importJs = function(url, charset, callback, callbackflag) {
		var head = document.getElementsByTagName("head")[0] || document.documentElement;
		var script = document.createElement("script");
		script.type = "text/javascript";
		if (charset) {
			script.setAttribute("charset", charset);
		}
		// 加载完成后删除
		var done = false;
		script.onload = script.onreadystatechange = function() {
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				//下载完成后触发回调函数
				if ( typeof (callback) == "function") {
					try {
						callback(callbackflag);
					} catch(e) {
						log(e);
					}
				}
				head.removeChild(this);
			}
		};
		script.src = url;
		//使用insertBefore而不是appendChild绕过IE的bug
		head.insertBefore(script, head.firstChild);
	};

	quote.get = function(elem) {
		return ( typeof (elem) == "string") ? document.getElementById(elem) : elem;
	};

	quote.find = function(options) {
		var css = options.css, attr = options.attr, val = options.attrValue, arr = [];
		var htmlcol = quote.get(options.parent).getElementsByTagName(options.tag || "*");
		var regexp = new RegExp("(^|\\s)" + css + "(\\s|$)");
		for (var i = 0; i < htmlcol.length; i++) {
			var obj = htmlcol[i];
			if (css && (obj.className != css && !obj.className.match(regexp)))
				continue;
			if (attr && !val && !obj.getAttribute(attr))
				continue;
			if (attr && val && obj.getAttribute(attr) != val)
				continue;
			arr.push(obj);
		}
		return arr;
	};

	quote.getParameter = function(name) {
		var rs = new RegExp("(^|)" + name + "=([^&]*)(&|$)", "gi").exec(location.href);
		return rs ? unescape(rs[2]) : null;
	};

	quote.trim = function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	};

	quote.isArray = function(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	};

	quote.isIE = (function() {
		var userAgent = navigator.userAgent.toLowerCase();
		return /msie/.test(userAgent) && !/opera/.test(userAgent)
	})();

	quote.cssColor = function(val) {
		return val > 0 ? quote.cRed : (val < 0 ? quote.cGreen : "");
	};

	quote.init = function(options) {
		//实时报价回调
		window._ntes_quote_callback = function(quoteList) {
			if (quote.beforeDataParsing) {
				quote.beforeDataParsing(quoteList);
			}
			// 处理数据
			quote.receiveQuote(quoteList);
			if (quote.afterDataParsing) {
				quote.afterDataParsing(quoteList);
			}
			if (quote.beforePageRending) {
				quote.beforePageRending();
			}
			// 触发事件集合
			for (var i = 0; i < quote.beforePageRendingEvents.length; i++) {
				quote.beforePageRendingEvents[i]();
			}
			// 格式化页面
			quote.defaultPageRender();
			// 触发事件集合
			for (var i = 0; i < quote.afterPageRendingEvents.length; i++) {
				quote.afterPageRendingEvents[i]();
			}
			if (quote.afterPageRending) {
				quote.afterPageRending();
			}
		}
		options = options || {};
		quote.timeout = options["timeout"] || quote.timeout;
		quote.defaultCode = options["defaultCode"];
		quote.quoteMark = options["quoteMark"] || quote.quoteMark;
		//绑定事件
		quote.beforeDataParsing = options["beforeDataParsing"] || null;
		quote.afterDataParsing = options["afterDataParsing"] || null;
		quote.beforePageRending = options["beforePageRending"] || null;
		quote.afterPageRending = options["afterPageRending"] || null;
		quote.inited = true;
		//返回自身
		return quote;
	};

	quote.refresh = function(parentElem) {
		quote.refreshed = true;
		quote._fillElems(parentElem);
		quote._loadCount = 0;
		return quote;
	};

	quote._fillElems = function(parentElem) {
		var codes = [];
		// 获取全部报价元素
		var elems = quote.find({
			parent : parentElem || document.body,
			attr : quote.quoteMark
		});
		for (var i = 0; i < elems.length; i++) {
			var elem = elems[i];
			var meta = quote.toMeta(elem.getAttribute(quote.quoteMark));
			var code = meta["code"] || quote.defaultCode;
			// attr使用空字符串也可以构建集合
			var attr = meta["attr"] || "";
			if (!code)
				continue;
			//记录
			quote._codeMap[code] = true;
			codes[codes.length] = code;
			elem["meta"] = meta;
			//将html元素按code构建成集合
			var qElem = quote._elemsMap[code] || (quote._elemsMap[code] = {});
			if (qElem[attr]) {//已存在该字段
				if (qElem[attr].constructor != Array) {//且不是数组
					var tmp = qElem[attr];
					qElem[attr] = [tmp];
					//改成数组类型
				}
				qElem[attr].push(elem);
			} else {
				qElem[attr] = elem;
				//填充元素hash表
			}
		}
		// 清空旧的code数组
		quote._codes = null;
		return codes;
	};

	quote.toMeta = function(s) {
		var serial = s.split(/[:;]/);
		var meta = {};
		for (var j = 0; j < serial.length; j += 2) {
			meta[serial[j]] = serial[j + 1];
		}
		return meta;
	};

	quote.receiveQuote = function(quoteList) {
		for (var code in quoteList) {
			// 替换最后一条数据
			if (quote._quoteMap[code]) {
				quote._preQuoteMap[code] = quote._quoteMap[code];
			}
			quote._quoteMap[code] = quoteList[code];
		}
	};

	quote.addBeforeHandler = function(key, fun) {
		quote._beforeHandler[key] = fun;
	};

	quote.addFormatHandler = function(key, fun) {
		quote._formatHandler[key] = fun;
	};

	quote.addAfterHandler = function(key, fun) {
		quote._afterHandler[key] = fun;
	};

	quote.getCodes = function() {
		if (!quote._codes) {
			quote._codes = [];
			for (var code in quote._codeMap) {
				quote._codes.push(code);
			}
		}
		return quote._codes;
	};

	quote.getQuoteCodes = function(type) {
		var _codes = [];
		if (type) {
			quote.eachQuote(function(code, quoteData) {
				if (quoteData.type && quoteData.type == type) {
					_codes.push(code);
				}
			});
		} else {
			quote.eachQuote(function(code, quoteData) {
				_codes.push(code);
			});
		}
		return _codes;
	};

	quote.eachCode = function(fn) {
		for (var code in quote._codeMap) {
			if (quote._codeMap[code]) {
				fn(code);
			}
		}
	};

	quote.eachQuote = function(fn) {
		for (var code in quote._quoteMap) {
			fn(code, quote._quoteMap[code]);
		}
	};

	quote.eachElement = function(fn) {
		for (var code in quote._elemsMap) {
			var qElem = quote._elemsMap[code];
			var quoteData = quote._quoteMap[code];
			for (var attr in qElem) {
				var elem = qElem[attr];
				if (elem.constructor != Array) {
					fn(code, elem["meta"], elem, quoteData);
				} else {
					for (var x = 0; x < elem.length; x++) {
						fn(code, elem[x]["meta"], elem[x], quoteData);
					}
				}
			}
		}
	};

	quote.getQuote = function(code) {
		return quote._quoteMap[code];
	};

	quote.getPreQuote = function(code) {
		return quote._preQuoteMap[code];
	};

	quote.remove = function(codes) {
		if ( typeof (codes) == "string") {
			codes = [codes];
		}
		var count = 0;
		for (var i = 0; i < codes.length; i++) {
			var code = codes[i];
			if (!quote._codeMap[code])
				continue;
			delete quote._codeMap[code];
			delete quote._quoteMap[code];
			delete quote._preQuoteMap[code];
			delete quote._elemsMap[code];
			quote._codes = null;
			count++;
		}
		return count;
	};

	quote.defaultPageRender = function() {
		// 循环页面全部报价html元素
		quote.eachElement(function(code, meta, elem, quoteData) {
			quote.defaultElementRender(code, meta, elem, quoteData);
		});
	};

	quote.defaultElementRender = function(code, meta, elem, quoteData) {
		try {
			var before = meta["before"];
			if (before && quote._beforeHandler[before]) {
				quote._beforeHandler[before](code, meta, elem, quoteData);
			}
			var fmt = meta["fmt"];
			(quote._formatHandler[fmt] || quote.defaultFormat)(code, meta, elem, quoteData);
			var after = meta["after"];
			if (after && quote._afterHandler[after]) {
				quote._afterHandler[after](code, meta, elem, quoteData);
			}
		} catch(e) {
			// IE下不会输出异常信息
			if ( typeof (console) != "undefined" && console.error) {
				console.error(e);
			}
		}
	};
	var colorExp = new RegExp("\\b(cRed)\\b|\\b(cGreen)\\b", "g");
	var bgchgExp = new RegExp("\\b(upbg)\\b|\\b(downbg)\\b", "g");

	quote.defaultFormat = function(code, meta, elem, quoteData) {
		if (!quoteData) {
			elem.innerHTML = '--';
			return;
		}
		var attr = meta["attr"];
		if (!attr)
			return;
		var data = quoteData[attr];
		var html;
		// 如果没有数据
		if (data != 0 && !data) {
			if (meta["default"]) {
				html = meta["default"];
			}
		} else {
			if (meta["*"]) {
				data = data * meta["*"];
			}
			if (meta["/"]) {
				data = data / meta["/"];
			}
			if (meta["fixed"]) {
				if (isFinite(data)) {
					//如果data小于1，则至少保留2位小数
					if (data * 1 < 1)
						meta["fixed"] = meta["fixed"] < 2 ? 2 : meta["fixed"];
					html = (data * 1).toFixed(meta["fixed"]);
				} else {
					html = "-";
				}
			} else if (meta["percent"]) {
				html = (data * 100).toFixed(meta["percent"]) + "%";
			} else {
				html = data;
			}
		}
		//是否添加颜色
		if (meta["color"]) {
			var colorData = quoteData[meta["color"]];
			if (colorData) {
				var css = quote.cssColor(colorData);
				elem.className = elem.className.replace(colorExp, "") + " " + css;
			}
		}
		//对比某个字段，大红小绿
		if (meta["colorcmp"]) {
			var colorcmpData = U.getMapValue(quoteData, meta["colorcmp"]);
			if (colorcmpData) {
				var css = cssColor(data - colorcmpData);
				elem.className = elem.className.replace(ntesQuoteData.colorExp, "") + " " + css;
			}
		}
		// 是否添加趋势背景色
		if (meta["bgchg"]) {
			var preQuote = ntesQuote.getPreQuote(code);
			if (preQuote) {
				var attr = meta["bgchg"];
				var curData = quoteData[attr];
				var preData = preQuote[attr];
				if (curData && preData) {
					elem.className = elem.className.replace(bgchgExp, "") + " " + (curData > preData ? "upbg" : (curData < preData ? "downbg" : "　"));
					var timeout = (meta["timeout"] || 1500) * 1;
					window.setTimeout(function() {
						elem.className = elem.className.replace(bgchgExp, "");
					}, timeout);
				}
			}
		}
		// 全角长度
		if (meta["maxlen"]) {
			elem.setAttribute('title', html);
			html = quote.widthString(html, meta["maxlen"]);
		}
		if (meta["title"]) {
			elem.setAttribute('title', quoteData[meta["title"]]);
		}
		// 如果是超链接
		if (meta["link"]) {
			var hash = meta["sign"] || "";
			var href = decodeURIComponent(quote.formatString(meta["link"], quoteData[meta["linkvalue"]]));
			// 使用innerHTML而不是createElement可明显提高性能
			html = quote.formatString("<a href=\"{0}" + hash + "\" target=\"{1}\">{2}</a>", href, meta["target"], html);
		}
		//设置数据
		//elem.innerHTML = html || '--';
		elem.innerHTML = html ? html : html === 0 ? 0 : '--';
	};

	quote.loadAll = function(parent) {
		var codes = [];
		if (quote.isArray(parent)) {
			for (var i = 0; i < parent.length; i++)
				codes = codes.concat(quote._fillElems(parent[i]));
		} else {
			codes = codes.concat(quote._fillElems(parent));
		}
		quote.loadOnce(codes);
	};

	quote.loadOnce = function(_codes) {
		if (!quote.inited) {
			quote.init();
			quote._fillElems();
		}
		var codes = _codes || quote.getCodes();
		if (codes.length == 0)
			return;
		// 要请求的代码
		var reqcodes = [];
		var now = new Date();
		for (var i = 0; i < codes.length; i++) {
			var code = codes[i], q = quote._quoteMap[code];
			if (!q || !q['type'] || (!quote.cronCache[q['type']] && !quote.intervalCache[q['type']])) {
				reqcodes.push(code);
			} else {
				var cronText = quote.cronCache[q['type']];
				var interval = quote.intervalCache[q['type']];
				if (quote.jcron.isMatch(now, q['type'], cronText) && quote.isMatchInterval(now, quote._typeTimeMap[q['type']], interval)) {
					reqcodes.push(code);
					quote._typeTimeMap[q['type']] = now;
				}
			}
		}
		if (reqcodes.length == 0)
			return;

		var time = now.getDay() + "" + now.getHours() + "" + now.getMinutes();
		//IE的url最大长度是2083个字节(http://support.microsoft.com/default.aspx?scid=kb;EN-US;q208427)，在IE下只能分多次载入,此时会触发多次PageRending
		if (reqcodes.length < 200 || !quote.isIE) {
			quote.importJs(quote.address + reqcodes.join(",") + ",money.api?" + time, "utf-8");
		} else {
			for (var i = 0; i < reqcodes.length; i += 200) {
				quote.importJs(quote.address + reqcodes.slice(i, i + 200).join(",") + ",money.api?" + time, "utf-8");
			}
		}
		quote._loadCount++;
		return quote;
	};
	//SH:"9:25-11:30,13:00-15:00 1-5"
	quote.loadData = function(timeout) {
		if (timeout)
			quote.timeout = timeout * 1;
		if (quote.timer) {
			window.clearTimeout(quote.timer);
			quote.timer = null;
		}
		//只有在交易时段或第一次调用才加载数据
		var hour = (new Date()).getHours();
		if ((hour >= 9 && hour <= 12) || (hour >= 13 && hour <= 16) || quote._loadCount == 0) {
			quote.loadOnce();
		}
		quote.timer = window.setTimeout(function() {
			quote.loadData();
		}, quote.timeout);
		return quote;
	};
	// 设置数据更新定时器
	quote.setCrontab = function(type, cronText) {
		// 判断删除
		if (!cronText && quote.cronCache[type]) {
			delete quote.cronCache[type];
			return true;
		}
		try {
			var obj = quote.jcron.parseCrontab(type, cronText);
			if (!obj.minute || !obj.hour || !obj.week) {
				return false;
			} else {
				quote.cronCache[type] = cronText;
				return true;
			}
		} catch(e) {
			return false;
		}
	};
	// 设置数据更新间隔
	quote.setInterval = function(type, interval) {
		// 判断删除
		if (!interval && quote.intervalCache[type]) {
			delete quote.intervalCache[type];
			return true;
		}

		quote.intervalCache[type] = interval;
		return true;

	}; 
	quote.isMatchInterval = function(time, lastTime, interval) {
		if (lastTime && interval) {
			if (time.getTime() - lastTime.getTime() < interval * 1000) {
				return false;
			}
		}
		return true;
	};
})(ntesQuote);

/**
 * js版仿crontab配置解释器
 * 格式 minute hour week
 */
(function(c) {
	// 缓存字符串与解释对象
	c.cache = {};
	// 将crontab时间段(*或*/n或x-y/n)解释为map对象{1:true, 2:true, ...}
	function parseTime(s, min, max, type, weight) {
		var map = {};
		// 如果是间隔
		if (s.indexOf('/') != -1) {
			var interval = parseInt(s.split('/')[1]);
			ntesQuote.setInterval(type, interval * weight);
			return null;
		}

		var list = s.split(',');
		for (var i = 0; i < list.length; i++) {
			var start = null, end = null, interval = null;
			var parts = list[i].split(/-|\//g);
			if (parts[0] == '*') {
				// "*" or "*/n"
				start = min;
				end = max;
				if (parts.length > 1 && isNaN(parts[1]))
					return null;
				interval = parts.length > 1 ? parts[1] * 1 : 1;
			} else {
				//"x-y/n" or "x-y" or "x"
				if (isNaN(parts[0]))
					return null;
				start = parts[0] * 1;
				if (parts.length > 1 && isNaN(parts[1]))
					return null;
				end = parts.length > 1 ? parts[1] * 1 : start;
				if (parts.length > 2 && isNaN(parts[2]))
					return null;
				interval = parts.length > 2 ? parts[2] * 1 : 1;
			}
			for (var j = start; j <= end; j += interval) {
				if (map[j])
					continue;
				map[j] = true;
			}
		}
		return map;
	}

	//  分析crontab字符串返回cronobj
	c.parseCrontab = function(type, cron_str) {
		if (c.cache[cron_str])
			return c.cache[cron_str];
		var args = cron_str.split(/[ \t]+/g);
		c.cache[cron_str] = {
			'second' : args.length > 0 ? parseTime(args[0], 0, 59, type, 1) : null,
			'minute' : args.length > 0 ? parseTime(args[1], 0, 59, type, 60) : null,
			'hour' : args.length > 1 ? parseTime(args[2], 0, 23, type, 60 * 60) : null,
			'week' : args.length > 2 ? parseTime(args[3], 0, 6, type, 60 * 60 * 24) : null
		};
		return c.cache[cron_str];
	};
	// 判断时间是否和可执行
	c.isMatch = function(time, type, cron_str) {
		if (cron_str) {
			var obj = c.parseCrontab(type, cron_str);
			if (obj.week && !obj.week[time.getDay()]) {
				return false;
			} else if (obj.hour && !obj.hour[time.getHours()]) {
				return false;
			} else if (obj.minute && !obj.minute[time.getMinutes()]) {
				return false;
			}
		}
		return true;
	};
})(ntesQuote.jcron);

// 上面为标准类定义
// ==============这是分界线2==============
// 下面为针对财经行情的通用模块

// 预设数据更新时段
ntesQuote.setCrontab('SH', '* * 9-11,13-15 1-5');
ntesQuote.setCrontab('SZ', '* * 9-11,13-15 1-5');
ntesQuote.setCrontab('RANK', '* * 9-11,13-15 1-5');
ntesQuote.setCrontab('FU', '* * 9-11,13-15 1-5');
ntesQuote.setCrontab('HK', '* * 10-11,13-16 1-5');
ntesQuote.setCrontab('US', '*/10 * 21-23,0-5 1-6');
ntesQuote.setCrontab('FG', '* */15 * *');
//ntesQuote.setCrontab('RANK', '* */2 * *');
//ntesQuote.setCrontab('UD', '* * 9-11,13-14 1-5');
ntesQuote.setCrontab('USUD', '* */2 21-23,0-5 1-6');

//每10s更新一次
//ntesQuote.setInterval('SH', 10);

// 用于解码的预处理函数
ntesQuote.addBeforeHandler("decode", function(code, meta, elem, quoteData) {
	if (!quoteData)
		return;
	var attr = meta["attr"];
	if (!attr)
		return;
	var data = quoteData[attr];
	if (!data)
		return;
	quoteData[attr] = decodeURIComponent(data);
});

// 显示涨跌箭头的预处理函数 <span _ntesquote_="code:{0};attr:_arrow;before:arrow;_arrowby:updown;color:updown"></span>
ntesQuote.addBeforeHandler("arrow", function(code, meta, elem, quoteData) {
	if (!quoteData)
		return;
	var attr = meta["attr"];
	if (!attr)
		return;
	var attrBy = meta["_arrowby"];
	if (!attrBy)
		return;
	var data = quoteData[attrBy];
	if (!data)
		return;
	// 设置自定义属性值
	quoteData[attr] = data > 0 ? "↑" : (data < 0 ? "↓" : "　");
});

// 显示两次报价趋势箭头的处理函数
ntesQuote.addFormatHandler("hstrend", function(code, meta, elem, quoteData) {
	if (!quoteData)
		return;
	var preQuote = ntesQuote.getPreQuote(code);
	if (!preQuote)
		return;
	var attr = meta["_arrowby"];
	if (!attr)
		return;
	var data = quoteData[attr];
	if (!data)
		return;
	var preData = preQuote[attr];
	if (!preData)
		return;
	elem.innerHTML = data > preData ? "↑" : (data < preData ? "↓" : "　");
	elem.className = ntesQuote.cssColor(data - preData);
	var timeout = (meta["timeout"] || 1500) * 1;
	window.setTimeout(function() {
		elem.innerHTML = "　";
		elem.className = "";
	}, timeout);
});

// 表格处理函数
ntesQuote.addFormatHandler("table", function(code, meta, elem, quoteData) {
	if (!quoteData)
		return;
	var thead = ntesQuote.find({
		parent : elem,
		tag : "th",
		attr : ntesQuote.minorMark
	});
	if (!thead || thead.length == 0)
		return;
	var metaArr = [];
	for (var i = 0; i < thead.length; i++) {
		var minorMeta = ntesQuote.toMeta(thead[i].getAttribute(ntesQuote.minorMark));

		if (minorMeta["link"]) {
			minorMeta["sign"] = meta["sign"] || "";
		}

		metaArr.push(minorMeta);
	}
	var tbody = elem.getElementsByTagName("tbody")[0];
	var rows = ntesQuote.find({
		parent : tbody,
		tag : "tr"
	});
	for (var i = 0; i < rows.length && i < quoteData.list.length; i++) {
		var stock = quoteData.list[i];
		for (var j = 0; j < metaArr.length; j++) {
			// 调用默认格式化函数
			ntesQuote.defaultElementRender(null, metaArr[j], rows[i].cells[j], stock);
		}
	}
});

// 时间格式化函数  timefmt:yyyy/MM/dd HH:mm:ss
ntesQuote.addFormatHandler("time", function(code, meta, elem, quoteData) {
	if (!quoteData)
		return;
	var attr = meta["attr"];
	if (!attr)
		return;
	var data = quoteData[attr];
	if (!data)
		return;
	var dt = new Date(data);
	var timefmt = meta["timefmt"];
	var str = timefmt.replace("yyyy", dt.getFullYear()).replace("MM", dt.getMonth() + 1).replace("dd", dt.getDate()).replace("HH", dt.getHours()).replace("mm", dt.getMinutes()).replace("ss", dt.getSeconds());
	elem.innerHTML = str;
});

// 首页排行榜
ntesQuote.addFormatHandler("rankmainpage", function(code, meta, elem, quoteData) {
	if (!quoteData)
		return;
	var thead = ntesQuote.find({
		parent : elem,
		tag : "th",
		attr : ntesQuote.minorMark
	});
	if (!thead || thead.length == 0)
		return;
	var metaArr = [];
	for (var i = 0; i < thead.length; i++) {
		var minorMeta = ntesQuote.toMeta(thead[i].getAttribute(ntesQuote.minorMark));
		metaArr.push(minorMeta);
	}
	var tbody = elem.getElementsByTagName("tbody")[0];
	var rows = ntesQuote.find({
		parent : tbody,
		tag : "tr"
	});
	var list = quoteData['list'] || quoteData['LIST'];
	for (var i = 0; i < rows.length && i < list.length; i++) {
		var stock = list[i];
		for (var j = 0; j < metaArr.length; j++) {
			if (metaArr[j]['attr'] == 'none')
				continue;
			// 调用默认格式化函数
			ntesQuote.defaultElementRender(null, metaArr[j], rows[i].cells[j], stock);
		}
		// add
		if (stock['uvsnews'] && stock['uvsnews'].length > 0) {
			url = stock['uvsnews'][0]['url'];
			title = stock['uvsnews'][0]['title'];
			if (url) {
				var html = rows[i].cells[1].innerHTML;
				html = ntesQuote.formatString("<div>{0}<a target='_blank' href='{1}' title='{2}' class='stock-news'></a></div>", html, url, title);
				rows[i].cells[1].innerHTML = html;
			}
		} else if (stock['announmt'] && stock['announmt'].length > 0) {
			announmtid = stock['announmt'][0]['announmtid'];
			announmt2 = stock['announmt'][0]['announmt2'];
			if (announmtid) {
				var html = rows[i].cells[1].innerHTML;
				html = ntesQuote.formatString('<div>{0}<a target="_blank" href="http://quotes.money.163.com/f10/ggnr_{1},{2}.html" title="{3}" class="stock-notice"></a></div>', html, stock['symbol'], announmtid, announmt2);
				rows[i].cells[1].innerHTML = html;
			}
		}
	}
}); 