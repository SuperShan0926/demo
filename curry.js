//函数curry化。

function curry() {
var that = this,
	arg	 = Array.prototype.slice.apply(arguments);
	console.log(arguments,arg);
	return function () {
		var argu = Array.prototype.slice.apply(arguments);
		console.log(that,arg,argu);
		return that.apply(null, argu.concat(arg));
	};	
}


function add(num1,num2) {
	return num1 + num2;
}
var add3 = curry.call(add,3);
console.log(add3(59));


//小技巧。 (未完待续)
//!!转换为等效的布尔值。
//!function 把函数声明变为函数表达式。


//改进代码的策略:(未完待续)
 //1.利用策略模式减少if else。利用惰性单例降低开销，节流函数降低多的性能消耗(每几秒只调用一次)。时分函数将大消耗的东西
 //分成时间块执行。利用闭包和iife封装全局变量。
 (function () {
  var a ;
  return function () {
    a++;
  } 
 })()
 var a;//undefined;
 //2.缓存一些计算过的结果，Dom节点等，降低消耗。
 //3.import编译时候加载，只能放在文件头部;require 运行时加载，可以放在任何地方

 typeof void 0;//得到"undefined"
console.log(void 0); //输出undefined

