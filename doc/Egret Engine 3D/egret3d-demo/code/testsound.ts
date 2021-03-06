namespace t {

    export class test_sound implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        camera: egret3d.framework.Camera;
        cube: egret3d.framework.Transform;
        parts: egret3d.framework.Transform;
        timer: number = 0;
        taskmgr: egret3d.framework.TaskMgr = new egret3d.framework.TaskMgr();
        count: number = 0;
        counttimer: number = 0;
        private angularVelocity: egret3d.math.Vector3 = new egret3d.math.Vector3(10, 0, 0);
        private eulerAngle = egret3d.math.Pool.new_vector3();
        looped: AudioBuffer = null;
        once1: AudioBuffer = null;
        once2: AudioBuffer = null;


        private loadShader(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (_state) => {
                state.finish = true;
            }
            );
        }

        private loadText(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
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
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            state.finish = true;

        }

        private addcube(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            //添加一个盒子
            {
                //添加一个盒子
                {
                    let cube = new egret3d.framework.Transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }
                    this.cube = cube;


                }
            }
            state.finish = true;
        }

        private loadSoundInfe(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            {

                egret3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/music1.mp3", (buf, err) => {
                    this.looped = buf;
                    egret3d.framework.AudioEx.instance().playLooped("abc", this.looped);
                });
                egret3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/sound1.mp3", (buf, err) => {
                    this.once1 = buf;
                });
                egret3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/sound2.mp3", (buf, err) => {
                    this.once2 = buf;
                    egret3d.framework.AudioEx.instance().playOnce("once2", this.once2);
                });
                {
                    var button = document.createElement("button");
                    button.textContent = "play once1";
                    button.onclick = () => {
                        egret3d.framework.AudioEx.instance().playOnce("once1", this.once1);
                    };
                    button.style.top = "130px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "play once2";
                    button.onclick = () => {
                        egret3d.framework.AudioEx.instance().playOnce("once2", this.once2);
                    };
                    button.style.top = "130px";
                    button.style.left = "90px"
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "play loop";
                    button.onclick = () => {
                        egret3d.framework.AudioEx.instance().playLooped("abc", this.looped);
                    };

                    button.style.top = "160px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "stop loop";
                    button.onclick = () => {
                        egret3d.framework.AudioEx.instance().stopLooped("abc");
                    };
                    button.style.top = "160px";
                    button.style.left = "90px"
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    document.body.appendChild(document.createElement("p"));
                    var input = document.createElement("input");
                    input.type = "range";
                    input.valueAsNumber = 10;
                    egret3d.framework.AudioEx.instance().setSoundVolume(-0.2);
                    egret3d.framework.AudioEx.instance().setMusicVolume(-0.2);
                    input.oninput = (e) => {
                        var value = (input.valueAsNumber - 50) / 50;
                        egret3d.framework.AudioEx.instance().setSoundVolume(value);
                        egret3d.framework.AudioEx.instance().setMusicVolume(value);
                    };
                    input.style.top = "190px";
                    input.style.position = "absolute";
                    this.app.container.appendChild(input);
                }

            }
            state.finish = true;
        }


        start(app: egret3d.framework.Application) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this))
            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadSoundInfe.bind(this));

        }




        update(delta: number) {
            this.taskmgr.move(delta);

            this.timer += delta;

            if (this.cube != null) {

                let cubeTransform = this.cube.gameObject.transform;

                this.eulerAngle.x = delta * this.angularVelocity.x * 10;
                this.eulerAngle.y = delta * this.angularVelocity.y;
                this.eulerAngle.z = delta * this.angularVelocity.z;

                let rotateVelocity: egret3d.math.Quaternion = egret3d.math.Pool.new_quaternion();

                //替代掉这个函数
                egret3d.math.quatFromEulerAngles(this.eulerAngle.x, this.eulerAngle.y, this.eulerAngle.z, rotateVelocity);

                //一切ok
                //egret3d.math.quatFromAxisAngle(new egret3d.math.vector3(0, 1, 0), this.timer, rotateVelocity);

                egret3d.math.quatMultiply(rotateVelocity, cubeTransform.localRotate, cubeTransform.localRotate);
                cubeTransform.markDirty();
            }
        }
    }

}