class ElfSelectUI extends eui.Component {
    static ELF_SELECTED:string = "elf_selected";
    private elfSnaps:Array<eui.Component>;
    private elfSelecetd:eui.Component;
    constructor() {
        super();
        this.skinName = "ElfSelectSkin";
        this.setupUI();
    }

    public selectDefault(){
        this.selectElf(this.elfSnaps[0]);
    }

    public setData(role_list){
        this["elf_snap_1"].data = this.createRoleData(role_list[0]);
        this["elf_snap_2"].data = this.createRoleData(role_list[1]);
        this["elf_snap_3"].data = this.createRoleData(role_list[2]);
    }

    private setupUI(){
        this.elfSnaps = [this["elf_snap_1"], this["elf_snap_2"], this["elf_snap_3"]];
        this.elfSnaps.forEach(elem => {
            let btn = <eui.Button>elem;
            btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onElfSnapClick, this);
        });
    }

    private onElfSnapClick(event:TouchEvent){
        //console.log("onElfBtnClick", event, event.target);
        let elf = <any>event.currentTarget;
        this.selectElf(elf);
    }

    private selectElf(elf:eui.Component){
        this.elfSnaps.forEach(elem => {
            let e = <eui.Component>(elem);
            if( e != elf ){
                e.currentState = "unselect";
            }else{
                e.currentState = "selected";
                if(this.elfSelecetd != e){
                    this.elfSelecetd = e;
                    this.dispatchEventWith(ElfSelectUI.ELF_SELECTED, true, e, false);
                }
            }
        });
    }

    private createRoleData(role){
        let id = role.elf_id;
        let unit = unitCfg.getByField("id", id + "");
        return {name:unit.name, icon:unit.icon, role:role};
    }

}