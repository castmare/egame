/* 创建角色场景 */
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
var CreateRoleScene = (function (_super) {
    __extends(CreateRoleScene, _super);
    function CreateRoleScene() {
        var _this = _super.call(this) || this;
        _this.name = "create_role_scene";
        _this.bgName = "role_scene_bg";
        _this.isCreating = false;
        return _this;
    }
    CreateRoleScene.prototype.init = function (view) {
        this.view = view;
        this.createUI();
    };
    CreateRoleScene.prototype.createBg = function () {
        return new egret.Bitmap(RES.getRes('elf_role_bg_png'));
    };
    CreateRoleScene.prototype.destroy = function () {
    };
    CreateRoleScene.prototype.createUI = function () {
        var _this = this;
        var ui = new CreateRoleUI();
        ui.setCreateHandler(function (elf) { _this.handleCreateRole(elf); });
        this.addChild(ui);
    };
    CreateRoleScene.prototype.handleCreateRole = function (elf) {
        var _this = this;
        if (this.isCreating) {
            return;
        }
        var cid = 0;
        switch (elf) {
            case "elf_fire":
                cid = 1;
                break;
            case "elf_water":
                cid = 2;
                break;
            case "elf_earth":
                cid = 3;
                break;
        }
        this.isCreating = true;
        var obj = {
            create: {
                role_cid: cid
            }
        };
        RPC.Call("role", obj, function (reply) { _this.onCreateRoleReply(reply); });
    };
    CreateRoleScene.prototype.onCreateRoleReply = function (reply) {
        console.log("onCreateRoleReply", reply);
        var create = reply.role.create;
        if (create.result == 0 && create.role != null) {
            DS.set(DataKey.ROLE, create.role);
            this.view.chanageScene(new MainScene());
        }
    };
    return CreateRoleScene;
}(egret.Sprite));
__reflect(CreateRoleScene.prototype, "CreateRoleScene", ["IGameScene"]);
//# sourceMappingURL=CreateRoleScene.js.map