import {url, wsPort} from "../config/http";

class Ws {
    constructor() {
        let wsUrl = 'ws://' + url + ':' + wsPort
        let ws = new WebSocket(wsUrl)
        ws.onopen = function () {
            console.log('connected ', url, ':', wsPort)
        }
        ws.onclose = function () {
            console.log('closed')
        }
        ws.onmessage = function (data) {
            console.log(data)
        }
        ws.onerror = function (error) {
            console.log(error)
        }

        return ws
    }
}

export default Ws