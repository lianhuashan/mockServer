import Koa from 'koa'
import Router from 'koa-router'
import { glob } from 'glob'
// const Koa = require('koa')
// const Router = require('koa-router')
// const glob = require('glob')
const fs = require('fs')
const { resolve } = require('path')
const Mock = require('mockjs')
const { searchTip, searchGlobal } = require('./templates/search')
const app = new Koa()

const router = new Router({ prefix: '/api' })
console.log(resolve(__dirname, 'mock/api', '**/*.json'))

router.get('/v1/search/tip', (ctx, next) => {
  const { qs } = ctx.query
  console.log('qs', qs)
  ctx.body = {
    data: Mock.mock(searchTip(qs)),
    state: 200,
    type: 'success',
  }
})

router.get('/v1/search/global', (ctx, next) => {
  const { qs } = ctx.query
  console.log('qs', qs)
  ctx.body = {
    data: Mock.mock(searchGlobal(qs)),
    state: 200,
    type: 'success',
  }
})
// 注册路由
glob(resolve(__dirname, 'mock/api', '**/*.json')).then((files) => {
  files.forEach((item, i) => {
    let apiJsonPath = item && item.split('/api')[1]
    let apiPath = apiJsonPath.replace('.json', '')
    console.log('------', apiPath)

    router.get(apiPath, (ctx, next) => {
      try {
        let jsonStr = fs.readFileSync(item).toString()
        ctx.body = {
          data: JSON.parse(jsonStr),
          state: 200,
          type: 'success', // 自定义响应体
        }
      } catch (err) {
        ctx.throw('服务器错误', 500)
      }
    })
  })
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3001)
