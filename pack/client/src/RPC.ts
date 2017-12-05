class RPC {
	private webSocket:egret.WebSocket;
    private static up:protobuf.IParserResult;
    private static down:protobuf.IParserResult;
    private static upMsgClass:protobuf.Type;
    private static downMsgClass:protobuf.Type;
    private static curSequence:number;
	public constructor() {
	}
    public static Init(){
        let commonFile = RES.getRes("common_proto");
        let protoFile = RES.getRes("up_proto");
        this.up = protobuf.parse(protoFile + commonFile, {keepCase:true});
        protoFile = RES.getRes("down_proto");
        this.down = protobuf.parse(protoFile + commonFile, {keepCase:true});
        this.upMsgClass = this.up.root.lookupType("up_msg");
        this.downMsgClass = this.down.root.lookupType("down_msg");
        console.log("up and down message", this.up, this.down);
        this.curSequence = 1;
    }

	public static Call(upField:string, data:any, replyCallBack){
        let protoData = this.CreateUpProroData(upField, data);
        RPC.Request(protoData, replyCallBack);
	}

    public static CreateUpProroData(upField:string, data:any){
        let upMsg = this.CreateUpMsg(upField, data);
        let encodeData = this.upMsgClass.encode(upMsg).finish();
        let protoData = this.WrapProtoData(encodeData);
        return protoData;
	}

    public static CreateUpMsg(Field, data) {
        let upObj = {
            sequence : this.NextSequence(),
            repeat : false,
            user_id : DS.get(DataKey.USER_ID),
            role_id : DS.get(DataKey.ROLE_ID)
        }
        upObj[Field] = data;
        return this.upMsgClass.create(upObj)
    }

    public static NextSequence() : number{
        return this.curSequence++;
    }

    public static WrapProtoData(data:Uint8Array) : Uint8Array{
        // <<IsLogin:8, Len:16/little, Left/binary>> = Data,
        // <<DeviceIDBinary:Len/binary, Body/binary>> = Left,
        // {SvrID, DeviceID} = get_svrid_and_deviceid(DeviceIDBinary),
        // {DeviceID, IsLogin, Body, SvrID}.
        let deviceID:string = DS.get(DataKey.DEVICE_ID);
        let deviceIDLen = deviceID.length;
        let headSize:number = 3 + deviceIDLen;
        let totalSize:number = headSize + data.length;
        let buffer:ArrayBuffer = new ArrayBuffer(totalSize);
        let view:DataView = new DataView(buffer);
        let isLogin = 1;
        let idx = 0;
        view.setUint8(idx++, isLogin);
        view.setUint16(idx++, deviceIDLen, true);
        let wrapData:Uint8Array = new Uint8Array(buffer);
        protobuf.util.utf8.write(deviceID, wrapData, 3);
        wrapData.set(data, headSize);
        return wrapData;
    }

    private static async Request(data:Uint8Array, replyCallBack){
        let net = new Network();
        //console.log("reqData", reqData);
        let promise = function(time){
            return new Promise<any>(function(resolve, reject) {
                var timer:egret.Timer = new egret.Timer(time, 1);
                timer.addEventListener(
                    egret.TimerEvent.TIMER_COMPLETE, 
                    () => {
                        reject("timeout")
                    }, 
                    this);
                timer.start();
                net.connect("192.168.5.7", 13001,
                    (so:egret.WebSocket) => {
                        so.type = egret.WebSocket.TYPE_BINARY;
                        so.writeBytes(new egret.ByteArray(data));
                    }, 
                    (so:egret.WebSocket) => { 
                        let array = new egret.ByteArray();
                        so.readBytes(array);
                        timer.stop();
                        resolve(array.bytes);
                    }
                );
            })
        };
        try{
            let result:Uint8Array = await promise(10000);
            //console.log("result", result);
            let ReplyMsg = RPC.downMsgClass.decode(result);
            //console.log("RPC:Call ReplyMsg", ReplyMsg);
            replyCallBack(ReplyMsg);
        }catch(error){
            console.log("catch error", error);
        }
       
    }

}

let rpc:RPC;
