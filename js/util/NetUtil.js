import queryString from 'query-string'

/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description :网络请求的工具类
 */
export default class NetUtils {
    static onResult(json, callbackSuccess, callbackError) {
        if (json.success) {
            console.log('server--------->', json.msg)
            callbackSuccess(json.msg)
        } else {
            callbackError('server---------> 服务器出错:收到数据为' + JSON.stringify(json))
        }
    }

    /**
     * 普通的get请求
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callbackSuccess  成功后的回调
     * @param {*} callbackError  失败后的回调
     */
    static get(url, params, callbackSuccess, callbackError) {
        if (params) {
            let paramsArray = []
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        console.log('server--------->' + url);
        fetch(url, {
            method: 'GET',
        })
            .then((response) => {
                if (response.ok) {//如果相应码为200
                    return response.json() //将字符串转换为json对象
                } else {
                    callbackError(response.status)
                }
            })
            .then((json) => {
                this.onResult(json, callbackSuccess, callbackError)
            }).catch(error => {
            console.log(url + ':' + error)
            callbackError(error)
        })
    }

    /**
     * post key-value 形式 hader为'Content-Type': 'application/x-www-form-urlencoded'
     * @param {*} url
     * @param {*} params
     * @param {*} callbackSuccess  成功后的回调
     * @param {*} callbackError  失败后的回调
     */
    static post(url, params, callbackSuccess, callbackError) {
        console.log('server--------->' + url)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'//key-value形式
            },
            body: queryString.stringify(params)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    return response.status
                }
            })
            .then((json) => {
                this.onResult(json, callbackSuccess, callbackError)
            }).catch(error => {
            console.log(url + ':' + error)
            callbackError(error)
        })
    }

    /**
     * post json形式  header为'Content-Type': 'application/json'
     * @param {*} url
     * @param {*} jsonObj
     * @param {*} callbackSuccess  成功后的回调
     * @param {*} callbackError  失败后的回调
     */
    static postJson(url, jsonObj, callbackSuccess, callbackError) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(jsonObj),//json对象转换为string
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.status
                }
            })
            .then((json) => {
                this.onResult(json, callbackSuccess, callbackError)
            }).catch(error => {
            console.log(url + ':' + error);
            callbackError(error);
        })
    }
}
