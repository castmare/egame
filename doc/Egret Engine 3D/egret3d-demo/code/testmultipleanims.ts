class test_multipleplayer_anim implements IState
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    player: egret3d.framework.Transform;
    cubes: { [id: string]: egret3d.framework.Transform } = {};
    infos: { [boneCount: number]: { abName: string, prefabName: string, materialCount: number } } = {};

    init()
    {
        // this.infos[25] = { abName: "gblgongjiang/gblgongjiang.assetbundle.json", prefabName: "gblgongjiang.prefab.json", materialCount: 1 };
        // this.infos[60] = { abName: "emoshou/emoshou.assetbundle.json", prefabName: "emoshou.prefab.json", materialCount: 3 };
        this.infos[53] = { abName: "prefabs/elong/elong.assetbundle.json", prefabName: "elong.prefab.json", materialCount: 1 };


    }
    start(app: egret3d.framework.Application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.init();
        var baihu = new egret3d.framework.Transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;

        this.scene.addChild(baihu);

        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (state) =>
        {
            if (state.isfinish)
            {
                let data = this.infos[53];
                this.app.getAssetMgr().load("res/" + data.abName,egret3d.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var _prefab: egret3d.framework.Prefab = this.app.getAssetMgr().getAssetByName(data.prefabName) as egret3d.framework.Prefab;
                        let a = 10;
                        let b = 10;
                        for (let i = -7; i <=7; i++)
                        {
                            for (let j = -7; j <=7; j++)
                            {
                                let trans = _prefab.getCloneTrans();

                                this.scene.addChild(trans);
                                trans.localScale = new egret3d.math.Vector3(1, 1, 1);
                                trans.localTranslate = new egret3d.math.Vector3(i * 5,0,j*5);
                                if (i ==0 && j == 0)
                                {
                                    objCam.lookat(trans);
                                }
                                var ap = trans.gameObject.getComponent("AniPlayer") as egret3d.framework.AniPlayer;
                                ap.autoplay = true;
                            }
                        }
                        objCam.markDirty();
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
        this.camera.far = 199;
        objCam.localTranslate = new egret3d.math.Vector3(0, 86, 0);
        // objCam.lookat(baihu);
        objCam.markDirty();//标记为需要刷新


    }

    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
    timer: number = 0;
    update(delta: number)
    {
        // this.timer += delta;
        // var x = Math.sin(this.timer * 0.5);
        // var z = Math.cos(this.timer * 0.5);
        // // var x2 = Math.sin(this.timer * 1.1);
        // // var z2 = Math.cos(this.timer * 1.1);
        // let objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new egret3d.math.vector3(x * 86, 55, -z * 86);
        // objCam.lookat(this.cube);
        // objCam.markDirty();//标记为需要刷新
        // objCam.updateWorldTran();
        // for (var key in this.cubes)
        // {
        //     var ap = this.player.gameObject.getComponent("aniplayer") as egret3d.framework.aniplayer;
        //     if (ap != null && ap.nowpose != null)
        //     {
        //         var p = ap.nowpose[key];
        //         var t = ap.tpose[key];

        //         if (p != undefined && t != undefined)
        //         {
        //             // var matt = new egret3d.math.matrix();
        //             // var matb = new egret3d.math.matrix();
        //             // egret3d.math.matrixMakeTransformRTS(t.t, new egret3d.math.vector3(1, 1, 1), t.r, matt);
        //             // egret3d.math.matrixMakeTransformRTS(p.t, new egret3d.math.vector3(1, 1, 1), p.r, matb);
        //             // let _matrix = new egret3d.math.matrix();
        //             // egret3d.math.matrixMultiply(matb, matt, _matrix);

        //             // let _newmatrix = new egret3d.math.matrix();
        //             // egret3d.math.matrixMultiply(this.player.getWorldMatrix(), _matrix, _newmatrix);
        //             // this.cubes[key].setWorldMatrix(_newmatrix);

        //             let fmat = egret3d.framework.PoseBoneMatrix.sMultiply(p, t);

        //             egret3d.math.vec3Clone(fmat.t, this.cubes[key].localTranslate);
        //             egret3d.math.quatClone(fmat.r, this.cubes[key].localRotate);
        //             this.cubes[key].markDirty();
        //         }
        //     }

        // }
    }
}