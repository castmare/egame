namespace t
{
    export class test_posteffect implements IState
    {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (_state) =>
            {
                if (_state.isfinish) 
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
        }

        private addcube(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            for (var i = -4; i < 5; i++)
            {
                for (var j = -4; j < 5; j++)
                {
                    var cube = new egret3d.framework.Transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                    cube.localTranslate.x = i;
                    cube.localTranslate.z = j;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                    if (sh != null)
                    {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        //cuber.materials[0].setVector4("_Color", new egret3d.math.vector4(0.4, 0.4, 0.2, 1.0));

                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }

                }
            }

            state.finish = true;
        }
        private addcamandlight(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {

            //添加一个摄像机
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
            this.camera.near = 1;
            this.camera.far = 15;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新


            //set post effect 
            {
                                //color 2 rt
                var color = new egret3d.framework.CameraPostQueue_Color();
                color.renderTarget = new egret3d.render.GlRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                this.camera.postQueues.push(color);


                //depth 2 rt 
                var depth = new egret3d.framework.CameraPostQueue_Depth();
                depth.renderTarget = new egret3d.render.GlRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                this.camera.postQueues.push(depth);

                var post = new egret3d.framework.CameraPostQueue_Quad();
                post.material.setShader(this.scene.app.getAssetMgr().getShader("diffuse.shader.json"));
                
                var text = new egret3d.framework.Texture("_depth");
                text.glTexture = depth.renderTarget;
                
                var textcolor = new egret3d.framework.Texture("_color");
                textcolor.glTexture = color.renderTarget;
                
                post.material.setTexture("_MainTex", textcolor);
                post.material.setTexture("_DepthTex", text);
                this.camera.postQueues.push(post);

            }
            var lighttran = new egret3d.framework.Transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("Light") as egret3d.framework.Light;
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();

            {
                var cube = new egret3d.framework.Transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;

                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    //cuber.materials[0].setVector4("_Color", new egret3d.math.vector4(0.4, 0.4, 0.2, 1.0));

                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;
                    cuber.materials[0].setTexture("_MainTex", texture);

                }
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
                        this.light.spotAngelCos = Math.cos(0.2 * Math.PI);
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
                objCam.localTranslate = new egret3d.math.Vector3(x2 * 10, 2.25, -z2 * 10);
                // objCam.markDirty();
                objCam.updateWorldTran();
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                //objCam.markDirty();
            }
            if (this.light != null)
            {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new egret3d.math.Vector3(x * 5, 3, z * 5);
                // objlight.markDirty();
                objlight.updateWorldTran();
                objlight.lookatPoint(new egret3d.math.Vector3(0, 0, 0));

            }

        }
    }

}