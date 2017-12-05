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
var MainSceneUI = (function (_super) {
    __extends(MainSceneUI, _super);
    function MainSceneUI() {
        var _this = _super.call(this) || this;
        _this.skinName = "MainSceneSkin";
        _this.setupUI();
        return _this;
        //this.uiElfInfo = this["ui_elf_info_1"];
        //this.uiElfInfo.elf_avatar.source = "FireElement_jpg";
        //this.uiElfInfo.label_name.text = "火元素";
    }
    MainSceneUI.prototype.setCreateHandler = function (handler) {
        this.matchHandler = handler;
    };
    MainSceneUI.prototype.setupUI = function () {
        console.log(this.elf_select, this);
        this.elf_name["data"] = { name: "魔法第三" };
        this["elf_level"]["data"] = { level: 1 };
        this.elf_select.addEventListener(ElfSelectUI.ELF_SELECTED, this.onElfSelected, this);
        var role_list = DS.get(DataKey.ROLE_SNAPS);
        this.elf_select.setData(role_list);
        this.elf_select.selectDefault();
    };
    MainSceneUI.prototype.onElfSelected = function (elf) {
        console.log("elf Selected", elf, elf.data);
    };
    return MainSceneUI;
}(eui.Component));
__reflect(MainSceneUI.prototype, "MainSceneUI");
//# sourceMappingURL=MainSceneUI.js.map