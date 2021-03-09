;(function(global, factory) {
	global.editorInit = global.editorInit || factory;
	//API 
	global.toggle = function(i) {
		let codeEle = document.querySelectorAll(`#api blockquote ul`)[i].nextElementSibling,
		state = codeEle.style.display;
		codeEle.style.display = (state == 'none' || state == '') ? 'block' : 'none';
	}
}(window || this, function(CodeMirror, option) {
	'use strict';
	
	function cr_node(i, l = "body") { //创建节点并添加
	    if (document.querySelectorAll(`[href="${i}"],[src="${i}"]`).length > 0)
	    	return
	    let t = i.split(".").reverse()[0], n = null;
	    if (t == "js") {//后缀判断
	        n = document.createElement("script");
	        n.setAttribute("type", "text/javascript");
	        n.setAttribute("src", i);
	    } else if (t == "css") {
	    	l = 'head';
	        n = document.createElement("link");
	        n.setAttribute("rel", "stylesheet");
	        n.setAttribute("href", i);
	    }
	    if (n != null)
	    	(typeof(l) == 'string' ? document[l] : l).appendChild(n)
	    return n;
	}
	
	let headEle = document.head,
	bodyEle = document.body,
	apiEle = document.createElement('div'),
	firstEle = bodyEle.firstChild;
	
	let {
		value = '',
		api = 'README.md',
		saveFn = cm => alert(cm.getValue()),//保存回调函数
		readOnly = false,//只读模式：boolean
		otherWords = {},//额外关键字 (Object or Array)：{ languageName: ['key', 'key1'], languageName1: {word: 'comment'} } or ['key', 'key1']
		themeLabel = '主题: ',
		languageLabel = ' 语言: ',
		keywords = '',
		variable = {},//变量
		codeEle = document.createElement('textarea'),//编辑器节点 ：element or false
		themeEle = document.createElement("select"),//皮肤选择器节点：element or false
		languageEle = document.createElement("select"),//语言选择器节点：element or false
		theme = [],//皮肤列表(Array or string)： ['theme', 'theme1'] or 'theme'
		language = 'javascript',//语言列表：string or ['name', 'name1'] or string
		include = [],//
		origLeft = undefined,
		orig = undefined,
	} = (typeof(option) == 'object' ? option : {});
	
	/**
	 * 初始化引用
	 */
	{
		function addNodes(o, index = 0) { //多个添加
		    if (o.src.length > index && typeof(o.src) == "object" && o.src.length > 0) {
		    	var n = cr_node(o.src[index], o.parent);
		    	if (o.src.length - 1 == index && typeof(o.load) == "function")
		            n.onerror = n.onload = o.load;
		        else
		            n.onerror = n.onload = addNodes.bind(this, o, index + 1)
		    }
		}
		addNodes({ "src": include, "parent":"head"})
	}
	
	/**
	 *初始化编辑器 
	 */
	if (option.codeEle == undefined) {
		codeEle.autofocus = "autofocus";
		bodyEle.insertBefore(codeEle, firstEle);
	}
		
	/**
	 * 字体设置
	 */
	let fontSizeSetting = (cm, size='+2') => {
    	let codeEle = cm.display.wrapper,
    	fontSize = /\d+/.exec(codeEle.style.fontSize || getComputedStyle(codeEle).fontSize)[0];
    	codeEle.style.fontSize = eval(fontSize + size) + 'px';
    }
	const editor = this.editor || ((codeEle.tagName == 'TEXTAREA' ? (codeEle.value = value, CodeMirror.fromTextArea) : CodeMirror)(codeEle, {
		value,
    	indentUnit: 4,
    	matchBrackets: true,
    	autoCloseTags: true,
    	lineNumbers: true,
    	foldGutter: true,
	    readOnly: readOnly || false,
		showTrailingSpace: true,
		tabSize: 4,
        indentWithTabs: true,
        origLeft: origLeft,
        orig: orig,
        collapseIdentical: false,
        connect: 'align',
    	extraKeys: {
    		'Ctrl-Q': cm => cm.foldCode(cm.getCursor()),//展开or合并
    		'F11': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),//全屏
	        'Esc': cm => { if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false); },//关闭全屏
	        'Ctrl-S': saveFn,//保存
	        'Ctrl-F': 'findPersistent',
//	        'Ctrl-R': cm => {},
//	        'F5': cm => {},
			'Ctrl-H': 'replace',
	        'Ctrl-D': 'deleteLine',//删除行
	        'Ctrl-=': fontSizeSetting,//字体放大
	        'Ctrl--': cm => fontSizeSetting(cm, '-2'),//字体缩小
	        'Alt-/': cm => cm.showHint(),//手动打开提示
	        'Shift-9': cm => autoComplete(cm.getSelections().length > 1 ? '(' : `(${cm.getSelection()})`),
	        'Shift-[': cm => autoComplete(cm.getSelections().length > 1 ? '{' : `{${cm.getSelection()}}`),
	        '[': cm => autoComplete(cm.getSelections().length > 1 ? '[' : `[${cm.getSelection()}]`),
	        'Shift-Tab': 'indentAuto',
	        'Ctrl-/': cm => {
	        	debugger
	        }
		},
		highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
	    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    }));
	let modeName = editor.getMode().name;
    
	/**
	 * 初始化布局 
	 */
	{
		let {innerHeight: height, innerWidth: width} = window,
		boxStyle = editor.display.wrapper.style//(option.codeEle == undefined ? bodyEle : editor.display.wrapper).style
		// boxStyle.height = height * (option.height || 1) - 25 + 'px'
		boxStyle.height = height * (option.height || 1)  -2+ 'px'
		boxStyle.width = width * (option.width || 1) - 3 + 'px'
	}
    /**
     * 初始化
     */
    {
    	editor.keywords = keywords + Object.keys(otherWords[language] || {}).join(' ');
    	let line = editor.lastLine();
    	if (!(localStorage && localStorage.cursor))
    		editor.setCursor({line, ch: editor.getLine(line).length});
    	apiEle.id = 'api';
    	apiEle.className = 'markdown-body';
    	apiEle.hidden = true;
    	bodyEle.append(apiEle);
    	//F1 API
		window.onkeydown = function(e) {
			let cm = this;
			if (e.code == 'F1') {
				let mEle = option.codeEle || cm.display.wrapper
				if (mEle.className != '' && !mEle.className.includes('CodeMirror'))//隐藏元素
					mEle = mEle.parentElement
				let conver = (cm.markdown = (cm.markdown || new showdown.Converter({tables: true}))),
				isApi = mEle.style.display = (mEle.style.display == 'none') ? '' : 'none';
				if (isApi) {
					localStorage.setItem('codeValue', cm.getValue());
					fetch(api)
					.then(data => data.text())
					.then(data => {
						apiEle.innerHTML = conver.makeHtml(data);
					}).catch(e => conver.makeHtml('###获取API失败'));
					apiEle.hidden = false;
					apiEle.style.width = mEle.style.width;
					apiEle.style.height = mEle.style.height;
				} else
					apiEle.hidden = true;
			    if (e && e.preventDefault)//阻止默认浏览器动作(W3C) 
			        e.preventDefault();
			    else//IE中阻止函数器默认动作的方式 
			        window.event.returnValue = false;
			}
		}.bind(editor);
    }
	
	/**
	 * 皮肤历史记录
	 * @param {Object} theme
	 * @param {Object} e
	 */
	function setTheme(theme, e){
		editor.setOption('theme', (this && this.value) || theme);
		let tm = ((theme.target && theme.target.value) || theme)
		location.hash = '#' + tm;
		cr_node(`theme/${tm}.css`)
	}
    
    /**
     * 加载提示
     * CodeMirror[hintWords][mode] = Object.keys(variable).join(' ');
	 * CodeMirror.tableKeywords = variable;
     */
    let loadOtherWords = () => {
    	CodeMirror.tableKeywords = variable;
    	modeName = editor.getMode().name;
		let words = (CodeMirror.hintWords && CodeMirror.hintWords[modeName] ? CodeMirror.hintWords : CodeMirror)[modeName], oW = Array.isArray(otherWords) ? otherWords : otherWords[modeName];
		if (oW) {
			oW = (Array.isArray(oW) ? oW : Object.keys(oW)).concat(Object.keys(variable));
			if (words)
				oW.forEach( d => {
					if (!words.includes(d))
						words.push(d)
				});
			CodeMirror[modeName] = oW.join(' ');
		}
    }
    
	// CodeMirror.modeURL = 'mode/%N/%N.js';
	CodeMirror.modeURL = "mode/%N/%N.js";
	/**
	 * 语言选择
	 * @param {Object} value
	 */
	function setLanguage (value) {
		let val = value instanceof Event && value ? this.value : value, m, mode, mime;
		if(m = /.+\.([^.]+)$/.exec(val)) {
			({mode, mime} = CodeMirror.findModeByExtension(m[1]));
		} else if(/\//.test(val))
			({mode, mime} = CodeMirror.findModeByMIME(mime = val));
		else
			({mode, mime} = (CodeMirror.findModeByName(val) || CodeMirror.findModeByFileName('.' + val)));
		if(mode) {
			editor.setOption('mode', mime);
			CodeMirror.autoLoadMode(editor, mode);
			setTimeout(loadOtherWords, 1000);
		}
	}

	
	//--------------BEGIN 参数 
	/**
	 * 选择皮肤
	 */
	let choice = (location.hash && location.hash.slice(1)) ||
             (document.location.search &&
              decodeURIComponent(document.location.search.slice(1))) || (typeof(theme) == 'string' && theme);
	if (choice)
		setTheme(choice);
	if (option.themeEle == undefined && Array.isArray(theme) && theme.length > 0 && themeEle) {
		bodyEle.insertBefore(themeEle, codeEle);
		let labelEle = document.createElement('label');
		labelEle.innerText = themeLabel;
		bodyEle.insertBefore(labelEle, themeEle);
	}
	if (themeEle && Array.isArray(theme) && theme.length > 0) {
		let optionEles = '\n';
		theme.forEach(name => (optionEles += `<option>${name}</option>\n`));
		themeEle.innerHTML = optionEles;
		themeEle.onchange = setTheme.bind(themeEle);
		if (choice)
			themeEle.value = choice;
	}
	
	/**
	 * 选择语言
	 */
	if (option.languageEle == undefined && Array.isArray(language) && language.length > 0 && languageEle) {
		bodyEle.insertBefore(languageEle, codeEle);
		let labelEle = document.createElement('label');
		labelEle.innerText = languageLabel;
		bodyEle.insertBefore(labelEle, languageEle);
	}
	if (languageEle && Array.isArray(language) && language.length > 0 && languageEle) {
		let optionEles = '\n';
		language.forEach(name => (optionEles += `<option>${name}</option>\n`));
		languageEle.innerHTML = optionEles;
		languageEle.onchange = setLanguage.bind(languageEle);
		setLanguage.call(this, languageEle.value);
	}
	if (typeof(language) == 'string')
		setLanguage.call(this, language);
	//--------------END 参数 
	
	let setLineCursor = i => {
		let {line, ch} = editor.getCursor();
		editor.setCursor({line, ch: ch + i});
	}

    /**
     * 回车事件
     */
    let enterFun = (e, f, comment) => {
    	if (comment && comment.style.display != 'none' && /[a-z]+\(([a-z]+((,)?[a-z]+)?)?\).*/ig.test(comment.innerText)) {
    		editor.insert('()');
    		setLineCursor(-1)
    	}
    }
    
    let autoComplete = char => {
    	editor.insert(char);
    	if (char.length > 1)
			setLineCursor(-1)
    }
	
    /**
     * 添加注释
     */
    let codePer = document.querySelector('.CodeMirror');
    let tipFun = (e, f) => {
		let hintEle = document.getElementsByClassName('CodeMirror-hints'),
		tipEle = document.getElementsByClassName('hint-tip')[0] || document.body.appendChild(document.createElement('span'));
		if (['Enter', 'NumpadEnter'].includes(f.code))
			enterFun(e, f, tipEle);
		if ((hintEle = hintEle[0]) && !Array.isArray(otherWords) && otherWords[modeName]) {
			let {offsetTop: top, offsetLeft: left, clientWidth: width} = hintEle,
				{backgroundColor, color} = getComputedStyle(codePer);
			tipEle.style.top = top + 'px';
			tipEle.style.left = left + width + 2 + 'px';
			tipEle.style.backgroundColor = backgroundColor;
			tipEle.style.zIndex = 999;
			tipEle.style.color = color;
			tipEle.className = 'hint-tip';
			let text = document.getElementsByClassName('CodeMirror-hint-active')[0].innerText,
			comment = text == 'null' ? undefined : otherWords[modeName][text];
			if (comment) {
				tipEle.innerText = comment;
				tipEle.style.display = 'block';
			} else
				tipEle.style.display = 'none';
		} else
			tipEle.style.display = 'none';
		//关键字提示
		if (f.code.startsWith('Key') || ['Period', 'Backspace'].includes(f.code)) {
			editor.showHint();
			console.log(f.code);
		}
    }
	editor.on('keyup', tipFun);
	
	//暴露函数
	editor.insert = editor.getDoc().replaceSelection.bind(editor.getDoc());
	editor.setLanguage = setLanguage.bind(this);
	
	return editor;
}.bind(window || this, CodeMirror)))
