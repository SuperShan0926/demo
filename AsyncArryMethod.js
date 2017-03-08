// JS本身是单线程的，无法异步执行，因此我们可以认为setTimeout这类JS规范之外的由运行环境提供的特殊函数做的事情是创建一个平行线程后立即返回，让JS主进程可以接着执行后续代码，并在收到平行进程的通知后再执行回调函数。除了
// setTimeout、setInterval这些常见的，这类函数还包括NodeJS提供的诸如fs.readFile之类的异步API。


//函数返回值

//同步方法处理，先执行fn2()得到结果之后再代入fn1中处理。
var output = fn1(fn2('input'));
//dosomething(output);



//异步方法处理。
//output1就是fn2函数执行的返回的结果
fn2('input', function(output1) {
	fn1(output1, function(output) {
		//dosomething(output);
	});
});



//同步数组方法
var i = 0,
	len = arr.length;

for (; i < len; ++i) {
	arr[i] = sync(a[i]);
}

//如果是异步执行的,这里就无法保证循环完成以后，每个数组都能够处理完成。


//异步处理串行数组方法

(function next(i, len, callback) {
	if (i < len) {
		async(arr[i], function(value) {
			arr[i] = value;
			next(i + 1, len, callback);
		});
	} else {
		callback();
	}

})(0, arr.length, function() {
	//数组中每个元素已经被处理完成。
	//这里所有元素都被处理完成以后，才会进入这个匿名回调函数中。
});

//异步处理并行数组方法。
(function(i, len, count, callback) {
	for (; i < len; i++) {
		(function(i) {
			async(a[i], function(value) {
				a[i] = value;
				if (++count === len) {
					callback();
				}
			});
		})(i); //立即执行函数为了闭包保存每次循环的i值。
	}
})(0, arr.length, 0, function() {});


//异常处理。

//对于异步的编程方法，异步函数会打断代码的执行路径t，异步函数执行
// 过程中以及执行之后产生的异常冒泡到执行路径被打断的
// 位置时，如果一直没有遇到try语句，就作为一个全局异常抛出。以下是一个例子。

function async(fn, callback) {
	// Code execution path breaks here.
	setTimeout(function()　 {
		callback(fn());
	}, 0);
}



try {
	async(null, function(data) {});
} catch (err) {
	console.log('Error: %s', err.message);
}






//这里异常在回调函数中被catch然后抛出，node的异步回调方式编程风格的第一个参数都是err。

function async(fn, callback) {
	// Code execution path breaks here.
	setTimeout(function()　 {
		try {
			//没有错误就作为回调函数第二个参数。实际调用时候if(err),没错误就是if(null),不执行。
			callback(null,fn());
		} catch (err) {
			//catch到err就作为回调函数第一个参数。
			callback(err);
		}
	}, 0);
}

	async(null, function(err,data) {
	if(err){
	console.log('Error: %s', err.message);
	}else{
		//do something...
	}
});

	//三次异步调用。。
	function main(callback) {
    // Do something.
    asyncA(function (err, data) {
        if (err) {
            callback(err);
        } else {
            // Do something
            asyncB(function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    // Do something
                    asyncC(function (err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            // Do something
                            callback(null);
                        }
                    });
                }
            });
        }
    });
}

	main(function (err) {
	    if (err) {

	    }
	});

//node 提供了domain模块，可以简化捕获异常代码的写法。
  var d = domain.create();

    d.on('error', function () {
        response.writeHead(500);
        response.end();
    });
