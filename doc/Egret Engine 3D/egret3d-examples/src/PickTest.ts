/// <reference path="../lib/egret3d.d.ts" />

//需加上这个反射标记，场景才能通过名字找到这个类，并自动创建他
@egret3d.reflect.userCode
class PickTest implements egret3d.framework.IUserCode
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    inputMgr: egret3d.framework.InputMgr;//键盘、鼠标(触屏)事件管理类    

    private camera: egret3d.framework.Camera;

    private createGeo(name:string, type:string):egret3d.framework.Transform {
        var cube = new egret3d.framework.Transform();
        cube.name = name;
        var smesh = this.app.getAssetMgr().getDefaultMesh(type);
        var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;
        mesh.mesh = (smesh);
        var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
        return cube;
    }

    private floor:egret3d.framework.Transform;
    private flag:egret3d.framework.Transform;
    
    onStart(app: egret3d.framework.Application) {
        this.app = app;

        this.inputMgr = this.app.getInputMgr();

        this.scene = this.app.getScene();

        // 加载shader
        let shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, (state) => {
            if (state.isfinish) {
                // create floor
                var floor = this.floor = this.createGeo("floor", "cube");
                floor.gameObject.addComponent("BoxCollider") as egret3d.framework.BoxCollider;
                floor.markDirty();
                floor.localScale.x = 10;
                floor.localScale.y = 0.1;
                floor.localScale.z = 10;
                this.scene.addChild(floor);
                // create flag
                var flag = this.flag = this.createGeo("floor", "pyramid");
                // flag.gameObject.addComponent("BoxCollider") as egret3d.framework.BoxCollider;
                flag.markDirty();
                this.scene.addChild(flag);
            }
        });

        //添加一个摄像机
        var objCam = new egret3d.framework.Transform();
        objCam.name = "mainCamera";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new egret3d.math.Color(0.0, 0.0, 0.0, 1.0);
        objCam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
        objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
    }

    private timer: number = 0;
    private pointDown: boolean = false;
    private movetarget: egret3d.math.Vector3 = new egret3d.math.Vector3();
    onUpdate(delta: number) {
        if(!this.flag || !this.floor) return;

        if(!this.pointDown && this.inputMgr.point.touch) {
            //根据当前鼠标按下的屏幕位置创建射线
            var ray = this.camera.creatRayByScreen(new egret3d.math.Vector2(this.inputMgr.point.x, this.inputMgr.point.y), this.app);
            //调用pick方法 默认为pick collider
            var pickinfo = this.scene.pick(ray);
            if (pickinfo != null) {
                //pickinfo中记录的交点的位置信息
                this.movetarget = pickinfo.hitposition;
                this.timer = 0;
            }
        }

        //作为上一帧的鼠标状态
        this.pointDown = this.inputMgr.point.touch;

        this.timer += delta;

        //把flag移动到拣选的位置上
        this.flag.localTranslate.x = this.movetarget.x;
        this.flag.localTranslate.y = this.movetarget.y;
        this.flag.localTranslate.z = this.movetarget.z;
        //必须markdirty一下才会更新
        this.flag.markDirty();
    }

    isClosed(): boolean {
        return false;
    }
}
