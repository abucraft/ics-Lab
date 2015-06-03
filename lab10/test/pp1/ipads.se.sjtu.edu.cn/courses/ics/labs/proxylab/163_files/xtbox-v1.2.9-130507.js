/*
 * netease ADbox apply v1.0
 * Creation date: 2012/5/17
 * Modified date: xxxx/xxxx/xxxxx
*/
//优先判断浏览器
function tempCheckBroswer()
{
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	if(Sys.ie){	if(parseInt(Sys.ie)>=7){return "ie8";}else{return "ie6";}}
	else if(Sys.firefox){return "ff";}
	else if(Sys.chrome){return "chr";}
	else{return 0;}
}
//浮层对象
var xtBox = new Object();
xtBox.broswer = tempCheckBroswer();
xtBox.h = 0;
xtBox.hFrame = 400;
xtBox.isShow = 0;
xtBox.topNumx = 0;

if(xtBox.broswer)
{
	
	/*************浮层广告执行***********
	*/
	//配置信息
	xtBox.height1 = (typeof(adInfoTempXt.height1)=="undefined")?400:adInfoTempXt.height;
	xtBox.width1 = (typeof(adInfoTempXt.width1)=="undefined")?960:adInfoTempXt.width;
	if(!adInfoTempXt.index)
	{
		xtBox.height2 = (typeof(adInfoTempXt.height2)=="undefined")?270:adInfoTempXt.height2;
		xtBox.width2 = (typeof(adInfoTempXt.width2)=="undefined")?20:adInfoTempXt.width2;
	}else
	{
		xtBox.height2 = (typeof(adInfoTempXt.height2)=="undefined")?270:adInfoTempXt.height2;
		xtBox.width2 = (typeof(adInfoTempXt.width2)=="undefined")?20:adInfoTempXt.width2;
		xtBox.height3 = (typeof(adInfoTempXt.height3)=="undefined")?270:adInfoTempXt.height3;
		xtBox.width3 = (typeof(adInfoTempXt.width3)=="undefined")?20:adInfoTempXt.width3;
	}
	xtBox.src1 = (typeof(adInfoTempXt.src1)=="undefined")?0:adInfoTempXt.src1;
	xtBox.src2 = (typeof(adInfoTempXt.src2)=="undefined")?0:adInfoTempXt.src2;
	xtBox.src3 = xtBox.src2;
	xtBox.url = (typeof(adInfoTempXt.url)=="undefined")?"http://163.com":adInfoTempXt.url;
	xtBox.key = (typeof(adInfoTempXt.key)=="undefined")?"xtkey":adInfoTempXt.key;
	xtBox.time = (typeof(adInfoTempXt.time)=="undefined")?8000:adInfoTempXt.time;
	xtBox.adBoxJs = (typeof(adInfoTempXt.adBoxJs)=="undefined")?"http://img2.126.net/ntesrich/auto/adbox/adbox-v1.1.2-120705.js":adInfoTempXt.adBoxJs;


	xtBox.hFrame = 400;
	xtBox.cookieTime = 2;
	//生成广告
	xtBox.createElement = function()
	{
		//生成主广告
		//默认960*400
		document.body.insertAdjacentHTML("afterBegin","<div id='xtMainDiv' style='height:400px; width:960px; display:none; margin-top:70px;'></div>");
		this.xtMainDiv = document.getElementById("xtMainDiv");
		
		this.mainDiv = adBox.createDiv(this.width1,this.height1);
		this.mainDiv.overflow = "hidden";
		this.mainStr = "<div style=\"height:400px; width:960px; overflow:hidden;\"><div id=\"xtMovieFrame\" style=\"height:400px; width:960px; display:block;\"></div><div id=\"xtClick\" onclick=\"xtBox.getURL()\" style=\"height:400px; width:960px; background:#FC6; cursor:pointer; position:relative; top:-400px; display:block; filter:alpha(opacity=0); opacity:0; \"></div><div id=\"xtClose\" onclick=\"xtBox.action('close')\" style=\"height:20px; width:60px; background:#ccc; position:relative; top:-420px; float:right; cursor:pointer; display:block;\"><img src=\"http://img2.126.net/ntesrich/auto/images/close.jpg\" height=\"20\" width=\"60\" border=\"0\" title=\"关闭广告\" alt=\"关闭按钮\" /></div></div>"
		this.mainDiv.innerHTML = this.mainStr;
		this.mainFrame = document.getElementById("xtMovieFrame");
		this.mainFrame.innerHTML = adBox.createSwf("xtMainMovie",this.width1,this.height1,this.src1);
		this.mainDiv.style.display = "none";
		this.mainDiv.style.zIndex=99999;
		
		//replay right
		this.replayDivR = adBox.createDiv(this.width2,this.height2);
		this.replayStrR = "<div id=\"xtReplayFrameR\" style=\"width:20px; height:"+this.height2+"px;\"></div><div id=\"xtClickR\" onclick=\"xtBox.getURL()\" style=\"width:20px; height:"+this.height2+"px; background:#0CC; position:relative; left:0; top:-"+this.height2+"px; cursor:pointer; filter:alpha(opacity=0); opacity:0;\"></div><div id=\"xtReplayR\" onclick=\"xtBox.action('show')\" style=\"width:20px; height:40px; background:#C99; position:relative; left:0; top:-"+(this.height2+40)+"px; cursor:pointer; filter:alpha(opacity=0); opacity:0;\"></div>";
		this.replayDivR.innerHTML = this.replayStrR;
		this.replayFrameR = document.getElementById("xtReplayFrameR");
		this.replayFrameR.innerHTML = adBox.createSwf("xtReplayMovieR",this.width2,this.height2,this.src2);
		this.replayDivR.style.zIndex=9999;
		this.replayDivR.style.display = "none";
		
		//replay left
		//判断是否首页投放
		if(adInfoTempXt.index)
		{
			/*this.replayDivL = adBox.createDiv(this.width3,this.height3);
			this.replayStrL = "<div id=\"xtReplayFrameL\" style=\"width:20px; height:"+this.height3+"px;\"></div><div id=\"xtClickL\" onclick=\"xtBox.getURL()\" style=\"width:20px; height:"+this.height3+"px; background:#0CC; position:relative; left:0; top:-"+this.height3+"px; cursor:pointer; filter:alpha(opacity=0); opacity:0; \"></div><div id=\"xtReplayL\" onclick=\"xtBox.action('show')\" style=\"width:20px; height:40px; background:#C99; position:relative; left:0; top:-"+(this.height3+40)+"px; cursor:pointer; filter:alpha(opacity=0); opacity:0; \"></div>";
			this.replayDivL.innerHTML = this.replayStrL;
			this.replayDivL.style.zIndex=9999;
			this.replayFrameL = document.getElementById("xtReplayFrameL");
			this.replayFrameL.innerHTML = adBox.createSwf("replayMovieL",this.width3,this.height3,this.src3);
			this.replayDivL.style.display = "none";*/
			this.hFrame = 445;
		}
	}
	//设置位置
	xtBox.reSetPosition = function()
	{
		//判断是否小分辨率
		this.toTop = (adInfoTempXt.index)?540:690;
		if(adBox.getClientInfo("height") <= this.toTop)
		{
			if(adBox.getClientInfo("top") >= 200)
			{
				this.dTop = 0;
			}else
			{
				
				this.dTop = this.toTop - adBox.getClientInfo("height");
				
			}
		}else
		{
			this.dTop = 0;
		}
		//浏览器类型
		if(this.broswer == "ie6")
		{
			//主文件定位
			this.mainDiv.style.position =
			this.replayDivR.style.position = "absolute";
			this.mainDiv.style.left = adBox.getClientInfo("width")/2 - this.width1/2 + "px";

			/*if(typeof(dwBox)!="undefined")
			{
				if(dwBox.isShow == 0)
				{
					//打开状态
					this.topNumx = 50;
				}else if(dwBox.isShow == 1)
				{
					//关闭状态
					this.topNumx = 0;
				}
			}*/

			this.mainDiv.style.top = this.hFrame - 400 + this.topNumx + "px";
			this.replayDivR.style.left = adBox.getClientInfo("width") - this.width2 + "px";
			this.replayDivR.style.top = this.dTop + adBox.getClientInfo("top") + adBox.getClientInfo("height") - this.height2 + "px";
			if(adInfoTempXt.index)
			{
				/*this.replayDivL.style.position = "absolute";
				this.replayDivL.style.left = "0px";
				this.replayDivL.style.top = this.dTop + adBox.getClientInfo("top") + adBox.getClientInfo("height") - this.height3 + "px";*/
			}
		}else
		{
			//主文件定位
			this.mainDiv.style.position = "absolute";
			this.replayDivR.style.position = "fixed";
			this.mainDiv.style.left = adBox.getClientInfo("width")/2 - this.width1/2 + "px";

			/*if(typeof(dwBox)!="undefined")
			{
				if(dwBox.isShow == 0)
				{
					//打开状态
					this.topNumx = 50;
				}else if(dwBox.isShow == 1)
				{
					//关闭状态
					this.topNumx = 0;
				}
			}*/

			this.mainDiv.style.top = this.hFrame - 400 + this.topNumx + "px";
			this.replayDivR.style.left = adBox.getClientInfo("width") - this.width2 + "px";
			this.replayDivR.style.top = this.dTop + adBox.getClientInfo("height") - this.height2 + "px";
			if(adInfoTempXt.index)
			{
				/*this.replayDivL.style.position = "fixed";
				this.replayDivL.style.left = "0px";
				this.replayDivL.style.top = this.dTop + adBox.getClientInfo("height") - this.height3 + "px";*/
			}
		}
		this.reSetPositionNum = setTimeout("xtBox.reSetPosition()",1000);
	}
	//下推动画
	xtBox.an = function(code)
	{
		if(code == "show")
		{
			this.h += 20;
			if(this.h >= this.hFrame)
			{
				//显示主动画
				this.mainDiv.innerHTML = this.mainStr;
				this.mainFrame = document.getElementById("xtMovieFrame");
				this.mainFrame.innerHTML = adBox.createSwf("xtMainMovie",this.width1,this.height1,this.src1);
				this.mainDiv.style.display = "block";
				this.time8Num = setTimeout("xtBox.action('close')",this.time);
				this.h = this.hFrame;
				//判断是否存在底纹
				//this.checkIsDw("none");
				clearTimeout(this.anNum);
			}else
			{
				this.anNum = setTimeout("xtBox.an('show')",50);
			}
		}else
		{
			this.h += -1*20;
			if(this.h<=0)
			{
				this.h = 0;
				this.xtMainDiv.style.display = "none";
				document.getElementById("xtReplayR").onclick = function(){xtBox.action('show');}
				if(adInfoTempXt.index)
				{
					//document.getElementById("xtReplayL").onclick = function(){xtBox.action('show');}
				}
				//判断是否存在底纹
				//this.checkIsDw("block");
				clearTimeout(this.anNum);
			}else
			{
				this.anNum = setTimeout("xtBox.an('close')",50);
			}
		}
		var tempH = ((this.h - 70)<0)?0:(this.h - 70);
		this.xtMainDiv.style.height = tempH +"px";
	}
	//交互
	xtBox.action = function(code)
	{
		if(typeof(this.isFirst)=="undefined")
		{
			this.isFirst = 1;
			this.cookie = adBox.cookieCount(this.key);
		}
		if(((code == "first")&&((this.cookie<=this.cookieTime)))||(code=="show"))
		{
			//隐藏重播
			this.replayDivR.innerHTML = "";
			this.replayDivR.style.display = "none";
			if(adInfoTempXt.index)
			{
				/*this.replayDivL.innerHTML = "";
				this.replayDivL.style.display = "none";*/
			}
			//开始下推动画
			this.xtMainDiv.style.display = "block";
			this.h = 0;
			this.an("show");
			//判断是否存在底纹广告
			//this.checkIsDw("none");
		}else if(((code == "first")&&((this.cookie>this.cookieTime)))||(code=="close"))
		{
			//隐藏主动画
			this.mainDiv.innerHTML = "";
			this.mainDiv.style.display = "none";
			//显示重播
			this.replayDivR.innerHTML = this.replayStrR;
			this.replayFrameR = document.getElementById("xtReplayFrameR");
			this.replayFrameR.innerHTML = adBox.createSwf("xtReplayMovieR",this.width2,this.height2,this.src2);
			this.replayDivR.style.display = "block";
			if(adInfoTempXt.index)
			{
				/*this.replayDivL.innerHTML = this.replayStrL;
				this.replayFrameL = document.getElementById("xtReplayFrameL");
				this.replayFrameL.innerHTML = adBox.createSwf("replayMovieL",this.width3,this.height3,this.src3);
				this.replayDivL.style.display = "block";*/
			}
			clearTimeout(this.time8Num);
			//开始上推
			if(code=="close")
			{
				this.h = this.hFrame;
				this.an("close");
				//屏蔽重播事件
				document.getElementById("xtReplayR").onclick = function(){}
				if(adInfoTempXt.index)
				{
					//document.getElementById("xtReplayL").onclick = function(){}
				}
			}
			//判断是否存在底纹广告
			//this.checkIsDw("block");

			//调用第二梯队
			//alert("下推主动播放并被关闭||不自动播放");
			if(typeof(adCindex) != "undefined")
			{
				adCindex.go(2);
			}
		}
	}
	//判断是否存在底纹广告
	xtBox.checkIsDw = function(disp)
	{
		/*if(typeof(dwBox) != "undefined")
		{
			if(typeof(dwBox.dwMainDiv) != "undefined")
			{
				dwBox.dwMainDiv.style.display = disp;
			}
			if(typeof(dwBox.topDiv) != "undefined")
			{
				dwBox.topDiv.style.display = disp;
			}
		}*/
	}
	//判断加载进度
	xtBox.checkPross = function()
	{
		if((this.broswer == "ff")||(this.broswer == "chr"))
		{
			this.checkPorssNum = setTimeout("xtBox.action('first')",1000);
		}else if(adBox.swfLoadPross(["xtMainMovie","xtReplayMovieR"]))
		{
			this.action("first");
		}else
		{
			this.checkPorssNum = setTimeout("xtBox.checkPross()",1000);
		}
	}
	//打开链接
	xtBox.getURL = function()
	{
		window.open(this.url,"_blank");
	}
	//综合调用
	xtBox.createAD = function()
	{
		if(xtBox.isShow == 0)
		{
			//生成元素
			this.createElement();
			//设置位置
			this.reSetPosition();
			//加载进度
			this.checkPross();

			xtBox.isShow = 1;
		}
	}
	//执行
	xtBox.go = function()
	{
		if(typeof(adBox) == "undefined")
		{
			//导入adbox
			document.write("<script language=\"JavaScript\" src=\""+xtBox.adBoxJs+"\"></script>");
			this.check = function()
			{
				if(typeof(adBox)=="undefined")
				{
					xtBox.checkNum = setTimeout("xtBox.check()",1000);
				}else
				{
					//开始执行
					clearTimeout(xtBox.checkNum);
					xtBox.createAD();
				}
			}
			this.check();
		}else
		{
			this.createAD();
		}
	}
	xtBox.go();
	//执行结束
	/***************结束***************/
}