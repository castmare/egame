/* 创建角色场景 */

class CreateRoleScene extends egret.Sprite implements IGameScene {
    public readonly name;
    public readonly bgName;
    private view:IGameView;
    private isCreating:boolean;
    public constructor() {
        super();
        this.name = "create_role_scene";
        this.bgName = "role_scene_bg";
        this.isCreating = false;
    }

    public init(view:IGameView):void {
        this.view = view;
        this.createUI();
    }

    public createBg(): egret.DisplayObject{
        return new egret.Bitmap(RES.getRes('elf_role_bg_png'));
    }

    public destroy(): void{

    }
 
    private createUI() {
        let ui = new CreateRoleUI();
        ui.setCreateHandler((elf:string) => {this.handleCreateRole(elf);});
        this.addChild(ui);
        
    }

    private handleCreateRole(elf:string){
        if(this.isCreating){
            return;
        }
        let cid = 0;
        switch (elf) {
            case "elf_fire" : cid = 1; break;
            case "elf_water" : cid = 2; break;
            case "elf_earth" : cid = 3; break;
        }
        this.isCreating = true;
        let obj = {
            create : {
                role_cid : cid
            }
        };
        RPC.Call("role", obj, (reply) => {this.onCreateRoleReply(reply)});
    }

    private onCreateRoleReply(reply){
        console.log("onCreateRoleReply", reply);
        let create = reply.role.create;
        if( create.result == 0 && create.role != null){ //成功
            DS.set(DataKey.ROLE, create.role);
            this.view.chanageScene(new MainScene());
        } 
    }
}
