namespace t
{

    export class test_three_leaved_rose_curve implements IState
    {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        camera: egret3d.framework.Camera;
        cube: egret3d.framework.Transform;
        parts: egret3d.framework.Transform;
        timer: number = 0;
        cube2: egret3d.framework.Transform;
        taskmgr: egret3d.framework.TaskMgr = new egret3d.framework.TaskMgr();
        count: number = 0;
        counttimer: number = 0;


        private loadShader(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }

        private loadText(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            this.app.getAssetMgr().load("compressRes/trailtest2_00000.imgdesc.json", egret3d.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            }
            );
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
        aniplayer: egret3d.framework.AniPlayer;
        role: egret3d.framework.Transform;
        private roleLength: number;
        private loadRole(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/prefabs/dragon/dragon.assetbundle.json", (s) => {
                if (s.isfinish) {
                    var _prefab: egret3d.framework.Prefab = this.app.getAssetMgr().getAssetByName("dragon.prefab.json") as egret3d.framework.Prefab;
                    this.role = _prefab.getCloneTrans();
                    this.role.name = "dragon";
                    // this.roleLength = this.role.children.length;
                    this.scene.addChild(this.role);


                    var trailtrans = new egret3d.framework.Transform();
                    trailtrans.localTranslate.y = 0.005;
                    
                    this.role.addChild(trailtrans);               
                    egret3d.math.quatFromAxisAngle(egret3d.math.Pool.vector3_forward, 90, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("TrailRender") as egret3d.framework.TrailRender;
                    //trailrender.color=new egret3d.math.color(1.0,0,0,1.0);
                    trailrender.setspeed(0.35);
                    trailrender.setWidth(0.5);
                    var mat = new egret3d.framework.Material();
                    let shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json") as egret3d.framework.Shader;
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json") as egret3d.framework.Texture;
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex)

                    trailrender.material = mat;
                    // this.aniplayer = this.role.gameObject.getComponent("aniplayer") as egret3d.framework.aniplayer;
                    state.finish = true;
                }
            });
        }

        private addcam(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {

            //添加一个摄像机
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
            this.camera.near = 0.01;
            this.camera.far = 1000;
            objCam.localTranslate = new egret3d.math.Vector3(0, 10, 10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新

            state.finish = true;

        }

        private addcube(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
        {
            //添加一个盒子
            {
                //添加一个盒子
                {
                    let cube = new egret3d.framework.Transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = 0.5;                    
                    cube.localScale.z =2;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null)
                    {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }
                    this.cube = cube;

                    var trailtrans = new egret3d.framework.Transform();
                    trailtrans.localTranslate.z = -0.5;
                    
                    this.cube.addChild(trailtrans);               
                    egret3d.math.quatFromAxisAngle(egret3d.math.Pool.vector3_forward, 90, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("TrailRender") as egret3d.framework.TrailRender;
                    //trailrender.color=new egret3d.math.color(1.0,0,0,1.0);
                    trailrender.setspeed(0.25);
                    trailrender.setWidth(0.25);
                    var mat = new egret3d.framework.Material();
                    let shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json") as egret3d.framework.Shader;
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json") as egret3d.framework.Texture;
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex)

                    trailrender.material = mat;
                }
                {
                    let ref_cube = new egret3d.framework.Transform();
                    ref_cube.name = "ref_cube";
                    ref_cube.localScale.x = ref_cube.localScale.y = ref_cube.localScale.z = 1;
                   // ref_cube.localTranslate.x = 2;
                    this.scene.addChild(ref_cube);
                    var mesh = ref_cube.gameObject.addComponent("MeshFilter") as egret3d.framework.MeshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = ref_cube.gameObject.addComponent("MeshRenderer") as egret3d.framework.MeshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("shader/def");
                    if (sh != null)
                    {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as egret3d.framework.Texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }



                    this.cube2 = ref_cube;


                }
            }
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
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            // this.taskmgr.addTaskCall(this.addcube.bind(this))
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        }

        private angularVelocity: egret3d.math.Vector3 = new egret3d.math.Vector3(10, 0, 0);
        private eulerAngle = egret3d.math.Pool.new_vector3();

        private  zeroPoint=new egret3d.math.Vector3(0,0,0);
        update(delta: number)
        {
            this.taskmgr.move(delta);

            this.timer += delta;

            if(this.role!=null)
            {
                let a = 5;
                {

                    let theta = this.timer *0.5;
                    this.role.localTranslate.x = a * Math.cos(3 * theta) * Math.cos(theta);
                    this.role.localTranslate.z = a * Math.cos(3 * theta) * Math.sin(theta);
                }
                {
                    let deltaTheta = this.timer * 0.5 + 0.001;
                    let targetPoint = egret3d.math.Pool.new_vector3();
                    targetPoint.x  = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                    targetPoint.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                    this.role.lookatPoint(targetPoint);
                    egret3d.math.Pool.delete_vector3(targetPoint);

                    let q = egret3d.math.Pool.new_quaternion();
                    egret3d.math.quatFromEulerAngles(-90,0,0,q);
                    egret3d.math.quatMultiply(this.role.localRotate,q,this.role.localRotate);
                    egret3d.math.Pool.delete_quaternion(q);
                }


                // {
                //     let deltaTheta = this.timer*0.5 + 0.001;
                //     this.cube.localTranslate.x = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                //     this.cube.localTranslate.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                //     this.role.lookat(this.cube);
                // }
                // // egret3d.math.quatFromEulerAngles(0,theta * 3,0,this.cube.localRotate);
                // // this.cube.lookatPoint(this.zeroPoint);
                // this.role.markDirty();
                this.role.markDirty();
                this.role.updateWorldTran();
            }

            if (this.cube != null)
            {
                // this.cube.localTranslate.x=Math.cos(this.timer)*3.0;
                // this.cube.localTranslate.z=Math.sin(this.timer)*3.0;
                let a = 5;
                {

                    let theta = this.timer *0.5;
                    this.cube.localTranslate.x = a * Math.cos(3 * theta) * Math.cos(theta);
                    this.cube.localTranslate.z = a * Math.cos(3 * theta) * Math.sin(theta);
                }
                {
                    let deltaTheta = this.timer * 0.5 + 0.001;
                    let targetPoint = egret3d.math.Pool.new_vector3();
                    targetPoint.x  = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                    targetPoint.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                    this.cube.lookatPoint(targetPoint);
                    egret3d.math.Pool.delete_vector3(targetPoint);
                }


                // {
                //     let deltaTheta = this.timer*0.5 + 0.001;
                //     this.cube.localTranslate.x = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                //     this.cube.localTranslate.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                //     this.role.lookat(this.cube);
                // }
                // // egret3d.math.quatFromEulerAngles(0,theta * 3,0,this.cube.localRotate);
                // // this.cube.lookatPoint(this.zeroPoint);
                // this.role.markDirty();
                this.cube.markDirty();
                this.cube.updateWorldTran();
            }
            if(this.cube2)
            {
                //this.cube2.lookat(this.cube);
                this.cube2.lookatPoint(this.cube.getWorldTranslate());
                this.cube2.markDirty();
            }
        }
    }
}