const {md5, sha1} = require('../nodejs/algorithm.js');
const uuid = require('uuid');
const stringRandom = require('string-random');
const {AddUser, GetInfo} = require('../nodejs/mysql.js');
const {logger} = require("../nodejs/logger");

function getUserId(req){
    if (req.headers["x-wx-source"]){
        return req.headers["x-wx-openid"];
    }
    return null
}

function genToken(uuid, openid, salt){
    const temp = sha1(uuid) + salt + md5(openid);
    return md5(sha1(temp));
}


module.exports.login = (req, res) => {
    let userinfo = {
        openid : null,
        salt : null,
        UUID : null,
        token : null,
        name : null,
        isvip : 0,
        isadmin : 0
    }
    userinfo.openid = getUserId(req);
    const res_copy =res;
    if (userinfo.openid != null) {
        userinfo.UUID = uuid.v5(userinfo.openid, '6ba7b810-9dad-11d1-80b4-00c04fd430c8').replace(/-/g, '');
        GetInfo(userinfo.UUID).then((res,rej)=>{
           if(!rej){
               logger.info(res.toString());
               // if (res.length === 0){
               if (res === []){
                   userinfo.salt = stringRandom(16, {numbers: false})
                   userinfo.token = genToken(userinfo.UUID, userinfo.openid, userinfo.salt);
                   userinfo.name = 'Unknown';
                   AddUser(userinfo).then((res, rej) => {
                       if (rej){
                           res.statusCode = 503;
                           res_copy.send({status: 'fail', err: '数据库执行错误'})
                       }
                   });
               }else {
                    userinfo.UUID = res[0].uuid;
                    userinfo.token = res[0].token;
                    userinfo.name = res[0].name;
               }
           }
        });
        res_copy.send({token: userinfo.token, UUID : userinfo.UUID, name: userinfo.name, status: 'success'});
    }else {
        res.send({status: 'fail', err: '未检测到openID'});
    }
}