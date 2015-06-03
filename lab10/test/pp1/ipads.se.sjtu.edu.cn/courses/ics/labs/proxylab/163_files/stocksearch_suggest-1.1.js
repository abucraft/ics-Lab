/**
 * 行情股票搜索  目前正式版
 * by Chunlai, 2011-03-09
 */

function _importJs(url, charset, callback, callbackflag){
	var head = document.getElementsByTagName("head")[0] || document.documentElement;
	var script = document.createElement("script");
	script.src = url;
	script.type = "text/javascript";
	if(charset){
		script.setAttribute("charset", charset);
	}
	// 加载完成后删除
	var done = false;
	script.onload = script.onreadystatechange = function() {
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
			//下载完成后触发回调函数
			if(typeof(callback) == "function"){ 
				callback(callbackflag);
			}
			head.removeChild(this);
		}
	};
	head.insertBefore(script, head.firstChild);
}

function _formatString(str){
	for(var i=1; i<arguments.length; i++) {
		str = str.replace(new RegExp("\\{"+(i-1)+"\\}","gm"), arguments[i]);
	};
	return str;
}

if(typeof(console)=="undefined"){
	window.console = {};
	console.info = function(s){};
	console.debug = function(){};
	console.error = function(){};
}
if (typeof(bsn) == "undefined"){
	_b = bsn = {};
}
if (typeof(_b.Autosuggest) == "undefined"){
	_b.Autosuggest = {};
}


/**
 * 抽取jQuery中的offset函数
 * by zwli, 2010.8.17
 * 1、省去bodyMarginTop = parseFloat( jQuery.curCSS(body, "marginTop", true)) || 0，因此只能用于body.style.marginTop=0下
 * 2、嵌入jQuery.support.boxModel判断
 * 3、使用 jOffset.offset(id or htmlElemment)
 */
_b.jOffset = {};
(function(jOffset){
	jOffset.init = function(){
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
		var divcss = { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" };
		for(var k in divcss){
			container.style[k] = divcss[k];
		}

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed", checkDiv.style.top = "20px";
		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden", innerDiv.style.position = "relative";
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		
		jOffset.init = function(){};
	}
	jOffset.supportCheck = function(){
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";
		document.body.appendChild( div );
		
		this.support_boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';
		div = null;
		jOffset.supportCheck = function(){};
	}
	
	if ( "getBoundingClientRect" in document.documentElement ) {
		jOffset.supportCheck();
		jOffset.offset = function(obj){
			var elem = typeof(obj)=='string' ? document.getElementById(obj) : obj;
			var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jOffset.support_boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jOffset.support_boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;
			
			return { top: top, left: left };
		}
	}else{
		jOffset.init();
		jOffset.offset = function(obj){
			var elem = typeof(obj)=='string' ? document.getElementById(obj) : obj;
			console.info(elem);
			var offsetParent = elem.offsetParent, prevOffsetParent = elem,
				doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
				body = doc.body, defaultView = doc.defaultView,
				prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
				top = elem.offsetTop, left = elem.offsetLeft;

			while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
				if ( jOffset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
					break;
				}

				computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
				top  -= elem.scrollTop;
				left -= elem.scrollLeft;

				if ( elem === offsetParent ) {
					top  += elem.offsetTop;
					left += elem.offsetLeft;

					if ( jOffset.doesNotAddBorder && !(jOffset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.nodeName)) ) {
						top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
						left += parseFloat( computedStyle.borderLeftWidth ) || 0;
					}

					prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
				}

				if ( jOffset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevComputedStyle = computedStyle;
			}

			if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
				top  += body.offsetTop;
				left += body.offsetLeft;
			}

			if ( jOffset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				top  += Math.max( docElem.scrollTop, body.scrollTop );
				left += Math.max( docElem.scrollLeft, body.scrollLeft );
			}
			
			return { top: top, left: left };
		}
	}
})(_b.jOffset);



_b.AutoSuggest = function (param) {
	if (!document.getElementById)
		return 0;
	
	id = param["inputid"];
	
	this.fld = _b.DOM.gE(id);
	if (!this.fld)
		return 0;
	
	_this = this;
	this.sInp 	= "";
	this.nInpC 	= 0;
	this.aSug 	= [];
	this.iHigh 	= 0;
	this.isSelected = false;
	
	param["sign"] = param["sign"] || "";
	
	this.oP = param ? param : {};
	param['callback'] = param['callback'] || function(item){
		typeMap = {
			"SH":"http://quotes.money.163.com/0{0}.html" + param["sign"],
			"SZ":"http://quotes.money.163.com/1{0}.html" + param["sign"],
			"HK":"http://quotes.money.163.com/hkstock/{0}.html" + param["sign"],
			"FX":"http://quotes.money.163.com/forex/hq/{0}.html" + param["sign"],
			"US":"http://quotes.money.163.com/usstock/hq/{0}.html" + param["sign"],
			"FN":"http://quotes.fund.163.com/html/{0}.html" + param["sign"],
			"FU":"http://quotes.money.163.com/futures/hq/{0}.html" + param["sign"]
		};
		url = typeMap[item["type"]].replace("{0}",  item["symbol"]);
		window.open(url);
	}
	
	var k, def = {minchars:1, meth:"get", varname:"input", className:"autosuggest", timeout:2500, delay:300, offsety:-5, shownoresults: false, noresults: "-", maxheight: 250};
	for (k in def)
	{
		if (typeof(this.oP[k]) != typeof(def[k]))
			this.oP[k] = def[k];
	}
	
	var p = this;
	
	
	this.fld.onkeypress 	= function(ev){ return p.onKeyPress(ev); };
	this.fld.onkeyup 		= function(ev){ return p.onKeyUp(ev); };
	this.fld.onkeydown 		= function(ev){ return p.onKeyDown(ev); };
	// 切换默认文字
	this.fld.onfocus = function(){
		if(p.fld.value == p.oP["tooltip"]){
			p.fld.value = "";
		}
	}
	this.fld.onblur = function(){
		p.resetTimeout();
		if(p.fld.value == ""){
			p.fld.value = p.oP["tooltip"];
		} else {
			setTimeout(function(){
				if (_this.isSelected == false) {
					_stockSugPointer.setHighlight(1);
					_stockSugPointer.setHighlightedValue();
				}
			}, 200);
		}
	}
	this.fld.setAttribute("autocomplete","off");
};

_b.AutoSuggest.prototype.onKeyPress = function(ev) {
	var key = (window.event) ? window.event.keyCode : ev.keyCode;
	//
	var RETURN = 13;
	var TAB = 9;
	var ESC = 27;
	var ARRUP = 38;
	var ARRDN = 40;
	
	var bubble = 1;

	switch(key)
	{
		case RETURN:
			this.setHighlightedValue();
			bubble = 0;
			break;

		case ESC:
			this.clearSuggestions();
			break;
	}

	return bubble;
};

_b.AutoSuggest.prototype.onKeyDown = function(ev) {
	var key = (window.event) ? window.event.keyCode : ev.keyCode;
	//
	var RETURN = 13;
	var TAB = 9;
	var ESC = 27;
	var ARRUP = 38;
	var ARRDN = 40;
	
	var bubble = 1;

	switch(key)
	{
		case ARRUP:
			this.changeHighlight(key);
			bubble = 0;
			break;
			
		case ARRDN:
			this.changeHighlight(key);
			bubble = 0;
			break;
	}

	return bubble;
}


_b.AutoSuggest.prototype.onKeyUp = function(ev) {
	var key = (window.event) ? window.event.keyCode : ev.keyCode;
	
	var ARRUP = 38;
	var ARRDN = 40;
	
	var bubble = 1;

	switch(key)
	{
/*
		case ARRUP:
			this.changeHighlight(key);
			bubble = 0;
			break;


		case ARRDN:
			this.changeHighlight(key);
			bubble = 0;
			break;
		*/
		default:
			this.getSuggestions(this.fld.value);
	}

	return bubble;

};

_b.AutoSuggest.prototype.getSuggestions = function (val) {
	
	if (val == this.sInp)
		return 0;
	
	//_b.DOM.remE(this.idAs);
	
	_this.isSelected = false;
	this.sInp = val;
	
	
	// 检查输入长度
	if (val.length < this.oP.minchars)
	{
		this.aSug = [];
		this.nInpC = val.length;
		this.resetTimeout();
		return 0;
	}
	
	
	// 旧 长度，用于缓存（未启用）
	var ol = this.nInpC; 
	this.nInpC = val.length ? val.length : 0;
	
	
	{
		var pointer = this;
		var input = this.sInp;
		clearTimeout(this.ajID);
		this.ajID = setTimeout( function() { pointer.doAjaxRequest(input) }, this.oP.delay );
	}

	return false;
};

// 接口数据回调
function _ntes_stocksearch_callback(list) {
	var p = window._stockSugPointer;
	p.aSug = [];
	for(var i=0; i<list.length; i++){
		var item = list[i];
		p.aSug.push({ 'symbol':item["symbol"], 'name':item["name"], 'spell':item["spell"], 'type':item["type"]});
	}
	p.idAs = "as_"+p.fld.id;
	p.createList(p.aSug);
}

_b.AutoSuggest.prototype.doAjaxRequest = function (input) {
	if (input != this.fld.value){
		return false;
	}
	
	window._stockSugPointer = this;
	
	_importJs("http://quotes.money.163.com/stocksearch/json.do?type="+this.oP.getType()+"&count="+this.oP["max"]+"&word="+encodeURIComponent(input)+"&t="+Math.random(), "gbk");
};



_b.AutoSuggest.prototype.createList = function(arr) {
	var pointer = this;
	var val = this.fld.value;
	// 重建列表
	_b.DOM.remE(this.idAs);
	this.killTimeout();
	
	//
	if (arr.length == 0 && !this.oP.shownoresults){
		return false;
	}
	var typeName = {'SH':'上海', 'SZ':'深圳', 'HK':'港股', 'FX':'外汇', 'US':'美股', 'FU':'期货', 'FN':'基金'};

	// 构建下拉框
	var div = _b.DOM.cE("div", {id:this.idAs, className:"tcbox"});
	// table
	var buf = [];
	buf.push('<table class="tbText">');
	buf.push('<thead><th>代码</th><th>名称</th><th>拼写</th><th>类型</th></thead>');
	buf.push('<tbody>');
	var valreg = new RegExp(val, 'i');
	var highval = '<span class="cRed">'+val.toUpperCase()+'</span>';
	for (var i=0; i<arr.length; i++){
		var symbol = arr[i]['symbol'];
		var name = arr[i]['name'];
		if(name.length>8) name = name.substring(0, 8);
		var spell = arr[i]['spell'];
		if(spell.length>9) spell	 = spell.substring(0, 9);
		var type = arr[i]['type'];
		buf.push(_formatString('<tr style="cursor:pointer" onclick="window._stockSugPointer.setHighlightedValue();" onmouseover="window._stockSugPointer.setHighlight({0});" title="{1}">', i+1, arr[i]['name']));
		buf.push(_formatString('<td>{0}</td>', symbol.replace(valreg, highval)));//<span class="cRed">6</span>
		buf.push(_formatString('<td>{0}</td>', name.replace(valreg, highval)));
		buf.push(_formatString('<td>{0}</td>', spell.replace(valreg, highval)));
		buf.push(_formatString('<td>{0}</td>', typeName[type]));
		buf.push('</tr>');
	}
	buf.push('</tbody>');
	buf.push('</table>');

	div.innerHTML = buf.join('');
	// 加入页面
	var p = null;
	if(this.oP["parentid"]){
		p = document.getElementById(this.oP["parentid"]);
	}
	if(!p){
		p = document.getElementsByTagName("body")[0];
	}
	p.appendChild(div);
	// 定位 getPos:x,y jOffset:left,top
	/*
	var pos = _b.DOM.getPos(this.oP["posElem"] || this.fld);
	pos.left = pos.x;
	pos.top = pos.y;
	*/
	var pos = _b.jOffset.offset(this.oP["posElem"] || this.fld);
	var posAlign = this.oP["posAlign"] || "bottom";
	if(posAlign=="top"){
		div.style.left 		= pos.left + "px";
		
		div.style.top 		= ( pos.top - div.offsetHeight -10) + "px";
	}else{
		div.style.left 		= pos.left + "px";
		div.style.top 		= ( pos.top + this.fld.offsetHeight + this.oP.offsety ) + "px";
	}
	//div.style.width 	= this.fld.offsetWidth + "px";
	//document.title = _formatString("{0},{1}", pos.x, pos.y);
	// 加入页面
	
	// 清除高亮序号
	this.iHigh = 0;

	// 定时隐藏
	//
	//var pointer = this;
	//this.toID = setTimeout(function () { pointer.clearSuggestions() }, this.oP.timeout);
};

_b.AutoSuggest.prototype.changeHighlight = function(key) {	
	var list = _b.DOM.gE(this.idAs).getElementsByTagName("tbody")[0];
	if (!list)
		return false;
	
	var n;
	if (key == 40)
		n = this.iHigh + 1;
	else if (key == 38)
		n = this.iHigh - 1;
	
	if (n > list.childNodes.length)
		n = list.childNodes.length;
	if (n < 1)
		n = 1;
	
	this.setHighlight(n);
};

_b.AutoSuggest.prototype.setHighlight = function(n) {
	var list = _b.DOM.gE(this.idAs).getElementsByTagName("tbody")[0];
	if (!list)
		return false;
	
	if (this.iHigh > 0)
		this.clearHighlight();
	
	this.iHigh = Number(n);
	
	list.childNodes[this.iHigh-1].className = "alter";


	this.killTimeout();
};

_b.AutoSuggest.prototype.clearHighlight = function() {
	var list = _b.DOM.gE(this.idAs).getElementsByTagName("tbody")[0];
	if (!list)
		return false;
	
	if (this.iHigh > 0)
	{
		list.childNodes[this.iHigh-1].className = "";
		this.iHigh = 0;
	}
};

_b.AutoSuggest.prototype.setHighlightedValue = function () {
	var callbackItem = null;

	if (this.iHigh)
	{
		callbackItem = this.aSug[ this.iHigh-1 ];
		this.sInp = this.fld.value = callbackItem["symbol"];
		_this.isSelected = true;
	}else{
			if(this.aSug.length==1){
				callbackItem = this.aSug[ 0 ];
			}
	}
	
	if(callbackItem){
		if (typeof(this.oP.callback) == "function") {
			this.clearSuggestions();
			this.oP.callback(callbackItem);
		}
	}
};

_b.AutoSuggest.prototype.killTimeout = function() {
	clearTimeout(this.toID);
};

_b.AutoSuggest.prototype.resetTimeout = function() {
	clearTimeout(this.toID);
	var pointer = this;
	this.toID = setTimeout(function () { pointer.clearSuggestions() }, 100);
};

_b.AutoSuggest.prototype.clearSuggestions = function () {
	//return;
	this.killTimeout();
	
	var ele = _b.DOM.gE(this.idAs);
	var pointer = this;
	if (ele)
	{
		var fade = new _b.Fader(ele,1,0,250,function () { _b.DOM.remE(pointer.idAs) });
	}
};

ntesStockSuggest = _b.AutoSuggest;





// 简化DOM操作 =================
if (typeof(_b.DOM) == "undefined")
	_b.DOM = {};

/* create element */
_b.DOM.cE = function ( type, attr, cont, html ) {
	var ne = document.createElement( type );
	if (!ne)
		return 0;
		
	for (var a in attr)
		ne[a] = attr[a];
	
	var t = typeof(cont);
	
	if (t == "string" && !html)
		ne.appendChild( document.createTextNode(cont) );
	else if (t == "string" && html)
		ne.innerHTML = cont;
	else if (t == "object")
		ne.appendChild( cont );

	return ne;
};

/* get element */
_b.DOM.gE = function ( e ) {
	var t=typeof(e);
	if (t == "undefined")
		return 0;
	else if (t == "string")
	{
		var re = document.getElementById( e );
		if (!re)
			return 0;
		else if (typeof(re.appendChild) != "undefined" )
			return re;
		else
			return 0;
	}
	else if (typeof(e.appendChild) != "undefined")
		return e;
	else
		return 0;
};

/* remove element */
_b.DOM.remE = function ( ele ) {
	var e = this.gE(ele);
	
	if (!e)
		return 0;
	else if (e.parentNode.removeChild(e))
		return true;
	else
		return 0;
};

/* get position */
_b.DOM.getPos = function ( e ) {
	var e = this.gE(e);

	var obj = e;

	var curleft = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft;
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	
	var obj = e;
	
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;

	return {x:curleft, y:curtop};
};

// FADER PROTOTYPE _____________________________________________

if (typeof(_b.Fader) == "undefined")
	_b.Fader = {};

_b.Fader = function (ele, from, to, fadetime, callback) {	
	if (!ele)
		return 0;
	
	this.e = ele;
	
	this.from = from;
	this.to = to;
	
	this.cb = callback;
	
	this.nDur = fadetime;
		
	this.nInt = 50;
	this.nTime = 0;
	
	var p = this;
	this.nID = setInterval(function() { p._fade() }, this.nInt);
};

_b.Fader.prototype._fade = function() {
	this.nTime += this.nInt;
	
	var ieop = Math.round( this._tween(this.nTime, this.from, this.to, this.nDur) * 100 );
	var op = ieop / 100;
	
	if (this.e.filters) // internet explorer
	{
		try
		{
			this.e.filters.item("DXImageTransform.Microsoft.Alpha").opacity = ieop;
		} catch (e) { 
			// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
			this.e.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity='+ieop+')';
		}
	}
	else // other browsers
	{
		this.e.style.opacity = op;
	}
	
	
	if (this.nTime == this.nDur)
	{
		clearInterval( this.nID );
		if (this.cb != undefined)
			this.cb();
	}
};

_b.Fader.prototype._tween = function(t,b,c,d) {
	return b + ( (c-b) * (t/d) );
};
 
 