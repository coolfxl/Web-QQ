
//获取元素
var weather = document.getElementById('weather');
var aBtn = weather.getElementsByTagName('a')[0];
var con = document.getElementById('con');
var h2 = con.getElementsByTagName('h2');
//获取日期
var oDate = new Date(); //获取日期。
var iM = oDate.getMonth() + 1; //获取月份
var iD = oDate.getDate(); //获取到一个月中的那一天
var iDay = oDate.getDay(); //获取星期
var arrMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var arrDay = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

//循环生成天气列表
for (var i = 0; i < h2.length; i++) {
	h2[i].innerHTML = arrMonth[iM] + '.' + (iD + i) + '.' + arrDay[iDay + i];
}

var W_assistant = document.getElementById('sjld'); //天气助手
var b_btn = document.getElementById('b_btn') //天气助手底部按钮
var wBtn = b_btn.getElementsByTagName('input');
var closeW = document.getElementById('closeW'); //关闭按钮
var wH2 = W_assistant.getElementsByTagName('h2')[0]; //天气小助手标题

var province = document.getElementById('shengfen'); //省份
var provP = province.getElementsByTagName('p')[0]; //当前选项
var provBox = province.getElementsByTagName('div')[0]; //省份盒子
var provUl = province.getElementsByTagName('ul')[0]; //省份对应列表
var provAli = provUl.getElementsByTagName('li'); //对应省份

var city = document.getElementById('chengshi'); //城市和自治区
var cityP = city.getElementsByTagName('p')[0]; //当前选项
var cityBox = city.getElementsByTagName('div')[0]; //城市盒子
var cityUl = city.getElementsByTagName('ul')[0]; //城市对应列表
var cityAli = cityUl.getElementsByTagName('li'); //对应城市

var area = document.getElementById('quyu'); //地区
var areaP = area.getElementsByTagName('p')[0]; //当前选项
var areaBox = area.getElementsByTagName('div')[0]; //地区盒子
var areaUl = area.getElementsByTagName('ul')[0]; //地区对应列表
var areaAli = areaUl.getElementsByTagName('li'); //对应地区
//循环生成省份
for (var i = 0; i < provinceList.length; i++) { //循环生成省份
	createLi(provUl, provinceList[i].name, provP, provinceList[0].name);
}

//循环生成对应的城市和地区
for (var i = 0; i < provAli.length; i++) {
	provAli[i].index = i;
	provAli[i].onclick = function() {

		provBox.style.display = 'none';
		provP.innerHTML = this.innerHTML; //初始化省份
		cityUl.innerHTML = ''; //每次都清空里面的内容，然后生成
		areaUl.innerHTML = ''; //每次都清空里面的内容，然后生成
		//根据省份生成对应的城市
		var cityList = provinceList[this.index].cityList;
		var areaList = cityList[0].areaList;

		for (var i = 0; i < cityList.length; i++) {
			createLi(cityUl, cityList[i].name, cityP, cityList[0].name);
			//根据省份生成对应的地区	
		};
		for (var j = 0; j < areaList.length; j++) {
			createLi(areaUl, areaList[j], areaP, areaList[0])
		}
		//根据城市生成的地区的操作
		for (var i = 0; i < cityAli.length; i++) {

			cityAli[i].index = i;
			cityAli[i].onclick = function() {
				var areaList = cityList[this.index].areaList;
				cityBox.style.display = 'none';
				cityP.innerHTML = this.innerHTML; //初始化省份
				areaUl.innerHTML = ''; //每次都清空里面的内容，然后生成	
				for (var i = 0; i < areaList.length; i++) {
					createLi(areaUl, areaList[i], areaP, areaList[0])
				}
				//对应的地区的操作
				fnArea();
			}
		}
		//对应的地区的操作
		fnArea();
	}
}
provAli[0].onclick(); //初始化地址

//获取数据
if (localStorage.getItem('city')) {
	searchWeather(decodeURIComponent(localStorage.getItem('city'))); //转码
} else {
	searchWeather('北京');
}
//切换
aBtn.onclick = function() {
	aBtn.style.display = 'none';
	W_assistant.style.display = 'block';

}
//保存
wBtn[0].onclick = function() {
	searchWeather(areaP.innerHTML); //查找天气
	//存储数据
	localStorage.setItem('city', encodeURIComponent(areaP.innerHTML)); //对数据进行编码

	aBtn.style.display = 'block';
	W_assistant.style.display = 'none';
	W_assistant.style.left = 0;
	W_assistant.style.top = 0;
}
//取消
wBtn[1].onclick = function() {
	aBtn.style.display = 'block';
	W_assistant.style.display = 'none';
	W_assistant.style.left = 0;
	W_assistant.style.top = 0;
}
//关闭天气小助手
closeW.onclick = function() {
	aBtn.style.display = 'block';
	W_assistant.style.display = 'none';
	W_assistant.style.left = 0;
	W_assistant.style.top = 0;
}
//拖拽天气小助手
wH2.onmousedown = function(ev) {
	ev = ev || event;
	drag(ev, W_assistant);
}

//对应的地区的操作

function fnArea() {
	for (var i = 0; i < areaAli.length; i++) {
		areaAli[i].index = i;
		areaAli[i].onclick = function() {
			areaBox.style.display = 'none';
			areaP.innerHTML = this.innerHTML; //初始化省份
		}
	}
}
//点击更改省份
provP.onclick = function() {
	provBox.style.display = 'block';
}
//点击更改城市
cityP.onclick = function() {
	cityBox.style.display = 'block';
}
//点击更改地区
areaP.onclick = function() {
	areaBox.style.display = 'block';
}
//用于创建省份、地区、城市

function createLi(type, obj, obj2, str) {
	var li = document.createElement('li');
	li.innerHTML = obj;
	type.appendChild(li);
	obj2.innerHTML = str; //初始化城市
}

//当前天气状况
var curCity = document.getElementById('curCity');
var curTips = document.getElementById('curTips');
var curTemperature = document.getElementById('curTemperature');

//今天
var T_temperature = document.getElementById('T_temperature');
var T_weather_img = document.getElementById('T_weather_img')

var T_img = T_weather_img.getElementsByTagName('img')[0];

//明天
var M_temperature = document.getElementById('M_temperature');
var M_weather_img = document.getElementById('M_weather_img')
var M_img = M_weather_img.getElementsByTagName('img')[0];

//后天
var A_temperature = document.getElementById('A_temperature');
var A_weather_img = document.getElementById('A_weather_img')
var A_img = A_weather_img.getElementsByTagName('img')[0];

//读取数据

function fn(data) {
	if (data.status == '1002') { //没有数据返回时的状态码
		alert('请输入一个正确的城市名称');
		return false;
	}
	//当前天气
	curCity.innerHTML = data.data.city;
	curTips.innerHTML = data.data.ganmao;
	curTemperature.innerHTML = data.data.wendu + '&deg;';

	function tq(obj1, obj2, num) {
		var imgsrc = dis_img(data.data.forecast[num].type);
		obj1.src = imgsrc; //图片地址
		obj1.title = data.data.forecast[num].type; //城市
		obj1.alt = data.data.forecast[num].type;
		obj2.innerHTML = (data.data.forecast[num].low).split(' ')[1] + '&deg; ~ ' + (data.data.forecast[num].high).split(' ')[1];
	}
	tq(T_img, T_temperature, 0); //今天
	tq(M_img, M_temperature, 1); //明天
	tq(A_img, A_temperature, 2); //后天

}

var style = 'qq';

function dis_img(weather) {
	//显示不同天气对应的图片
	var route = "./images/skin/weather/";
	//文件夹路径
	if (style == 'unknow') {
		var forder = 'unknow';
	} else {
		var forder = 'qq';
	}
	var style_img = route + forder + "/s_13.png";
	if (weather.indexOf("多云") !== -1) {
		//多云转晴，以下类同 indexOf:包含字串
		style_img = route + forder + "/s_1.png";
	} else if (weather.indexOf("多云") !== -1 && weather.indexOf("阴") !== -1) {
		style_img = route + forder + "/s_2.png";
	} else if (weather.indexOf("阴") !== -1 && weather.indexOf("雨") !== -1) {
		style_img = route + forder + "/s_3.png";
	} else if (weather.indexOf("晴") !== -1 && weather.indexOf("雨") !== -1) {
		style_img = route + forder + "/s_12.png";
	} else if (weather.indexOf("晴") !== -1 && weather.indexOf("雾") !== -1) {
		style_img = route + forder + "/s_12.png";
	} else if (weather.indexOf("晴") !== -1) {
		style_img = route + forder + "/s_13.png";
	} else if (weather.indexOf("多云") !== -1) {
		style_img = route + forder + "/s_2.png";
	} else if (weather.indexOf("阵雨") !== -1) {
		style_img = route + forder + "/s_3.png";
	} else if (weather.indexOf("小雨") !== -1) {
		style_img = route + forder + "/s_3.png";
	} else if (weather.indexOf("中雨") !== -1) {
		style_img = route + forder + "/s_4.png";
	} else if (weather.indexOf("大雨") !== -1) {
		style_img = route + forder + "/s_5.png";
	} else if (weather.indexOf("暴雨") !== -1) {
		style_img = route + forder + "/s_5.png";
	} else if (weather.indexOf("冰雹") !== -1) {
		style_img = route + forder + "/s_6.png";
	} else if (weather.indexOf("雷阵雨") !== -1) {
		style_img = route + forder + "/s_7.png";
	} else if (weather.indexOf("小雪") !== -1) {
		style_img = route + forder + "/s_8.png";
	} else if (weather.indexOf("中雪") !== -1) {
		style_img = route + forder + "/s_9.png";
	} else if (weather.indexOf("大雪") !== -1) {
		style_img = route + forder + "/s_10.png";
	} else if (weather.indexOf("暴雪") !== -1) {
		style_img = route + forder + "/s_10.png";
	} else if (weather.indexOf("扬沙") !== -1) {
		style_img = route + forder + "/s_11.png";
	} else if (weather.indexOf("沙尘") !== -1) {
		style_img = route + forder + "/s_11.png";
	} else if (weather.indexOf("雾") !== -1) {
		style_img = route + forder + "/s_12.png";
	} else {
		style_img = route + forder + "/s_2.png";
	}

	return style_img;
}

function searchWeather(strCity) {

	//创建srcipt标签
	var script = document.createElement('script');
	//引入地址
	script.src = 'http://wthrcdn.etouch.cn/weather_mini?city=' + strCity + '&callback=fn';
	//插入页面
	document.body.appendChild(script);
}

//拖拽并限定范围

function drag(ev, obj) {
	var disX = ev.clientX - obj.offsetLeft;
	var disY = ev.clientY - obj.offsetTop;
	document.onmousemove = function(ev) {
		ev = ev || event;
		var x = ev.clientX - disX;
		var y = ev.clientY - disY;
		var maxL = document.documentElement.clientWidth - obj.offsetWidth;
		var maxT = document.documentElement.clientHeight - obj.offsetHeight;

		obj.style.left = (x) + 'px';
		obj.style.top = (y) + 'px';
	}
	document.onmouseup = function() {
		document.onmousemove = document.onmouseup = null;
	};
	return false;
}