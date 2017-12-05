class ElfNameUI extends eui.Component {
    private skill_group:eui.Group;
    private timer:egret.Timer;
    constructor() {
        super();
        this.skinName = "ElfNameSkin";
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        
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

    private onTouchBegin(e) {
        
    }

    private onTouchEnd(e) {

    }
}