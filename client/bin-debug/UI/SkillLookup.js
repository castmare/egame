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
var SkillLookupUI = (function (_super) {
    __extends(SkillLookupUI, _super);
    function SkillLookupUI() {
        var _this = _super.call(this) || this;
        _this.skinName = "SkillLookupSkin";
        return _this;
    }
    SkillLookupUI.prototype.setSkills = function (skills) {
        var skillElemSize = this.skill_group.numElements;
        var skillSize = skills.length;
        var i = 0;
        for (; i < skillElemSize; i++) {
            var skill = this.skill_group.getElementAt(i);
            if (i < skillSize) {
                skill.setSkillID(skills[i]);
            }
            else {
                skill.visible = false;
            }
        }
    };
    return SkillLookupUI;
}(eui.Component));
__reflect(SkillLookupUI.prototype, "SkillLookupUI");
//# sourceMappingURL=SkillLookup.js.map