var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var RPC = (function () {
    function RPC() {
    }
    RPC.Init = function () {
        var commonFile = RES.getRes("common_proto");
        var protoFile = RES.getRes("up_proto");
        this.up = protobuf.parse(protoFile + commonFile, { keepCase: true });
        protoFile = RES.getRes("down_proto");
        this.down = protobuf.parse(protoFile + commonFile, { keepCase: true });
        this.upMsgClass = this.up.root.lookupType("up_msg");
        this.downMsgClass = this.down.root.lookupType("down_msg");
        console.log("up and down message", this.up, this.down);
        this.curSequence = 1;
    };
    RPC.Call = function (upField, data, replyCallBack) {
        var protoData = this.CreateUpProroData(upField, data);
        RPC.Request(protoData, replyCallBack);
    };
    RPC.CreateUpProroData = function (upField, data) {
        var upMsg = this.CreateUpMsg(upField, data);
        var encodeData = this.upMsgClass.encode(upMsg).finish();
        var protoData = this.WrapProtoData(encodeData);
        return protoData;
    };
    RPC.CreateUpMsg = function (Field, data) {
        var upObj = {
            sequence: this.NextSequence(),
            repeat: false,
            user_id: DS.get(DataKey.USER_ID),
            role_id: DS.get(DataKey.ROLE_ID)
        };
        upObj[Field] = data;
        return this.upMsgClass.create(upObj);
    };
    RPC.NextSequence = function () {
        return this.curSequence++;
    };
    RPC.WrapProtoData = function (data) {
        // <<IsLogin:8, Len:16/little, Left/binary>> = Data,
        // <<DeviceIDBinary:Len/binary, Body/binary>> = Left,
        // {SvrID, DeviceID} = get_svrid_and_deviceid(DeviceIDBinary),
        // {DeviceID, IsLogin, Body, SvrID}.
        var deviceID = DS.get(DataKey.DEVICE_ID);
        var deviceIDLen = deviceID.length;
        var headSize = 3 + deviceIDLen;
        var totalSize = headSize + data.length;
        var buffer = new ArrayBuffer(totalSize);
        var view = new DataView(buffer);
        var isLogin = DS.get(DataKey.ROLE_ID) ? 0 : 1;
        var idx = 0;
        view.setUint8(idx++, isLogin);
        view.setUint16(idx++, deviceIDLen, true);
        var wrapData = new Uint8Array(buffer);
        protobuf.util.utf8.write(deviceID, wrapData, 3);
        wrapData.set(data, headSize);
        return wrapData;
    };
    RPC.Request = function (data, replyCallBack) {
        return __awaiter(this, void 0, void 0, function () {
            var net, promise, result, ReplyMsg, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        net = new Network();
                        promise = function (time) {
                            return new Promise(function (resolve, reject) {
                                var timer = new egret.Timer(time, 1);
                                timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                                    reject("timeout");
                                }, this);
                                timer.start();
                                net.connect("192.168.5.7", 13001, function (so) {
                                    so.type = egret.WebSocket.TYPE_BINARY;
                                    so.writeBytes(new egret.ByteArray(data));
                                }, function (so) {
                                    var array = new egret.ByteArray();
                                    so.readBytes(array);
                                    timer.stop();
                                    resolve(array.bytes);
                                });
                            });
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, promise(10000)];
                    case 2:
                        result = _a.sent();
                        ReplyMsg = RPC.downMsgClass.decode(result);
                        //console.log("RPC:Call ReplyMsg", ReplyMsg);
                        replyCallBack(ReplyMsg);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log("catch error", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return RPC;
}());
__reflect(RPC.prototype, "RPC");
var rpc;
//# sourceMappingURL=RPC.js.map