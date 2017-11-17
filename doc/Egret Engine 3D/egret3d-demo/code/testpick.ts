@egret3d.reflect.userCode
class test_pick implements IState {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    start(app: egret3d.framework.Application) {
        console.log("i am here.");
        this.app = app;
        this.inputMgr = this.app.getInputMgr();
        this.scene = this.app.getScene();
        let cuber: egret3d.framework.MeshRenderer;
        console.warn("Finish it.");

        //添加一个盒子 作为地面
        var cube = new egret3d.framework.Transform();
        cube.name = "cube";

        cube.localScale.x = 10;
        cube.localScale.y = 0.1;
        cube.localScale.z = 10;
        this.scene.addChild(cube);
        //添加渲染相关组件并设置mesh
        var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;
        mesh.mesh = (this.app.getAssetMgr().getDefaultMesh("cube"));
        var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
        //本次测试为colliderpick 需要添加collider
        cube.gameObject.addComponent("BoxCollider") as egret3d.framework.BoxCollider;
        cube.markDirty();

        var smesh = this.app.getAssetMgr().getDefaultMesh("pyramid");

        cuber = renderer;


        this.cube = cube;

        {
            this.cube2 = new egret3d.framework.Transform();
            this.cube2.name = "cube2";
            this.scene.addChild(this.cube2);
            this.cube2.localScale.x = this.cube2.localScale.y = this.cube2.localScale.z = 1;
            this.cube2.localTranslate.x = -5;
            this.cube2.markDirty();
            var mesh = this.cube2.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;
            mesh.mesh = (smesh);
            var renderer = this.cube2.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
            let coll = this.cube2.gameObject.addComponent("SphereCollider") as egret3d.framework.SphereCollider;
            coll.center = new egret3d.math.Vector3(0, 1, 0);
            coll.radius = 1;

            //---------------------baocuo
            //this.cube2.gameObject.addComponent("Frustumculling") as egret3d.framework.frustumculling;
        }


        this.cube3 = this.cube2.clone();
        this.scene.addChild(this.cube3);
        {
            this.cube3 = new egret3d.framework.Transform();
            this.cube3.name = "cube3";
            this.scene.addChild(this.cube3);
            this.cube3.localScale.x = this.cube3.localScale.y = this.cube3.localScale.z = 1;
            this.cube3.localTranslate.x = -5;
            this.cube3.markDirty();
            var mesh = this.cube3.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;
            mesh.mesh = (smesh);
            var renderer = this.cube3.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
            let coll = this.cube3.gameObject.addComponent("BoxCollider") as egret3d.framework.BoxCollider;
            coll.colliderVisible = true;
        }


        {
            this.cube4 = new egret3d.framework.Transform();
            this.cube4.name = "cube4";
            this.scene.addChild(this.cube4);
            this.cube4.localScale.x = this.cube4.localScale.y = this.cube4.localScale.z = 1;
            this.cube4.localTranslate.x = 5;
            this.cube4.markDirty();
            var mesh = this.cube4.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;
            mesh.mesh = (smesh);
            var renderer = this.cube4.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
            let coll = this.cube4.gameObject.addComponent("BoxCollider") as egret3d.framework.BoxCollider;
            coll.colliderVisible = true;
        }
        //添加一个摄像机
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
        objCam.lookat(this.cube);
        objCam.markDirty();//标记为需要刷新

    }
    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
    cube4: egret3d.framework.Transform;
    timer: number = 0;
    movetarget: egret3d.math.Vector3 = new egret3d.math.Vector3();
    inputMgr: egret3d.framework.InputMgr;//键盘、鼠标(触屏)事件管理类
    pointDown: boolean = false;
    update(delta: number) {
        //上一帧不是按下状态  当前为按下状态 即为按下
        if (this.pointDown == false && this.inputMgr.point.touch == true) {
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
        //把cube移动到拣选的位置上
        egret3d.math.vec3SLerp(this.cube2.localTranslate, this.movetarget, this.timer, this.cube2.localTranslate);
        //必须markdirty一下才会更新
        this.cube2.markDirty();

        // if ((this.cube3.gameObject.getComponent("boxcollider") as egret3d.framework.boxcollider).intersectsTransform(this.cube4))
        // {
        //     return;
        // }
        // this.cube3.localTranslate.x += delta;
        // this.cube3.markDirty();
        // var x = Math.sin(this.timer);
        // var z = Math.cos(this.timer);
        // var x2 = Math.sin(this.timer * 0.1);
        // var z2 = Math.cos(this.timer * 0.1);

        // var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate.x += delta;
        // objCam.markDirty();
    }

    isClosed(): boolean {
        return false;
    }
}