function curry() {
	var arg = Array.prototype.slice.apply(arguments);
	    that = this,
	    Aproto = Array.prototype ;
	// console.log(arg);
	    return function () {
			finalArg = Aproto.concat(arg,Aproto.slice.apply(arguments));
			return that.apply(null, finalArg);
	    };
}


function add() {
	var sum = 0;
	//把参数arguments变成数组。
	var arg = Array.prototype.slice.apply(arguments);
	for (var i = 0; i < arg.length; i++) {
		sum += arguments[i];
	}
	return sum;
}

add1 = curry.call(add,10,24,555);
console.log(add1(33,5555));

