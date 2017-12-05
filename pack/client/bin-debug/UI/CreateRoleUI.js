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
var CreateRoleUI = (function (_super) {
    __extends(CreateRoleUI, _super);
    function CreateRoleUI() {
        var _this = _super.call(this) || this;
        _this.skinName = "CreateRoleSkin";
        _this.elfBtns = [_this["btn_fire"], _this["btn_water"], _this["btn_earth"]];
        _this.elfBtns.forEach(function (elem) {
            var btn = elem;
            btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onElfBtnClick, _this);
        });
        _this["btn_create"].addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onCreateBtnClick, _this);
        _this.clickElfBtn(_this.elfBtns[0]);
        return _this;
    }
    CreateRoleUI.prototype.setCreateHandler = function (handler) {
        this.createHandler = handler;
    };
    CreateRoleUI.prototype.onElfBtnClick = function (event) {
        //console.log("onElfBtnClick", event, event.target);
        var btn = event.target;
        this.clickElfBtn(btn);
    };
    CreateRoleUI.prototype.clickElfBtn = function (clicked) {
        this.showElfDetail(clicked.name);
        this.elfBtns.forEach(function (elem) {
            var btn = (elem);
            if (clicked != btn) {
                btn.currentState = "up";
            }
            else {
                btn.currentState = "down";
            }
        });
    };
    CreateRoleUI.prototype.showElfDetail = function (elf) {
        //console.log("showElfDetail", elf);
        this.elf = elf;
    };
    CreateRoleUI.prototype.onCreateBtnClick = function () {
        if (this.createHandler != null) {
            this.createHandler(this.elf);
        }
    };
    return CreateRoleUI;
}(eui.Component));
__reflect(CreateRoleUI.prototype, "CreateRoleUI");
//# sourceMappingURL=CreateRoleUI.js.map