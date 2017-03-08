Array.prototype.maaap = function (cb) {
	for(var i=0;i<this.length;i++){
		cb(this[i]);
	}
};

function logg(str) {
	console.log(str*2);
}

[1,32,44].maaap(logg);

