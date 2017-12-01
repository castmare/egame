enum NetworkState{
	CONNECTIND = 1,
	CONNECTED = 2,
	REQUESTING = 4,
	RECEIVED  = 5,
	CLOSED = 6
};

class Network {
	private webSocket:egret.WebSocket;
	private state:NetworkState;
	private connectHandler
	private receiveHandler
	public constructor() {
		this.connectHandler = null;
		this.receiveHandler = null;
	}
	public Connect(IP:string, Port:number, onConnected?, onReceived?){
		this.webSocket = new egret.WebSocket();
		this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    	this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
		this.connectHandler = onConnected,
		this.receiveHandler = onReceived,
	    this.webSocket.connect(IP, Port);
	}

	private onSocketOpen():void {    
		console.log("连接成功");
		if (this.connectHandler !== null ){
			this.connectHandler(this.webSocket);
		}
	}
	
	private onReceiveMessage(e:egret.Event){   
    	console.log("收到数据：");
		if (this.receiveHandler !== null ){
			this.receiveHandler(this.webSocket);
		}
	}

}
