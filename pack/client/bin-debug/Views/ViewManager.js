/** 主要控制界面的切换 */
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
var ViewManager = (function (_super) {
    __extends(ViewManager, _super);
    function ViewManager() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    ViewManager.prototype.init = function () {
        this.gameStartPanel = new GameStartPanel();
        this.gameEndPanel = new GameEndPanel();
        this.gamePlayingPanel = new GamePlayingPanel();
    };
    ViewManager.prototype.start = function () {
        this.addChild(this.gameStartPanel);
        this.gameStartPanel.start();
        this.gameStartPanel.addEventListener(GameStartPanel.GAME_START, this.gamePlaying, this);
    };
    ViewManager.prototype.gamePlaying = function () {
        this.gameStartPanel.end();
        this.removeChild(this.gameStartPanel);
        this.gameStartPanel.removeEventListener(GameStartPanel.GAME_START, this.gamePlaying, this);
        this.addChild(this.gamePlayingPanel);
        this.gamePlayingPanel.start();
        this.gamePlayingPanel.addEventListener(GamePlayingPanel.CHANGEPANEL, this.gameEnd, this);
    };
    ViewManager.prototype.gameEnd = function () {
        this.gamePlayingPanel.end();
        this.removeChild(this.gamePlayingPanel);
        this.gamePlayingPanel.removeEventListener(GamePlayingPanel.CHANGEPANEL, this.gameEnd, this);
        this.addChild(this.gameEndPanel);
        this.gameEndPanel.start();
        this.gameEndPanel.addEventListener(GameEndPanel.GAME_END, this.gameStart, this);
    };
    ViewManager.prototype.gameStart = function () {
        this.gameEndPanel.end();
        this.removeChild(this.gameEndPanel);
        this.gameEndPanel.removeEventListener(GameEndPanel.GAME_END, this.gameStart, this);
        this.addChild(this.gameStartPanel);
        this.gameStartPanel.start();
        this.gameStartPanel.addEventListener(GameStartPanel.GAME_START, this.gamePlaying, this);
    };
    return ViewManager;
}(egret.DisplayObjectContainer));
__reflect(ViewManager.prototype, "ViewManager");
//# sourceMappingURL=ViewManager.js.map