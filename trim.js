//trim()函数的实现。
function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

console.log(trim('   aaa     ').length);
