/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 抓取web上的数据
 */
'use strict'
const puppeteer = require('puppeteer-cn')　//web抓取工具类

/**
 *　模拟移动设备iphone6
 */
const devices = require('puppeteer/DeviceDescriptors')
const iphone = devices['iPhone 6 Plus']
/**
 * 模拟pc设备mac
 */
const viewPort = {
    width: 1920,
    height: 1080
}
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
let browser = null // 全局的浏览器实例
exports.neteaseUrl = 'https://manhua.163.com' //网易漫画地址
exports.tencentUrl = 'http://ac.qq.com' //腾讯漫画地址
/**
 * 初始化抓取客户端
 * @returns {Promise<void>}
 */
exports.init = async function () {
    if (!browser) {
        // 启动了一个Chrome实例
        browser = await puppeteer.launch({ headless: true })
    }
    // 浏览器中创建一个新的页面
    return await browser.newPage()
}

/**
 * 切换到pc设备
 * @param page
 * @returns {Promise<void>}
 */
exports.switchPc = async function (page) {
    await page.setViewport(viewPort);
    await page.setUserAgent(userAgent);
}
/**
 * 切换到移动设备
 * @param page
 * @returns {Promise<void>}
 */
exports.switchMobile = async function (page) {
    // 模拟iphone访问
    await page.emulate(iphone)
}

/**
 * 关闭客户端，结束抓取
 * @returns {Promise<void>}
 */
exports.close = async function () {
    await browser.close()
}