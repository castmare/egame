/* 游戏开始界面 */

class GameStartPanel extends egret.Sprite {
    public static GAME_START: string = "gameStart";
    private bg: egret.Bitmap;// 背景
    private startBtn: egret.TextField;//这里我们使用textfield当做按钮
    public constructor() {
        super();
        this.init();
    }
	
    //开启监听
    public start() {
        this.startBtn.touchEnabled = true;
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTab,this);
    }

    //初始化
    private init() {
        this.bg = new egret.Bitmap(RES.getRes('bg_jpg'));
        this.addChild(this.bg);

        this.startBtn = new egret.TextField();
        this.startBtn.text = '开始游戏';
        this.startBtn.size = 36;
        this.startBtn.textColor = 0xFBCE10;
        this.addChild(this.startBtn);
        this.startBtn.x = 1;
        this.startBtn.y = this.stage.height*0.5;
    }

    private onTouchTab(e: egret.TouchEvent) {
        this.dispatchEventWith(GameStartPanel.GAME_START);
    }
	
    //结束界面，释放监听
    public end() {
        this.startBtn.touchEnabled = false;
        if(this.startBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP))
            this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTab,this);
    }
}
