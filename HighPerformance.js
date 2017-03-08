//性能优化总结。


1.加载js脚本
  。所有脚本放到 </body>之前保证页面加载完成。
  。合并脚本，script标签越少，加载越快
  。无阻塞下载js脚本方法
     - 使用script的defer属性
     - 动态创建script元素并执行代码
     - 使用XHR对象下载js脚本

2.数据存取
  。全局变量在作用域的位置较深，尽量避免使用
  。避免使用with语句
  。嵌套的对象成员会明显影响性能
  。属性方法在原型链的位置越深，访问速度越慢

  =作用域链 函数被创建时作用域中的对象合集。
  =执行环境 调用函数时候创建的内部对象

  ##  任何执行上下文时刻的作用域, 都是由作用域链(scope chain)来实现。 在一个函数被定义的时候, 
      会将它定义时刻的scope chain链接到这个函数对象的scope属性。 在一个函数对象被调用的时候，会创建一个活动对象(也就是一个对象),
      然后对于每一个函数的形参，都命名为该活动对象的命名属性, 然后将这个活动对象做为此时的作用域链(scope chain)最前端,
      并将这个函数对象的scope加入到scope chain中。

3.DOM
  。最小化DOM访问次数，减少过桥费
  。多次访问某个DOM应该使用局部变量储存引用
  。经常操作合集应该拷贝到数组当中
  。使用更快的API  querySelectorALL等
  。动画使用绝对定位，拖放代理
  。使用事件委托来减少事件处理器的数量


4.正则
  几个trim:
  -  this.replace(/^\s+/,"").replace(/\s+$/,"");
  -  this.replace(/^\s+|\s+$/g,"");
  -  this.replace(/^\s*([\s\S]*?)\s*$/,"$1");

5.定时器
  。用于延迟代码执行解放UI。
  。webworks可以UI线程外部执行js代码避免锁定ui，不能修改DOM，location对象只读。
    会创建一个新的线程。适用于处理纯数据，与浏览器ui无关的长时间运行脚本。

6.ajax
  。JSON-P 图片游标:利用<img>标签。
  。MXHR可以减少请求数，响应各种文件类型，但不能缓存收到的响应。
  。减少请求数，合并js css文件，或使用MXHR。
  。缩短页面的加载时间，主要内容加载完成后，用ajax获取次要的文件。
  。利用成熟的ajax类库。

7.实践
  。避免双重求值 setTimeout setInterval，eval，new Function传入的是字符串，会先以
    正常方式求值，然后在求值过程中发起另一个求值运算，严重影响性能。
  。避免重复工作，利用延迟加载 在design-partten中有一个兼容IE的延迟加载DOM LEVEL2事件的例子。
  。条件预加载。不等函数调用，就在脚本加载期间检测是IE或标准DOM LEVEL2事件，调用时候已经不需要再判断。
  。使用速度快的部分。
        按位与 25&3      ---   1
        按位或 25|3      ---   11011
        按位亦或 25^3    ---   11010
        按位取反 ～25     ---  -11010

        例子:判断奇偶  if(i%2) 改为 if(i&1)
  。 使用原生方法 Math.PI等。

  8.构建高性能应用
    。合并js文件减少请求数
    。压缩js文件
    。服务器端使用gzip编码压缩js文件。
    。设置http响应头缓存js文件  
         Expires:Mon, 28 Jul 2017 23:30:30 GMT
    。使用CDN  内容分发网络
