/* 主场景 */

class MainScene extends egret.Sprite implements IGameScene {
    public readonly name;
    public readonly bgName;
    private view:IGameView;
    private mainUI;
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
    }

}
