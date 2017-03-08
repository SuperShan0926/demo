//**********************利用闭包实现重载，无敌********************************************
function addMethod(obj,name,fn) {
	var old = obj[name];
	obj[name] = function () {
		debugger;
		if(fn.length === arguments.length){
			fn.apply(this,arguments);
			return;
		}else if (typeof old === 'function'){
			old.apply(this,arguments);
			return;
		}
	};
}

var ninja = {};
var oldHell = [];
addMethod(ninja,'creep',function () {
	console.log('0 params');
});
addMethod(ninja,'creep',function (a) {
	console.log('1 params');
});
addMethod(ninja,'creep',function (a,b) {
	console.log('2 params');
});


var m = ninja['creep']();

//1.绑定阶段。
//第一次执行addMethod,old(1)指向undefined。假设判断参数相等的函数为m，ninja.whatever = m_0;
//命名来源:这里fn.len=0故为m_0。注:虽然是同一个函数m，但是因为每次的fn不同，所以obj[name]每次引用的函数m是不同的。
//第二次执行addMethod，old(2)指向第一次执行时产生的函数m。这里因为子函数中引用old形成闭包，
//所以old不会被回收，这里有2个old，分别指向undefined和m_0,虽然后面obj[name]被覆盖，但old已经保存了上一个未覆盖的
//m_0的引用。
//第三次执行addMethod，old(3)指向m_1,并覆盖obj[name]为m_2。
//2.调用阶段。
//传入0个参数时，此时调用的obj[name]为m_2，故fn.length为2，所以不匹配，调用old(3)指向的函数(m_1),m1的fn.len=1;
//又不匹配顾调用old(2),指向m0，此时匹配，输出"0 params";
//传入1个参数类似，比上一种更简单，略。
//传入3个参数则一直不匹配。最后指向m_0，为undefined，不是Function类型。故不存在apply函数。
