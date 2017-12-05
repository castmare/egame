/* 登录场景 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LoginScene = (function (_super) {
    __extends(LoginScene, _super);
    function LoginScene() {
        var _this = _super.call(this) || this;
        _this.name = "login_scene";
        _this.bgName = "role_scene_bg";
        return _this;
    }
    LoginScene.prototype.init = function (view) {
        this.view = view;
        this.login();
    };
    LoginScene.prototype.createBg = function () {
        return new egret.Bitmap(RES.getRes('elf_role_bg_png'));
    };
    LoginScene.prototype.destroy = function () {
    };
    LoginScene.prototype.login = function () {
        //RPC.Call("login", {device_id: DS.get(DataKey.DEVICE), version : "1.0.0"}, (reply) => {this.onLoginReply(reply)});
        var reply = JSON.parse("\n            {\"login\":{\"result\":3,\"user_id\":67,\"roles\":[{\"role_id\":671,\"elf_id\":1,\"name\":\"NickName\",\"level\":1},{\"role_id\":671,\"elf_id\":2,\"name\":\"NickName\",\"level\":1},{\"role_id\":671,\"elf_id\":3,\"name\":\"NickName\",\"level\":1}]}}\n        ");
        this.onLoginReply(reply);
    };
    LoginScene.prototype.onLoginReply = function (reply) {
        console.log("login scene reply", reply, this.view);
        var login_reply = reply.login;
        var result = login_reply.result;
        var userID = login_reply.user_id;
        DS.set(DataKey.USER_ID, userID);
        console.log("result", JSON.stringify(reply));
        switch (result) {
            case 1:
                {
                    this.view.chanageScene(new CreateRoleScene());
                    break;
                }
                ;
            case 2:
                {
                    if (login_reply.role != null) {
                        DS.set(DataKey.ROLE, login_reply.role);
                        this.view.chanageScene(new MainScene());
                    }
                    break;
                }
                ;
            case 3: {
                var roleList = login_reply.roles;
                if (roleList.length == 0) {
                    this.view.chanageScene(new CreateRoleScene());
                }
                else {
                    //有角色，切换到选角场景
                    DS.set(DataKey.ROLE_SNAPS, roleList);
                    this.view.chanageScene(new MainScene());
                }
                break;
            }
        }
    };
    return LoginScene;
}(egret.Sprite));
__reflect(LoginScene.prototype, "LoginScene", ["IGameScene"]);
//# sourceMappingURL=LoginScene.js.map