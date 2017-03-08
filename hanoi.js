function hanoi(N,a,b,c) {
	if(N>0){
		hanoi(N-1,a,c,b);
		console.log('移动 盘'+N+' 从 '+a+' 柱到 '+c+' 柱,此时'+a+'柱'+((6-N)>0?6-N:0)+'个,'+b+'柱'+(N-1)+'个,'+c+'柱1个。'
			);

		hanoi(N-1,b,a,c);
	}
}

hanoi(6,'左','中','右');