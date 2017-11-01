const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('koa-better-router')
const schedule = require('node-schedule')
const openexchangeAppID = process.env.OPENEXCHANGE_APP_ID

// init leancloud
const AV = require('leanengine');
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY 
});

// run schedule
const syncSchedules = require('./schedules/sync_exchange_rates')
const rule = new schedule.RecurrenceRule()

const syncCurrencies = schedule.scheduleJob('59 * * * *', () => {
  syncSchedules.syncCurrencies(openexchangeAppID)
})

const syncRates = schedule.scheduleJob('59 * * * *', () => {
  syncSchedules.syncRates(openexchangeAppID)
})

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
