"use strict";
exports.__esModule = true;
var koa_1 = require("koa");
var koa_router_1 = require("koa-router");
var glob_1 = require("glob");
// const Koa = require('koa')
// const Router = require('koa-router')
// const glob = require('glob')
var fs = require('fs');
var resolve = require('path').resolve;
var Mock = require('mockjs');
var _a = require('./templates/search'), searchTip = _a.searchTip, searchGlobal = _a.searchGlobal;
var app = new koa_1["default"]();
var router = new koa_router_1["default"]({ prefix: '/api' });
console.log(resolve(__dirname, 'mock/api', '**/*.json'));
router.get('/v1/search/tip', function (ctx, next) {
    var qs = ctx.query.qs;
    console.log('qs', qs);
    ctx.body = {
        data: Mock.mock(searchTip(qs)),
        state: 200,
        type: 'success'
    };
});
router.get('/v1/search/global', function (ctx, next) {
    var qs = ctx.query.qs;
    console.log('qs', qs);
    ctx.body = {
        data: Mock.mock(searchGlobal(qs)),
        state: 200,
        type: 'success'
    };
});
// 注册路由
glob_1.glob(resolve(__dirname, 'mock/api', '**/*.json')).then(function (files) {
    files.forEach(function (item, i) {
        var apiJsonPath = item && item.split('/api')[1];
        var apiPath = apiJsonPath.replace('.json', '');
        console.log('------', apiPath);
        router.get(apiPath, function (ctx, next) {
            try {
                var jsonStr = fs.readFileSync(item).toString();
                ctx.body = {
                    data: JSON.parse(jsonStr),
                    state: 200,
                    type: 'success'
                };
            }
            catch (err) {
                ctx["throw"]('服务器错误', 500);
            }
        });
    });
});
app.use(router.routes()).use(router.allowedMethods());
app.listen(3001);
