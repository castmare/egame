/* 轮盘：控制角色移动 */
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
var RoleWheel = (function (_super) {
    __extends(RoleWheel, _super);
    function RoleWheel() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    RoleWheel.prototype.init = function () {
        var shp = new egret.Shape();
        shp.x = 100;
        shp.y = 100;
        shp.graphics.lineStyle(10, 0x00ff00);
        shp.graphics.beginFill(0xff0000, 1);
        shp.graphics.drawCircle(0, 0, 50);
        shp.graphics.endFill();
    };
    return RoleWheel;
}(egret.DisplayObjectContainer));
__reflect(RoleWheel.prototype, "RoleWheel");
//# sourceMappingURL=RoleWheel.js.map