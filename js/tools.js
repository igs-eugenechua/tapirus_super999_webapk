function BrowserDetect() {
    const sys = ['Unknown', 'Android', 'iOS', 'Facebook', 'PlayStation', 'Windows', 'Linux']
    const u = navigator.userAgent.toLowerCase()
    let versions, language, osStr, osNum
    const info = { versions: versions, language: language, osStr: osStr, osNum: osNum }
    info.versions = {
      trident: u.indexOf('trident') > -1, // IE內核
      presto: u.indexOf('presto') > -1, // opera內核
      webKit: u.indexOf('applewebkit') > -1, // 蘋果、谷歌內核
      gecko: u.indexOf('gecko') > -1 && u.indexOf('khtml') === -1, // 火狐內核
      mobile: !!u.match(/applewebkit.*mobile.*/), // 是否為移動終端
      ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), // ios終端
      android: u.indexOf('android') > -1 || u.indexOf('linux') > -1, // android終端或uc瀏覽器
      iPhone: u.indexOf('iphone') > -1, // 是否為iPhone或者QQHD瀏覽器
      iPad: u.indexOf('ipad') > -1, // 是否iPad
      webApp: u.indexOf('safari') === -1, // 是否web應該程序，沒有頭部與底部
      linux: u.indexOf('x11') > -1 || u.indexOf('linux') > -1,
      windows: !!u.match(/windows|win32/),
      mac: !!u.match(/macintosh|mac os x/)
    }
    info.language = (navigator.browserLanguage || navigator.language).toLowerCase()
    info.osStr = (function() {
      if (info.versions.mac || info.versions.ios) return 'iOS'
      if (info.versions.windows) return 'Windows'
      if (info.versions.android || info.versions.mobile) return 'Android'
      if (info.versions.linux) return 'Linux'
      return 'Unknown'
    })()
    info.osNum = sys.indexOf(info.osStr)
    return info
  }
  
  const isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i) !== null;
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null;
    },
    any: function() {
      return (
        isMobile.Android() ||
        isMobile.iOS()
      );
    },
  };
  
  const thousandComma = function(number) {
    let num = number.toString()
    const pattern = /(-?\d+)(\d{3})/
    while (pattern.test(num)) {
      num = num.replace(pattern, '$1,$2')
    }
    return num
  }
  
  function moneyFormat(unFormatNumber) {
    var point = 0
    if (typeof arguments[1] === 'number') point = arguments[1]
    if (typeof unFormatNumber === 'number') {
      return unFormatNumber.toFixed(point).replace(/(\d)(?=(\d{3})+(\.\d+)?$)/g, '$1,')
    }
    if (typeof unFormatNumber === 'string') {
      return unFormatNumber.replace(/(\d)(?=(\d{3})+(\.\d+)?$)/g, '$1,')
    }
    return unFormatNumber
  }
  
  function CheckIEVersion() {
    let rv = -1 // Return value assumes failure.
  
    if (navigator.appName === 'Microsoft Internet Explorer') {
      let ua = navigator.userAgent
      let re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})')
  
      if (re.exec(ua) !== null) {
        rv = parseFloat(RegExp.$1)
      }
    } else if (navigator.appName === 'Netscape') {
      // in IE 11 the navigator.appVersion says 'trident'
      // in Edge the navigator.appVersion does not say trident
      if (navigator.appVersion.indexOf('Trident') === -1) rv = 12
      else rv = 11
    }
  
    return rv
  }
  
  // For FormatDate() to used
  function addZero(i) {
    if (i < 10) {
      i = '0' + i
    }
    return i
  }
  
  const timestampConverter = (timestamp) => {
    let date = new Date(timestamp * 1000)
    return {
      date: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    }
  }
  
  function FormatDate(inputedTimeStamp, outputType) {
    if (inputedTimeStamp < 10000000000) inputedTimeStamp *= 1000
    let outputTime = ''
    const timeObj = new Date(inputedTimeStamp)
    const year = timeObj.getFullYear()
    const month = addZero(timeObj.getMonth() + 1)
    const date = addZero(timeObj.getDate())
    const hours = addZero(timeObj.getHours())
    const minutes = addZero(timeObj.getMinutes())
    const seconds = addZero(timeObj.getSeconds())
    switch (outputType) {
      case 'ym':
        outputTime = `${year}-${month}`
        break
      case 'ymd':
        outputTime = `${year}-${month}-${date}`
        break
      case 'ymdhm':
        outputTime = `${year}/${month}/${date} (${hours}:${minutes})`
        break
      case 'hms':
        outputTime = `${hours}:${minutes}:${seconds}`
        break
      default:
        outputTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
        break
    }
    return outputTime
  }
  
  function FormatDateUTC(inputedTimeStamp, outputType, UTCHour) {
    if (inputedTimeStamp < 10000000000) inputedTimeStamp *= 1000
    let outputTime = ''
    inputedTimeStamp = inputedTimeStamp + (UTCHour * 60 * 60 * 1000)
    const timeObj = new Date(inputedTimeStamp)
    const year = timeObj.getUTCFullYear()
    const month = addZero(timeObj.getUTCMonth() + 1)
    const date = addZero(timeObj.getUTCDate())
    const hours = addZero(timeObj.getUTCHours())
    const minutes = addZero(timeObj.getUTCMinutes())
    const seconds = addZero(timeObj.getUTCSeconds())
    switch (outputType) {
      case 'ym':
        outputTime = `${year}-${month}`
        break
      case 'ymd':
        outputTime = `${year}-${month}-${date}`
        break
      case 'ymd_slash':
        outputTime = `${year}/${month}/${date}`
        break
      case 'ymd_slash_hm_colon':
        outputTime = `${year}/${month}/${date} ${hours}:${minutes}`
        break      
      case 'ymdhm':
        outputTime = `${year}/${month}/${date} (${hours}:${minutes})`
        break
      case 'mdhm':
        outputTime = `${month}/${date} (${hours}:${minutes})`
        break
      case 'hms':
        outputTime = `${hours}:${minutes}:${seconds}`
        break
      default:
        outputTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
        break
    }
    return outputTime
  }
  
  function timeRemaining(endDate) {
    let output = ''
    if (endDate < 10000000000) endDate *= 1000
    let now = new Date().getTime()
    let t = endDate - now
    let days = addZero(Math.floor(t / (1000 * 60 * 60 * 24)))
    let hours = addZero(Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    let mins = addZero(Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)))
    let secs = addZero(Math.floor((t % (1000 * 60)) / 1000))
    if (endDate < now) {
      output = null
    } else {
      output = `${hours}:${mins}:${secs}`
    }
    return output
  }
  
  // Speed up calls to hasOwnProperty
  const hasOwnProperty = Object.prototype.hasOwnProperty
  
  function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true
  
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false
    if (obj.length === 0) return true
  
    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== 'object') return true
  
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false
    }
  
    return true
  }
  
  ;(function() {
    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
      // If the exp is undefined or zero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value)
      }
      value = +value
      exp = +exp
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN
      }
      // Shift
      value = value.toString().split('e')
      value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)))
      // Shift back
      value = value.toString().split('e')
      return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp))
    }
    // Decimal round
    if (!Math.round10) {
      Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp)
      }
    }
    // Decimal floor
    if (!Math.floor10) {
      Math.floor10 = function(value, exp) {
        return decimalAdjust('floor', value, exp)
      }
    }
    // Decimal ceil
    if (!Math.ceil10) {
      Math.ceil10 = function(value, exp) {
        return decimalAdjust('ceil', value, exp)
      }
    }
  })()
  
  function formatToDecimalPlaces(num, decimalPlaces = 2) {
    let wholePart = Math.floor(num);   // 取整數部分
    let multiplier = Math.pow(10, decimalPlaces);
    let roundedDecimal = Math.round((num - wholePart) * multiplier) / multiplier;
  
    if (roundedDecimal === 0) {
        return wholePart.toString();
    } else {
        let decimalStr = roundedDecimal.toString().slice(2); // 從 '0.' 後取得小數部分
        return wholePart + '.' + decimalStr;
    }
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  export { BrowserDetect, isMobile, thousandComma, moneyFormat, CheckIEVersion, FormatDate, isEmpty, timeRemaining, FormatDateUTC, sleep, addZero, timestampConverter, formatToDecimalPlaces }
  