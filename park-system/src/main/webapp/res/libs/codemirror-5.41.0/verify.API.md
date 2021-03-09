> # <center>验证公式函数API<span style="font-size: 14px;color:red">（开关API请按“F1”）</span></center>

>> ### 字符串函数

>> * [isNull(object)](javascript:toggle(0);) : **boolean**	判断字符串是否为空
>>> ```javascript
>>> function isNull(obj) {
	return obj == null || obj == undefined;
>>> }
>>> ```

>> * [isNotNull(object)](javascript:toggle(1);) : **boolean**	判断字符串不为空
>>> ```javascript
>>> function isNotNull(obj) {
	return !isNull(obj);
>>> }
>>> ```

>> * [isEmpty(string)](javascript:toggle(2);) : **boolean**	判断字符串是否为空
>>> ```javascript
>>> function isEmpty(str) {
	return (str || '').trim().length == 0;
>>> }
>>> ```

>> * [isNotEmpty(string)](javascript:toggle(3);) : **boolean**	判断字符串不为空
>>> ```javascript
>>> function isNotEmpty(str) {
	return !isEmpty(str);
>>> }
>>> ```

>> * [length(string)](javascript:toggle(4);) : **int**	返回字符串长度
>>> ```javascript
>>> function length(str) {
	return (str || '').length;
>>> }
>>> ```

>> * [trim(string)](javascript:toggle(5);) : **string**	字符串去除前后空格
>>> ```javascript
>>> function trim(str) {
	return (str || '').trim();
>>> }
>>> ```

>> * [lower(string)](javascript:toggle(6);) : **string**	字符串转小写
>>> ```javascript
>>> function lower(str) {
	return (str || '').toLowerCase();
>>> }
>>> ```

>> * [up(string)](javascript:toggle(7);) : **string**	字符串转大写
>>> ```javascript
>>> function up(str) {
	return (str || '').toUpperCase();
>>> }
>>> ```

>> * [replace(string: 原字符串, string: 替换字符串, string/regex: 字符串或正则式)](javascript:toggle(8);) : **string**	字符串替换，支持正则表达式
>>> ```javascript
>>> function replace(str, rep, r) {
	return (str || '').replace(r, rep);
>>> }
>>> ```

>> * [has(string: 字符串, string: 匹配字符串)](javascript:toggle(9);) : **boolean**	是否存在此字符
>>> ```javascript
>>> function has(str, ch) {
	return (str || '').indexOf(ch) > -1;
>>> }
>>> ```

>> * [sub(string/array, int[, int])](javascript:toggle(10);) : **string/array**	字符串或数组切片; int 可为负数，则从末尾开始
>>> ```javascript
***示例***
获取末尾两位字符                       sub('123456789', -2) : "89"
获取第三位开始到末尾的字符              sub('123456789', 2) : "3456789"
获取第三位至第五位之间的字符            sub('123456789', 2, 5) : "345"
获取第六位至倒数第二位之间的字符        sub('123456789', 5, -2) : "67"
获取数组的第二位至第五位之间的元素	   sub([1,2,3,4,5,6,7,8,9], 1, 4) : [2, 3, 4]
--------------------------------------------------
>>> function sub(source, start, end) {
	var sb = (start == undefined || start == 0),
	 	eb = (end == undefined || end == 0);
	if ((source || '').length < 1 || (sb && eb))
		return source;
	var a = start, b = end, l = source.length;
	if (sb)
		a = start = 0;
	if (eb)
		b = end = l;
	if (start < 0)
		a = l + start;
	if (end < 0)
		b = l + end;
	return typeof(source) == 'string' ? source.substring(a, b) : source.slice(a, b);
>>> }
>>> ```

>> * [match(string: 字符串, string/regex: 匹配字符串)](javascript:toggle(11);) : **boolean**	找到一个或多个正则表达式的匹配，无匹配则返回空数组
>>> ```javascript
>>> function match(str, re) {
	return (str || '').match(re) || [];
>>> }
>>> ```

>> * [matchL(string: 字符串, string/regex: 匹配字符串)](javascript:toggle(12);) : **boolean**	获取左边则表达式的匹配；即第一个，无则返回空字符串
>>> ```javascript
>>> function matchL(str, re) {
	var vals = match(str, re),
		len = vals.length;
	return len > 0 vals[0] : '';
>>> }
>>> ```

>> * [matchR(string: 字符串, string/regex: 匹配字符串)](javascript:toggle(13);) : **boolean**	获取右边则表达式的匹配；即第最后一个，无则返回空字符串
>>> ```javascript
>>> function matchR(str, re) {
	var vals = match(str, re),
		len = vals.length;
	return len > 0 vals[len - 1] : '';
>>> }
>>> ```


> ------------------------------------------------------------------------------------------------------------------------------------------
>> ### 数值函数
>> * [int(string)](javascript:toggle(14);) : **int**	字符串转整数，空字符串返回0
>>> ```javascript
>>> function int(str) {
	return isEmpty(str) ? 0 : parseInt(str);
>>> }
>>> ```

>> * [float(string)](javascript:toggle(15);) : **float**	字符串转浮点数，空字符串返回0.0
>>> ```javascript
>>> function float(str) {
	return isEmpty(str) ? 0.0 : parseFloat(str);
>>> }
>>> ```

>> * [abs(string)](javascript:toggle(16);) : **float**	返回数的绝对值，空字符串返回0.0
>>> ```javascript
>>> function abs(str) {
	return isEmpty(str) ? 0.0 : Math.abs(str);
>>> }
>>> ```

>> * [ceil(string)](javascript:toggle(17);) : **float**	对数进行上舍入，空字符串返回0.0
>>> ```javascript
>>> function ceil(str) {
	return isEmpty(str) ? 0.0 : Math.ceil(str);
>>> }
>>> ```

>> * [floor(string)](javascript:toggle(18);) : **float**	对数进行下舍入，空字符串返回0.0
>>> ```javascript
>>> function floor(str) {
	return isEmpty(str) ? 0.0 : Math.floor(str);
>>> }
>>> ```

>> * [round(string)](javascript:toggle(19);) : **float**	把数四舍五入为最接近的整数，空字符串返回0.0
>>> ```javascript
>>> function round(str) {
	return isEmpty(str) ? 0.0 : Math.round(str);
>>> }
>>> ```


> ------------------------------------------------------------------------------------------------------------------------------------------
>> ### 校验函数
>> * [regexObj](javascript:toggle(20);) : 提供可选校验正则集合
>>>```
>>>var regexObj = {
	//正整数
	A: /^[0-9]*[1-9][0-9]*$/,
	//负整数
	B: /^-[0-9]*[1-9][0-9]*$/,
	//正浮点数
	C: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
	//负浮点数
	D: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,
	//浮点数
	E: /^(-?\d+)(\.\d+)?$/,
	//email地址
	F: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
	//url地址
	G: /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,
	//年/月/日（年-月-日、年.月.日）
	H: /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/,
	//一年的12个月(01～09和1～12)
	I: /^(0?[1-9]|1[0-2])$/,
	//一个月的31天(01～09和1～31)
	J: /^((0?[1-9])|((1|2)[0-9])|30|31)$/,
	//匹配中文字符
	K: /[\u4e00-\u9fa5]/,
	//匹配中国邮政编码
	L: /[1-9]\d{5}(?!\d)/,
	//匹配身份证
	M: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
	//所有手机号码
	N: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
	//区号+座机号码+分机号码
	O: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
	//匹配IP地址
	P: /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/,
	//中文、英文、数字及下划线
	Q: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
>>>}
>>>```

>> * [test(string: 字符串, regex: 正则式)](javascript:toggle(21);) : **boolean**	正则式匹配字符串
>>> ```javascript
>>> ***示例***
判断是否是整数 test('123', /^\d+$/) : true
------------------------------------------
>>> function test(str, re) {
	return re.test(str);
>>> }
>>> ```

>> * [test1(string: 字符串, char: regexObj正则式标识)](javascript:toggle(22);) : **boolean**	正则式匹配字符串
>>> ```javascript
>>> ***示例***
判断是否是整数 test1('123', 'A') : false
------------------------------------------
>>> function test1(str, ch) {
	return isNotNull(regexObj[ch]) && test(str, regexObj[ch]);
>>> }
>>> ```







<!--
//提取到提示Map
var map = {};
document.querySelectorAll('li').forEach(e => {
    let t = e.innerText;
    a[t.substring(0, t.indexOf('('))] = t;
});
console.log(map)
-->
