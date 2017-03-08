function *foo(x,y) {
	return x*y;
}
var it = foo(6,7);
var res = it.next();
//停在下个yeild，若无就运行结束
//{value:42,done:true}
var x = yield 2;//这里表示x未赋值。到达这一步时,yield将它前面一步的it.next()的value赋值为2,
				//而下一个it.next(val)将给x赋值为val，并执行下一个yield后面的函数表达式。



//generator控制异步流程。
//这里it.next()启动了即执行foo;并将foo的返回值赋于it.next.value,(这里应该是undifined)并暂停。
//获取data以后，执行it.next(data),将data赋予text。
 function foo(x,y) {
         ajax("http://some.url.1/?x=" + x + "&y=" + y,
             function(err,data){
		if (err) {it.throw( err );}
		else {it.next( data );}
		});
  	}

 function *main() {
         try {
             var text = yield foo( 11, 31 );
                   console.log( text );
        }
         catch (err) {
             console.error( err );
		}}
     var it = main();
     it.next();

//promise+generator见promise-generator.js
//这里用foo的返回值为promise。然后利用promise控制异步流程。
