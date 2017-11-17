/// <reference path="../lib/egret3d.d.ts" />

namespace t
{
    export class light_d1 implements IState
    {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (_state) =>
            {
                if(_state.isfinish)
                {
                    state.finish = true;
                }
                
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
            this.app.getAssetMgr().load("compressRes/rock256.png", egret3d.framework.AssetTypeEnum.Auto, (s) =>
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
            this.app.getAssetMgr().load("compressRes/rock_n256.png", egret3d.framework.AssetTypeEnum.Auto, (s) =>
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

        private addcube(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {


            var sphereString = "res/prefabs/sphere/resources/Sphere.mesh.bin";

            this.app.getAssetMgr().load(sphereString, egret3d.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    for (var i = -4; i < 5; i++)
                    {
                        for (var j = -4; j < 5; j++)
                        {
                            var baihu = new egret3d.framework.Transform();
                            this.scene.addChild(baihu);
                            baihu.localScale = new egret3d.math.Vector3(0.5, 0.5, 0.5);
                            baihu.localTranslate.x = i;
                            baihu.localTranslate.y = j;
                            //egret3d.math.quatFromEulerAngles(-90, 0, 0, baihu.localRotate);
                            baihu.markDirty();

                            var smesh1 = this.app.getAssetMgr().getAssetByName("Sphere.mesh.bin") as egret3d.framework.Mesh;
                            var mesh1 = baihu.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;
                            mesh1.mesh = (smesh1);
                            var renderer = baihu.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                            baihu.markDirty();
                            var sh = this.app.getAssetMgr().getShader("light3.shader.json");
                            renderer.materials = [];
                            renderer.materials.push(new egret3d.framework.Material());
                            renderer.materials[0].setShader(sh);

                            let texture = this.app.getAssetMgr().getAssetByName("rock256.png") as egret3d.framework.Texture;
                            renderer.materials[0].setTexture("_MainTex", texture);

                            var tex2 = this.app.getAssetMgr().getAssetByName("rock_n256.png") as egret3d.framework.Texture;
                            renderer.materials[0].setTexture("_NormalTex", tex2);
                        }
                    }

                    state.finish = true;
                }
            });


        }
        private addcamandlight(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {

            //添加一个摄像机
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新


            var lighttran = new egret3d.framework.Transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("Light") as egret3d.framework.Light;
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();

            {
                var cube = new egret3d.framework.Transform();
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;

                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                let cuber = renderer;
            }
            state.finish = true;

        }
        start(app: egret3d.framework.Application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = () =>
            {
                if (this.light != null)
                {
                    if (this.light.type == egret3d.framework.LightTypeEnum.Direction)
                    {
                        this.light.type = egret3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (this.light.type == egret3d.framework.LightTypeEnum.Point)
                    {
                        this.light.type = egret3d.framework.LightTypeEnum.Spot;
                        console.log("聚光灯");
                    }
                    else
                    {
                        this.light.type = egret3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            }
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        }

        camera: egret3d.framework.Camera;
        light: egret3d.framework.Light;
        timer: number = 0;
        taskmgr: egret3d.framework.TaskMgr = new egret3d.framework.TaskMgr();
        update(delta: number)
        {
            this.taskmgr.move(delta);

            this.timer += delta;

            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null)
            {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 4, -z2 * 5);
                // objCam.markDirty();
                //objCam.updateWorldTran();
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                objCam.markDirty();
            }
            if (this.light != null)
            {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new egret3d.math.Vector3(x * 3, 3, z * 3);

                //objlight.updateWorldTran();
                objlight.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                objlight.markDirty();
            }

        }
    }

}