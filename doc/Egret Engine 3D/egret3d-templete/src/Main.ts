/// <reference path="../lib/egret3d.d.ts" />

//需加上这个反射标记，场景才能通过名字找到这个类，并自动创建他
@egret3d.reflect.userCode
class Main implements egret3d.framework.IUserCode
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;

    private camera: egret3d.framework.Camera;
    private baihu: egret3d.framework.Transform;

    private cube:egret3d.framework.Transform;
    
    onStart(app: egret3d.framework.Application) {
        this.app = app;

        this.scene = this.app.getScene();

        // 加载shader
        let shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, (state) => {
            if (state.isfinish) {
                // 加载并显示模型
                let baihuAssetUrl = "resources/prefabs/baihu/baihu.assetbundle.json";
                this.app.getAssetMgr().load(baihuAssetUrl, egret3d.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        let prefab: egret3d.framework.Prefab = this.app.getAssetMgr().getAssetByName("baihu.prefab.json") as egret3d.framework.Prefab;
                        this.baihu = prefab.getCloneTrans();
                        this.scene.addChild(this.baihu);
                        this.baihu.markDirty();
                    }
                });
                // 显示内置cube
                // var cube = this.cube = new egret3d.framework.Transform(); //创建一个transform
                // cube.name = "cube"; //设定名字（可以不设定）
                // var mesh = cube.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_MESHFILTER) as egret3d.framework.MeshFilter; // 为其添加一个meshFilter组件
                // var smesh = this.app.getAssetMgr().getDefaultMesh("cube"); //获取引擎内置的cube模型
                // mesh.mesh = smesh; //赋值给meshFilter组件
                // var renderer = cube.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_MESHRENDER) as egret3d.framework.MeshRenderer;// 添加meshRender组件，用来渲染盒子
                // cube.localEulerAngles = new egret3d.math.Vector3(45, 45, 0); //给盒子一定的旋转角度
                // cube.markDirty(); //标记dirty，这样引擎就会去去更新一次这个cube
                // this.scene.addChild(cube); // 将盒子添加到场景中去
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
        objCam.localTranslate = new egret3d.math.Vector3(0, 0, -30);
        objCam.markDirty();//标记为需要刷新
    }

    private timer: number = 0;
    onUpdate(delta: number) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 2.25, -z2 * 5);
        // 摄像机对准baihu
        if (this.baihu) {
            objCam.lookat(this.baihu);
            objCam.markDirty();//标记为需要刷新
        }
        // 摄像机对准cube
        // if(this.cube) {
        //     objCam.lookat(this.cube);
        //     objCam.markDirty();//标记为需要刷新
        // }
    }

    isClosed(): boolean {
        return false;
    }
}
