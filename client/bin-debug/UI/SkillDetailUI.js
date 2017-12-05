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
var SkillDetailUI = (function (_super) {
    __extends(SkillDetailUI, _super);
    function SkillDetailUI() {
        var _this = _super.call(this) || this;
        _this.skinName = "SkillDetailSkin";
        return _this;
    }
    SkillDetailUI.prototype.setSkillID = function (id) {
        var skill = skillCfg.get(id + "");
        this["skill_info"]["skill_icon"].data = { skill_icon: skill["Icon"] };
        this["skill_desc"].data = { skill_desc: skill["Description"], skill_name: skill["Skill Name"], skill_rank: 1 };
        if (skill["Component 1"]) {
            this["skill_info"]["element_1"].currentState = skill["Component 1"];
        }
        if (skill["Component 2"]) {
            this["skill_info"]["element_2"].currentState = skill["Component 2"];
        }
        if (skill["Component 3"]) {
            this["skill_info"]["element_3"].currentState = skill["Component 3"];
        }
    };
    return SkillDetailUI;
}(eui.Component));
__reflect(SkillDetailUI.prototype, "SkillDetailUI");
//# sourceMappingURL=SkillDetailUI.js.map