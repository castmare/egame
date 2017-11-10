/* 游戏界面 */
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
var GamePlayingPanel = (function (_super) {
    __extends(GamePlayingPanel, _super);
    function GamePlayingPanel() {
        var _this = _super.call(this) || this;
        _this.timeNumbers = 20; //计时的秒数
        _this.init();
        return _this;
    }
    //开启监听
    GamePlayingPanel.prototype.start = function () {
        this.timeNumbers = 20;
        this.timer.start();
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
    };
    //初始化
    GamePlayingPanel.prototype.init = function () {
        this.bg = new egret.Bitmap(RES.getRes('bg_jpg'));
        this.addChild(this.bg);
        this.timeTitle = new egret.TextField();
        this.timeTitle.text = "剩余时间：" + this.timeNumbers + " 秒";
        this.timeTitle.x = (480 - this.timeTitle.width) * 0.5;
        this.timeTitle.y = 400;
        this.addChild(this.timeTitle);
        this.timer = new egret.Timer(200, this.timeNumbers);
    };
    GamePlayingPanel.prototype.onTimer = function (e) {
        this.timeNumbers -= 1;
        this.timeTitle.text = "剩余时间：" + this.timeNumbers + " 秒";
    };
    GamePlayingPanel.prototype.onTimerComplete = function (e) {
        this.dispatchEventWith(GamePlayingPanel.CHANGEPANEL);
    };
    //结束界面，释放监听
    GamePlayingPanel.prototype.end = function () {
        if (this.timer.hasEventListener(egret.TimerEvent.TIMER))
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        if (this.timer.hasEventListener(egret.TimerEvent.TIMER_COMPLETE))
            this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.timer.stop();
        this.timer.reset();
    };
    GamePlayingPanel.CHANGEPANEL = "changepanel";
    return GamePlayingPanel;
}(egret.Sprite));
__reflect(GamePlayingPanel.prototype, "GamePlayingPanel");
//# sourceMappingURL=GamePlayingPanel.js.map