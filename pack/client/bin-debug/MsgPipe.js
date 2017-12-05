var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/*** 消息管道 ****/
var LOOP_INTERVAL = 100;
var WRITE_LOOP_INTERVAL = 200;
var CONNECT_TIMEOUT = 2000;
var MsgPipe = (function () {
    function MsgPipe() {
        this.write_queue = new Queue();
        this.read_queue = new Queue();
    }
    // 绑定对方地址和端口
    MsgPipe.prototype.bind = function (ip, port) {
        this.ip = ip;
        this.port = port;
        this.reconnect();
    };
    //取消绑定
    MsgPipe.prototype.unbind = function () {
        if (this.net != null) {
            this.net.close();
        }
    };
    // 弹出一个消息，没有消息则返回null,
    MsgPipe.prototype.pop = function () {
        var ret = this.read_queue.pop();
        if (ret === false) {
            return null;
        }
        else {
            return ret[1];
        }
    };
    //推送一个消息
    MsgPipe.prototype.push = function (msg) {
        this.write_queue.push(msg);
    };
    MsgPipe.prototype.loop = function (callback) {
        var _this = this;
        if (this.loopTimer != null) {
            this.loopTimer.stop();
        }
        else {
            this.loopTimer = new egret.Timer(LOOP_INTERVAL, 0);
        }
        this.loopTimer.addEventListener(egret.TimerEvent.TIMER, function () {
            if (!_this.read_queue.empty()) {
                var ret = _this.read_queue.pop();
                callback(ret[1]);
            }
        }, this);
        this.loopTimer.start();
    };
    MsgPipe.prototype.onConnectTimeout = function () {
        console.log("onConnectTimeout", this);
    };
    MsgPipe.prototype.onMsgRecieved = function (so) {
        var array = new egret.ByteArray();
        so.readBytes(array);
        console.log("onMsgRecieved", array.bytes);
        this.read_queue.push(array.bytes);
    };
    MsgPipe.prototype.onConnected = function (so) {
        console.log("onConnected", this);
        this.loopWrite();
    };
    MsgPipe.prototype.loopWrite = function () {
        var _this = this;
        if (this.writeTimer != null) {
            this.writeTimer.stop();
        }
        else {
            this.writeTimer = new egret.Timer(LOOP_INTERVAL, 0);
        }
        this.writeTimer = new egret.Timer(LOOP_INTERVAL, 0);
        this.writeTimer.addEventListener(egret.TimerEvent.TIMER, function () {
            if (_this.net == null || !_this.net.isConnected()) {
                _this.reconnect();
                return;
            }
            if (!_this.write_queue.empty()) {
                var ret = _this.write_queue.pop();
                console.log("loop write msg", ret[1]);
                try {
                    _this.net.send(ret[1]);
                }
                catch (exception) {
                    console.log("loop write exception", exception);
                }
            }
        }, this);
        this.writeTimer.start();
    };
    MsgPipe.prototype.reconnect = function () {
        var _this = this;
        var net;
        if (this.net != null) {
            net = this.net;
        }
        else {
            net = new Network();
            this.net = net;
        }
        var timer = new egret.Timer(CONNECT_TIMEOUT, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onConnectTimeout, this);
        timer.start();
        net.connect(this.ip, this.port, function (so) {
            _this.onConnected(so);
            timer.stop();
        }, function (so) {
            _this.onMsgRecieved(so);
        });
    };
    return MsgPipe;
}());
__reflect(MsgPipe.prototype, "MsgPipe");
//# sourceMappingURL=MsgPipe.js.map