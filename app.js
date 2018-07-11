var createError = require('http-errors');
var express = require('express');// 加载express模块
var path = require('path');
var logger = require('morgan');

var app = express();// 启动Web服务器
app.locals.moment=require('moment')// 载入moment模块，格式化日期

// view engine setup
app.set('views', path.join(__dirname, './views/pages')); // 设置视图默认的文件路径
app.set('view engine', 'jade');// 设置视图引擎：jade


app.use(logger('dev'));
// app.use(express.json());//这里使用了body-parser后就不能用express中的json解析了
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, 'bower_components')));//将bower_components下的文件提供出去
// app.use(express.bodyParser());
var bodyParser = require('body-parser');//这里使用了body-parser后就不能用express中的json解析了
// 因为后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化
app.use(bodyParser.urlencoded({extended: true}));


var session = require('express-session'); //如果要使用session，需要单独包含这个模块
var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块
var MongoStroe = require('connect-mongo')(session);
app.use(cookieParser())
app.use(session({
    secret:'imooc',
    store:new MongoStroe({
       url:"mongodb://localhost:27017/imooc",
        collection:'sessions'
    }),
}))

//配置路由
 require('./routes/index')(app);
// app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(function () {
    console.log("服务器开始运行了");
})
module.exports = app;
