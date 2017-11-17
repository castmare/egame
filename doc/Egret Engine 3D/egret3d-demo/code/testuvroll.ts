/// <reference path="../lib/egret3d.d.ts" />
namespace t
{
    export class test_uvroll implements IState
    {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (_state) =>
            {
                if (_state.isfinish)
                    state.finish = true;
            }
            );
        }

        private loadText(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            this.app.getAssetMgr().load("compressRes/uvSprite.png", egret3d.framework.AssetTypeEnum.Auto, (s) => 
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
            //添加一个盒子
            {
                var cube = new egret3d.framework.Transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                cube.localTranslate.x = -1;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("sample_uvsprite.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    let texture = this.app.getAssetMgr().getAssetByName("uvSprite.png") as egret3d.framework.Texture;
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
                this.cube = cube;
            }
            {
                var cube1 = new egret3d.framework.Transform();
                cube1.name = "cube1";
                cube1.localScale.x = cube1.localScale.y = cube1.localScale.z = 1;
                cube1.localTranslate.x = 1;
                this.scene.addChild(cube1);
                var mesh1 = cube1.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh1.mesh = (smesh);
                var renderer1 = cube1.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                let cuber1 = renderer1;

                var sh = this.app.getAssetMgr().getShader("uvroll.shader.json");
                if (sh != null)
                {
                    cuber1.materials = [];
                    cuber1.materials.push(new egret3d.framework.Material());
                    cuber1.materials[0].setShader(sh);//----------------使用shader

                    let texture1 = this.app.getAssetMgr().getAssetByName("uvSprite.png") as egret3d.framework.Texture;
                    cuber1.materials[0].setTexture("_MainTex", texture1);
                    cuber1.materials[0].setFloat("_SpeedU", 3);
                    cuber1.materials[0].setFloat("_SpeedV", 1);
                    this.cube1 = cube1;
                }

            }
            {
                var cube2 = new egret3d.framework.Transform();
                cube2.name = "cube2222";
                cube2.localScale.x = cube1.localScale.y = cube1.localScale.z = 1;
                cube2.localTranslate.y = 1;
                this.scene.addChild(cube2);
                var mesh1 = cube2.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh1.mesh = (smesh);
                var renderer2 = cube2.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;

                var sh = this.app.getAssetMgr().getShader("selftimer_uvroll.shader.json");
                if (sh != null)
                {
                    renderer2.materials = [];
                    renderer2.materials.push(new egret3d.framework.Material());
                    renderer2.materials[0].setShader(sh);//----------------使用shader
                    let texture1 = this.app.getAssetMgr().getAssetByName("uvSprite.png") as egret3d.framework.Texture;
                    renderer2.materials[0].setTexture("_MainTex", texture1);
                    
                }
                this.cube2 = cube2;
            }
            state.finish = true;
        }
        private addcam(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {

            //添加一个摄像机
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
            this.camera.near = 0.01;
            this.camera.far = 30;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新

            state.finish = true;

        }
        start(app: egret3d.framework.Application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        }

        camera: egret3d.framework.Camera;
        cube: egret3d.framework.Transform;
        cube1: egret3d.framework.Transform;
        cube2: egret3d.framework.Transform;

        timer: number = 0;
        taskmgr: egret3d.framework.TaskMgr = new egret3d.framework.TaskMgr();
        count: number = 0;

        row: number = 3;
        col: number = 3;
        totalframe: number = 9;
        fps: number = 2;
        /**
         * 在粒子系统的一个生命周期内，动画重复的数量
         */
        private cycles: number;
        update(delta: number)
        {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.cube != null)
            {
                //uv 动画
                let curframe = Math.floor(this.timer * this.fps);
                curframe = curframe % this.totalframe;

                // let ratex = 1/this.col;
                // let ratey = 1/this.row;

                // var vec4 = new egret3d.math.vector4(ratex, ratey, curframe%this.col*ratey, Math.floor(curframe/this.col)*ratex);
                var vec41 = new egret3d.math.Vector4();
                egret3d.math.spriteAnimation(3, 3, curframe, vec41);
                var renderer = this.cube.gameObject.getComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                renderer.materials[0].setVector4("_MainTex_ST", vec41);//shader 里加入st参数
            }
            //cube1用的全局的timer
            if (this.cube2 != null)
            {//uv滚动//用自己的timer
                var renderer2 = this.cube2.gameObject.getComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                renderer2.materials[0].setVector4("_MainTex_ST", new egret3d.math.Vector4(1.0, 1.0, 0, 0));
                renderer2.materials[0].setFloat("_SpeedU", 3.0);
                renderer2.materials[0].setFloat("_SpeedV", 1.0);
                renderer2.materials[0].setFloat("self_timer", this.timer);//shader 里加入st参数
            }




            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null)
            {
                var objCam = this.camera.gameObject.transform;
                // objCam.localTranslate = new egret3d.math.vector3(x2 * 10, 2.25, -z2 * 10);
                // objCam.markDirty();
                // objCam.updateWorldTran();
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                objCam.markDirty();
            }

        }
    }

}