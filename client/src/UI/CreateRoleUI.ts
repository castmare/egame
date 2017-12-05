class CreateRoleUI extends eui.Component {
    private elfBtns;
    private elf:string;
    private createHandler;
    constructor() {
        super();
        this.skinName = "CreateRoleSkin";
        this.elfBtns = [this["btn_fire"], this["btn_water"], this["btn_earth"]];
        this.elfBtns.forEach(elem => {
            let btn = <eui.Button>elem;
            btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onElfBtnClick, this);
        });
        this["btn_create"].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onCreateBtnClick, this);
        this.clickElfBtn(this.elfBtns[0]);
    }

    public setCreateHandler(handler:(string)=>void){
        this.createHandler = handler;
    }

    private onElfBtnClick(event:TouchEvent){
        //console.log("onElfBtnClick", event, event.target);
        let btn = <any>event.target;
        this.clickElfBtn(btn);
    }

    private clickElfBtn(clicked:eui.Button){
        this.showElfDetail(clicked.name);
        this.elfBtns.forEach(elem => {
            let btn = <eui.Button>(elem);
            if( clicked != btn ){
                btn.currentState = "up";
            }else{
                btn.currentState = "down";
            }
        });
    }

    private showElfDetail(elf:string){
        //console.log("showElfDetail", elf);
        this.elf = elf;
    }

    private onCreateBtnClick(){
        if( this.createHandler != null){
            this.createHandler(this.elf);
        }
    }
}