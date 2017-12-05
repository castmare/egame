/** 游戏视图控制器，负责游戏场景切换 */

//游戏场景的背景

//游戏场景
interface IGameView extends egret.DisplayObjectContainer {
    chanageScene(scene:IGameScene, data?:any);
    start():void;
}

interface IGameScene extends egret.Sprite{
    readonly name: string;
    readonly bgName: string;
    init(IGameView, data?:any): void;
    createBg(): egret.DisplayObject;
    destroy(): void;
}

class GameView extends egret.DisplayObjectContainer implements IGameView{
    public constructor() {
        super();
    }
    private curScene: IGameScene;
    private curSceneBg: egret.DisplayObject;
    public start() {
        this.chanageScene(new LoginScene());
    }
    public chanageScene(scene:IGameScene, data?:any) {
        if (scene == null) {
            throw("scene is null");
        }
        if(this.curScene == scene){
            return;
        }
        if( this.curScene == null || this.curScene.bgName != scene.bgName){
            let newBg = scene.createBg();
            this.addChild(newBg);
            if(this.curSceneBg != null){
                this.removeChild(this.curSceneBg);
            }
            this.curSceneBg = newBg;
        }
        this.addChild(scene);
        if (this.curScene != null){
            this.removeChild(this.curScene);
            this.addRemovedScene(this.curScene);
        }
        this.curScene = scene;
        this.curScene.init(this, data);
    }

    private addRemovedScene(scene:IGameScene){

    }

    private addRemovedSceneBg(bg:egret.DisplayObject){
        
    }
}
