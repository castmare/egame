namespace t {

    export class test_blend implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        camera: egret3d.framework.Camera;
        background: egret3d.framework.Transform;
        parts: egret3d.framework.Transform;
        timer: number = 0;
        taskmgr: egret3d.framework.TaskMgr = new egret3d.framework.TaskMgr();
        count: number = 0;
        counttimer: number = 0;
        private angularVelocity: egret3d.math.Vector3 = new egret3d.math.Vector3(10, 0, 0);
        private eulerAngle = egret3d.math.Pool.new_vector3();

        private loadShader(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (_state) => {
                if (_state.isfinish) {

                    state.finish = true;
                }
            }
            );
        }

        private loadText(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            let t = 2;
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    t--;
                    if (t == 0) {
                        state.finish = true;

                    }
                }
                else {
                    state.error = true;
                }
            }
            );

            this.app.getAssetMgr().load("compressRes/trailtest2.png", egret3d.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    t--;
                    if (t == 0) {
                        state.finish = true;

                    }
                }
                else {
                    state.error = true;
                }
            }
            );
        }

        private addcam(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {

            //添加一个摄像机
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, 10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            state.finish = true;

        }

        foreground: egret3d.framework.Transform;
        private addplane(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            {
                {
                    let background = new egret3d.framework.Transform();
                    background.name = "background";
                    background.localScale.x = background.localScale.y = 5;
                    background.localTranslate.z =-1;
                    this.scene.addChild(background);
                    background.markDirty();
                    background.updateWorldTran();
                    var mesh = background.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("quad");
                    mesh.mesh = (smesh);
                    var renderer = background.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                    let meshRender = renderer;

                    var sh = this.app.getAssetMgr().getShader("diffuse_bothside.shader.json") as egret3d.framework.Shader;
                    if (sh != null) {
                        meshRender.materials = [];
                        meshRender.materials.push(new egret3d.framework.Material());
                        meshRender.materials[0].setShader(sh);
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;
                        meshRender.materials[0].setTexture("_MainTex", texture);
                    }
                    this.background = background;
                }
            }

            {
                {
                    let foreground = new egret3d.framework.Transform();
                    foreground.name = "foreground ";
                    foreground.localScale.x = foreground.localScale.y = 5;
                    this.scene.addChild(foreground);
                    foreground.markDirty();
                    foreground.updateWorldTran();
                    var mesh = foreground.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("quad");
                    mesh.mesh = (smesh);
                    var renderer = foreground.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                    let meshRender = renderer;

                    var sh = this.app.getAssetMgr().getShader("particles_additive.shader.json") as egret3d.framework.Shader;
                    if (sh != null) {
                        meshRender.materials = [];
                        meshRender.materials.push(new egret3d.framework.Material());
                        meshRender.materials[0].setShader(sh);
                        let texture = this.app.getAssetMgr().getAssetByName("trailtest2.png") as egret3d.framework.Texture;
                        meshRender.materials[0].setTexture("_MainTex", texture);
                    }
                    this.foreground = foreground;
                }
            }
            state.finish = true;
        }


        start(app: egret3d.framework.Application) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.addplane.bind(this))
            this.taskmgr.addTaskCall(this.addcam.bind(this));

        }


        update(delta: number) {
            this.taskmgr.move(delta);

            this.timer += delta;
            if (this.background != undefined) {
                let x = Math.cos(this.timer * 1);
                let y = Math.sin(this.timer * 1);

                this.background.localTranslate.x = 1.5 * x;
                this.background.localTranslate.y = 1.5 * y;

                // this.cube.markDirty();
                // egret3d.math.quatFromAxisAngle(egret3d.math.pool.vector3_up, this.timer * 20, this.background.localRotate);
                this.background.markDirty();
            }
        }
    }

}