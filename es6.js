// 使用新的ES6方式
function foo(...args) {
    // `args`已经是一个真正的数组了
    // 丢弃`args`中的第一个元素
    args.shift();
    // 将`args`的所有内容作为参数值传给`console.log(..)`
    console.log(...args,args);
}

foo(1,2,3,4);