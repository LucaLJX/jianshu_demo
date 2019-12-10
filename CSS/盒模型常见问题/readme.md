# 盒模型常见问题 part 1

### margin-top 影响父元素样式

 - 原因

 > In this specification, the expression collapsing margins means that adjoining margins (no non-empty content, padding or border areas or clearance separate them) of two or more boxes (which may be next to one another or nested) combine to form a single margin. 所有毗邻的两个或更多盒元素的margin将会合并为一个margin共享之。毗邻的定义为：同级或者嵌套的盒元素，并且它们之间没有非空内容、Padding或Border分隔。

 - 解决办法
    - 父级或子元素使用浮动或者绝对定位absolute（浮动或绝对定位不参与）margin的折叠
    - 父级overflow:hidden;
    - 父级设置padding（破坏非空白的折叠条件）
    - 父级设置border
 - 参考
    - [子元素margin-top为何会影响父元素？--CSDN](https://blog.csdn.net/sinat_27088253/article/details/52954688)
    - [w3c - css2.1 盒模型规范](https://www.w3.org/TR/CSS21/box.html#collapsing-margins)