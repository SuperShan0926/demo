//-------解决回调过早问题--------。


//封装的是回调函数result,让同步/异步方法testThis看起来是异步的。其实testThis还是同步执行，但result中
//的hack延迟了代码到下一个tick中。

function testThis(str,fn) {
	console.log(str);
	fn();
	// 绑定到bb
	// fn.call(bb);
}

function result(data) {
	console.log(a);
}


var a = 0;
bb = {};

var syncFun = asyncify(result);
testThis('fuckU',syncFun); //注意！！！，这里testThis仍然是同步的，变成异步的是result。封装的是回调函数，
// testThis('fuckU',result); //为了让testThis看起来像异步的一样，-------解决回调过早问题--------。
a++;

//同步／异步函数变异步。 **********************************************
function asyncify(fn) {
	var orig_fn = fn;
	var itv = setTimeout(function () {
		itv = null;
		if(fn)fn();
	},0);
	fn = null;
	return function () {
		console.log(this);
		if(itv){
			// var arg = [].slice.call(arguments);
			// var argv = [this].concat(arg);
			// console.log(this,arg);
			//此时fn已经置null，所以没有bind，需要借用orign_bind的bind。
			//??????下面的写法也可以？[this]到底是为了什么？
			fn = orig_fn.bind.apply(orig_fn,[this].concat([].slice.call(arguments)));
			// fn = orig_fn.bind(orig_fn,[this].concat([].slice.call(arguments)));
		}
		else{
			orig_fn.apply(this,arguments);
		}	
	};
}


//此方法的意思就是对同步方法进行异步封装
//因为是testThis(str,fn)是同步方法，所以会立即执行fn
//所以testThis('fuckU',result);的结果是0
//如果testThis是异步方法，则在a++后的下一个tick或者更后才会执行result，故结果为1。
//异步封装asyncify释疑：
 // 1。对于本身是异步函数：setTimeout将在下一个tick执行匿名函数内的内容。故此tick里itv不为null。如果是异步方法(例如$.ajax)
 // 则执行回调函数时候已经是下一个或者更以后的tick，这时setTimeout(fn,0)肯定已经执行，itv为null,而异步函数本身无需
 // 封装，因为fn已经置为null,执行副本orig_fn即可。注意：如果直接orig_fn(),则会把this绑定到window。故要使用orig_fn.apply(this,arguments);

 // 2。对于同步函数：这里保存一个fn的副本orig_fn就是为了hack同步函数。如果是同步函数则立刻执行，此时setTimeout还没执行，所以itv不为null
 //这是return的匿名函数执行到上面的if(),这里并未执行fn(),或者orgin_fn()，只是给fn绑定了一个this参数和相应的参数
 //真正执行fn()是在setTimeout的内部匿名函数中，虽然fn先被置空但又在return函数的if中被绑定到orig_fn，真正的调用发生在setTimeout()中，
 //此时已经进行到下一个tick,所以a++已经执行，故实现了同步方法的异步化。