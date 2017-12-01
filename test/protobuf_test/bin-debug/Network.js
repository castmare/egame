var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var NetworkState;
(function (NetworkState) {
    NetworkState[NetworkState["CONNECTIND"] = 1] = "CONNECTIND";
    NetworkState[NetworkState["CONNECTED"] = 2] = "CONNECTED";
    NetworkState[NetworkState["REQUESTING"] = 4] = "REQUESTING";
    NetworkState[NetworkState["RECEIVED"] = 5] = "RECEIVED";
    NetworkState[NetworkState["CLOSED"] = 6] = "CLOSED";
})(NetworkState || (NetworkState = {}));
;
var Network = (function () {
    function Network() {
        this.connectHandler = null;
        this.receiveHandler = null;
    }
    Network.prototype.Connect = function (IP, Port, onConnected, onReceived) {
        this.webSocket = new egret.WebSocket();
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this.connectHandler = onConnected,
            this.receiveHandler = onReceived,
            this.webSocket.connect(IP, Port);
    };
    Network.prototype.onSocketOpen = function () {
        console.log("连接成功");
        if (this.connectHandler !== null) {
            this.connectHandler(this.webSocket);
        }
    };
    Network.prototype.onReceiveMessage = function (e) {
        console.log("收到数据：");
        if (this.receiveHandler !== null) {
            this.receiveHandler(this.webSocket);
        }
    };
    return Network;
}());
__reflect(Network.prototype, "Network");
//# sourceMappingURL=Network.js.map