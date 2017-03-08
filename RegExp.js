    。1.字面量模式
         /test/g
    。2.构造函数模式
        var pattern = new RegExp("test"，"g")
        //区别：构造器方式是在运行时动态构建正则使用的。可以动态传入一些参数
        例：let className = document.getElementById('qqq');
            new RegExp("^(\\s)"+className+("\\s|$"));

    。? 可以出现一次或者根本不出现。（字符后）
    。+ 一次或多次
    。* 0次或多次
    。/q{4,10}/ 表示出现q 4-10次
    。[abc] 匹配abc中的一个字符。
    。？也可表示非贪婪模式。匹配一次就终止。（操作符后）
       /a+?/只匹配一个a

    \d [0-9]
    \D [^0-9]
    \w [A-Za-z0-9]
    \W [^A-Za-z0-9]
    \s 匹配空白字符
    \S 匹配非空白字符。

    \1可表示反向引用

    。match在匹配局部表达式时，返回的结果第一个总是完整的匹配。后面是每一个捕获组的结果。
    。match在匹配局部表达式时，返回的是完整匹配的所有结果的合集。看不到捕获组。

    ?:表示（）只执行分组功能不进行捕获



    。2个例子
 ====== 驼峰替换成"-"形式
        fontFamily  =>  font-family

          function change1(str) {
            str.replace(/([A-Z])/g,"-$1").toLowerCase();
          }

  ====== "-"形式替换成驼峰形式
        replace中使用函数替换
          函数的参数列表：
             1.匹配的完整文本
             2.匹配的捕获，一个捕获对应一个参数
             3.匹配字符在源字符串中的索引
             4.源字符串
            
             function upper(all,letter){
              return letter.toUpperCase()
            }

            function change2(str) {
              str.replace(/-(w+)/g,upper);
            }