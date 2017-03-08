// 利用Splice方法模拟push;

function push() {
	Array.prototype.splice.apply(this,[this.length,0].concat(
			Array.prototype.slice.apply(arguments)
		));
}

var a = [2,'aa',3];
push.call(a,'av');
console.log(a);
