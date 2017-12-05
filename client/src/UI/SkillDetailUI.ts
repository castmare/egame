class SkillDetailUI extends eui.Component {
    constructor() {
        super();
        this.skinName = "SkillDetailSkin";
    }

    public setSkillID(id){
        let skill = skillCfg.get(id+"");
        this["skill_info"]["skill_icon"].data = {skill_icon:skill["Icon"]};
        this["skill_desc"].data = {skill_desc:skill["Description"], skill_name:skill["Skill Name"], skill_rank:1};
        if(skill["Component 1"]){
            this["skill_info"]["element_1"].currentState = skill["Component 1"];
        }
        if(skill["Component 2"]){
            this["skill_info"]["element_2"].currentState = skill["Component 2"];
        }
        if(skill["Component 3"]){
            this["skill_info"]["element_3"].currentState = skill["Component 3"];
        }
    }
}