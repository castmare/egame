@egret3d.reflect.userCode
class testUserCodeUpdate implements egret3d.framework.IUserCode
{
    beExecuteInEditorMode: boolean = false;
    trans: egret3d.framework.Transform;
    timer: number = 0;
    app: egret3d.framework.Application;
    onStart(app: egret3d.framework.Application)
    {
        this.app = app;
    }
    onUpdate(delta: number)
    {
        if (this.trans == null || this.trans == undefined)
        {
            this.trans = this.app.getScene().getChildByName("Cube");
        }
        if (this.trans == null || this.trans == undefined)
            return;
        this.timer += delta * 15;
        egret3d.math.quatFromAxisAngle(new egret3d.math.Vector3(0, 1, 0), this.timer, this.trans.localRotate);
        this.trans.markDirty();
    }
    isClosed(): boolean
    {
        return false;
    }
}