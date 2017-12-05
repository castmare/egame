class MatchBtnUI extends eui.Component {
    static MATCHING:string = "matching";
    private timer:egret.Timer;
    constructor() {
        super();
        this.skinName = "MatchBtnSkin";
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        
    }

    public setMatchEnable(){
        this.currentState = "match";
    }

    private onTouchBegin(e) {
        if( this.currentState != "matching" ){
            this.dispatchEventWith(MatchBtnUI.MATCHING, true, e, false);
            this.currentState = "matching";
        }
    }

    private onTouchEnd(e) {

    }
}