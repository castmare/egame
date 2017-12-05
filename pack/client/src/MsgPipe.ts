/*** 消息管道 ****/
const LOOP_INTERVAL = 100;
const WRITE_LOOP_INTERVAL = 200;
const CONNECT_TIMEOUT = 2000;
class MsgPipe {
	private net:Network;
    private ip:string;
    private port:number;
    private write_queue:Queue;
    private read_queue:Queue;
    private loopTimer:egret.Timer;
    private writeTimer:egret.Timer;
	public constructor() {
        this.write_queue = new Queue();
        this.read_queue = new Queue();
	}
    // 绑定对方地址和端口
    public bind(ip:string, port:number) {
        this.ip = ip;
        this.port = port;
        this.reconnect();
    }

    //取消绑定
    public unbind(){
        if(this.net != null){
            this.net.close();
        }
    }

    // 弹出一个消息，没有消息则返回null,
    public pop(){
        let ret = this.read_queue.pop();
        if(ret === false){
            return null;
        }else{
            return ret[1];
        }
    }

    //推送一个消息
    public push(msg:any){
        this.write_queue.push(msg);
    }

    public loop(callback) {
        if(this.loopTimer != null){
            this.loopTimer.stop();
        }else{
            this.loopTimer = new egret.Timer(LOOP_INTERVAL, 0);
        }
        this.loopTimer.addEventListener(egret.TimerEvent.TIMER, ()=>{
            if (!this.read_queue.empty()){
                let ret = this.read_queue.pop();
                callback(ret[1]);
            }
        }, this);
        this.loopTimer.start();
    }

    private onConnectTimeout(){
        console.log("onConnectTimeout", this);
    }

    private onMsgRecieved(so:egret.WebSocket){
        let array = new egret.ByteArray();
        so.readBytes(array);
        console.log("onMsgRecieved", array.bytes);
        this.read_queue.push(array.bytes);
    }

    private onConnected(so:egret.WebSocket){
        console.log("onConnected", this);
        this.loopWrite();
    }

    public loopWrite(){
        if(this.writeTimer != null){
            this.writeTimer.stop();
        }else{
            this.writeTimer = new egret.Timer(LOOP_INTERVAL, 0);
        }
        this.writeTimer = new egret.Timer(LOOP_INTERVAL, 0);
        this.writeTimer.addEventListener(egret.TimerEvent.TIMER, ()=>{
            if (this.net == null || !this.net.isConnected()){
                this.reconnect();
                return;
            }
            if (!this.write_queue.empty()){
                let ret = this.write_queue.pop();
                console.log("loop write msg", ret[1]);
                try{
                    this.net.send(ret[1]);
                }catch(exception){
                    console.log("loop write exception", exception);
                }
            }
        }, this);
        this.writeTimer.start();
    }

    private reconnect() {
        let net:Network;
        if(this.net != null){
            net = this.net;
        }else{
            net = new Network();
            this.net = net;
        }
        var timer:egret.Timer = new egret.Timer(CONNECT_TIMEOUT, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onConnectTimeout, this);
        timer.start();
        net.connect(this.ip, this.port,
            (so:egret.WebSocket) => {
                this.onConnected(so);
                timer.stop();
            }, 
            (so:egret.WebSocket) => { 
                this.onMsgRecieved(so);
            }
        );   
    }

}

