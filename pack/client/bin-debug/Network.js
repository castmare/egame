var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var NetworkState;
(function (NetworkState) {
    NetworkState[NetworkState["CREATED"] = 0] = "CREATED";
    NetworkState[NetworkState["CONNECTING"] = 1] = "CONNECTING";
    NetworkState[NetworkState["CONNECTED"] = 2] = "CONNECTED";
    NetworkState[NetworkState["CLOSED"] = 3] = "CLOSED";
})(NetworkState || (NetworkState = {}));
;
var Network = (function () {
    function Network() {
        this.connectHandler = null;
        this.receiveHandler = null;
        this.state = NetworkState.CREATED;
    }
    Network.prototype.connect = function (IP, Port, onConnected, onReceived) {
        if (this.state == NetworkState.CONNECTING || this.state == NetworkState.CONNECTED) {
            return;
        }
        this.webSocket = new egret.WebSocket();
        this.state = NetworkState.CONNECTING;
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this.connectHandler = onConnected,
            this.receiveHandler = onReceived,
            this.webSocket.connect(IP, Port);
    };
    Network.prototype.send = function (msg, type) {
        if (type === void 0) { type = egret.WebSocket.TYPE_BINARY; }
        if (!this.isConnected()) {
            throw ("not connected");
        }
        this.webSocket.type = type;
        if (type == egret.WebSocket.TYPE_BINARY) {
            this.webSocket.writeBytes(new egret.ByteArray(msg));
        }
        else {
            this.webSocket.writeUTF(msg);
        }
    };
    Network.prototype.close = function () {
        this.state = NetworkState.CLOSED;
        if (this.webSocket != null) {
            this.webSocket.close();
        }
    };
    Network.prototype.isConnected = function () {
        return this.state === NetworkState.CONNECTED;
    };
    Network.prototype.onSocketOpen = function () {
        console.log("连接成功");
        this.state = NetworkState.CONNECTED;
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
    Network.prototype.onSocketClose = function (e) {
        this.state = NetworkState.CLOSED;
    };
    return Network;
}());
__reflect(Network.prototype, "Network");
//# sourceMappingURL=Network.js.map