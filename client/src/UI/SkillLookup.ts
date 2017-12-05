class SkillLookupUI extends eui.Component {
    private skill_group:eui.Group;
    constructor() {
        super();
        this.skinName = "SkillLookupSkin";
    }

    public setSkills(skills:Array<number>){
        let skillElemSize = this.skill_group.numElements;
        let skillSize = skills.length;
        let i = 0;
        for(; i < skillElemSize; i++ ){
            let skill = <SkillDetailUI>this.skill_group.getElementAt(i);
            if( i < skillSize ){
                skill.setSkillID(skills[i]);
            }else{
                skill.visible = false;
            }
        }
    }

}