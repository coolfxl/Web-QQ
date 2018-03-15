window.onload = function() { /*-------------------------------顶部功能----------------------------------*/
	var gn = document.getElementById('gn');
	var gn_btn = gn.getElementsByTagName('a');
	var clientW, clientH; //可视区
	/*-------------------------------顶部换肤功能----------------------------------*/
	var web_pf = document.getElementById('web_pf');
	var oImg = web_pf.getElementsByTagName('img')[0]; //要换的皮肤
	var pf_box = document.getElementById('pf_box');
	var bg_yl = document.getElementById('bg_yl'); //预览
	var bg_con = document.getElementById('bg_con');
	var bg_ul = bg_con.getElementsByTagName('ul'); //图片区域
	var sq = document.getElementById('sq'); //收起
	var imgonOff = true; //用于判断是否为开启点击document收起皮肤列表
	//点击换肤
	gn_btn[0].onclick = function(ev) {
		ev = ev || event;
		move(pf_box, {
			'height': {
				target: 246,
				duration: 500,
				fx: 'linear'
			},
			'opacity': {
				target: 100,
				duration: 500,
				fx: 'linear'
			}
		});
		//读取缓存
		if (localStorage.getItem('ftpImg')) {
			bg_yl.style.background = 'url(' + localStorage.getItem('ftpImg') + ')';
		} else {
			if (getCookie('bg')) {
				var str = getCookie('bg').substring(12);
				bg_yl.style.background = 'url(images/pf/' + str + ')';
			}
		}

		imgonOff = false; //用于判断点击document是否关闭
		ev.cancelBubble = true; //阻止事件冒泡 防止在菜单未打开之前触发document的点击事件	
	}
	//阻止冒泡	
	pf_box.onclick = function(ev) {
		ev = ev || event;
		ev.cancelBubble = true; //打开之后阻止冒泡，防止触发document的点击事件

	}
	//点击document，消失菜单
	bind(document, 'click', function() {
		if (!imgonOff) {
			sq.onclick();
		}
	})

	for (var i = 0; i < bg_ul.length; i++) {
		fnBg(bg_ul[i]); //预览图片
	} /*----------------------自定义图片---------------------*/
	//自定义图片
	var ftpImg = document.getElementById('ftpImg');
	var upFileBtn = document.getElementById('upFileBtn'); //上传按钮
	var upImg = document.getElementById('upImg'); //上传按钮控件
	var ftpArea = ftpImg.children[0];
	var demand_info = document.getElementById('demand_info'); //上传前信息提示
	var btn_box = document.getElementById('btn_box');
	var aBtn = btn_box.getElementsByTagName('input'); //确定和取消按钮
	var ftp_info = document.getElementById('ftp_info');
	var fInfo = ftp_info.getElementsByTagName('p'); //上传信息
	var pf_files; //文件控件
	upFileBtn.onclick = function() { //点击按钮触发上传按钮的点击事件
		upImg.click();
	}
	//能够监控到上传状态
	upImg.onchange = function() {
		//获取上传文件
		pf_files = this.files[0];

		//判断是否是图片类型
		if (pf_files && pf_files.type.indexOf('image') == -1) {
			alert('只能支持image类型的上传');
			return;
		}
		//判断是否是图片类型
		if (pf_files && (pf_files.size / 1027).toFixed(2) + 'k' >= '200k') {
			alert('上传的图片大小应该为200k');
			return;
		}
		demand_info.style.display = 'none'; //隐藏上传须知框
		ftp_info.style.display = 'block'; //显示上传信息框

		//获取图片的名称和大小
		fInfo[0].innerHTML = '图片名称: ' + pf_files.name;
		fInfo[1].innerHTML = '图片大小: ' + (pf_files.size / 1027).toFixed(2) + 'k'; //进制转换

		readFile1(pf_files); //将文件写入内存，供js访问文件
	}
	//文件写入内存函数封装
	var img;

	function readFile1(f) {
		//利用HTML5提供的对象，将指定的内容写入缓存，从而使js能够访问系统文件
		var fr = new FileReader();
		//在写入文件的时候触发		
		fr.onload = function(ev) {
			ev = ev || event;
			var m = ev.total;
			//创建img对象
			if (arrIndexOf(arr, m) == -1) {

				if (!img) {
					img = document.createElement('img');
				}
				img.src = ev.target.result;
				fInfo[2].innerHTML = '图片尺寸: ' + img.width + '*' + img.height;
				ftpArea.appendChild(img);

				var ftp_pf = ftpArea.getElementsByTagName('img')[0]; //预览区域的图片
				//预览上传图片
				ftp_pf.onmouseover = function() {
					bg_yl.style.background = 'url(' + this.src + ')';
				}
				ftp_pf.onmouseout = function() {
					//读取缓存
					if (localStorage.getItem('ftpImg')) {
						bg_yl.style.background = 'url(' + localStorage.getItem('ftpImg') + ')';
					} else {
						if (getCookie('bg')) {
							var str = getCookie('bg').substring(12);
							bg_yl.style.background = 'url(images/pf/' + str + ')';
						}
					}
				}
				//点击使用图片
				aBtn[0].onclick = function() {
					oImg.src = ftp_pf.src;
					removeCookie('bg')
					localStorage.setItem('ftpImg', 'php/uploads/' + pf_files.name);
				}
			}
		}
		//将文件写入内存中 将文件读取为DataURL
		fr.readAsDataURL(f);

	}

	//收起
	aBtn[1].onclick = function() {
		sq.onclick();
	}
	//用于监控上传状态且将上传的文件存储到指定的文件夹内
	bind(aBtn[0], 'click', function() {
		upfile();
	})
	//上传

	function upfile() {
		//创建ajax对象。
		var xhr = new XMLHttpRequest();
		//设置请求为post。
		xhr.open('post', './php/post_file.php', true);
		//监控上传的状态。
		xhr.upload.onprogress = function(ev) {
			console.log('上传成功');
		}
		//创建格式化处理对象。
		var fd = new FormData();
		//将文件添加进格式化处理对象。
		fd.append('file', pf_files);
		//将格式化处理对象，发送给后台。
		xhr.send(fd);
	}
	//预览图片

	function fnBg(obj) {
		var li_img = obj.getElementsByTagName('img');
		for (var i = 0; i < li_img.length; i++) {
			li_img[i].onmouseover = function() {
				bg_yl.style.background = 'url(' + this.src + ')';
			}
			li_img[i].onmouseout = function() {
				//读取缓存
				if (localStorage.getItem('ftpImg')) {
					bg_yl.style.background = 'url(' + localStorage.getItem('ftpImg') + ')';
				} else {
					if (getCookie('bg')) {
						var str = getCookie('bg').substring(12);
						bg_yl.style.background = 'url(images/pf/' + str + ')';
					}
				}
			}
			li_img[i].onclick = function() {
				//images/pf/53.jpg
				var str = this.src.match(/\/(\w+\.(?:png|jpg|gif|bmp))$/i)[1]
				oImg.src = 'images/pf/bg' + str + '';
				setCookie('bg', 'images/pf/bg' + str + '', 30);
				localStorage.removeItem('ftpImg'); //不是用户上传的话需要清除cookie
			}
		}
	}
	//收起换肤
	sq.onclick = function() {
		move(pf_box, {
			'height': {
				target: 0,
				duration: 500,
				fx: 'linear'
			},
			'opacity': {
				target: 0,
				duration: 500,
				fx: 'linear'
			}
		})
	}

	var zt = document.getElementById('zt');
	var a_zt = zt.getElementsByTagName('a');
	var aNum = 0;

	//切换换肤选项
	for (var i = 0; i < a_zt.length; i++) {
		a_zt[i].index = i;
		a_zt[i].onclick = function() {
			a_zt[aNum].className = ''; //清除上一个
			bg_ul[aNum].className = '';
			this.className = 'active'; //添加当前的
			bg_ul[this.index].className = 'onOff';
			aNum = this.index; //将当前的索引值赋值给之前的aNum

		}
	} /*------------------------------顶部登陆和注册--------------------------*/
	var login = document.getElementById('login');
	var reg_btn = login.getElementsByTagName('a')[0];
	var close_g = login.getElementsByTagName('span')[0]; //登陆关闭
	var land = document.getElementById('land');
	var close_d = land.getElementsByTagName('span')[0] //注册关闭

	var land_status = document.getElementById('land_status'); //登陆状态
	var land_pic = document.getElementById('land_pic'); //登陆状态显示的图片

	//顶部登陆按钮
	gn_btn[1].onclick = function() {
		user.value = ''; //初始化
		pas.value = ''; //初始化
		reg_land(login, 350, true);
		login.style.display = 'block';
		land.style.display = 'none';
	}
	//顶部注册按钮
	gn_btn[2].onclick = function() {
		username.value = ''; //初始化
		password.value = ''; //初始化
		password1.value = ''; //初始化
		man.checked = 'checked'; //初始化
		status(username, aSpan[2], '*请输入您的手机号', true); //初始化
		status(password, aSpan[4], '*密码为6-12个字符区分大小写', true); //初始化
		status(password1, aSpan[6], '*请再次输入密码', true); //初始化
		reg_land(land, 430, true);
		login.style.display = 'none';
		land.style.display = 'block';
	}

	//点击登陆窗口中的注册
	reg_btn.onclick = function() {
		reg_land(login);
		reg_land(land, 430, true);

	}
	//点击x取消登陆
	close_g.onclick = function() {
		reg_land(login);

	};
	//点击x取消注册
	close_d.onclick = function() {
		reg_land(land);

	}
	//注册登陆显示和取消函数封装

	function reg_land(obj, height, result) {
		if (result) {
			obj.style.display = 'block';
			clientW = document.documentElement.clientWidth;
			clientH = document.documentElement.clientHeight;
			var _left = Math.floor((clientW - obj.offsetWidth) / 2);
			var _top = Math.floor((clientH - height) / 2);
			obj.style.left = _left + 'px';
			//login.style.top = _top+'px';
			move(obj, {
				'opacity': {
					target: 100,
					duration: 1000,
					fx: 'bounceOut'
				},
				'top': {
					target: _top,
					duration: 1000,
					fx: 'bounceOut'
				},
				'height': {
					target: height,
					duration: 300,
					fx: 'linear'
				}
			})
		} else {
			move(obj, {
				'opacity': {
					target: 0,
					duration: 700,
					fx: 'linear'
				},
				'top': {
					target: 0,
					duration: 700,
					fx: 'linear'
				},
				'height': {
					target: 0,
					duration: 700,
					fx: 'linear'
				}
			})
		}
	} /*-------------------------注册验证---------------------------------------*/
	var land = document.getElementById('land');
	var username = document.getElementById('username');
	var password = document.getElementById('password');
	var aSpan = land.getElementsByTagName('span');
	var submit = document.getElementById('submit');
	var r_man = document.getElementById('man');
	var r_woman = document.getElementById('woman');
	var regPhone = /^1[3|4|5|8][0-9]\d{8}$/; //匹配手机号
	var regPassword = /^[A-Za-z0-9]{6,12}$/; //匹配密码
	var valU, valP, valP1, valS = man.value,
		imgSrc = 'man'; //默认值是男;

	//验证用户名 手机
	username.onfocus = function() {
		setInterval(function() {
			valU = username.value;
		}, 10)
	};

	username.onblur = function() {
		if (valU == '') return;
		if (valU.match(regPhone)) {
			status(username, aSpan[2], '*请输入您的手机号', true);

		} else {
			status(username, aSpan[2], '*请输入正确的手机号', false);
		}
	}
	//验证密码  必须是数字或者字母以及它们的组合
	password.onfocus = function() {
		setInterval(function() {
			valP = password.value;
		}, 10)
	};

	password.onblur = function() {
		if (valP == '') return;
		if (valP.match(regPassword)) {
			status(password, aSpan[4], '*密码为6-12个字符区分大小写', true);
		} else {
			status(password, aSpan[4], '*验证密码  必须是数字或者字母以及它们的组合', false);
		}
	}
	//再次输入密码验证
	password1.onfocus = function() {
		setInterval(function() {
			valP1 = password1.value;
		}, 10);
	};
	password1.onblur = function() {
		if (valP1 == '') return;
		if (valP1 != undefined && valP != undefined && valP1 == valP) {
			status(password1, aSpan[6], '*请再次输入密码', true);
		} else {
			status(password1, aSpan[6], '*两次输入密码不一致', false);
		}
	}
	//获取性别  男
	r_man.onclick = function() {
		valS = r_man.value;
		imgSrc = 'man';
	}
	//获取性别  男
	r_woman.onclick = function() {
		valS = r_woman.value;
		imgSrc = 'woman';
	}
	//点击注册
	register.onclick = function() {
		if (valU != undefined && valP != undefined && valP1 != undefined) {
			if (valU.match(regPhone) && valP.match(regPassword) && (valP1 == valP)) {
				var json = JSON.parse(localStorage.getItem(valU));
				if (json && json.username == valU) {
					alert('用户名已存在');
					return;
				}
				var json1 = {
					'username': valU,
					'password': valP,
					'sex': valS,
					'name': imgSrc
				}
				localStorage.setItem(valU, JSON.stringify(json1));
				alert('恭喜您注册成功');
				gn_btn[1].onclick(); //重新登陆
			}
		} else {
			alert('请注册')
		}
	}
	//判断验证对错的状态显示

	function status(obj1, obj2, str, result) {
		if (result) {
			obj1.style.border = '1px solid #c7c7c7';
			obj2.innerHTML = str;
			obj2.style.color = '#f38200';
		} else {
			obj1.style.border = '1px solid red';
			obj2.innerHTML = str;
			obj2.style.color = 'red';

		}
	} /*-------------------------登陆验证---------------------------------------*/
	var login = document.getElementById('login');
	var user = document.getElementById('user');
	var pas = document.getElementById('pas');
	var log = document.getElementById('log')
	var remember = document.getElementById('remember'); //记住密码
	var land_status = document.getElementById('land_status'); //登陆成功时的状态
	var valUser, valPas, key;
	//获取用户名
	user.onclick = function() {
		setInterval(function() {
			valUser = user.value;
		}, 10)
	}
	//获取密码
	pas.onclick = function() {
		setInterval(function() {
			valPas = pas.value;
		}, 10)
	}
	//登陆  验证密码
	log.onclick = function() {
		if (!valUser) {
			shake(user, 'left');
		};
		if (!valPas) {
			shake(pas, 'left');
		}
		if (valUser && valPas) {
			var json = JSON.parse(localStorage.getItem(valUser));
			if (!json) {
				alert('用户名不存在，请注册');

			} else if (json && (valUser == json.username && valPas !== json.password)) {

				alert('用户名或者密码有错误');

			} else if (json && (valUser == json.username && valPas == json.password)) {

				key = valUser; //保存用户名，供修改密码使用
				alert('成功登陆');
				reg_land(login, 350);

				//显示登陆状态
				reg_land(land);
				land_pic.src = 'images/gn/' + json.name + '.png';
				land_status.style.display = 'block';
				var json2 = {
					'name': json.name,
					'checked': remember.checked
				}
				localStorage.setItem('status', JSON.stringify(json2));
				if (!remember.checked) {
					user.value = '';
					pas.value = '';
				}

			}

		}
	}

	/*------------------------------修改密码------------------------------*/
	var change_password = document.getElementById('change_password');
	var ori_pas = document.getElementById('ori_pas');
	var new_pas = document.getElementById('new_pas');
	var yes = document.getElementById('yes');
	var no = document.getElementById('no');
	var valOri, valNew;
	//获取原密码
	ori_pas.onclick = function() {
		setInterval(function() {
			valOri = ori_pas.value;
		}, 10)
	}
	//获取新密码
	new_pas.onclick = function() {
		setInterval(function() {
			valNew = new_pas.value;

		}, 10)
	}
	//确定  修改密码
	yes.onclick = function() {
		var json = JSON.parse(localStorage.getItem(key)); //用于存储新的密码
		if (valOri == undefined || valOri == '') {
			shake(ori_pas, 'left');
		}
		if (valNew == undefined || valNew == '') {
			shake(new_pas, 'left');
		}
		if (valOri && valNew) {
			if (!json) {
				alert('密码错误');
			} else if (json && json.password == valNew) {
				alert('两次密码不能重复')
			} else if (json && json.password != valNew) {
				if (!valNew.match(regPassword)) {
					alert('密码必须是6-12位')
				} else {
					alert('修改密码成功');
					json.password = valNew;
					localStorage.setItem(key, JSON.stringify(json));
					reg_land(change_password, 346);
				}

			}
		}
	}
	//取消  不修改密码
	no.onclick = function() {
		ori_pas.value = '';
		new_pas.value = '';
		reg_land(change_password, 346);
	}

	/*--------------------------登陆成功时的状态-----------------------*/
	var showSpan = land_status.getElementsByTagName('span')[0]; //用户在线中
	var stali = land_status.getElementsByTagName('li');
	var jt = document.getElementById('jiantou'); //三角形
	var select = document.getElementById('select');
	var json3 = JSON.parse(localStorage.getItem('status'));
	if (json3 && json3.checked) {
		land_pic.src = 'images/gn/' + json3.name + '.png';
		land_status.style.display = 'block';

	}
	stali[0].onclick = function() {
		reg_land(change_password, 346, true);
		ori_pas.value = ''; //初始化
		new_pas.value = ''; //初始化
	}
	stali[1].onclick = function() {
		confirm('你确定要注销登陆吗?')
		land_status.style.display = 'none';
		remember.checked = false;
		//更新数据
		var json2 = {};
		json2.checked = false;
		localStorage.setItem('status', JSON.stringify(json2));
	};
	land_status.onmouseover = function() {
		showSpan.className = 'mouse';
		select.style.display = 'block';
	}
	land_status.onmouseout = function() {
		showSpan.className = '';
		select.style.display = 'none';
	}

	/*-------------------登陆窗口，注册窗口，密码修改窗口拖拽--------*/
	//login  land change_password
	var login_top = document.getElementById('login_top');
	var change_top = document.getElementById('change_top');
	var land_title = document.getElementById('land_title');
	//拖拽 登陆窗口
	login_top.onmousedown = function(ev) {
		ev = ev || event;
		drag(ev, login);
	}
	//拖拽 注册窗口
	land_title.onmousedown = function(ev) {
		ev = ev || event;
		drag(ev, land);

	}
	//拖拽 拖拽密码修改窗口
	change_top.onmousedown = function(ev) {
		ev = ev || event;
		drag(ev, change_top);
		return false; //阻止浏览器默认行为
	}

	/*---------------------------------顶部天气按钮------------------------------*/
	var weather = document.getElementById('weather');
	var close_w = document.getElementById('close');
	var weather_title = document.getElementById('weather_title');
	//点击顶部天气按钮 弹出天气对话框
	gn_btn[3].onclick = function() {
		reg_land(weather, 318, true)
	}
	//关闭天气对话框
	close_w.onclick = function() {
		reg_land(weather);
	}
	//拖拽天气对话框
	weather_title.onmousedown = function(ev) {
		ev = ev || event;
		drag(ev, weather);
		return false; //阻止浏览器默认行为
	} /*-------------------------桌面图标操作和弹出窗口操作---------------------------*/
	//点击桌面app图标
	var web_icon = document.getElementById('web_icon'); //桌面图标ID
	var aUl = web_icon.getElementsByTagName('ul'); //获取web_icon下面所有的ul
	var files_right_menu = document.getElementById('files_right_menu'); //文件夹右键
/*var moveUl = files_right_menu.getElementsByTagName('ul')[0];//文件夹上右键桌面选项ul
	var moveLi = moveUl.getElementsByTagName('li');//文件夹上右键桌面选项*/

	/*---------------------------桌面切换------------------------------------*/
	var web_top_menu = document.getElementById('web_top_menu');
	var desk_tag = document.getElementById('desk_tag');
	var topMenuLi = web_top_menu.getElementsByTagName('li');
	//desk_tag.style.width = (topMenuLi.length * topMenuLi[0].offsetWidth) + 'px'; //父级总宽度
	tab() //桌面切换

	function tab() {
		for (i = 0; i < aUl.length; i++) {
			aUl[i].style.left = i * (document.documentElement.clientWidth) + 'px';
		}
		for (i = 0; i < topMenuLi.length - 2; i++) { //去除右边两个按钮

			topMenuLi[i].index = i;
			topMenuLi[i].onclick = function() {
				for (i = 0; i < topMenuLi.length - 2; i++) { //去除右边两个按钮
					topMenuLi[i].className = '';
					//moveLi[i].className = '';

				}
				this.className = 'active';
				//moveLi[this.index].className = 'curdesk';
				createNum = wheelNum = this.index; //同步索引值
				createfile(this, this.index); //传递下标 用于创建文件夹时确定出入的位置
				var _this = this;
				move(desk_tag, {
					'left': {
						target: -_this.index * document.documentElement.clientWidth,
						duration: 300,
						fx: 'linear'
					}
				});

			}
		}
	}
	bind(window, 'resize', function() { //窗口发生改变时，更新可视区尺寸
		tab();

	})
	/*--------------------------------滚轮切换桌面---------------------------------*/
//	document.onmousewheel = fn_tag; //非firefox
//	document.addEventListener('DOMMouseScroll', fn_tag, false); //滚轮事件  针对firefox
//	var wheelNum = 0;
//
//	function fn_tag(ev) {
//		ev = ev || event;
//		//非firefox ev.wheelDelta
//		if (ev.wheelDelta) {
//
//			if (ev.wheelDelta < 0) { //向下
//				wheelNum++;
//				if (wheelNum >= 5) {
//					wheelNum = 0;
//				};
//				icon_tag(wheelNum);
//
//			} else { //向上
//				wheelNum--;
//				if (wheelNum < 0) {
//					wheelNum = 4;
//				};
//				icon_tag(wheelNum);
//
//			}
//
//		} else { //firefox ev.detail
//			if (ev.detail > 0) { //向下
//				wheelNum++;
//				if (wheelNum >= 5) {
//					wheelNum = 0;
//				};
//				icon_tag(wheelNum);
//
//			} else { //向上
//				wheelNum--;
//				if (wheelNum < 0) {
//					wheelNum = 4;
//				};
//				icon_tag(wheelNum);
//
//			}
//
//		}
//		//滚动时触发 切换桌面
//		function icon_tag(wheelNum) {
//			for (i = 0; i < topMenuLi.length - 2; i++) {
//				topMenuLi[i].className = '';
//				moveLi[i].className = '';
//			}
//			topMenuLi[wheelNum].className = 'active';
//			moveLi[wheelNum].className = 'curdesk';//给文件夹右键桌面选项添加样式
//			createfile(this, wheelNum);		
//			move(desk_tag, {
//				'left': {
//					target: -wheelNum * document.documentElement.clientWidth,
//					duration: 300,
//					fx: 'linear'
//				}
//			});
//		}
//	}
	/*----------------------------------文件搜索------------------------*/
	var searchBox = web_top_menu.getElementsByTagName('div')[0]; //搜索框
	var web_top_right = document.getElementById('web_top_right'); //桌面顶部右边按钮
	var top_right = web_top_right.getElementsByTagName('li'); //俩按钮
	//点击桌面搜索按钮 显示搜索框
	top_right[1].onclick = function(ev) {
		ev = ev || event;
		searchBox.style.display = 'block';
		ev.cancelBubble = true; //阻止冒泡
	}
	searchFile(); //文件搜索

	function searchFile() {
		var search = web_top_menu.getElementsByTagName('input')[0]; //搜索框
		var searBtn = web_top_menu.getElementsByTagName('span')[0]; //搜索按钮
		var arrAppText = []; //存储app的文件名

		var appInp = web_icon.getElementsByTagName('input');
		var appLi = web_icon.getElementsByTagName('li');
		//用于判断查找的文件是否是当前页面的
		var a = aUl[0].children.length - 1;
		var b = a + aUl[1].children.length;
		var c = b + aUl[2].children.length;
		var d = c + aUl[3].children.length;
		var e = d + aUl[4].children.length;
		for (var i = 0; i < appInp.length; i++) {
			arrAppText.push(appInp[i].value); //存储文件名称
		}
		//点击搜索
		searBtn.onclick = function() { //aUl
			for (var i = 0; i < arrAppText.length; i++) {
				if (arrAppText[i] == search.value) {
					appLi[i].className = 'hover';
					//如果不在当前桌面，就跳到指定的桌面
					if (i > a) {
						topMenuLi[1].onclick();
					}
					if (i > b) {
						topMenuLi[2].onclick();
					}
					if (i > c) {
						topMenuLi[3].onclick();
					}
					if (i > d) {
						topMenuLi[4].onclick();
					}
				}
			}
			searchBox.style.display = 'none'; //隐藏搜索框
		};
		//回车按下时也可以取消焦点
		document.onkeydown = function(ev) {
			ev = ev || event;
			if (ev.keyCode == 13) {
				searBtn.click();
				search.blur();
			}
		}
	}; /*--------------------------图标定位-----------------------------*/
	//图标定位
	var num1 = 160; //通过计算得知设置4个一列较为合适
	var num2 = 117; //每个图标的坐标基数
	var onOff = true; //默认是纵向菜单  判断排列方式
	var popOnff = true; //用来控制弹出窗口事件的触发
	var plOff = true; //用于控制图标的自由排列中运动位置
	var menuOnff = true; //用于区分文件夹右键和系统右键
	var arrRemove = []; //用于保存删除的文件夹的那个元素
	var files_right_menu = document.getElementById('files_right_menu'); //文件夹右键
	var files_first = files_right_menu.children;
	for (i = 0; i < aUl.length; i++) {
		aUl[i].index = i; //用于存储删除ul的下标
		app_click(aUl[i], i); //多次传参，便于获取每个ul下面的li
		show(aUl[i], onOff); //图标位置生成函数调用
		fileCall(aUl[i], aUl[i].index)
	} /*---------------------------------图标位置生成--------------------------------------*/
	//桌面（ul）中图标的排列

	function show(oParent, onOff) {
		var arr = []; //用来存储定位值
		var aLi = oParent.getElementsByTagName('li');

		function change_client(onOff) { //处理桌面图标排列问题
			if (onOff) { //竖排  列
				var app_line = Math.floor(document.documentElement.clientHeight / num1);
				//如果计算后的结果小于1就显示一排，否则按照计算的列数来排列图标
				app_line = app_line < 1 ? 1 : app_line;
				for (var i = 0; i < aLi.length; i++) {
					aLi[i].index = i; //用于删除文件夹时候更新索引值
					move(aLi[i], {
						'left': {
							target: num2 * Math.floor(i / app_line),
							duration: 300,
							fx: 'easeIn'
						},
						'top': {
							target: num2 * (i % app_line),
							duration: 300,
							fx: 'easeIn'
						}
					})
					arr.push([num2 * Math.floor(i / app_line), num2 * (i % app_line)]);
					//console.dir(arr);
				}

			} else { //横排  行
				var app_row = Math.floor(document.documentElement.clientWidth / num1);
				//如果计算后的结果小于1就显示一排，否则按照计算的列数来排列图标
				app_row = app_row < 1 ? 1 : app_row;
				for (var i = 0; i < aLi.length; i++) {
					aLi[i].index = i; //用于删除文件夹时候更新索引值
					move(aLi[i], {
						'left': {
							target: num2 * (i % app_row),
							duration: 300,
							fx: 'easeIn'
						},
						'top': {
							target: num2 * Math.floor(i / app_row),
							duration: 300,
							fx: 'easeIn'
						}
					})

					arr.push([num2 * (i % app_row), num2 * Math.floor(i / app_row)])
				}

			}
		}
		change_client(onOff); //页面一刷新就执行

		/*-----------------------------------拖拽效果-----------------------------------------*/
		//图标拖拽
		app_drag()

		function app_drag() {
			//console.log(aLi.length);
			for (var i = 0; i < aLi.length; i++) {
				aLi[i].num = i;

				aLi[i].onmousedown = function(ev) {
					popOnff = true; //按下时可以触发弹出窗口事件
					var curLeft, curTop;
					ev = ev || event;
					if (!plOff) { //如果图标已经自由排列，那么就获取当前图标的位置
						curLeft = this.offsetLeft;
						curTop = this.offsetTop;
					} else { //允许回到原来位置 从数组中去位置
						curLeft = arr[this.num][0];
						curTop = arr[this.num][1];
					}
					var disX = ev.clientX - curLeft;
					var disY = ev.clientY - curTop;
					//记录鼠标按下时的位置，用于判断鼠标移动距离
					var curX = ev.clientX;
					var curY = ev.clientY;
					var _this = this;
					var x, y;
					document.onmousemove = function(ev) {
						ev = ev || event;
						//如果在有效的范围内就表示移动事件触发了，并且不会打开弹出窗口
						if (Math.abs(ev.clientX - curX) > 5 || Math.abs(ev.clientY - curY) > 5) {
							popOnff = false; //如果移动事件触发就改变开关状态

						}

						x = ev.clientX - disX;
						y = ev.clientY - disY;

						//将定位值赋值给当前移动的元素
						_this.style.left = x + 'px';
						_this.style.top = y + 'px';
						_this.style.zIndex = 1;

					}
					//元素身上加鼠标抬起事件
					document.onmouseup = function() {

						document.onmouseup = null; //如果鼠标抬起事件加在document上，那么为了防止改事件多次触发，需要先清掉鼠标抬起事件

						var c_Index; //用于交换索引的位置
						var nearLi = judge_bound(_this);
						//alert(nearLi)
						if (nearLi) {
							var sibLeft = arr[nearLi.num][0];
							var sibTop = arr[nearLi.num][1];
							//运动位置交换
							move(_this, {
								'left': {
									target: sibLeft,
									duration: 400,
									fx: 'linear'
								},
								'top': {
									target: sibTop,
									duration: 400,
									fx: 'linear'
								}
							});
							move(nearLi, {
								'left': {
									target: curLeft,
									duration: 400,
									fx: 'linear'
								},
								'top': {
									target: curTop,
									duration: 400,
									fx: 'linear'
								}
							})
							//位置属性交换
							c_index = _this.num;

							_this.num = nearLi.num;

							nearLi.num = c_index;

						} else {
							if (plOff) {
								move(_this, {
									'left': {
										target: curLeft,
										duration: 500,
										fx: 'linear'
									},
									'top': {
										target: curTop,
										duration: 500,
										fx: 'linear'
									}
								});
							}
						}


						document.onmousemove = null;
						document.onmousemup = null;
						_this.style.zIndex = 0;

					}
					return false; //阻止浏览器拖拽的默认行为
				}

			}
		} /*--------------------------------检测碰撞-------------------------*/

		function check(obj1, obj2) {
			var L1 = obj1.offsetLeft;
			var R1 = L1 + obj1.offsetWidth;
			var T1 = obj1.offsetTop;
			var B1 = T1 + obj1.offsetHeight;

			var L2 = obj2.offsetLeft;
			var R2 = L2 + obj2.offsetWidth;
			var T2 = obj2.offsetTop;
			var B2 = T2 + obj2.offsetHeight;

			return !(L1 > R2 || T1 > B2 || R1 < L2 || B1 < T2); //满足这些条件表示没有碰撞，在取反就表示已经碰撞了
		}
		//判断重合面积大小  原理利用定位值的差值来判断重合面积的大小

		function judge_bound(curThis) {
			//console.log(curThis)
			var num = 1000; //用于判断最小重合面积使用
			var index; //用于保存符合要求的li元素
			for (var i = 0; i < aLi.length; i++) {
				if ((check(aLi[i], curThis)) && (aLi[i] !== curThis)) {
					var iLeft = Math.abs(aLi[i].offsetLeft - curThis.offsetLeft);
					var iTop = Math.abs(aLi[i].offsetTop - curThis.offsetTop);
					var posValue = iLeft + iTop; //拿到left和top值的和同一个值进行比较

					if (posValue < num) { //判断得出最小值的索引
						num = posValue;
						index = i;
					}
				}
			}
			if (index >= 0) { //这里面排除索引值为0的情况
				return aLi[index];
			} else {
				return false;
			}
		}
	}
	//绑定事件函数  浏览器窗口发生变化时改变图标的排列方式
	bind(window, 'resize', function() {
		if (onOff) {
			for (i = 0; i < aUl.length; i++) {
				show(aUl[i], onOff); //图标位置生成函数调用
			}
		} else {
			for (i = 0; i < aUl.length; i++) {
				show(aUl[i]); //图标位置生成函数调用
			}
		}
	})

	//图标定位
	/*--------------------------------------左边菜单----------------------------------*/

	var web_t_menu = document.getElementById('web_t_menu'); //左边图标
	var webImg = web_t_menu.getElementsByTagName('img'); //桌面左边app
	web_t_menu.onmouseover = function() { //模拟苹果导航效果
		document.onmouseover = function(ev) {
			ev = ev || event;
			for (i = 0; i < webImg.length; i++) {
				var x = webImg[0].offsetLeft + webImg[0].offsetWidth / 2;
				var y = webImg[i].offsetTop + webImg[i].offsetHeight / 2 + web_t_menu.offsetTop;
				var a = x - ev.clientX;
				var b = y - ev.clientY;
				var dis = Math.sqrt(a * a + b * b);
				var scale = 0.9 - dis / 300; //变化幅度

				if (scale < 0.5) {
					scale = 0.5;
				}
				webImg[i].style.width = scale * 70 + 'px';
				webImg[i].style.height = scale * 70 + 'px';
			}
		}
		return false;
	}
	app_click(web_t_menu, 0, true);

	/*-----------------------------桌面图标操作------------------------------------------*/
	//用于更新页面中原有的文件夹名称
	var arrOri = []; //用于记录原始文件夹更改后的文件名称

	function fileCall(obj, Uindex) {
		var aInput = obj.getElementsByTagName('input'); //获取每个ul下面的li
		if (localStorage.getItem('c' + Uindex)) {
			var arrCall = localStorage.getItem('c' + Uindex).split(',');
		}
		for (i = 0; i < aInput.length; i++) {
			if (localStorage.getItem('c' + Uindex) && arrCall[i]) {
				aInput[i].value = arrCall[i];
			} else {
				continue;
			}
		}
	}
	//桌面图标操作

	function app_click(obj, Uindex, isLeft) { //l 用于判断是否是左边的图标
		var min_menu_bg = document.getElementById('min_menu_bg') //弹窗最小化后图标
		var aLi = obj.getElementsByTagName('li'); //获取每个ul下面的li
		var aInput = obj.getElementsByTagName('input'); //获取每个ul下面的li
		var url; //保存网址
		if (isLeft) {
			url = [
				['http://web.qq.com/module/appmarket/appmarket.html', 'http://www.weiyun.com/index.html', 'http://mail.qq.com/cgi-bin/login', 'http://www.qq.com/', 'https://mail.qq.com/cgi-bin/loginpage', 'http://dev.t.qq.com/']
			];
		} else {
			var inp = obj.getElementsByTagName('input'); //获取li下面的input标签

			url = [
				['http://pan.baidu.com/', 'http://map.qq.com/', 'http://www.kuaipan.cn/', 'http://qqreader.qq.com/', 'http://reader.qq.com/cgi-bin/loginpage', 'html/readme.html'],
				['http://douban.fm/partner/qq_plus', 'http://webqq.qidian.com', 'http://www.kuaidi100.com/ad/head_ad.html', 'http://www.dooland.com/', 'http://www.le.com/', 'http://www.mangocity.com/?utm_source=bdppzq&utm_medium=cpc=0020005'],
				['http://qqreader.qq.com/', 'http://v.qq.com/', 'http://www.le.com/'],
				['http://www.pengyou.com/?http%3A%2F%2Fhome.pengyou.com%2Findex.php%3Fmod%3Dhome', 'http://www.3366.com/', 'http://web.3366.com/ddz/'],
				['http://baobei.qq.com/', 'http://www.zhenai.com/901004_924817.html?planid=7620358&groupid=133239289&ctvid=6239592922&kwid=19421816347&domain=&keyword=开心交友网&kwmatch=e&plan=enc_0e0c1d3dbbdbf57a0dfd8bf59335&group=enc_d656f58fdc1d3dbbdb8776&network=1', '']
			]
		}

		var win_mask = document.getElementById('win_mask'); //弹出窗口
		var w_h2 = win_mask.getElementsByTagName('h2')[0]; //弹出窗口h2
		var con_cover = document.getElementById('con_cover'); //iframe遮罩层
		var iframe = win_mask.getElementsByTagName('iframe')[0] //获取iframe
		var ctrl_btn = win_mask.getElementsByTagName('a');
		var min_menu_bg = document.getElementById('min_menu_bg') //弹窗最小化后图标
		var h2 = min_menu_bg.getElementsByTagName('h2')[0];
		
		min_menu_bg.onmousedown = function(ev) {
			ev = ev || event;
			drag(ev, min_menu_bg);
			return false; //阻止浏览器默认行为
		}


		var i; //循环变量

		//给对应的ul下面的所有li添加事件
		for (i = 0; i < aLi.length; i++) {
			aLi[i].index = i;
			aLi[i].onclick = function() {
				if (popOnff) {
					pop_defalut(); //弹出窗口默认设置

					if (isLeft) {
						popUp(this, this.title, url[Uindex][this.index], isLeft); //弹窗
					} else {
						popUp(this, inp[this.index], url[Uindex][this.index]); //弹窗
					}
					if (min_menu_bg.children.length > 0) { //如果为0，那么就创建这个元素

						min_menu_bg.removeChild(min_menu_bg.children[0]);
					}
					ctrl_btn[1].onOff = false; //控制最大化按钮的状态
				}
			}
			if (!isLeft) {
				//鼠标经过桌面图标添加样式
				aLi[i].onmouseover = function() {
					this.className = 'hover';
				}
				//鼠标离开桌面图标恢复默认样式
				aLi[i].onmouseout = function() {
					this.className = '';
				}
			} /*------------------------------------文件夹右键功能-----------------------------*/
			if (!isLeft) {
				aLi[i].oncontextmenu = function(ev) {
					var _this = this;
					ev = ev || event;
					var disX = ev.clientX;
					var disY = ev.clientY;
					files_right_menu.style.left = disX + 'px';
					files_right_menu.style.top = disY + 'px';

					files_right_menu.style.display = 'block';
					right_menu.style.display = 'none';
					ev.cancelBubble = true;

					//打开应用
					files_first[0].onclick = function() {
						_this.onclick();
					}
					//删除文件夹
					files_first[1].onclick = function() {
						move(_this, {
							'opacity': {
								target: 0,
								duration: 240,
								fx: 'linear'
							}
						}, function() {
							obj.removeChild(_this);
							url[Uindex].splice(_this.index, 1); //删除对应的URL地址
							for (i = 0; i < aUl.length; i++) { //更新图标位置
								show(aUl[i], onOff); //图标位置生成函数调用
							}
						})
					}
					//重命名
					files_first[2].onclick = function() {
						aInput[_this.index].focus(); //设置焦点
						aInput[_this.index].select(); //默认选中

						//回车按下时也可以取消焦点
						document.onkeydown = function(ev) {
							ev = ev || event;
							if (ev.keyCode == 13) {
								aInput[_this.index].blur();
							}
						}
						//失去焦点 获取并且存储value
						aInput[_this.index].onblur = function() {
							if (localStorage.getItem('c' + Uindex)) { //如果存储的原来文件夹的名称存储，那么下次存储的时候，从已有的内容继续开始

								arrOri = localStorage.getItem('c' + Uindex).split(',')
							}
							var pIndex = _this.parentNode.index
							arrOri[_this.index] = aInput[_this.index].value;
							localStorage.setItem('c' + pIndex, arrOri);
						}
					}
					for (i = 0; i < aLi.length; i++) {
						aLi[i].index = i;
						aLi[i].onclick = function() {
							if (popOnff) {
								pop_defalut(); //弹出窗口默认设置

								if (isLeft) {
									popUp(this, this.title, url[Uindex][this.index], isLeft); //弹窗
								} else {
									console.log(this, this.index, inp[this.index], url[Uindex][this.index])
									popUp(this, inp[this.index], url[Uindex][this.index]); //弹窗
								}
								if (min_menu_bg.children.length > 0) { //如果为0，那么就创建这个元素

									min_menu_bg.removeChild(min_menu_bg.children[0]);
								}
								ctrl_btn[1].onOff = false; //控制最大化按钮的状态
							}
						}
					}
					return false; //阻止浏览器右键的默认行为
				}
			}
		} /*---------------------------------弹出窗口操作------------------------------------------*/
		//弹出窗口设置默认值
		var json = {
			W: 800,
			H: 500,
			O: 100,
			L: 0,
			T: 0
		}

		//弹出窗口出现的位置

		function pop_defalut() {
			win_mask.className = 'show';
			win_mask.style.width = json.W + 'px'; //恢复默认left值
			win_mask.style.height = json.H + 'px'; //恢复默认高度
			win_mask.style.opacity = json.O; //恢复默认透明度
			win_mask.style.filter = 'apha(opacity:' + json.O + ')'; //恢复默认透明度

			clientW = document.documentElement.clientWidth;
			clientH = document.documentElement.clientHeight;

			//弹出窗口出现在桌面的中央位置
			var _left = Math.floor((clientW - win_mask.offsetWidth) / 2);
			var _top = Math.floor((clientH - win_mask.offsetHeight) / 2);
			json.L = _left;
			json.T = _top;

			win_mask.style.left = json.L + 'px';
			win_mask.style.top = json.T + 'px';
		}

		//绑定事件函数  浏览器窗口发生变化时改变图标的排列方式
		bind(window, 'resize', function() {
			clientW = document.documentElement.clientWidth;
			clientH = document.documentElement.clientHeight;
		});

		//弹出窗口按钮变化
		var li = null; //用于存储创建的折叠任务菜单的li元素

		function popUp(_this, val, src, isLeft) {
			//切换弹出窗口标题
			if (isLeft) {
				w_h2.innerHTML = val;
				//添加桌面图标对应内容
				iframe.src = src;
				//折叠任务栏标题
				valT = val;
			} else {
				w_h2.innerHTML = val.value;
				//添加桌面图标对应内容
				iframe.src = src;
				//折叠任务栏标题
				valT = val.value;
			}

			/*-----------------------------窗口最大化、最小化、关闭操作------------------------*/
			for (i = 0; i < ctrl_btn.length; i++) {
				//最小化按钮
				ctrl_btn[0].onclick = function() {
					move(win_mask, {
						'height': {
							target: 0,
							duration: 500,
							fx: 'linear'
						},
						'top': {
							target: 500,
							duration: 500,
							fx: 'linear'
						},
						'opacity': {
							target: 0,
							duration: 500,
							fx: 'linear'
						}
					}, function() {
						win_mask.className = 'hidden'; //隐藏弹出窗口
						ctrl_btn[1].className = 'magnify'; //显示默认最大化按钮样式
						if (ctrl_btn[1].onOff) { //如果中间按钮的状态为true，那么就恢复left值设置为0
							win_mask.style.left = 0 + 'px'; //恢复默认left值

						} else {
							win_mask.style.left = json.L + 'px'; //恢复默认left值

						}
					})

					setTimeout(function() { //延迟显示折叠任务菜单
						fold_menu(valT, _this); //折叠任务菜单	
					}, 300)

				}
				//中间最大化按钮
				ctrl_btn[1].onclick = function() {
					this.onOff = !this.onOff;
					magnify(this.onOff, this);

				}
				ctrl_btn[2].onclick = function() {
					iframe.src = '';
					//关闭按钮
					move(win_mask, {
						'height': {
							target: 0,
							duration: 500,
							fx: 'linear'
						},
						'opacity': {
							target: 0,
							duration: 500,
							fx: 'linear'
						}
					}, function() {
						win_mask.className = 'hidden'; //隐藏弹出窗口
						win_mask.style.cssText = 'width:' + json.W + 'px';
						'height:' + json.H + 'px';
						'top:' + json.T + 'px';
						'left:' + json.L + 'px';
						'opacity:' + json.O;
						fliter: 'apha(opacity:' + json.O + ')';
						ctrl_btn[1].className = 'magnify'; //显示默认最大化按钮样式
					});
				}
			} /*-------------------------弹出窗口拖拽-----------------------------------*/
			//在标题位置可以拖拽
			w_h2.onmousedown = function(ev) {
				ev = ev || event;
				//拿到鼠标到弹出窗口边界的位置
				var disX = ev.clientX - win_mask.offsetLeft;
				var disY = ev.clientY - win_mask.offsetTop;
				con_cover.style.display = 'block'; //显示iframe遮罩层

				document.onmousemove = function(ev) {
					ev = ev || event;
					//拿到元素在移动过程中的定位值
					var x = ev.clientX - disX;
					var y = ev.clientY - disY;
					if (y < 0) {
						y = 0;
					}
					win_mask.style.left = x + 'px';
					win_mask.style.top = y + 'px';
				}
				document.onmouseup = function() {
					con_cover.style.display = 'none'; //隐藏iframe遮罩层
					document.onmouseup = null;
					document.onmousemove = null;
				}
				return false;
			}

			/*------------------------折叠任务菜单操作处理--------------------------------*/
			//折叠任务菜单处理

			function fold_menu(val, _this) {
				if (min_menu_bg.children.length == 0) { //如果为0，那么就创建这个元素
					li = document.createElement('li');
				}
				li.innerHTML = '<div class="min_menu_box"><span class="min_menu"><h2>' + val + '</h2><a class="bg" href="javascript:;"></a><a class="close" href="javascript:;"></a></div></div>';

				//向创建的li元素中添加内容
				if (li) { //如果存在li，就添加到页面中去
					min_menu_bg.appendChild(li);
				};
				//显示做小化折叠菜单
				move(li, {
					'width': {
						target: 112,
						duration: 300,
						fx: 'linear'
					},
				})
				//给生成的li添加事件
				var oSpan = getClass('min_menu', li)
				li.onmouseover = function() {
						var aA = oSpan[0].getElementsByTagName('a');
						var win_mask = document.getElementById('win_mask'); //弹出窗口
						var onOff = true;
						var _this = this;
						move(oSpan[0], {
							'top': {
								target: -42,
								duration: 300,
								fx: 'linear'
							}
						});
						//还原
						aA[0].onclick = function() {
							move(li, {
								'width': {
									target: 0,
									duration: 500,
									fx: 'easeIn'
								}
							}, function() {
								min_menu_bg.removeChild(li); //移出
							});
							if (ctrl_btn[1].onOff) {
								move(win_mask, {
									'height': {
										target: clientH,
										duration: 500,
										fx: 'linear'
									},
									'opacity': {
										target: json.O,
										duration: 500,
										fx: 'linear'
									},
									'top': {
										target: 0,
										duration: 500,
										fx: 'linear'
									}
								});
							} else {
								move(win_mask, {
									'height': {
										target: json.H,
										duration: 500,
										fx: 'linear'
									},
									'opacity': {
										target: json.O,
										duration: 500,
										fx: 'linear'
									},
									'top': {
										target: json.T,
										duration: 500,
										fx: 'linear'
									}
								});
							}
							win_mask.className = 'show';
						}
						//关闭
						aA[1].onclick = function() {
							iframe.src = '';
							move(li, {
								'width': {
									target: 0,
									duration: 500,
									fx: 'linear'
								}
							}, function() {
								min_menu_bg.removeChild(li); //移出
							})

							ctrl_btn[2].onclick(); //此时在调用一遍关闭按钮的事件函数，保证窗口打开的位置还是居中显示

						}
					}
					//鼠标移入折叠菜单
					li.onmouseout = function() {
						var _that = this;
						move(oSpan[0], {
							'top': {
								target: 0,
								duration: 300,
								fx: 'linear'
							}
						})
					}
			}
			//最大化

			function magnify(onOff, _this) {
				if (onOff) {
					//切换最大化按钮
					_this.className = 'bg';
					move(win_mask, {
						'width': {
							target: clientW,
							duration: 600,
							fx: 'linear'
						},
						'height': {
							target: clientH,
							duration: 600,
							fx: 'linear'
						},
						'left': {
							target: 0,
							duration: 600,
							fx: 'linear'
						},
						'top': {
							target: 0,
							duration: 600,
							fx: 'linear'
						},
						'opacity': {
							target: 100,
							duration: 600,
							fx: 'linear'
						}
					})
				} else {
					_this.className = 'magnify';
					move(win_mask, {
						'width': {
							target: json.W,
							duration: 600,
							fx: 'linear'
						},
						'height': {
							target: json.H,
							duration: 600,
							fx: 'linear'
						},
						'left': {
							target: json.L,
							duration: 600,
							fx: 'linear'
						},
						'top': {
							target: json.T,
							duration: 600,
							fx: 'linear'
						},
						'opacity': {
							target: json.O,
							duration: 600,
							fx: 'linear'
						}
					})
				}
			}
		}
	}

	/*-----------------------------------右键功能-----------------------------------------*/
	var right_menu = document.getElementById('right_menu'); //系统右键
	var aLi1 = right_menu.getElementsByTagName('li');
	var files_right_menu = document.getElementById('files_right_menu'); //文件夹右键
	var aLi2 = files_right_menu.getElementsByTagName('li');

	//自定义右键
	document.oncontextmenu = function(ev) {
		ev = ev || event;
		var disX = ev.clientX;
		var disY = ev.clientY;
		right_menu.style.left = disX + 'px';
		right_menu.style.top = disY + 'px';
		files_right_menu.style.display = 'none';
		right_menu.style.display = 'block'; //显示右键菜单
		return false; //阻止浏览器右键的默认行为
	}
	menuHover(aLi1) //给右键菜单加样式
	menuHover(aLi2) //给右键菜单加样式

	function menuHover(obj) {
		for (var i = 0; i < obj.length; i++) {
			//给li添加鼠标移入事件
			obj[i].onmouseover = function() {
				this.children[0].className = 'active';
				if (this.children[0].children[0]) {
					this.children[0].children[0].className = 'triangle'; //三角形的样式
					this.children[1].style.display = 'block';
				}
			}
			//给li添加鼠标移出事件
			obj[i].onmouseout = function() {
				this.children[0].className = '';
				if (this.children[0].children[0]) {
					this.children[0].children[0].className = '';
					this.children[1].style.display = '';
				}
			}
		}
	} /*---------------------------改换图标大小------------------------*/
	var aLi = web_icon.getElementsByTagName('li'); //获取web_icon下面所有的ul
	var iconUl = right_menu.getElementsByTagName('ul')[0]; //查看 
	var iconLi = iconUl.getElementsByTagName('li');
	var num3 = 0;

	/*---------------------------------切换小图标-------------------------------------*/
	iconLi[0].onclick = function() {
		clear_add(iconLi, this) //添加选中样式
		num1 = 133; //每个图标所占的真实位置  
		num2 = 107; //每个图标的坐标基数
		num3 = 1;
		for (i = 0; i < aLi.length; i++) {
			css(aLi[i], '80px', '80px', '5px', '5px');
		}
		for (i = 0; i < aUl.length; i++) {
			show(aUl[i], onOff); //图标位置生成函数调用
		}
		right_menu.style.display = 'none'; //隐藏右键菜单
	} /*---------------------------------切换中等图标-------------------------------------*/
	iconLi[1].onclick = function() {
		clear_add(iconLi, this) //添加选中样式
		num1 = 160; //每个图标所占的真实位置  
		num2 = 117; //每个图标的坐标基数
		num3 = 2;

		for (i = 0; i < aLi.length; i++) {
			css(aLi[i], '90px', '90px', '0px', '5px');
		}
		for (i = 0; i < aUl.length; i++) {
			show(aUl[i], onOff); //图标位置生成函数调用
		}
		right_menu.style.display = 'none'; //隐藏右键菜单
	}

	/*---------------------------------切换大图标-------------------------------------*/
	iconLi[2].onclick = function() {
		clear_add(iconLi, this) //添加选中样式
		num1 = 230; //每个图标所占的真实位置  
		num2 = 127; //每个图标的坐标基数
		num3 = 3;

		for (i = 0; i < aLi.length; i++) {
			css(aLi[i], '100px', '100px', '0px', '15px');
		}
		for (i = 0; i < aUl.length; i++) {
			show(aUl[i], onOff); //图标位置生成函数调用
		}
		right_menu.style.display = 'none'; //隐藏右键菜单
	}

	//图标样式切换函数封装

	function css(obj, s1, s2, s3, s4) {

		obj.style.width = s1;
		obj.style.height = s2;
		obj.style.paddingBottom = s3;
		obj.style.paddingTop = s4;

	} /*---------------------------------排列方式------------------------------------*/
	var PlUl = right_menu.getElementsByTagName('ul')[1];
	var plLi = PlUl.getElementsByTagName('li'); /*-----------------------------------横向排列-----------------------------------*/
	plLi[0].onclick = function() {
		clear_add(plLi, this) //添加选中样式
		onOff = false;
		plOff = true; //允许图标拖拽运动到原来位置
		for (i = 0; i < aUl.length; i++) {
			show(aUl[i]); //图标位置生成函数调用
		}
	} /*-----------------------------------纵向排列-----------------------------------*/
	plLi[1].onclick = function() {
		clear_add(plLi, this) //添加选中样式
		onOff = true;
		plOff = true; //允许图标拖拽运动到原来位置
		for (i = 0; i < aUl.length; i++) {
			show(aUl[i], onOff); //图标位置生成函数调用
		}
	} /*-----------------------------------自由排列-----------------------------------*/
	plLi[2].onclick = function() {
		clear_add(plLi, this) //添加选中样式
		plOff = false; //自由排列事件触发的时候，不允许图标拖拽回到原来位置
	}

	//添加清除选中样式

	function clear_add(ele, obj) {
		for (i = 0; i < ele.length; i++) {
			ele[i].className = '';
		}
		obj.className = 'checked';
	} /*--------------------------------模拟window刷新功能-------------------------*/
	var reload = right_menu.children[2];
	reload.onclick = function() { //原理改变透明度
		var arr2 = []; //用于保存桌面的app图标
		for (i = 0; i < aLi.length; i++) {
			arr2.push(aLi[i]);
			move(aLi[i], {
				'opacity': {
					target: 0,
					duration: 400,
					fx: 'linear'
				}
			}, function() {
				for (var j = 0; j < arr2.length; j++) {
					move(arr2[j], {
						'opacity': {
							target: 100,
							duration: 300,
							fx: 'linear'
						}
					})
				}

			})

		}
	} /*--------------------------------预览功能-------------------------*/
	var ftp1 = right_menu.children[3]; //右键上传菜单
	var ftp = document.getElementById('ftp');
	var content_area = document.getElementById('content_area'); //上传的内容区域
	var upBtn = document.getElementById('upButton'); //上传按钮
	var img_area = content_area.getElementsByTagName('ul')[0]; //放图片区域
	var pro_bar = document.getElementById('pro_bar'); //
	var allLength = pro_bar.getElementsByTagName('div'); //总长度
	var proLine = pro_bar.getElementsByTagName('li'); //进度条父级
	var file = ftp.getElementsByTagName('input')[0]; //文件控件
	var closeFtp = document.getElementById('closeFtp'); //关闭上传
	var arrM = []; //用来存储文件的名字  用于比较是否上传的是同一张图片
	var arrFiles = []; //用于保存满足条件的文件
	var arrImgBig = []; //存储图片尺寸
	var imgInfo = document.getElementById('imgInfo'); //存储图片信息区域

	var shift = pro_bar.getElementsByTagName('a'); //删除按钮
	var imgLength = img_area.getElementsByTagName('li'); //包裹图片的li
	var ylImg = img_area.getElementsByTagName('img'); //包裹图片的li

	ftp1.onclick = function() {
		//alert('上传');
		ftp.style.display = 'block';

	} /*----------------------------选择上传图片预览--------------------------------*/

	//能够监控到上传状态
	bind(file, 'change', function(ev) {
		ev = ev || event;
		var files = ev.target.files || ev.dataTransfer.files;
		//var arrFiles;//用于保存文件数
		upButton(files);

	})
	var canUp = true;
	upBtn.onclick = function() {
		if (canUp) {
			file.click(); //触发上传按钮的点击事件
		}
	}

	/*---------------------------拖拽图片预览-------------------------------*/
	var drag_area = document.getElementById('fileDragArea'); //拖拽区域

	//当拖拽的内容进入指定区域的时候触发
	drag_area.ondragenter = function() {
		this.style.border = '1px solid #f00';
	}
	//当拖拽的内容离开指定区域的时候触发
	drag_area.ondragleave = function() {

		this.style.border = '';

	}
	//当拖拽的内容在指定区域移动的时候
	drag_area.ondragover = function() {

		return false; //阻止浏览器复制图片的默认事件

	}
	//当拖拽过程中鼠标松开时触发
	drag_area.ondrop = function(ev) { //ev  拖拽事件的对象
		if (canUp) {
			ev = ev || event;
			var files = ev.target.files || ev.dataTransfer.files;
			upButton(files);
			return false; //阻止浏览器复制图片的默认行为
		}
	}
	//能够监控到上传状态

	function upButton(files) {
		if (files.length > 5 || arrFiles.length > 5) {
			alert('图片张数不超过5张')
			return
		}; //限制上传图片的张数
		//继续向里面添加文件
		for (var i = 0, file; file = files[i]; i++) {
			//判断是否是图片类型
			if (arrIndexOf(arrM, file.name) == -1) {
				var type = file.type;
				var size = (file.size / 1027).toFixed(2) + 'k';
				if (file && type.indexOf('image') == -1) { //限制上传类型
					alert('只能支持image类型的上传');
				} else if (file && size >= '200k') {
					alert('上传的图片大小应该为200k'); //限制上传图片的大小
				} else {
					arrM.push(file.name); //存储将要上传的图片名称
					arrFiles.push(file); //存储要上传的文件
					file.index = i //给上传的文件添加唯一索引值
					readFile(file); //将文件写入内存，供js访问文件
				}
			}
		}
	}
	//文件写入内存函数封装

	function readFile(f) {
		//利用HTML5提供的对象，将指定的内容写入缓存，从而使js能够访问系统文件
		var fr = new FileReader();
		//在写入文件的时候触发
		fr.onload = function(ev) {
			ev = ev || event;
			var m = f.name;
			//创建对象
			var li = document.createElement('li');
			var img = document.createElement('img');
			var div = document.createElement('div');
			img.style.width = '100%';
			img.style.height = '100%';
			img.src = ev.target.result;
			li.appendChild(img);
			//存储图片尺寸
			arrImgBig.push({
				'width': img.width,
				'height': img.height
			})
			div.className = 'border';
			div.innerHTML = '<span class="bar"></span><i>0%</i><a href="javascript:;">删除</a>'

			pro_bar.appendChild(div);
			img_area.appendChild(li);

			//上传确认是否删除
			for (var i = 0; i < shift.length; i++) {
				shift[i].index = i;
				imgLength[i].index = i;
				shift[i].onclick = function() {
					pro_bar.removeChild(this.parentNode);

					for (var j = 0; j < imgLength.length; j++) {
						if (imgLength[j].index == this.index) {
							img_area.removeChild(imgLength[j]);

							j--;
						}
					}

					for (var j = 0; j < arrFiles.length; j++) {
						if (arrFiles[j].index == this.index) {
							arrFiles.splice(j, 1); //清空文件数组
							arrImgBig.splice(j, 1); //清空文件数组
							//arrM.splice(j,1);
							j--;
						}
					}

				}
			}

		}
		//将文件写入内存中 将文件读取为DataURL
		fr.readAsDataURL(f);
	} /*-------------------------------上传进度条----------------------------------*/
	var upload = document.getElementById('upload'); //开始上传按钮
	var progress = pro_bar.getElementsByTagName('span'); //进度
	var numI = pro_bar.getElementsByTagName('i'); //进度条数字
	var finish = imgInfo.getElementsByClassName('finish')[0]; //上传全部完成后的提示
	upload.onclick = function() {
		for (var i = 0; i < arrFiles.length; i++) {
			ajax(arrFiles[i], i);

		}

	}
	var ajaxNum = 0; //用于判断ajax所有传输任务是否完成

	function ajax(obj, i) {
		//创建ajax对象

		var xhr = new XMLHttpRequest();

		//监控上传状态	
		xhr.upload.onprogress = function(ev) {
			console.log(i);
			ev = ev || event;
			//计算上传进度
			var iSc = parseInt((ev.loaded / ev.total) * 100);
			numI[i].innerHTML = iSc + '%';
			//console.log(div);
			progress[i].style.width = allLength[i].clientWidth * (iSc / 100) + 'px';
		}
		//监听请求信息 
		//如果浏览器没有onload这个属性，那么就为undefined，如果有这个属性，没绑定处理函数，其值为空 xhr.onload=null,所以需要判断是否为undefined
		if (xhr.onload !== undefined) { //高版本浏览器支持  低版本浏览器不支持
			xhr.onload = function() {
				success(xhr, i); //当上传成功时的回调函数
				canUp = false; //上传过程中布允许再次上传
				ajaxNum++;
				if (ajaxNum === arrFiles.length) { //判断是否都上传完
					//全部输出完毕
					ajaxNum = 0; //计数归零
					onComplete(); //上传完执行回调函数
					canUp = true; //上传完后可以继续上传
				}
			}
		} else { //所有浏览器都支持
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) { //监测onreadystatechange 的状态
					if (xhr.status === 200) { //监测 http状态码
						success(xhr, i); //当上传成功时的回调函数
						canUp = false; //上传过程中布允许再次上传
						ajaxNum++;
						console.log(ajaxNum)
						if (ajaxNum === arrFiles.length) { //判断是否都上传完
							//全部输出完毕
							ajaxNum = 0; //计数归零
							onComplete(); //上传完执行回调函数
							canUp = true; //上传完后可以继续上传
						}
					}
				} else {
					alert('请求不成功。' + xhr.status);
				}
			}
		}

		xhr.open('post', './php/post_file.php', true); //设置请求信息

		xhr.setRequestHeader("X_FILENAME", file.name); //设置请求头

		var fd = new FormData(); //创建格式化处理对象。

		fd.append('file', obj); //将文件添加进格式化处理对象。

		xhr.send(fd); //将格式化处理对象，发送给后台。

	}
	//上传成功执行

	function success(text, i) {
		//console.log(text.responseText)
		var inputContext = JSON.parse(text.responseText); //获取上传后的信息（字符串json）并转换为json
		var result = decodeURIComponent(inputContext.msg); //上传结果（转成中文）
		var url = '/webQQ1 - fuben/php' + decodeURIComponent(inputContext.url);
		var imgName = decodeURIComponent(inputContext.name); //上传结果（转成中文）
		var width = arrImgBig[i].width;
		var height = arrImgBig[i].height;
		var _imgThis = imgLength[i];
		var _prgThis = allLength[i];

		move(_imgThis, {
			'opacity': {
				target: 0,
				duration: 400,
				fx: 'linear'
			}
		}, function() {
			_imgThis.style.display = 'none'; //隐藏图片的位置
		});

		move(_prgThis, {
			'opacity': {
				target: 100,
				duration: 400,
				fx: 'linear'
			}
		}, function() {
			_prgThis.style.display = 'none'; //隐藏图片的位置
			var div = document.createElement('div');
			div.className = 'result'
			div.innerHTML = result + ' 图片地址为:' + url + ' 尺寸为' + width + '*' + height;
			imgInfo.appendChild(div);
		})
		finish.innerHTML = '';
	}
	//输出完毕执行

	function onComplete() {
		//上传全部按成时候需要清除原来创建的图片和进度条标签结构内容
		pro_bar.innerHTML = '';
		img_area.innerHTML = '';
		arrFiles = []; //清空存储文件个数的数组
		arrM = []; //清空存储文件名称的数组
		arrImgBig = [];

		//console.log(result);
		finish.innerHTML = '上传完毕后可以继续上传'
	}
	//关闭对话框
	closeFtp.onclick = function() {
		//隐藏上传窗口
		move(ftp, {
			'opacity': {
				target: 0,
				duration: 400,
				fx: 'linear'
			},
			'height': {
				target: 0,
				duration: 400,
				fx: 'linear'
			}
		}, function() {
			var childNdoes = img_area.children;
			for (i = 0; i < childNdoes.length; i++) { //删除上传内容
				if (childNdoes[i]) {
					img_area.removeChild(childNdoes[i])
				}
			}
			ftp.style.display = 'none';
			ftp.style.opacity = '1';
			ftp.style.filter = 'apha(opacity:100)';
			ftp.style.height = 'auto';
			ftp.style.left = '50px';
			ftp.style.top = '100px';
		})


	}
	//拖拽上传窗口
	ftp.onmousedown = function(ev) {
		ev = ev || event;
		drag(ev, ftp);
		return false; //阻止浏览器默认行为
	} /*----------------------------------右键新建-----------------------------*/
	var new_build = right_menu.children[4]; //右键
	var aUl = web_icon.getElementsByTagName('ul'); //获取web_icon下面所有的ul
	var arrCreate = []; //用于记录读取数据时创建的文件夹的个数
	var arrClick = []; //用于控制创建文件夹函数的调用的次数

	createfile(topMenuLi[0], 0); //默认参数出入的下标是0

	function createfile(obj, createIndex) {

		if (localStorage.getItem(createIndex)) { //如果读取值成功就给obj.createNum赋值为读取的值
			obj.createNum = localStorage.getItem(createIndex);

		} else { //默认为-1
			obj.createNum = -1; //用于计算生成的文件夹的个数
		}
		if (!arrClick[createIndex]) {
			arrClick[createIndex] = 1;
			createLi(obj, createIndex); //未创建文件时候 读取数据
		}

		new_build.onclick = function() {
			createLi(obj, createIndex, true); //右键创建文件夹
		}
	}

	//用于创建文件夹
	var arrW = []; //用于存储文件夹名称

	function createLi(obj, createIndex, isCreate) { //isCreate如果为true 就可以创建文件夹
		if (isCreate) {
			obj.createNum++;
			localStorage.setItem(createIndex, obj.createNum); //进行存储
		}
		if (isCreate) { //条件成立  单独创建
			var li = document.createElement('li');

			li.innerHTML = '<a href="javascript:;"><img src="images/page/27.png" alt="作品"/><i><input placeholder="新建文件夹" type="text" value="新建文件夹"/></i></a>';
			//将创建的li插入到对应ul下面
			aUl[createIndex].appendChild(li);

		} else { //读取存储中创建li的个数
			if (!arrCreate[createIndex] && localStorage.getItem('b' + createIndex)) {
				arrCreate[createIndex] = localStorage.getItem(createIndex); //获取创建文件夹的个数
				var arrCall = localStorage.getItem('b' + createIndex).split(','); //分割后获取文件夹名称

				if (arrCreate[createIndex] == null) {
					return;
				}
				//创建li
				for (var i = 0; i <= arrCreate[createIndex]; i++) {
					var li = document.createElement('li');
					li.innerHTML = '<a href="javascript:;"><img src="images/page/27.png" alt="' + arrCall[i] + '"/><i><input placeholder="' + arrCall[i] + '" type="text" value="' + arrCall[i] + '"/></i></a>';
					//将创建的li插入到对应ul下面
					aUl[createIndex].appendChild(li);
				}
			}
		}
		//同步生成li样式
		if (li) {
			switch (num3) {
			case 1:
				css(li, '70px', '70px', '10px', '5px');
				break;
			case 2:
				css(li, '90px', '90px', '0px', '5px');
				break;
			case 3:
				css(li, '110px', '110px', '0px', '15px');
				break;
			default:
				css(li, '90px', '90px', '0px', '5px');
			}
		}

		for (var i = 0; i < aUl.length; i++) {
			if (localStorage.getItem('b' + createIndex)) { //如果有那么就从已经有的内容中在进行添加
				arrW = localStorage.getItem('b' + createIndex).split(','); //分割后获取文件夹名称
			}
			var index = aUl[createIndex].children.length - 1;
			//获取新创建的li下的input
			var input = aUl[createIndex].children[index].getElementsByTagName('input')[0];

			if (isCreate) { //设置焦点默认选中 便于修改文件夹名称
				input.focus();
				input.select();
			}
			//回车按下时也可以取消焦点
			document.onkeydown = function(ev) {
				ev = ev || event;
				if (ev.keyCode == 13) {
					input.blur();
				}
			}

			//失去焦点时获取value 并且存储文件夹名称
			input.onblur = function() {
				arrW.push(input.value);
				localStorage.setItem('b' + createIndex, arrW); //存储输入的value
			}
			//更新图标的位置
			show(aUl[i], onOff, i); //图标位置生成函数调用
			app_click(aUl[i], i); //更新图标操作

		}
		searchFile();

	} /*----------------------------右键主题皮肤和缓存设置--------------------------------*/
	var change_skin = right_menu.children[5];
	var skin = document.getElementById('skin'); //皮肤
	var skin_title = document.getElementById('title'); //标题
	var close = skin.getElementsByTagName('a')[0];
	var skin_content = document.getElementById('skin_content');
	var aImg = skin_content.getElementsByTagName('img'); //主题下面的所有图片
	var web_pf = document.getElementById('web_pf');
	var oImg = web_pf.getElementsByTagName('img')[0]; //要换的皮肤

	//右键显示主题设置 
	change_skin.onclick = function() {
		skin.style.display = 'block';
	}
	//切换图片
	for (i = 0; i < aImg.length; i++) {
		aImg[i].index = i;
		aImg[i].onclick = function() {
			oImg.src = this.src;
			setCookie('bg', this.src, 30); //设置缓存
		}
	}
	//读取缓存
	if (localStorage.getItem('ftpImg')) {
		oImg.src = localStorage.getItem('ftpImg');
	} else {
		if (getCookie('bg')) {
			oImg.src = getCookie('bg');
		}
	}

	//关闭主题设置对话框
	close.onclick = function() {
		move(skin, {
			'height': {
				target: 0,
				duration: 400,
				fx: 'linear'
			},
			'opacity': {
				target: 0,
				duration: 400,
				fx: 'linear'
			}
		}, function() {
			skin.style.display = 'none';
			skin.style.opacity = '1';
			skin.style.fliter = 'apha(opacity:100)';
			skin.style.height = '494px';
			skin.style.left = '50px';
			skin.style.top = '100px';
		})
	}
	skin_title.onmousedown = function(ev) {
		ev = ev || event;
		drag(ev, skin);
		return false;
	} /*--------------------------------桌面便签----=------------------------------*/
	var noteOpen = right_menu.children[6]; //右键
	var notepad = document.getElementById('notepad');
	var add = document.getElementById('add');
	var closeNote = document.getElementById('closeNote');
	var note_title = document.getElementById('note_title');
	var list = document.getElementById('list');
	var content = document.getElementById('content');
	var save = document.getElementById('save');
	var del = document.getElementById('del');
	var textarea = document.getElementById('textarea');

	var arr = []; //用来存储内容
	var date = new Date();
	var time = (date.getMonth() + 1) + "月" + date.getDate() + "日";
	//如果有存储内容就读取
	if (localStorage.getItem('note')) {
		arr = localStorage.getItem('note').split(','); //将所条数据分割
	}
	noteOpen.onclick = function() {
		notepad.style.left = right_menu.offsetLeft + 'px';
		notepad.style.top = right_menu.offsetTop + 'px';
		notepad.style.display = 'block';
	}
	//添加
	add.onclick = function() {
		textarea.value = '';
		content.style.display = 'block';
		list.style.display = 'none';
		save.index = -1;
		textarea.focus();
	}
	//保存
	save.onclick = function() {
		content.style.display = 'none';
		list.style.display = 'block';
		var con = time + "=" + encodeURIComponent(textarea.value); //将字符进行编码
		if (save.index == -1 && textarea.value == '') return; //如果文本为空就不添加

		//保存时删除数据
		if (save.index != -1 && textarea.value == '') {
			arr.splice(save.index, 1);
			updateList();
			return;
		}
		if (save.index != -1) {
			arr.splice(save.index, 1, con);
			updateList();
			return;
		}
		//每条数据的存储
		if (save.index == -1) {
			if (arr.length == 0) {
				arr[0] = con;
			} else {
				arr.unshift(con);
			}
		}
		updateList();
	}
	//删除数据
	del.onclick = function() {
		var result = confirm('你确定要删除这条便签吗?');
		if (result) {
			arr.splice(save.index, 1);
			content.style.display = 'none';
			list.style.display = 'block';
			updateList();
		}
	}

	//更新数据

	function updateList() {
		localStorage.setItem('note', arr.toString());
		list.innerHTML = '';
		for (var i = 0; i < arr.length; i++) {
			if (arr.length == 0) return;
			var li = document.createElement('li');
			//标题
			var title = decodeURIComponent(arr[i].split("=")[1]).substring(0, 20); //解码并且限制字符的长度
			//时间
			var t = arr[i].split('=')[0];
			li.innerHTML = '<span>' + t + '</span>' + title;
			list.appendChild(li);
		}
		//获取点击内容
		var aLi = list.getElementsByTagName("li");
		for (var i = 0; i < aLi.length; i++) {
			aLi[i].onclick = function() {
				var con = arr[i].split('=')[1];
				var num = i;
				return function() {
					content.style.display = 'block';
					list.style.display = 'none';
					textarea.focus();
					save.index = num;
					textarea.value = decodeURIComponent(con);
				}

			}(i)
		}
	}
	updateList(); //页面刷新自动跟新数据

	//隐藏便签
	closeNote.onclick = function() {
		move(notepad, {
			'height': {
				target: 0,
				duration: 400,
				fx: 'linear'
			},
			'opacity': {
				target: 0,
				duration: 400,
				fx: 'linear'
			}
		}, function() {
			notepad.style.display = 'none';
			notepad.style.opacity = '1';
			notepad.style.fliter = 'apha(opacity:100)';
			notepad.style.height = '395px';
		})


	}
	//拖动便签窗口
	note_title.onmousedown = function(ev) {
		ev = ev || event;
		drag(ev, notepad);
		return false;
	} /*-------------------------------注销--------------------------------*/
	var cancel = right_menu.children[7]; //注销
	cancel.onclick = function() {
		var result = confirm('你确定要要离开吗?');
		if (result) {
			land_status.style.display = 'none';
		}
	}
	//点击document，消失菜单
	document.onclick = function() {
		files_right_menu.style.display = 'none'; //隐藏文件夹上的右键菜单
		right_menu.style.display = 'none'; //隐藏右键菜单
	} /*----------------------------------时钟绘制-------------------------------------*/
	var mask = document.getElementById('mask');
	var clock = document.getElementById('clock');

	//哪到上下文的绘图环境
	var context = clock.getContext('2d');

	function drawClock() {
		//用于清除画布
		context.clearRect(0, 0, 450, 450);
		//拿到当前时间对象
		var oDate = new Date();
		//获取当前时间的  时 分 秒
		var year = oDate.getFullYear(); //年
		var month = oDate.getMonth() + 1; //月
		var date = oDate.getDate(); //日
		var week = oDate.getDay(); //一周的第几天

		var hour = oDate.getHours();
		var min = oDate.getMinutes();
		var sec = oDate.getSeconds();
		//小时和分钟的关系 
		var hours = hour + (min / 60);
		//将24小时转化为12小时制
		hours = hours > 12 ? hours - 12 : hours;

		//画圆
		context.beginPath(); //开始路径
		context.lineWidth = 15; //线条宽度
		context.fillStyle = '#eee'; //填充颜色
		context.strokeStyle = "#373737"; //边框颜色
		context.arc(200, 140, 120, 0, 2 * Math.PI, false); //画圆
		context.fill(); //填充绘制
		context.stroke(); //进行具体绘制
		context.closePath(); //关闭路径

		//画刻度
		//时针刻度
		for (var i = 0; i < 12; i++) {
			scale(-95, -110, 30, 3, i);
		}
		//分针刻度
		for (var i = 0; i < 60; i++) {
			scale(-100, -110, 6, 1, i);
		}

		//绘制时针
		pin(-60, 20, 7, 'black', hours, 30);

		//绘制分针
		pin(-80, 20, 5, 'black', min, 6);

		//绘制秒针
		pin(-90, 20, 3, 'red', sec, 6);

		//数字生成
		createNmu();

		//画数字
		showTime(year, month, date, week, hour, min, sec);

	}
	drawClock();

	//绘制刻度

	function scale(y1, y2, angle, width, i) {
		context.save(); //保存当前图形的状态

		//设置时针刻度的样式
		context.lineWidth = width; //设置时针刻度的粗细
		context.strokeStyle = '#000'; //设置时针刻度的颜色

		//设置时针刻度的初始位置
		context.translate(200, 140); //设置时针刻度的起点位置
		context.rotate((i * angle) * Math.PI / 180); //弧度转角度

		//设置路径状态
		context.beginPath(); //开始路径
		context.moveTo(0, y1); //起始点
		context.lineTo(0, y2); //结束点
		context.closePath(); //关闭路径
		context.stroke(); //进行绘制

		context.restore(); //恢复当前图形状态
	}
	//绘制钟表的针
	//参数：起点时y轴偏移量 终点时y轴偏移量 绘制的针的颜色 时间  角度

	function pin(y1, y2, width, color, time, angle) {
		//绘制时针
		context.save(); //保存当前图形的状态

		//设置时针的样式
		context.lineWidth = width; //设置时针的粗细
		context.strokeStyle = color; //设置时针的颜色

		//设置时针的起始状态
		context.translate(200, 140); //设置起始位置
		context.rotate((time * angle) * Math.PI / 180); //弧度转角度

		//设置路径状态
		context.beginPath(); //开始路径
		context.moveTo(0, y1); //起始点
		context.lineTo(0, y2) //结束点
		context.closePath(); //闭合路径
		context.stroke(); //进行绘制
		if (width == 3) {
			overlap(); //绘制交叉点
		}
		context.restore(); //恢复当前图形状态
	}

	//绘制交叉点  

	function overlap() {
		//画交叉点
		context.beginPath();
		context.arc(0, 0, 5, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = "gray";
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(0, -70, 5, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = "gray";
		context.fill();
		context.stroke();
	}

	//生成数字

	function createNmu() {
		for (var i = 0; i < 12; i++) {
			context.save(); //保存当前图形的状态

			context.translate(200, 140); //设置起始位置
			context.rotate(-(i * 29.5) * Math.PI / 180); //弧度转角度

			context.font = '20px arial'; //数字的 大小 字体名称
			context.fillStyle = 'black'; //数字的颜色
			context.fillText(12 - i, -10, -70); //画数字

			context.restore(); //恢复当前图形的状态
		}
	}

	function showTime(y, m, d, w, h, min, s) {
		var arrWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
		context.save();
		context.translate(200, 140);
		context.font = '35px arial';
		context.fillStyle = 'black';
		//context.lineWidth = 2;
		context.strokeStyle = '#000'
		context.fillText(y + '年' + m + '月' + d + '日' + arrWeek[w] /*+ '  ' + ad(h) + '时' + ad(min) + '分' + ad(s) + '秒'*/ , -180, 170)
		//context.strokeText(y + '年' + m + '月' + d + '日' + arrWeek[w] + '  ' + ad(h) + '时' + ad(min) + '分' + ad(s) + '秒', -195, 170);
		context.restore();
	}

	//用于时间数字补零

	function ad(str) {
		return str < 10 ? '0' + str : '' + str;
	}
	//使用setInternal（代码，（毫秒）时间）  让时钟动起来
	setInterval(drawClock, 1000); //1秒中动一下

	//鼠标拖拽
	mask.onmousedown = function(ev) {
		ev = ev || event;
		drag(ev, mask);
		return false; //阻止浏览器默认行为
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
			//限定x,y值得范围
			if (x < 0) {
				x = 0;
			}
			if (x > maxL) {
				x = maxL;
			}
			if (y < 0) {
				y = 0;
			}
			if (y > maxT) {
				y = maxT;
			}
			obj.style.left = (x) + 'px';
			obj.style.top = (y) + 'px';
		}
		document.onmouseup = function() {
			document.onmousemove = document.onmouseup = null;
		};
		return false;
	}
}
//关闭页面 或者重新加载时触发
window.onbeforeunload = function() {
	return "您确定要离开吗";
}