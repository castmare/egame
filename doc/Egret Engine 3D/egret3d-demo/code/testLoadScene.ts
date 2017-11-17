@egret3d.reflect.userCode
class test_loadScene implements IState
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    start(app: egret3d.framework.Application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        this.cube = new egret3d.framework.Transform();
        this.scene.addChild(this.cube);

        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (state) =>
        {
            if (state.isfinish)
            {        
                let name = "test";
                //通过加载assetbundle的方式加载场景  这里使用的是加载压缩的bundle
                this.app.getAssetMgr().load("res/scenes/" + name + "/" + name + ".assetbundle.json",egret3d.framework.AssetTypeEnum.Auto,
                    (s) =>
                    {
                        //这里的回调状态包含了加载进度
                        console.log(s.curtask + "/" + s.totaltask);
                        if (s.isfinish)
                        {
                            this.app.getAssetMgr().loadScene(name + ".scene.json",()=>{
                                console.log("load over");
                            });

                            // //加载完成后拿到对应的rawscene类型资源
                            // var _scene: egret3d.framework.Rawscene = this.app.getAssetMgr().getAssetByName(name + ".scene.json") as egret3d.framework.Rawscene;
                            // //获取到场景树的根节点  添加到场景中去
                            // var _root = _scene.getSceneRoot();
                            // this.scene.addChild(_root);
                            // _root.localEulerAngles = new egret3d.math.Vector3(0,0,0);
                            // _root.markDirty();
                            // //获取lightmap并应用
                            // this.app.getScene().lightmaps = [];
                            // _scene.useLightMap(this.app.getScene());
                        }
                    });

            }
        });
        

        //添加一个摄像机
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
        objCam.localTranslate = new egret3d.math.Vector3(-10, 25, -10);
        objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));

        objCam.markDirty();//标记为需要刷新

        CameraController.instance().init(this.app, this.camera);
    }
    baihu:egret3d.framework.Transform;
    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
    timer: number = 0;
    bere: boolean = false;
    update(delta: number)
    {
        this.timer += delta;
        CameraController.instance().update(delta);
        // var x = Math.sin(this.timer);
        // var z = Math.cos(this.timer);
        // var x2 = Math.sin(this.timer * 0.5);
        // var z2 = Math.cos(this.timer * 0.5);
        // var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new egret3d.math.vector3(x2 * 10, 30, z2 * 10);
        // objCam.markDirty();//标记为需要刷新








        // this.cube.markDirty();
        // objCam.updateWorldTran();
        // if (this.timer > 5)
        // {
        //     this.app.getScene().getRoot().dispose();
        // }
        // if (this.timer > 10 && !this.bere)
        // {
        //     this.bere = true;
        //     this.app.getAssetMgr().unload("res/scenes/city/city.assetbundle.json");
        //     this.app.getAssetMgr().releaseUnuseAsset();
        // }
    }
    isClosed(): boolean
    {
        return false;
    }
}