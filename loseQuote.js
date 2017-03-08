//递归中引用丢失。
var ninja = {
	chirp:function (n) {
		return n>1?ninja.chirp(n-1)+'-chirp':'chirp';
	}
}

var samurai = {chirp:ninja.chirp};
ninja = {};
samurai.chirp(3); //ninja置为空，引用丢失,将不能正常工作。

//改进1
	var ninja = {
	chirp:function (n) {
		return n>1?this.chirp(n-1)+'-chirp':'chirp';
	}
};

//换成this,此时samurai.chirp(3)中this指向samurai，不会丢失，解耦了对象的关联
//但this必须保证samurai和ninja的方法名都为chirp，方法名的关联还没解耦。


//改进2 内联命名函数。
	var ninja = {
		chirp:function signal(n) {
			return n>1?signal(n-1)+'-chirp':'chirp';
		}
	}

	var samurai = {cppp:ninja.chirp};
	samurai.cppp(3);
	//这里内联命名函数的作用就是解耦了方法名的关联，至此，samurai和ninja没有任何关联，也不会互相影响了。

