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
var ElfSelectUI = (function (_super) {
    __extends(ElfSelectUI, _super);
    function ElfSelectUI() {
        var _this = _super.call(this) || this;
        _this.skinName = "ElfSelectSkin";
        _this.setupUI();
        return _this;
    }
    ElfSelectUI.prototype.selectDefault = function () {
        this.selectElf(this.elfSnaps[0]);
    };
    ElfSelectUI.prototype.setData = function (role_list) {
        this["elf_snap_1"].data = role_list[0];
        this["elf_snap_2"].data = role_list[1];
        this["elf_snap_3"].data = role_list[2];
    };
    ElfSelectUI.prototype.setupUI = function () {
        var _this = this;
        this.elfSnaps = [this["elf_snap_1"], this["elf_snap_2"], this["elf_snap_3"]];
        this.elfSnaps.forEach(function (elem) {
            var btn = elem;
            btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onElfSnapClick, _this);
        });
    };
    ElfSelectUI.prototype.onElfSnapClick = function (event) {
        //console.log("onElfBtnClick", event, event.target);
        var elf = event.currentTarget;
        this.selectElf(elf);
    };
    ElfSelectUI.prototype.selectElf = function (elf) {
        var _this = this;
        this.elfSnaps.forEach(function (elem) {
            var e = (elem);
            if (e != elf) {
                e.currentState = "unselect";
            }
            else {
                e.currentState = "selected";
                if (_this.elfSelecetd != e) {
                    _this.elfSelecetd = e;
                    _this.dispatchEventWith(ElfSelectUI.ELF_SELECTED, true, e, false);
                }
            }
        });
    };
    ElfSelectUI.ELF_SELECTED = "elf_selected";
    return ElfSelectUI;
}(eui.Component));
__reflect(ElfSelectUI.prototype, "ElfSelectUI");
//# sourceMappingURL=ElfSelectUI.js.map