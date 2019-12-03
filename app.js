const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const Config = require('./config/config');
Config.setRootDir(__dirname);
//文件上传中间件
const koaBody = require('koa-body')


//路由列表
const index = require('./routes/index')
const users = require('./routes/users')
const user = require('./routes/user')
const reptile = require('./routes/reptile')





//upload file(文件上传)
app.use(koaBody({
    multipart:true,
    formidable:{
        maxFieldsSize:2000*1024*1024  //最大上传文件为20M
    }
}));

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(user.routes(), user.allowedMethods());
app.use(reptile.routes(), reptile.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
