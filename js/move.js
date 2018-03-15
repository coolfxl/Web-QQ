//运动函数封装
function move(obj,attrs,callBack){
	var json = {};//用于存储遍历attrs中的值
	var arr = [];//用来保存运动的时间
	for(var attr in attrs){
		json[attr] = {};
		//起始位置
		if(attr == 'opacity'){
			json[attr].b = Math.round( css(obj,attr)*100 );
		}else{
			json[attr].b = parseFloat( css(obj,attr));
		}
		//总距离
		json[attr].c = attrs[attr].target - json[attr].b;

		//运动持续时间
		json[attr].d = attrs[attr].duration;

		//保存运动的总时间
		arr.push( json[attr].d );
	}

	//得出最大运动时间
	var d = Math.max.apply(null,arr);
	
	//起始运动时间
	var startTime = +new Date();

	clearInterval( obj.timer );
	obj.timer = setInterval(function(){
		//已过去的时间
		var t = +new Date() - startTime;
		if(t >= d){
			t = d;
			clearInterval( obj.timer );
		}
		for(var attr in json){
			json[attr].t = t;

			if(json[attr].t >= json[attr].d){
				json[attr].t = json[attr].d
			}
			//给对应属性赋值
			if(json[attr].t <= json[attr].d){
				var value = Tween[attrs[attr].fx](//调用tween函数 指定运动类型，并且传参
					json[attr].t,
					json[attr].b,
					json[attr].c,
					json[attr].d
				)
				if(attr == 'opacity'){
					obj.style[attr] = value/100;
					obj.style[attr] = 'apha(opacity('+ value +'))';
				}else{
					obj.style[attr] = value+'px';
				}
			}
			if(t === d){
				callBack&&callBack();
			}
		}
	},30)
}


/*
* t : time 已过时间
* b : begin 起始值
* c : count 总的运动值
* d : duration 持续时间
* */

//Tween.linear();

var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}

//抖动函数封装
function shake(obj,dir,endFn){
	var arr=[];//生成的要抖动的距离数组
	var n=0;//数组从0开始
	var len=20;//抖动的最大距离
	var timer=null;//定时器初始化
	if(!obj[dir]){//目的是获得第一次鼠标移入的时候，抖动的初始位置（一开始obj是没有num属性的，所以给它添加一个num属性保存初始值，这样防止对此移入移出，每次都获得一个不同的'初始值'，让它每次都在初始值的位置开始抖动）
		//var obj.num=obj.num||obj.num
		obj[dir]=parseFloat(css(obj,dir));
	}
	for(var i=len;i>0;i-=2){//抖动的距离是从大到小的，每次距离都是（这里设置的是偶数）一次减小的
		arr.push(i,-i);//生成同样的正数和负数
	}
	arr.push(0);//最后回到原始位置
	//console.log(arr);
	clearInterval(timer);//清除上一个定时器，开启下一个定时器
	timer=setInterval(function(){
		n++;
		if(n>arr.length-1){//超过数组长度停止定时器
			clearInterval(timer);
			
			endFn&&endFn();
		}
		obj.style[dir]=arr[n]+obj[dir]+'px';
	},30);
	
}

//获取样式
function css(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}