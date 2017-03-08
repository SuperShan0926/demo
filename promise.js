//1.
	//OK 链式流解决 callback hell 。return的这个promise将会代替then返回的promise并传递下去。
	 request("http://some.url.1/")
	     .then(function(response1){
	return request("http://some.url.2/?v=" + response1);})
	     .then(function(response2){
	         console.log(response2);
	});

	 //not good 又回到callback hell中。
	  request( "http://some.url.1/" )
	     .then( function(response1){
				request( "http://some.url.2/?v=" + response1 )
				.then(function(response2) {
					console.log(response2);
			  });
			});

//2. promise.resolve()的结果是完成或者拒绝，不一定就是完成。
	// 用一个被拒绝的promise完成这个promise
	var rejectedPr = new Promise(function(resolve,reject){
		resolve(Promise.reject("Oops"));
	});

	
     rejectedPr.then(
         function fulfilled(){
			//never reach here.        
 			},
         function rejected(err){
             console.log( err ); // "Oops"
            });


//3。抛出的错误是给下一个promise处理，promise一经过决议就不能再改变。
 var p = Promise.resolve( 42 );
     p.then(function fulfilled(msg){
			// 数字没有string函数。msg.toLowerCase会报错。
             console.log(msg.toLowerCase());
         },
			function rejected(err){ 
			//never reach here。         
		 });

//这里的错误处理函数是为p准备的，而p用42填充，已经完成，promise p是不可变的	所以这里的错误会被
//p.then()返回的那个promise处理，在这个例子中我们并没有捕捉。




 function getY(x) {
         return new Promise( function(resolve,reject){
             setTimeout(function(){
                 resolve((3*x)-1);
				},100);});
		}

 function foo(bar,baz) {
         var x = bar * baz;
         return getY( x )
         .then( function(y){
             return [x,y];
         });
     }

foo(10,20).then(function(msgs) {
	var x = msg[0];
	var y = msg[1];
	console.log(x,y);
});
//为了减少性能开销，这里可以
foo(10,20).then(Function.prototype.apply.bind(function(x,y){
	console.log(x,y);
}),null);

//这里能解构赋值的原因是，将msgs传给apply的第二个参数，第一个参数是bind传给的null。
// bind传给的匿名函数fn用来绑定apply中的this。调用即等价于fn.apply(null,msgs)
//而msgs=[200,599]就会相当于fn(200,599),直接实现解构。
// fn.apply(null,[a,b]) === fn(a,b) 实现解构。


//实现promisify: *******************************************
//@...fn:某个error-first风格的异步函数。
function promisify(fn) {
	return function () {
		var arg = [].slice.call(arguments);
		return new Promise(function(resolve,reject) {
			fn.apply(null,arg.concat(function(err,data) {
				if(err)reject(err);
				resolve(data);
			}));
			//即fn(url,cb)
		});
	};
}

//ajax(url,cb) => requst = promisify(ajax);
//request(url).then(cb)  arguments --- url


function pro(fn) {
	return function () {
		var args = [].slice.call(arguments);
		return new Promise(function (resovle,reject) {
			fn.apply(null, args.concat(function(err,data) {
				if(err)reject(err);
					resolve(data);
			}));
		});

	};
}


