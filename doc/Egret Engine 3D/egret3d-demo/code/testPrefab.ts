class test_loadprefab implements IState
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    renderer: egret3d.framework.MeshRenderer[];
    skinRenders: egret3d.framework.SkinnedMeshRenderer[];
    start(app: egret3d.framework.Application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new egret3d.math.Vector3(0, 0, 0);
        let names: string[] = ["baihu", "0060_duyanshou", "0001_fashion", "193_meirenyu"];
        let name = names[0];
        // name="Wing_11";
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/prefabs/" + name + "/" + name + ".assetbundle.json",egret3d.framework.AssetTypeEnum.Auto,
                    (s) =>
                    {
                        if (s.isfinish)
                        {
                            var _prefab: egret3d.framework.Prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as egret3d.framework.Prefab;
                            this.baihu = _prefab.getCloneTrans();
                            this.scene.addChild(this.baihu);
                            this.baihu.markDirty();
                            // this.baihu.localScale = new egret3d.math.Vector3(1, 1, 1);
                            // this.baihu.localTranslate = new egret3d.math.Vector3(0, 0, 0);
                            // this.baihu.localEulerAngles = new egret3d.math.Vector3(0, 180, 0);

                            // this.baihu.localEulerAngles = new egret3d.math.vector3();
                            // this.baihu = _prefab.getCloneTrans();
                            // objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
                            // objCam.lookatPoint(new egret3d.math.Vector3(0.1, 0.1, 0.1));
                            // objCam.markDirty();
                            // this.renderer = this.baihu.gameObject.getComponentsInChildren("meshRenderer") as egret3d.framework.MeshRenderer[];
                            // this.skinRenders = this.baihu.gameObject.getComponentsInChildren(egret3d.framework.StringUtil.COMPONENT_SKINMESHRENDER) as egret3d.framework.SkinnedMeshRenderer[];
                        }
                    });
            }
        });


        //添加一个摄像机
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new egret3d.math.Color(0.5, 0.0, 0.0, 1.0);
        objCam.localTranslate = new egret3d.math.Vector3(0, 0, -30);
        objCam.markDirty();//标记为需要刷新

    }

    
    camera: egret3d.framework.Camera;
    baihu: egret3d.framework.Transform;
    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 2.25, -z2 * 5);
        if (this.baihu)
        {
            objCam.lookat(this.baihu);
            objCam.markDirty();//标记为需要刷新
        }
    }
}