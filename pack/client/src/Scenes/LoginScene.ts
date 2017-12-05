/* 登录场景 */

class LoginScene extends egret.Sprite implements IGameScene {
    public readonly name;
    public readonly bgName;
    private view:IGameView;
    public constructor() {
        super();
        this.name = "login_scene";
        this.bgName = "role_scene_bg";
    }

    public init(view:IGameView):void {
        this.view = view;
        this.login()
    }

    public createBg(): egret.DisplayObject{
        return new egret.Bitmap(RES.getRes('elf_role_bg_png'));
    }

    public destroy(): void{

    }
 
    private login() {
        //RPC.Call("login", {device_id: DS.get(DataKey.DEVICE), version : "1.0.0"}, (reply) => {this.onLoginReply(reply)});
        let reply = JSON.parse(`
            {"login":{"result":3,"user_id":67,"roles":[{"role_id":671,"elf_id":1,"name":"NickName","level":1},{"role_id":671,"elf_id":2,"name":"NickName","level":1},{"role_id":671,"elf_id":3,"name":"NickName","level":1}]}}
        `);
        this.onLoginReply(reply);
    }

    private onLoginReply(reply) {
        console.log("login scene reply", reply, this.view);
        let login_reply = reply.login;
        let result = login_reply.result;
        let userID = login_reply.user_id;
        DS.set(DataKey.USER_ID, userID);
        console.log("result", JSON.stringify(reply));
        switch(result) {
            case 1: { //新账号
                this.view.chanageScene(new CreateRoleScene()); 
                break;
            };
            case 2: { //默认角色
                if (login_reply.role != null){
                    DS.set(DataKey.ROLE, login_reply.role);
                    this.view.chanageScene(new MainScene()); 
                }
                break;
            };
            case 3: { // 返回角色列表
                let roleList = login_reply.roles;
                if(roleList.length == 0){ //没有角色，创建角色
                    this.view.chanageScene(new CreateRoleScene());
                }else{
                    //有角色，切换到选角场景
                    DS.set(DataKey.ROLE_SNAPS, roleList);
                    this.view.chanageScene(new MainScene());
                }
                break; 
            }
        } 
            
        
    }
}
