class test_load implements IState
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    start(app: egret3d.framework.Application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        var baihu = new egret3d.framework.Transform();
        baihu.name = "baihu";
        egret3d.math.quatFromEulerAngles(-90, 0, 0, baihu.localRotate);
        this.scene.addChild(baihu);
        var lighttran = new egret3d.framework.Transform();
        this.scene.addChild(lighttran);
        var light = lighttran.gameObject.addComponent("Light");
        lighttran.localTranslate.x=50;
        lighttran.localTranslate.y=50;
        lighttran.markDirty();

        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/prefabs/baihu/resources/res_baihu_baihu.FBX_baihu.mesh.bin", egret3d.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var smesh1 = this.app.getAssetMgr().getAssetByName("res_baihu_baihu.FBX_baihu.mesh.bin") as egret3d.framework.Mesh;
                        var mesh1 = baihu.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;
                        mesh1.mesh = smesh1.clone();
                        var renderer = baihu.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                        var collider = baihu.gameObject.addComponent("BoxCollider") as egret3d.framework.BoxCollider;
                        baihu.markDirty();
                        var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                        renderer.materials = [];
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials[0].setShader(sh);
                        renderer.materials[1].setShader(sh);
                        renderer.materials[2].setShader(sh);
                        renderer.materials[3].setShader(sh);
                        this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihu.imgdesc.json", egret3d.framework.AssetTypeEnum.Auto, (s2) =>
                        {
                            if (s2.isfinish)
                            {
                                let texture = this.app.getAssetMgr().getAssetByName("baihu.imgdesc.json") as egret3d.framework.Texture;
                                renderer.materials[0].setTexture("_MainTex", texture);
                            }
                        });
                        this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuan.png", egret3d.framework.AssetTypeEnum.Auto, (s2) =>
                        {
                            if (s2.isfinish)
                            {
                                let texture = this.app.getAssetMgr().getAssetByName("baihuan.png") as egret3d.framework.Texture;
                                renderer.materials[1].setTexture("_MainTex", texture);
                            }
                        });
                        this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuya.png", egret3d.framework.AssetTypeEnum.Auto, (s2) =>
                        {
                            if (s2.isfinish)
                            {
                                let texture = this.app.getAssetMgr().getAssetByName("baihuya.png") as egret3d.framework.Texture;
                                renderer.materials[2].setTexture("_MainTex", texture);
                            }
                        });
                        this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihumao.png", egret3d.framework.AssetTypeEnum.Auto, (s2) =>
                        {
                            if (s2.isfinish)
                            {
                                let texture = this.app.getAssetMgr().getAssetByName("baihumao.png") as egret3d.framework.Texture;
                                renderer.materials[3].setTexture("_MainTex", texture);
                            }
                        });

                    }
                });
            }
        });
        this.cube = baihu;

        //添加一个摄像机
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();//标记为需要刷新

    }

    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
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
        objCam.lookat(this.cube);
        objCam.markDirty();//标记为需要刷新
        objCam.updateWorldTran();
    }
}