//0.0时分函数，解决浏览器假死问题。***************************************

//假死
var ary = [];
for(var i=1;i<=1000;i++){
	ary.push(i);
}
 var renderFriendList = function(data) {
 	for(var i=0,l=data.length;i<l;i++){
 		var div = document.createElement('div')
 		div.innerHTML = i;
 		document.body.appendChild(div)
 	}
 };

 //解决
 var timeChuck = function (arr,fn,count) {
 	var obj,t;
 	var len = arr.length;
 	var start = function() {
 		for(var i=0;i<Math.min(count||1,len);i++){
 			var obj = ary.shift();
 			fn(obj);
 		}
 	};
 	return function () {
 		t = setInterval(function () {
 			if(ary.length === 0){
 				//所有节点都已经创建好
 				return clearInterval(t);
 			}
 			start();
 		},200);
 	};
 };

//调用
var ary = [];
for(var i=1;i<=1000;i++){
	ary.push(i);
}

var renderFriendList = timeChuck(ary,function(n) {
	var div = document.createElement('div');
 		div.innerHTML = n;
 		document.body.appendChild(div);
},8);
//1s创建1000个节点改为每200ms创建8个节点。

//0.1节流 让不必要的频繁调用的函数调用较少的次数。************************************
var throttle = function (fn,interval) {
	var _self = fn,
	timer,
	firstTime = true;
	return function () {
		var args = arguments;
		_me = this;
		if(firstTime){
			_self.apply(_me,args);
			return firstTime = false; //第一次调用不需要延迟执行。
		}
		if(timer){
			return false;
		}
		timer = setTimeout(function () { //延迟一段时间执行。
			clearTimeout(timer);
			timer = null;
			_self.apply(_me,args);
		},interval||500);
	};	
};

window.onresize = throttle(function () {
	console.log(1);
},500);

//0.3惰性加载函数。**************************************************

//每次调用都要调用if else分支，不佳。
var addEvent = function (elem,type,handler) {
	if(window.addEventListener)
	return elem.addEventListener(type,handler,false);
	if(window.attachEvent){
		return elem.attachEvent('on'+type,handler);
	}
};

//解决了每次都要判断的问题，但是若没有使用过addEvent函数，这里浏览器嗅探就是多余的操作。不够完美
var addEvent = (function () {
	if(window.addEventListener){
		return function (elem,type,handler) {
			elem.addEventListener(type,handler,false);
		};
	}
	if(window.attachEvent){
		return function (elem,type,handler) {
			elem.attachEvent('on'+type,handler);
		};
	}
})();


//惰性加载，第一次出发判断并覆盖之前的函数。第二次就不要进行嗅探。perfect。
var addEvent = function (elem,type,handler) {
	if(window.addEventListener){
		//覆盖addEvent并未调用。
		addEvent = function (elem,type,handler) {
			elem.addEventListener(type,handler,false);
		};
	}
		//覆盖addEvent并未调用。
	if(window.attachEvent){
		addEvent = function (elem,type,handler) {
			elem.attachEvent('on'+type,handler);
		};
	}
	//调用
	addEvent(elem,type,handler);
};


//0.4 命名空间封装代码***********************************************
	var myApp = {};
	myApp.namespace=function(name){
	var part = name.split('.');
	var current = myApp;
	for(i in part){
		if(!current[part[i]]){
			//对象是按引用传递的，current[part[i]]={}}就修改了myApp指向的那个对象。
		current[part[i]]={}};
			//这里把current指向myApp指向的那个对象的内部对象，所以再修改current[part[i]]={}}时候，myApp就会递归地进行修改。
		current = current[part[i]];
		}};

myApp.namespace('dom.style.color') //{dom:{style:{color:{}}}};
console.dir(myApp)

//1.提炼函数。封装全局变量到局部。**************************************

//初始版本。
var cache = {};
var mult = function () {
	var args = Array.prototype.join.call(arguments,',');
	if(cache[args]){
		return cache[args];
	}
	var a = 1;
	for (var i = 0; i < arguments.length; i++) {
		a *= arguments[i];
	}
	return cache[args] = a;
};

//改进。利用变量封装。
var mult = (function() {
	var cache = {};
	return function () {
	var args = Array.prototype.join.call(arguments,',');
	if(cache[args]){
		return cache[args];
	}
	var a = 1;
	for (var i = 0; i < arguments.length; i++) {
		a *= arguments[i];
	}
	return cache[args] = a;

	};
})();



//2.惰性单例模式 **************************************************
//如果用户点击出现悬浮窗，它不应该无视用户是否点击就生成dom节点，并切换显示隐藏。而应该用户点击之后，再
//动态生成dom节点。且次悬浮窗是个单例，为了生成各种类型的节点而不需要复制代码（单一职责原则）我们将单例
//代码分离出来。
var getSingle = function(fn) {
	var result;
	return function () {
		return result || (result=fn.apply(this,arguments));
	};
};
var createLoginLayer = function () {
	var div = document.createElement('div');
	div.innerHTML = '我是登陆悬浮窗';
	div.style.display = 'none';
	document.body.appendChild(div);
};

var createSingleLoginLayer = getSingle(createLoginLayer);
//onclick = function () {
	//var loginLayer = createSingleLoginLayer();
	//div.style.display = 'block';
//}


//3.策略模式 ******************************************************
//定义一系列算法并把它们封装起来，将算法的使用和算法的实现分离开来。策略模式的程序由两部分组成，第一部分是策略类，封
//装具体的算法和计算过程，第二部分是环境类Context，接受客户的请求并委托给一个策略类。

var strategies = {
	"S":function (salary) {
		return salary*4;
	},
	"A":function (salary) {
		return salary*3;
	},
	"B":function(salary) {
		return salary*2;
	}
};

var calculateBonus = function (level,salary) {
	return strategies[level](salary);
};

console.log(calculateBonus('S',2000));


//4.代理模式:小明追MM。************************************************************
//代理B帮助代理A过滤掉一些请求。-保护代理。
//代理B帮助代理A讲某些代价昂贵的操作延迟创建，惰性创建，按需创建 —虚拟代理。

//图片预加载
var proxyImage = (function() {
	var img = new Image();
	img.onload = function () {
		myImage.setSrc(this.src); //this => img
	}
	return {
		setSrc:function(src) {
			myImage.setSrc('loding.jpg');
			img.src = src;
		}
	};
});

proxyImage.setSrc('true.jpg');

//myImage是真正需要加载true.jpg的<img>,img是一个代理对象。
//这里setSrc时候先让myImage的src为一个loading图，而img去加载真正的图，加载完成
//触发onload，让加载完成的src再覆盖到myImage上覆盖loading图。
//这里的onload，new Image都是额外的功能，放在代理里面以后不需要此功能就可以不改动本体了。
//符合开放-封闭原则。代理对象和本体对象应该拥有一样的"接口"。




//5。迭代器模式 类似array.forEach()等方法，大部分语言都已经实现**********************************

//比如文件上传，不同的浏览器有不同的写法，充斥着条件分支显然不合理
//这里分割成几个函数对象，利用迭代器遍历就可以满足开闭原则。
var getActiveUploadObj = function() {
	try{
		return new ActiveXObject("TXFTNActiveX.FTNUpload");
	}catch(e){
		return false;
	}
};

var getFlashUploadObj = function () {
	if(supportFlash()){
		var str = '<object type="application/x-shockwave-flash"></object>';
		return $(str).appendTo($('body'));
	}
	return false;
};

var getFormUploadObj = function () {
	var str = '<input name="file" type="file" class="ui-file"/>';
	return $(str).appendTo($('body'));
};

var iteratorUploadObj = function () {
	for (var i = 0,fn; fn=arguments[i++];) {
		var uploadObj = fn();
		if(uploadObj!==false){
			return uploadObj;
		}
	}
};

var uploadObj = iteratorUploadObj(getActiveUploadObj,getFlashUploadObj,getFormUploadObj);


//6。发布订阅模式 ***********************************************************************

//7。命令模式 **************************************************************************

//把请求封装成对象，和接收者解耦。
var RefreshCommand = function (receiver) {
	return {
		execute : function () {
			receiver.refresh();
		}
	};
};

//安装命令。
var setCommand = function (button,command) {
	button.onclick = function () {
		command.execute();
	};
};
//接受者是menubar
var menubar = {
	refresh:function () {
		console.log('刷新页面');
	}
};

var rcmd = new RefreshCommand(menubar);
var bt1 = document.getElementById('bt1');
setCommand(bt1, rcmd);
