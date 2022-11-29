// 核心服务器导入
const express = require("express");
const app = express();
// 导入cookie解析和session处理
const cookieParser = require('cookie-parser');
const session = require('express-session');
// 处理跨域访问问题
const cors = require("cors");
app.use(cors());
// 导入随机字符串函数
const stringRandom = require('string-random');
// 生成随机字符串，用来加密cookie
const cookieKey = stringRandom(64, {numbers: false});
// 导入日志记录器
const {logger} = require('./nodejs/logger.js');
// 导入自定义路由并挂载
const {router} = require('./router/api');
app.use('/', router);
// 定义POST表单解析和json数据解析
app.use(express.urlencoded({extended: false}));
app.use(express.json());
// 指定cookie加密字符串和session时长设置
app.use(cookieParser(cookieKey));
app.use(session({
    secret: cookieKey,
    resave: false,
    saveUninitialized: true,
    name: "UUID",
    cookie: {
        maxAge: 1200000
    },
    rolling: true,
}));
// 定义访问记录中间件
app.use((req, res, next) => {
    logger.info(`Client call ${req.path} from ${req.ip}`);
    next();
});



