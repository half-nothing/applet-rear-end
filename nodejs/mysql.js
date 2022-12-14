const mysql = require('mysql2');
const {logger, Error, Function} = require("./logger");
// const {
//     MYSQL_USERNAME: username,
//     MYSQL_PASSWORD: password,
//     MYSQL_ADDRESS: host = "127.0.0.1",
//     MYSQL_PORT: port = 3306,
//     MYSQL_NAME: dbname = 'WeiXin'
// } = process.env;
host="sh-cynosdbmysql-grp-3zvjnzmk.sql.tencentcdb.com"
username="root"
port=24391
dbname="WeiXin"
password="iavfGemi2bXIYP1RqYNj4zp7QfHTA8Be"
const database = mysql.createPool(({
    host: host,
    user: username,
    password: password,
    database: dbname,
    port: port
}))

function run_SQL_command(sql, param = []) {
    Function.info(`Call function run_SQL_command`);
    return new Promise((res, rej) => {
        database.query(sql, param, (err, result) => err ? rej(err) : res(result));
    });
}

function add_user(userinfo) {
    Function.info(`Call function add_user`);
    return new Promise((res, rej) => {
        database.query('INSERT INTO Users (uuid, token, openid, salt, name, isvip, isadmin) VALUES(?,?,?,?,?,?,?);',
            [userinfo.UUID, userinfo.token, userinfo.openid, userinfo.salt, userinfo.name, userinfo.isvip, userinfo.isadmin],
            (err, result) => err ? rej(err) : res(result))
    })
}

function get_user_info(uuid){
    Function.info(`Call function check_uuid`);
    return new Promise((res, rej) => {
        database.query('SELECT uuid,token,openid,salt,name FROM Users WHERE uuid = ?;',
            [uuid],
            (err, result) => err ? rej(err) : res(result))
    })
}

function initDB() {
    Function.info(`Call function initDB`);
    run_SQL_command("CREATE TABLE IF NOT EXISTS `Users`  " +
        "(`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增序号，可以视为短uuid使用'," +
        "`uuid` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '每位用户唯一识别uuid'," +
        "`token` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '每位用户生成的token'," +
        "`openid` char(32) NOT NULL COMMENT '用户的小程序openid'," +
        "`salt` char(16) NOT NULL COMMENT '用户的随机字符串，用来生成token'," +
        "`name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '每位用户的用户名，可重复'," +
        "`isvip` tinyint(1) NULL DEFAULT 0 COMMENT '是否是会员'," +
        "`isadmin` tinyint(1) NULL DEFAULT 0 COMMENT '是否是管理员'," +
        "PRIMARY KEY (`id`, `uuid`, `token`) USING BTREE) " +
        "ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;", [])
        .then(res => logger.info(`Creat table \'Users\' successfully.`))
        .catch(rej => Error.info(`${rej}`));
}

module.exports.SQL_command = run_SQL_command;
module.exports.AddUser = add_user;
module.exports.GetInfo = get_user_info;
module.exports.initDB = initDB;