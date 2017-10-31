const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('koa-better-router')
const releaseData = JSON.parse(fs.readFileSync(path.resolve('./release.json'), 'utf8'))


// init leancloud
const AV = require('leanengine');
AV.init({
  appId: releaseData.leancloud.appId,
  appKey: releaseData.leancloud.appKey,
  masterKey: releaseData.leancloud.masterKey 
});

// run schedule
const syncSchedules = require('./schedules/sync_exchange_rates')

//syncSchedules.syncCurrencies(releaseData.openexchange.appId)
//syncSchedules.syncRates(releaseData.openexchange.appId)

// run api
const app = new Koa()
const router = Router().loadMethods()

router.get('/api/rates', (ctx, next) => {
  const query = new AV.Query('Rates')
  query.descending('createdAt')
  query.limit(1)
  return query.find().then((result) => {
    ctx.body = result
  }, (err) => {
    console.log('get rates fail')
    console.log(err)
  })
})

router.get('/api/currencies', (ctx, next) => {
  const query = new AV.Query('Currencies')
  query.descending('createdAt')
  query.limit(1)
  return query.find().then((result) => {
    ctx.body = result
  }, (err) => {
    console.log('get rates fail')
    console.log(err)
  })

})


app.use(AV.koa()).use(router.middleware())

app.listen(process.env.LEANCLOUD_APP_PORT)
