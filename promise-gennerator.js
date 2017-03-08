//promise去控制generator流程
  function foo(x,y) {
         return request("http://some.url.1/?x=" + x + "&y=" + y);
         //返回promise
	}
   
   function *main() {
        try {
            var text = yield foo( 11, 31 );
            console.log(text);
       }
        catch (err) {
            console.error(err);}
       }
 	
 	var it = main();
    var p = it.next().value;
       p.then(
          function(text){
             it.next(text);
		},function(err){
             it.throw(err);
		});


//自动运行生成器直到结束。************************************************
function run(gen) {
	var args = [].slice.call(arguments,1);
	var it = gen.apply(this, args);

	return Promise.resolve().then(function handleNext(value) {
		var next = it.next(value);
		//得到next值之后判断是否done，否则就继续下一步，这里再把得到的next作为参数传入下个promise里。
		//显式的return是因为最后只能返回一个promise，这里是覆盖之前的promise，返回最后那个promise。
		return (function handleResult(next) {
			if(next.done){
				return next.value;
			}
			//没结束则继续往下走，重复之前，故递归。
			else{
				return Promise.resolve(next.value).then(handleNext,function handleErr(err) {
					return Promise.resolve(it.throw(err)).then(handleResult);
					//这里把错误一级级地传递下去直到结束，这样错误就不会被吞掉？？OMG！
				});
			}
		})(next);

	});
}