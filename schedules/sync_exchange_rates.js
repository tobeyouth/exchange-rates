/**
 * sync exchange data from openexchangerates.org
**/
const fs = require('fs')
const path = require('path')
const request = require('request')
const AV = require('leanengine');
const baseAPI = 'https://openexchangerates.org/api/'
const baseCurrency = 'USD'

function syncRates(appid) {
  request.get(`${baseAPI}latest.json?app_id=${appid}`, (err, res, body) => {
    if (err) {
      console.log(err)
    }
    const _body = JSON.parse(body)
    const R = AV.Object.extend('Rates')
    const rate = new R()
    
    rate.set('timestamp', _body.timestamp)
    rate.set('base', _body.base)
    rate.set('rates', _body.rates)
    rate.save().then(() => {
      console.log('sync rates success') 
    }, (e) => {
      console.log('sync rates fail')
      console.log(e)
    })
   })
}

function syncCurrencies(appid) {
  request.get(`${baseAPI}currencies.json?app_id=${appid}`, (err, res, body) => {
    if (err) {
      console.log(err)
    }
    const C = AV.Object.extend('Currencies')
    const currency = new C()
    currency.set('dict', JSON.parse(body))
    currency.set('timestamp', timestamp())
    currency.save().then(() => {
      console.log('sync currencies success')
    }, (e) => {
      console.log('sync currencies fail')
      console.log(e)
    }) 
  })
}


function timestamp() {
  return parseInt(new Date().getTime(), 10)
}

module.exports = {
  syncRates: syncRates,
  syncCurrencies: syncCurrencies
}
