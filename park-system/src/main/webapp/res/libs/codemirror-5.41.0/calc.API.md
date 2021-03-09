> # <center>计算公式API<span style="font-size: 14px;color:red">（开关API请按“F1”）</span></center>


>> ### 编辑器快捷键
>> * [keyMap](javascript:toggle(0);) : 快捷键
>>> ``` text
 F1            # 函数说明(API)
 F11           # 全屏
 Ctrl+S        # 保存
 Ctrl+A        # 全选
 Ctrl+D        # 删除行
 Ctrl+Y        # 恢复上一步
 Ctrl+Z        # 撤销上一步
 Ctrl+F        # 查找
 Ctrl+H        # 替换
 Ctrl+Home     # 跳转到首行
 Ctrl+End      # 跳转到尾行
 Ctrl++        # 字体放大
 Ctrl+-        # 字体缩小
 Ctrl+鼠标左键  # 跨行多选词
 Alt+鼠标左键   # 跨行扩选
 Alt+/         # 打开提示
 >>> ```


>> ### 公式系统默认值

>> * [defalut](javascript:toggle(1);) : 系统默认值
>>> ``` python
_PARAMS      # 系统参数，用与获取数据源的条件
_TIME        # 当前时间
_COUN        # 县
_PROV        # 省码
_PROVONE     # 市码
_YEAR        # 当前年
_MONTH       # 当前月份
```


>> ### 公式关键字

>> * [keys](javascript:toggle(2);) : 关键字说明
>>> ``` python
True         # 布尔（bool）类型，真值
False        # 布尔（bool）类型，假值
is           # 判断是否一致；如：1 is 1 返回 True; 等同与： 1==1
not          # 否，如：not False 返回 True; 等同于：1 != 2
is not       # 否，如：1 is not 1 返回 Flse; 等同于：1 != 1
in           # 是否存在，如：'a' in 'china' 返回 True; 1 in [1, 2, 3, 4] 返回 True
not in       # 是否不存在，如：'a' not in 'china' 返回 Flase; 1 not in [1, 2, 3, 4] 返回 False
and          # 并且，用于连接条件的关键字
or           # 或者，用于连接条件的关键字
continue     # for 循环关键字，表示结束本次运算，进行下次运算
break        # for 循环关键字，表示跳出此循环，之后的运算都不执行
return       # 结束运行
int          # 整型
str          # 字符串；即：'123'、'abcd'
bool         # 布尔类型；即：True、False
float        # 浮点型；即：0.1
list         # 数组（列表）；即：[1, 2, 3, ...]
dict         # 字典，键对应值的类型；即：{'name': '张三', 'age': 21, 'gender': '男'}
null         # 空对象
None         # 空对象
#            # 注释关键符，不支持双斜线“//”
>>> ```


>> ### 公式逻辑块

>> * [for](javascript:toggle(3);) : 循环
>>> ``` python
# 循环数组
for v in [1, 2, 3, 4]:
	pass
>>>
# 循环矩阵（数据集）
A = report('A', _PARAMS)	# 获取A卷数据
for i, row in A:
	pass
	# i 表示矩阵的行标识，即“0, 1, 2, 3, ...”；row 标识一个人的A问卷
	continue # for 循环关键字，表示结束本次计算，进行下次运算
>>> ```

>> * [if](javascript:toggle(4);) : 判断
>>> ``` python
a = 1
b = 2
# 判断a要等于1并且b要等于2
if a == 1 and b == 2:
	pass
>>>
c = [1, 3, 4]
# 判断c中存在a
if a in c:
	pass

>>> ```


>> ### 切片（截取）

>> * [[int:开始位置, int:结束位置]](javascript:toggle(5);) : 	切片，开始位置从0开始（包含开始位置，不包含结束位置）
>>> ``` python
'abcdefg'[:4]     # 表示获取前四位	 返回 'abcd'
'abcdefg'[1:4]    # 表示获取从位置1开始到位置4结束	返回 'bcd'
'abcdefg'[1:-1]   # 表示获取从位置1开始到倒数1个位置结束	返回 'bcdef'
'abcdefg'[2：3]   # 表示获取第三个字符	返回 'c'
[1,2,3,4,5][2:3]  # 表示获取第三个数	返回 [3]
[1,2,3,4,5][:]    # 无切片	返回 [1,2,3,4,5]
>>> ```


>> ### 数据源

>> * [mode(数据源标识)](javascript:toggle(6);) : 引用基础数据源
>>> ``` python
FAMILY      # 家庭信息
A           # 住户成员及劳动力从业情况
B           # 住房和耐用消费品拥有情况
C           # C卷收支情况
E           # 家庭经营和生产投资情况
F           # 家庭经营和生产投资情况
TG          # 退耕还林问卷
G           # 县（市、区）职工社会保障缴费比例
M           # 住宅摸底表
ZY          # 账页数据
WEIGHT      # 权数数据
>>> ```


>> ### 公式函数

>> * [report(mode:数据源标识, _PARAMS:系统变量[,bool:是否懒加载])](javascript:toggle(7);) : ***DataSet(数据集)***	引用基础数据源
>>> ``` python
A = report('A', _PARAMS) # 加载A卷，默认懒加载
ret = report(_PARAMS) # 声明一个结果集，用于保存计算结果
for i, p in A:
	r = row() # 声明行结果
	r[1] = p.A100 # 人编码赋值
	r[2] = p.A106 in [1, 2, 3] # 符合条件返回1；否则返回0
	r[3] = 6 > _MONTH > 3 # 符合条件返回1；否则返回0
	...
	r[20] = sum(r[1:5, 10:13, 17]) # 将计算结果的1至5、10至13、17指标进行加和
	ret.append(r, p) # 将每行的计算值添加到结果集中
ret.save() # 保存结果集，如果没调用save()则不会被保存 
>>> ```

>> * [reportCalc(_PARAMS:系统变量)](javascript:toggle(8);) : ***DataSet(数据集)***	汇总函数，引用计算数据源
>>> ``` python
data = reportCalc(_PARAMS) # 加载计算数据
# 定义分组规则（名称：分组条件）
data.summary({
    '城镇住户(U+UR)': 'I3 == 1',
    '农村住户(R)': 'I4 == 1',
    '居委会住户': 'I5 == 1',
    '村委会住户': 'I6 == 1',
    '城镇居委会住户(U)': 'I7 == 1',
    '城镇村委会与乡村(UR+R)': 'I8 == 1',
})
data.save() # 保存汇总结果，如果没调用save()则不会被保存 
>>> ```

>> * [left(data, on:关联字段, left_on=左集合关联字段, right_on=右集合关联字段)](javascript:toggle(9);) :  ***DataSet(数据集)***	左连接
>>> ``` python
# 左连接特性：左集合为主右集合为辅，左集合中的数据在右集合中不存在，则连接后的新集合中属于左集合的字段值为空
FAMILY = report('FAMILY', _PARAMS)   # 调查家庭基本信息
A = report('A', _PARAMS) # 加载A卷，默认懒加载
B = report('B', _PARAMS) # 加载B卷，默认懒加载
# A集合左连接B集合，on和left_on、right_on参数二选一
DS = A.left(B, 'FAMILYID')
>>>
# FAMILY集合左连接B集合，左集合的FAMILYCODE字段和右集合的FAMILYID字段进行关联
DS1 = FAMILY.left(B, 'FAMILYCODE', 'FAMILYID')
>>> ```

>> * [right(data, on:关联字段, left_on=左集合关联字段, right_on=右集合关联字段)](javascript:toggle(10);) :  ***DataSet(数据集)***	右连接
>>> ``` python
# 右连接特性：右集合为主左集合为辅，右集合中的数据在左集合中不存在，则连接后的新集合中属于右集合的字段值为空
FAMILY = report('FAMILY', _PARAMS)   # 调查家庭基本信息
A = report('A', _PARAMS) # 加载A卷，默认懒加载
B = report('B', _PARAMS) # 加载B卷，默认懒加载
# A集合右连接B集合，on和left_on、right_on参数二选一
DS = A.right(B, 'FAMILYID')
>>>
# FAMILY集合右连接B集合，左集合的FAMILYCODE字段和右集合的FAMILYID字段进行关联
DS1 = FAMILY.right(B, 'FAMILYCODE', 'FAMILYID')
>>> ```

>> * [inner(data, on:关联字段, left_on=左集合关联字段, right_on=右集合关联字段)](javascript:toggle(11);) :  ***DataSet(数据集)***	内连接
>>> ``` python
# 内连接特性：左右集合的并集数据集
FAMILY = report('FAMILY', _PARAMS)   # 调查家庭基本信息
A = report('A', _PARAMS) # 加载A卷，默认懒加载
B = report('B', _PARAMS) # 加载B卷，默认懒加载
# A集合内连接B集合，on和left_on、right_on参数二选一
DS = A.inner(B, 'FAMILYID')
>>>
# FAMILY集合内连接B集合，左集合的FAMILYCODE字段和右集合的FAMILYID字段进行关联
DS1 = FAMILY.inner(B, 'FAMILYCODE', 'FAMILYID')
>>> ```

>> * [report(_PARAMS)](javascript:toggle(12);) :  ***DataSet(数据集)***	创建一个空集合，用于存储计算的值
>>> ``` python
ret = report(_PARAMS)
...
ret.save() # 保存计算集合
>>> ```

>> * [row()](javascript:toggle(13);) :  ***array***	创建一行空集合
>>> ``` python
ret = report(_PARAMS)
r = row() # 声明一行空集合
r[1] = 1
r[2] = 2
...
ret.append(r)
>>> ```

>> * [append(row, data:详细)](javascript:toggle(14);) : 追加数据
>>> ``` python
ret = report(_PARAMS)
r = row()
r[1] = 1
r[2] = 2
...
ret.append(r) # 将行结果添加到结果集中
>>> ```

>> * [get_zy(wz:位置 [, int:pcode人码])](javascript:toggle(15);) :  ***DataSet(数据集)***		获取账页集合
>>> ``` python
ZY = report('ZY', _PARAMS)
ZY.get_zy(10) # 获取一个家庭的所有账页
ZY.get_zy(10, 1) # 获取一个家庭某个人的所有账页
>>> ```

>> * [zy(int: 账页编码, int: （1：数量；2：价格；3：数量1）)](javascript:toggle(16);) :  ***DataSet(数据集)***	根据账页编码获取账页值
>>> ``` python
ZY = report('ZY', _PARAMS)
f_zy = ZY.get_zy(10) # 获取一个家庭的所有账页
p_zy = ZY.get_zy(10, 1) # 获取一个家庭某个人的所有账页
t = f_zy.zy(12, 1) # 获取编码为‘12’开头的账页数量总和
>>> ```


>> ### 类型转换函数

>> * [len(object)](javascript:toggle(17);) :  ***int***	获取对象的长度
>>> ``` python
len('abc') # 返回：3
len([1, 2, 3, 4]) # 返回：4
len({'name': '张三', 'age': 21, 'gender': '男'}) # 返回：3
len(('a', 'b', 'c')) # 返回：3
>>> ```

>> * [int(string)](javascript:toggle(18);) :  ***int***	将字符串转换为整数
>>> ``` python
int('123')    # 返回：123
int('123.1')  # 返回：123
>>> ```

>> * [str(object)](javascript:toggle(19);) :  ***str***	将对象转换为字符串
>>> ``` python
str(123)    # 返回：'123'
str(123.1)  # 返回：'123.1'
>>> ```

>> * [float(object)](javascript:toggle(20);) :  ***float***	将字符串转换为浮点数
>>> ``` python
float(123)    # 返回：123.0
float(123.1)  # 返回：123.1
>>> ```

>> * [list(string)](javascript:toggle(21);) :   ***array***	 将字符串分割成字符数组
>>> ``` python
a = []
for i in list('ABCDE'):
	a.append(i)
# 返回：a = ['A', 'B', 'C', 'D', 'E']
>>> ```

>> * [range(int[,int：结束位置])](javascript:toggle(22);) :  返回可迭代的数组
>>> ``` python
s = ''
for i in range(5):
	s += str(i)
# 返回：s = '12345'
for i in range(2, 4):
	s += str(i)
# 返回：s = '23'
>>> ```

>> * [type(object：对象)](javascript:toggle(23);) :	***Type***	获取对象类型
>>> ``` python
type(1)             # 返回：int
type(1.0)           # 返回：float
type('jick')        # 返回：str
type([1,2,3])       # 返回：list
type({'A100': 1})   # 返回：dict
>>> ```

>> * [mult(string)](javascript:toggle(24);) :	***array***	 为多选指标
>>> ``` python
mult('1,2,3')       # 返回：[1, 2, 3]
>>> ```


>> ### 数学函数

>> * [sum(array)](javascript:toggle(25);) :	***int/float***	 加和函数
>>> ``` python
sum([1, 2, 3])       # 返回：6
sum([1, 2, 3.0])     # 返回：6.0
>>> ```

>> * [min(array:数组集合)](javascript:toggle(26);) :	***int/float***	 求集合的最小值
>>> ``` python
min([1, 2, 3])       # 返回：1
min([1.0, 2, 3.0])   # 返回：1.0
>>> ```

>> * [max(array:数组集合)](javascript:toggle(27);) :	***int/float***	 求集合的最大值
>>> ``` python
max([1, 2, 3])       # 返回：3
max([1.0, 2, 3.0])   # 返回：3.0
>>> ```

>> * [mode(array:数组集合)](javascript:toggle(28);) :	***int/float***	 求集合的众数
>>> ``` python
mode([1, 2, 3, 1])        # 返回：1
mode([1.0, 2, 3.0, 1.0])  # 返回：2.5
>>> ```

>> * [median(array:数组集合)](javascript:toggle(29);) :	***int/float***	 求集合的中值
>>> ``` python
median([1, 2, 3])           # 返回：2
median([1.0, 2, 3.0, 1.0])  # 返回：3.5
>>> ```

>> * [avg(array:数组集合)](javascript:toggle(30);) :	***int/float***	 求集合的平均值
>>> ``` python
avg([1, 2, 3])        # 返回：3
avg([1.0, 2, 3.0])    # 返回：3.0
>>> ```

>> * [freq(array:数组集合 [, c:字符])](javascript:toggle(31);) :  频数
>>> ``` python
freq([1, 2, 3, 1], 1) # 返回：2
freq([1, 2, 2, 2, 3]) # 返回：{1: 1, 2: 3}；即：{值：频数}
>>> ```

>> * [iif(boolean:真假, true_val:真值, false_val:假值)](javascript:toggle(32);) : 	三元表达式函数
>>> ``` python
a = iif(1 == 1, 123, 456)
# a返回：123
b = iif(1 != 1, 123, iif(True, 'A', 'B'))
# b返回：'A'
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
