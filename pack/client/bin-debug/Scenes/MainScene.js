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
        this.mainUI = new MainSceneUI();
        this.addChild(this.mainUI);
    };
    return MainScene;
}(egret.Sprite));
__reflect(MainScene.prototype, "MainScene", ["IGameScene"]);
//# sourceMappingURL=MainScene.js.map