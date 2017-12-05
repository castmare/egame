enum NetworkState{
	CREATED = 0,
	CONNECTING = 1,
	CONNECTED = 2,
	CLOSED = 3
};

class Network {
	private webSocket:egret.WebSocket;
	private state:NetworkState;
	private connectHandler
	private receiveHandler
	public constructor() {
		this.connectHandler = null;
		this.receiveHandler = null;
		this.state = NetworkState.CREATED;
	}

	public connect(IP:string, Port:number, onConnected?, onReceived?){
		if( this.state == NetworkState.CONNECTING || this.state == NetworkState.CONNECTED){
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
	}

	public send(msg, type = egret.WebSocket.TYPE_BINARY){
		if(!this.isConnected()){
			throw("not connected");
		}
		this.webSocket.type = type;
		if( type == egret.WebSocket.TYPE_BINARY ){
			this.webSocket.writeBytes(new egret.ByteArray(msg));
		}else{
			this.webSocket.writeUTF(msg);
		}
	}
	
	public close(){
		this.state = NetworkState.CLOSED;
		if( this.webSocket != null ){
			this.webSocket.close();
		}
	}

	public isConnected():boolean {
		return this.state === NetworkState.CONNECTED;
	}

	private onSocketOpen():void {    
		console.log("连接成功");
		this.state = NetworkState.CONNECTED;
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

	private onSocketClose(e:egret.Event){
		this.state = NetworkState.CLOSED;
	}

}
