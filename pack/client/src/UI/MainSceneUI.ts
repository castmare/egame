class MainSceneUI extends eui.Component {
    private elf:string;
    private matchHandler;
    private elf_select:ElfSelectUI;
    private elf_name;
    constructor() {
        super();
        this.skinName = "MainSceneSkin";
        this.setupUI();
        //this.uiElfInfo = this["ui_elf_info_1"];
        //this.uiElfInfo.elf_avatar.source = "FireElement_jpg";
        //this.uiElfInfo.label_name.text = "火元素";
    }

    public setCreateHandler(handler:(string)=>void){
        this.matchHandler = handler;
    }

    private setupUI(){
        console.log(this.elf_select, this);
        this.elf_name["data"] = {name : "魔法第三"};
        this["elf_level"]["data"] = {level : 1};
        this.elf_select.addEventListener(ElfSelectUI.ELF_SELECTED, this.onElfSelected, this);
        let role_list = DS.get(DataKey.ROLE_SNAPS);
        this.elf_select.setData(role_list);
        this.elf_select.selectDefault();
    }

    private onElfSelected(elf){
        console.log("elf Selected", elf, elf.data);
    }

}