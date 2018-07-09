# ImovieDemo
该demo是学习自慕课网的Scott老师

慕课网链接[node+mongodb 建站攻略](https://www.imooc.com/learn/75 )

该项目是在webstrom环境，使用 express+pug编写的



# 编写过程中遇到的一些问题 #

1.使用debug调试的时候老是运行太慢，有时候直接运行不起来；个人认为是因为使用了pug而且又打了断点导致debug编译运行太慢。后面发现在debug开始前先将要断点取消掉后，使用debug先将项目运行起来，然后在相应位置打断点调试。如果使用vscode编写的话，debug则不会出现debug运行慢的问题