/// <reference path="../lib/egret3d.d.ts" />

namespace t
{

    export class test_rendertexture implements IState
    {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (_state) =>
            {
                state.finish = true;
            }
            );
        }

        private loadText(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, (s) => 
            {
                if (s.isfinish) 
                {
                    state.finish = true;
                }
                else
                {
                    state.error = true;
                }
            }
            );
        }
        sh: egret3d.framework.Shader;
        private initscene(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            {
                //camera1
                var objCam = new egret3d.framework.Transform();
                objCam.name = "cam_show";
                this.scene.addChild(objCam);
                this.showcamera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
                this.showcamera.order = 0;
                this.showcamera.near = 0.01;
                this.showcamera.far = 30;
                this.showcamera.fov = Math.PI * 0.3;
                objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                objCam.markDirty();//鏍囪涓洪渶瑕佸埛鏂?
            }

            {
                var o2ds = new egret3d.framework.Overlay2D();

                this.showcamera.addOverLay(o2ds);
                {//overlay1
                    var t2d = new egret3d.framework.Transform2D();
                    t2d.name="ceng1";
                    t2d.localTranslate.x = 200;
                    t2d.localTranslate.y = 200;
                    t2d.width = 300;
                    t2d.height = 300;
                    t2d.pivot.x = 0;
                    t2d.pivot.y = 0;
                    t2d.markDirty();
                    var rawiamge = t2d.addComponent("RawImage2D") as egret3d.framework.RawImage2D;
                    rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;

                    o2ds.addChild(t2d);
                }
                {
                    var cube1 = new egret3d.framework.Transform();

                    cube1.name = "cube1";
                    this.scene.addChild(cube1);
                    cube1.localScale.x = 8;
                    cube1.localScale.y = 1;
                    cube1.localScale.z = 1;

                    cube1.markDirty();

                    var mesh1 = cube1.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh1.mesh = (smesh);
                    var renderer = cube1.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                }
            }
            


            state.finish = true;

        }

        private add3dmodelbeforeUi(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            {
                var modelcam = new egret3d.framework.Transform();
                modelcam.name = "modelcam";
                this.scene.addChild(modelcam);
                this.wath_camer = modelcam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
                //--------------------------------重要设置-----------------------------------------
                this.wath_camer.order = 1;//这个看向模型的相机的order需要高于场景相机
                this.wath_camer.clearOption_Color = false;
                this.wath_camer.clearOption_Depth=true;
                this.wath_camer.CullingMask=egret3d.framework.CullingMask.modelbeforeui|egret3d.framework.CullingMask.ui;
                //--------------------------------------------------------------------------------------
                
                // this.wath_camer.near = 0.01;
                // this.wath_camer.far = 30;
                // this.wath_camer.fov = Math.PI * 0.3;
                modelcam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
                modelcam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));//相机要看向你想看到的3d模型
                modelcam.markDirty();
            }
            {//加3d模型，用特定shader
                var cube = new egret3d.framework.Transform();

                cube.name = "cube";
                this.scene.addChild(cube);
                cube.localScale.x = 3;
                cube.localScale.y = 3;
                cube.localScale.z = 3;

                cube.markDirty();

                var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                renderer.renderLayer = egret3d.framework.CullingMask.modelbeforeui;
                let cuber = renderer;

                //"shader/def3dbeforeui"
                //"def/defui"
                //"diffuse.shader.json"
                this.sh = this.app.getAssetMgr().getShader("diffuse.shader.json");//3d模型要用这个shader

                if (this.sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(this.sh);//

                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
                this.target = cube;
                {//加ui，如果需要在模型上层显示ui
                    var o2d1 = new egret3d.framework.Overlay2D();
                    this.wath_camer.addOverLay(o2d1);
                    {//
                        var t2d = new egret3d.framework.Transform2D();
                        t2d.name="ceng2";
                        t2d.localTranslate.x = 300;
                        t2d.localTranslate.y = 100;
                        t2d.width = 150;
                        t2d.height = 150;
                        t2d.pivot.x = 0;
                        t2d.pivot.y = 0;
                        t2d.markDirty();
                        var rawiamge = t2d.addComponent("RawImage2D") as egret3d.framework.RawImage2D;
                        rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;

                        o2d1.addChild(t2d);
                    }
                }
            }
            state.finish=true;
        }
        start(app: egret3d.framework.Application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            this.taskmgr.addTaskCall(this.add3dmodelbeforeUi.bind(this));


        }
        wath_camer: egret3d.framework.Camera;
        target: egret3d.framework.Transform;
        targetMat: egret3d.framework.Material;
        show_cube: egret3d.framework.Transform;
        showcamera: egret3d.framework.Camera;
        timer: number = 0;
        taskmgr: egret3d.framework.TaskMgr = new egret3d.framework.TaskMgr();

        angle: number;
        update(delta: number)
        {
            this.taskmgr.move(delta);

            if (this.target == undefined) return;
            // if (this.show_cube == undefined) return;
            this.timer += delta;

            egret3d.math.quatFromAxisAngle(egret3d.math.Pool.vector3_up, this.timer * 3, this.target.localRotate);
            this.target.markDirty();


        }
    }
}