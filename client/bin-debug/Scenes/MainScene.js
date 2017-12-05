/* 主场景 */
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
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        var _this = _super.call(this) || this;
        _this.name = "main_scene";
        _this.bgName = "main_scene_bg";
        return _this;
    }
    MainScene.prototype.init = function (view) {
        this.view = view;
        this.setup();
    };
    MainScene.prototype.createBg = function () {
        return new egret.Bitmap(RES.getRes("elf_main_bg_png"));
    };
    MainScene.prototype.destroy = function () {
    };
    MainScene.prototype.setup = function () {
        var _this = this;
        this.mainUI = new MainSceneUI();
        this.addChild(this.mainUI);
        this.mainUI.setMatchHandler(function () { _this.match(); });
        this.mainUI.setSelectHandler(function (role) {
            _this.selectRole(role);
        });
        this.mainUI.setupUI();
    };
    MainScene.prototype.match = function () {
        var _this = this;
        RPC.Call("match", { start: {} }, function (reply) {
            _this.onMatchReply(reply);
        });
        if (this.matchTimer == null) {
            this.matchTimer = new egret.Timer(3000, 1);
            this.matchTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.matchTimeout, this);
        }
        else {
            this.matchTimer.reset();
        }
        this.matchTimer.start();
    };
    MainScene.prototype.onMatchReply = function (reply) {
        console.log("onMatchReply", reply);
    };
    MainScene.prototype.matchTimeout = function (e) {
        this.matchTimer.stop();
        this.mainUI.setMatchEnable();
    };
    MainScene.prototype.selectRole = function (role) {
        DS.set(DataKey.ROLE, role);
        DS.set(DataKey.ROLE_ID, role.role_id);
    };
    return MainScene;
}(egret.Sprite));
__reflect(MainScene.prototype, "MainScene", ["IGameScene"]);
//# sourceMappingURL=MainScene.js.map