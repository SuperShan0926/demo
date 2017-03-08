function logArr(arr) {
	var x = arr[0];
	var y = arr[1];
	console.log(x,y);
}

//实现解构赋值。 ***************************************************
function spread(fn) {
	return Function.apply.bind(fn,null);
}

//var logSpreadArr = spread(fnn);//=>一个封装了apply本身的this为fnn的apply函数。
//常见的apply是：add.apply({a:33},[2,3]); 这个是绑定add函数中的this为{a:33}。
							// function add(x,y) {
							// 	console.log(x+y+this.a);
							// }

				// add() => this  - window 
				// o.add() => this - o
				// add.apply(o) => this - o
				// add.bind(o) => this - o
				// add.apply.bind(fn,null) => Function.apply.bind(fn,null) this - fn 
				// 调用此函数 相当于=> fn.apply(null,args)



function add(x,y) {
	console.log(x+y+this.a);
}

function fnn(x,y) {
	console.log(x,y);
}

// var asm = spread(add);

// logArr([3,4]);
// logSpreadArr([3,4]);
// fnn.apply(fnn,[5,6]);
// Function.apply(fnn,[8,8]);


// f.bind(o)=>函数f的this对象被绑定为o，若不绑定，直接调用f()=>window.f()=>this指向window;
// 因为绑定this为o所以相当于o.f();就算o没有定义f也可以调用，这就是借用的意义。

// =>所以这里var aa = apply.bind(fn,null),当aa调用(aa(args))，就相当于fn.apply(null,args);
// 解释：
// 这里，bind中的null是传给函数apply的参数。即绑定apply的第一个参数为null(this为null)，即所以只需要传第二个参数。
// aa(23) =>  fn.apply(null, 23);

// Function.bind.apply(fn,[null]) === fn.bind(null)

function ff() {
	console.log(this.a);
}

var o = {a:23};

var mm = Function.bind.apply(ff,[o]);
var kk = ff.bind(o);

mm();
kk();





