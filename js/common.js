//设置cookie

function setCookie(attr, value, d) {
	//获取日期对象
	var date = new Date();
	//设置过期时间
	date.setDate(date.getDate() + d);
	//设置cookie信息
	document.cookie = attr + '=' + value + ';expires=' + date.toUTCString();
}
//获取cookie
var keyValue = []; //用来存储分割后的cookie信息

function getCookie(key) {
	var cookies = document.cookie.split('; ');
	for (var i = 0; i < cookies.length; i++) {
		keyValue = cookies[i].split('=');
		//这粗心大意啊，==写成了=
		if (keyValue[0] == key) {
			return keyValue[1];
		}
	}
}
//删除cookie

function removeCookie(key) {
	setCookie(key, '', -1);
}

//封装函数用于获取元素自身的样式（样式表、行间均可）

function getStyle(obj, attr, iPx) {
	var value;
	if (obj.currentStyle) {
		value = obj.currentStyle[attr];
	} else {
		value = getComputedStyle(obj, false)[attr];
	}
	if (iPx) {
		value = parseFloat(value);
	}
	return value;
}

//获取class封装函数

function getClass(className, context) {
	//如果没有出入从哪获取，那么默认就是从body下面获取
	context = context || document.body;
	//将出入的className分割成数组
	var classNames = className.split(',');
	//通过tagName方式找到指定的context下面的所有标签
	var elems = context.getElementsByTagName('*');
	var arr = []; //用于保存符合要求的标签
	var classse;
	//如果不等于-1说明传入的可能是'div1,div2'或者是一个div1
	if (className.indexOf(',') != -1) {
		//循环元素
		for (var i = 0; i < elems.length; i++) {
			//循环元素获得元素的className
			classse = elems[i].className.split(' ');
			//如果元素的className和传入的className相同就添加进数组
			if (fn(classse, classNames)) {
				arr.push(elems[i]);
			}
		}
	} else {
		//将传入的className分割形成数组
		classNames = className.split(' ');
		//循环元素
		for (var i = 0; i < elems.length; i++) {
			//通过循环元素获得每个元素身上的className
			classse = elems[i].className.split(' ');
			//循环每个元素身上的className
			for (var j = 0; j < classse.length; j++) {
				//循环传入的className
				for (var k = 0; k < classNames.length; k++) {
					//将元素身上的className和传入的className进行对比
					if (classse[j] === classNames[k]) { //如果相同，那么就表示找到了这个元素
						arr.push(elems[i]); //如果找到了就不在进行查找，避免找到重复的元素
						k = className.length; //找到了就结束内层循环
						j = classse.length; //找到了就结束外层循环
					}
				}
			}
		}
	}
	//循环结束 所有合适的元素都已经被找到了，然后返回存这些元素的数组。
	return arr;
}
//将出入的class和元素身上的className进行比较

function fn(classse, classNames) {
	//如果classse中包含name
	for (var i = 0; i < classNames.length; i++) {
		if (arrIndexOf(classse, classNames[i]) == -1) {
			return false;
		}
	}
	return true;
}
//查找数组中某一项

function arrIndexOf(arr, s, start) {
	//如果传入起始位置，就从起始位置，否则从0开始
	start = start || 0;
	//遍历数组
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === s) { //如果找到就返回这个元素下标
			return i;
		}
	}
	return -1; //如果循环结束的时候还没有找到就返回-1;
}

//实现删除class功能（删除的是一组元素中的class）

function clearClass(obj, className, start, end) { //这里的obj是一组元素
	start = start || 0;
	end = end || obj.length;
	for (var i = start; i < end; i++) {
		removeClass(obj[i], className); //找到每一个，清除出入的className
	}
}
//添加class

function addClass(obj, className) {
	if (obj && obj.nodeType === 1) { //首先判断obj是否存在，然后在判断obj的节点类型,如果是元素节点，那么就添加class

		//获得obj的className，将其分割形成数组
		var classNames = obj.className.split(' ');

		//遍历数组同出入的className进行比较，如果相等就不再添加class
		if (arrIndexOf(classNames, className) === -1) {
			// obj.className=obj.className+' '+className
			obj.className += ' ' + className;
		}

	}
}
//移出class

function removeClass(obj, className) {
	//'first green hover'
	if (obj && obj.nodeType === 1) { //首先判断obj是否存在，存在就进行下面的操作，看它的节点类型元素节点，是元素节点就添加class
		//'hover hovers' 将传入的className分割
		var classse = className.split(' ');
		//将obj的className分割成数组
		var classNames = obj.className.split(' ');
		//先查找一次，拿到查找到的结果
		var n;
		for (var i = 0; i < classse.length; i++) {
			n = arrIndexOf(classNames, classse[i]);
			//如果n不等于-1说明找到了，就可以进入循环删掉对应的
			while (n !== -1) {
				//找到就进行删除
				classNames.splice(n, 1);
				//然后将将n赋值，继续进行查找（ps 为了防止有重复项跳过，这里规定第二次和以后的起点是从n-1开始的）
				n = arrIndexOf(classNames, className, n - 1);
			}
		}
		//最后添加class（将跟出入的className同名的都移除，把不一样的添加回去）
		obj.className += classNames.join(' ');

	}
}
//查找数组中的元素

function arrIndexOf(arr, s, start) {
	start = start || 0; //如果没有出入起始点，那么就从0开始
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === s) {
			return i; //如果查找到数组中的s，那么就返回s的下标
		}
	}
	return -1; //如果遍历完没有找到就返回-1
}
//class切换（就是class样式的切换）

function toggle(obj, className) {
	if (obj && obj.nodeType === 1) { //如果obj存在并且是元素节点，就进行下面的操作
		//将obj的className分割成数组，进行判断
		var classNames = obj.className.split(' ');
		if (arrIndexOf(classNames, className) == -1) {
			//如果不存在就添加
			addClass(obj, className);
		} else {
			//如果存在就删除
			removeClass(obj, className);
		}
	}
}
//绑定事件函数封装

function bind(obj, eventType, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(eventType, function() {
			fn.call(this);
		}, false)
	} else {
		obj.attachEvent('on' + eventType, function() {
			fn.call(this);
		})
	}
}