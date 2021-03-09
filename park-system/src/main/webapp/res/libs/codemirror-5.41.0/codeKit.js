;(function(global, factory) {
	global.codeKit = factory();
}(window || this, function() {
	'use strict';
	let format = object => {
		let variable = {};// map object
        
    	// key value map
	    let kvm = (k, p) => {
	    	if (typeof(k) == 'string' && k.includes('.')) {
	    		let km = k.split('.'),
	    		 	vs = (variable[km[0]] || []);
	    		if (!vs.includes(km[1]))
					variable[km[0]] = vs.concat(km[1]);
	    	} else {
	    		let t = (typeof(k) == 'string' ? object[k] : k);
	    		if (typeof(t) == 'function')
	    			variable[k] = t;
				else
	    			(Array.isArray(t) ? t : Object.keys(t)).forEach(e => kvm(e, k));
	    	}
	    }
		Object.keys(object).forEach(kvm);
		
		return {variable, fks: Object.keys(variable)};
	}
	var keyworlds = {'byte': 'byte', 'short': 'short', 'int': 'int', 'long': 'long', 'float': 'float', 'double': 'double', 'boolean': 'boolean','char': 'char', 'string': 'String', 'object': 'Object', 'integer': 'Integer'}
	let template = (text='', object={}) => {
		let {variable, fks} = format(object);
		//预处理删除注释
		text = text.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '');
		let javascript = text, java = text;
		
		/**
		 * javascript 
		 */
		{
			fks.forEach(k => {
				let vs = variable[k];
				if (Array.isArray(vs))
					vs.forEach(v => {
						let kv = `(?<=\\s|\\W|^)(?!" *)${k}\.${v}(?! *")(?=\\s|\\W|$)`;
						javascript = javascript.replace(new RegExp().compile(kv, 'ig'), `get("${k}.${v}")`);
					});
				else if (typeof(vs) == 'function')
					javascript = javascript.replace(new RegExp().compile(k, 'ig'), '!' + vs.toString());
			});
			//Java关键字替换成var
			javascript = javascript.replace(new RegExp().compile(`(?<=\\s|\\W|^)(?!" *)(${Object.keys(keyworlds).join('|')})(?! *")(?=\\s|\\W|$)`, 'ig'), 'var');

		}
		console.log('javascript:\n', javascript);
		
		/**
		 * java
		 */
		{
			/*let regexp = new RegExp().compile('[' + fks.join(',') + ']', 'ig');
			text.split(/\n/).forEach(s => {
				if (regexp.test(s)) {
					let ms = undefined;
					if (ms = /(?<= *[if,while] *\()(.*)(?= *\))/ig.exec(s))
						if (regexp.test(ms[0]))
							java += s.replace(ms[0], `@[${ms[0]}]`);
					else
						java += `@[${s}]`;
				} else
					java += s;
				java += '\n'
			})*/
			fks.forEach(k => {
				let vs = variable[k];
				if (Array.isArray(vs))
					vs.forEach(v => {
						let kv = `(?<=\\s|\\W|^)(?!" *)${k}\.${v}(?! *")(?=\\s|\\W|$)`;
						java = java.replace(new RegExp().compile(kv, 'ig'), `get("${k}.${v}")`);
					});
			});
			//Java关键字替换成var
			let javaKeyworlds = Object.assign({}, keyworlds);
			javaKeyworlds['in'] = ':';
			javaKeyworlds['var'] = 'Object';
			Object.keys(javaKeyworlds).forEach(k => {
				java = java.replace(new RegExp().compile(`(?<=\\s|\\W|^)(?!" *)${k}(?! *")(?=\\s|\\W|$)`, 'ig'), javaKeyworlds[k]);
			})
		}
		console.log('java:\n', java);
		
		return {
			java,
			javascript,
		}
	}
	
	return {
		format,
		template,
	}
}))
