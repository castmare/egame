/// <reference path="../lib/egret3d.d.ts" />

class test_anim implements IState
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    player: egret3d.framework.Transform;
    cubes: { [id: string]: egret3d.framework.Transform } = {};
    start(app: egret3d.framework.Application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        // this.app.targetFrame = 10;
        var baihu = new egret3d.framework.Transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;

        this.scene.addChild(baihu);
        {
            var lighttran = new egret3d.framework.Transform();
            this.scene.addChild(lighttran);
            var light = lighttran.gameObject.addComponent("Light") as egret3d.framework.Light;
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();

        }
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (state) =>
        {
            if (state.isfinish)
            {
                // let _shader = this.app.getAssetMgr().getShader("light1.shader.json");

                this.app.getAssetMgr().load("res/prefabs/elong/elong.assetbundle.json",egret3d.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var _prefab: egret3d.framework.Prefab = this.app.getAssetMgr().getAssetByName("elong.prefab.json") as egret3d.framework.Prefab;
                        baihu = _prefab.getCloneTrans();
                        this.player = baihu;
                        this.scene.addChild(baihu);
                        baihu.localScale = new egret3d.math.Vector3(0.2, 0.2, 0.2);
                        baihu.localTranslate = new egret3d.math.Vector3(0, 0, 0);


                        objCam.lookat(baihu);
                        objCam.markDirty();
                        // var _skinMeshRenders = baihu.gameObject.getComponentsInChildren("skinnedMeshRenderer") as egret3d.framework.skinnedMeshRenderer[];
                        // _skinMeshRenders[0].materials[0].setShader(_shader);

                        var ap = baihu.gameObject.getComponent("AniPlayer") as egret3d.framework.AniPlayer;
                        // ap.autoplay = false;

                        document.onkeydown = (ev) =>
                        {
                            if (ev.code == "KeyM")
                            {
                                ap.playCrossByIndex(0, 0.2);
                            }
                            else if (ev.code == "KeyN")
                            {
                                ap.playCrossByIndex(1, 0.2);
                            }
                        }

                        let wingroot = baihu.find("Bip001 Xtra18Nub");

                        let trans = new egret3d.framework.Transform();
                        trans.name = "cube11";
                        var mesh = trans.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;
                        var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                        mesh.mesh = smesh;
                        var renderer = trans.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                        wingroot.addChild(trans);
                        trans.localTranslate = new egret3d.math.Vector3(0, 0, 0);
                        renderer.materials = [];
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials[0].setShader(this.app.getAssetMgr().getShader("shader/def"));

                        

                        // for (var i = 0; i < ap.bones.length; i++)
                        // {
                        //     var cube = new egret3d.framework.transform();
                        //     cube.name = "cube";
                        //     var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.meshFilter;
                        //     var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                        //     mesh.mesh = smesh;
                        //     var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.meshRenderer;
                        //     egret3d.math.vec3Clone(ap.bones[i].tposep, cube.localTranslate);

                        //     egret3d.math.quatClone(ap.bones[i].tposeq, cube.localRotate);
                        //     cube.localScale.x=0.2;
                        //     baihu.addChild(cube);
                        //     cube.markDirty();
                        //     this.cubes[ap.bones[i].name] = cube;
                        // }
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
        var x2 = Math.sin(this.timer * 1.1);
        var z2 = Math.cos(this.timer * 1.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();//标记为需要刷新
        objCam.updateWorldTran();
        //for (var key in this.cubes)
        //{
        //    var ap = this.player.gameObject.getComponent("aniplayer") as egret3d.framework.aniplayer;
        //    if (ap != null && ap.nowpose != null)
        //    {
        //        var p = ap.nowpose[key];
        //        var t = ap.tpose[key];

        //        if (p != undefined && t != undefined)
        //        {
        //            // var matt = new egret3d.math.matrix();
        //            // var matb = new egret3d.math.matrix();
        //            // egret3d.math.matrixMakeTransformRTS(t.t, new egret3d.math.vector3(1, 1, 1), t.r, matt);
        //            // egret3d.math.matrixMakeTransformRTS(p.t, new egret3d.math.vector3(1, 1, 1), p.r, matb);
        //            // let _matrix = new egret3d.math.matrix();
        //            // egret3d.math.matrixMultiply(matb, matt, _matrix);

        //            // let _newmatrix = new egret3d.math.matrix();
        //            // egret3d.math.matrixMultiply(this.player.getWorldMatrix(), _matrix, _newmatrix);
        //            // this.cubes[key].setWorldMatrix(_newmatrix);

        //             let fmat = egret3d.framework.PoseBoneMatrix.sMultiply(p, t);

        //             egret3d.math.vec3Clone(fmat.t, this.cubes[key].localTranslate);
        //             egret3d.math.quatClone(fmat.r, this.cubes[key].localRotate);
        //            this.cubes[key].markDirty();
        //        }
        //    }

        //}
    }
}