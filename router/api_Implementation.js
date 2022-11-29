const {md5, sha1} = require('../nodejs/algorithm.js');
const uuid = require('uuid');
const stringRandom = require('string-random');
const {AddUser} = require('../nodejs/mysql.js');
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
    if (userinfo.openid != null) {
        userinfo.salt = stringRandom(16, {numbers: false})
        userinfo.UUID = uuid.v5(userinfo.openid, '6ba7b810-9dad-11d1-80b4-00c04fd430c8').replace(/-/g, '');
        userinfo.token = genToken(userinfo.UUID, userinfo.openid, userinfo.salt);
        userinfo.name = 'Unknown';
        AddUser(userinfo).then((res, rej) => {
            if (!rej){
                logger.info(res);
            }
        });
    }
}