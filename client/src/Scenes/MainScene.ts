/* 主场景 */

class MainScene extends egret.Sprite implements IGameScene {
    public readonly name;
    public readonly bgName;
    private view:IGameView;
    private mainUI:MainSceneUI;
    private matchTimer:egret.Timer;
    public constructor() {
        super();
        this.name = "main_scene";
        this.bgName = "main_scene_bg";
    }

    public init(view:IGameView):void {
        this.view = view;
        this.setup();
    }

    public createBg(): egret.DisplayObject {
        return new egret.Bitmap(RES.getRes("elf_main_bg_png"));
    }

    public destroy(): void{

    }
 
    private setup() {
       this.mainUI = new MainSceneUI();
       this.addChild(this.mainUI);
       this.mainUI.setMatchHandler( ()=>{this.match()} );
       this.mainUI.setSelectHandler( (role) =>{
            this.selectRole(role);
       });
       this.mainUI.setupUI();
    }

    private match(){
        RPC.Call("match", {start: {}}, 
            (reply) => {
            this.onMatchReply(reply)}
        );
        if( this.matchTimer == null ){
            this.matchTimer = new egret.Timer(3000, 1);
            this.matchTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.matchTimeout, this);
        }else{
            this.matchTimer.reset();
        }
        this.matchTimer.start();
    }

    private onMatchReply(reply){
        console.log("onMatchReply", reply);
    }

    private matchTimeout(e){
        this.matchTimer.stop();
        this.mainUI.setMatchEnable();
    }

    private selectRole(role){
        DS.set(DataKey.ROLE, role);
        DS.set(DataKey.ROLE_ID, role.role_id);
    }
}
