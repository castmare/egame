class MainSceneUI extends eui.Component {
    private elf:string;
    private matchHandler;
    private selectHandler;
    private elf_select:ElfSelectUI;
    private elf_skills:SkillLookupUI;
    private btn_match:MatchBtnUI;
    constructor() {
        super();
        this.skinName = "MainSceneSkin";
        //this.uiElfInfo = this["ui_elf_info_1"];
        //this.uiElfInfo.elf_avatar.source = "FireElement_jpg";
        //this.uiElfInfo.label_name.text = "火元素";
    }

    public setMatchHandler(handler){
        this.matchHandler = handler;
    }

    public setSelectHandler(handler){
        this.selectHandler = handler;
    }

    public setMatchEnable(){
        this.btn_match.setMatchEnable();
    }

    public setupUI(){
        console.log(this.elf_select, this);
        this.elf_select.addEventListener(ElfSelectUI.ELF_SELECTED, this.onElfSelected, this);
        let role_list = DS.get(DataKey.ROLE_SNAPS);
        this.elf_select.setData(role_list);
        this.elf_select.selectDefault();
        this.btn_match.addEventListener(MatchBtnUI.MATCHING, this.onMatching, this);
    }

    private onElfSelected(elf){
        //console.log("elf Selected", elf, elf.data);
        let role = elf.data.data.role;
        let unit = unitCfg.getByField("id", role.elf_id + "");
        this["elf_name"]["data"] = {name : role.name};
        this["elf_level"]["data"] = {level : role.level};
        this["elf_card"]["data"] = {elf_card : unit.portrait};
        this.elf_skills.setSkills(unit.skill_list);
        if(this.selectHandler != null){
            this.selectHandler(role);
        }
    }

    private onMatching(e){
        if( this.matchHandler != null ){
            this.matchHandler();
        }
    }
}