/* 游戏开始界面 */
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
var GameStartPanel = (function (_super) {
    __extends(GameStartPanel, _super);
    function GameStartPanel() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    //开启监听
    GameStartPanel.prototype.start = function () {
        this.startBtn.touchEnabled = true;
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
    };
    //初始化
    GameStartPanel.prototype.init = function () {
        this.bg = new egret.Bitmap(RES.getRes('bg_jpg'));
        this.addChild(this.bg);
        this.startBtn = new egret.TextField();
        this.startBtn.text = '开始游戏';
        this.startBtn.size = 36;
        this.startBtn.textColor = 0xFBCE10;
        this.addChild(this.startBtn);
        this.startBtn.x = 1;
        this.startBtn.y = this.stage.height * 0.5;
    };
    GameStartPanel.prototype.onTouchTab = function (e) {
        this.dispatchEventWith(GameStartPanel.GAME_START);
    };
    //结束界面，释放监听
    GameStartPanel.prototype.end = function () {
        this.startBtn.touchEnabled = false;
        if (this.startBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP))
            this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
    };
    GameStartPanel.GAME_START = "gameStart";
    return GameStartPanel;
}(egret.Sprite));
__reflect(GameStartPanel.prototype, "GameStartPanel");
//# sourceMappingURL=GameStartPanel.js.map