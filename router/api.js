const express = require('express');
const router = express.Router();
const api = require('api_Implementation.js');

router.get('/api/login', api.login);

module.exports.router = router;