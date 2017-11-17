@egret3d.reflect.userCode
class test_effect implements egret3d.framework.IUserCode
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    camera: egret3d.framework.Camera;
    timer: number = 0;
    taskmgr: egret3d.framework.TaskMgr = new egret3d.framework.TaskMgr();
    effect: egret3d.framework.EffectSystem;
    label: HTMLLabelElement;

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
        //添加一个盒子
        {
            //添加一个盒子
            {
                let cube = new egret3d.framework.Transform();
                cube.name = "cube";
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
            }
        }
        state.finish = true;
    }

    private dragon: egret3d.framework.Transform;
    private loadModel(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate)
    {
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", (s) =>
        {
            if (s.isfinish)
            {
                this.app.getAssetMgr().loadCompressBundle("compressRes/prefabs/fx_shuijing_cj/fx_shuijing_cj.assetbundle.json",                     (_s) =>
                    {
                        if (_s.isfinish)
                        {
                            let _prefab: egret3d.framework.Prefab = this.app.getAssetMgr().getAssetByName("fx_shuijing_cj.prefab.json") as egret3d.framework.Prefab;
                            this.dragon = _prefab.getCloneTrans();
                            this.scene.addChild(this.dragon);
                            state.finish = true;
                        }
                    });
            }
        });

    }
    onStart(app: egret3d.framework.Application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        // this.taskmgr.addTaskCall(this.addcube.bind(this));
        // this.taskmgr.addTaskCall(this.loadModel.bind(this));
        this.taskmgr.addTaskCall(this.loadEffect.bind(this));

    }


    private loadEffect(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) 
    {
        // this._loadEffect("res/particleEffect/hjxnew/hjxnew.assetbundle.json", "hjxnew");//
        // this._loadEffect("res/particleEffect/particle/particle.assetbundle.json", "particle.effect.json");//
        //fx_0005_sword_sword
        let names: string[] = ["fx_ss_female@attack_04-", "fx_ss_female@attack_03", "fx_ss_female@attack_02", "fx_0_zs_male@attack_02", "fx_shuijing_cj", "fx_fs_female@attack_02", "fx_0005_sword_sword", "fx_0005_sword_sword", "fx_0_zs_male@attack_02", "fx_fs_female@attack_02"];
        let name = "fx_ss_female@attack_04-";
        //通过加载assetbundle的方式加载特效  这里使用的是加载压缩的bundle
        this.app.getAssetMgr().loadCompressBundle("compressRes/particleEffect/" + name + "/" + name + ".assetbundle.json", (_state) =>
        {
            //特效资源包括1.特效配置  2.相关依赖图片 mesh资源
            //加载完成后将特效配置提交给特效组件即可
            if (_state.isfinish)
            {
                this.tr = new egret3d.framework.Transform();
                //添加一个特效组件
                this.effect = this.tr.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as egret3d.framework.EffectSystem;
                //获取加载的特效配置文件
                var text: egret3d.framework.Textasset = this.app.getAssetMgr().getAssetByName(name + ".effect.json") as egret3d.framework.Textasset;
                //把特效配置提交给特效组件解析 释放
                this.effect.setJsonData(text);
                this.scene.addChild(this.tr);
                this.tr.markDirty();
                state.finish = true;
                this.effectloaded = true;
            }
        }
        );

    }

    private addcam(laststate: egret3d.framework.Taskstate, state: egret3d.framework.Taskstate) 
    {
        //添加一个摄像机
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
        this.camera.near = 0.01;
        this.camera.far = 200;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new egret3d.math.Color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new egret3d.math.Vector3(0, 0, 20);
        objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        state.finish = true;
    }

    tr: egret3d.framework.Transform;
    ttr: egret3d.framework.Transform;
    eff: egret3d.framework.EffectSystem;
    beclone = false;
    effectloaded = false;
    bestop = false;
    bereplay = false;
    onUpdate(delta: number)
    {
        this.taskmgr.move(delta);
        // if(this.effectloaded)
        // {
        //     this.timer += delta;
        //     if(this.timer > 1 && !this.beclone)
        //     {
        //         this.beclone = true;
        //         this.ttr = this.tr.clone(); 
        //         this.eff = this.ttr.gameObject.getComponent("effectSystem") as egret3d.framework.effectSystem;
        //         this.scene.addChild(this.ttr);
        //     }
        //     if(this.timer > 3 && !this.bestop)
        //     {
        //         this.bestop = true;
        //         this.eff.stop();
        //     }

        //     if(this.timer > 6 && !this.bereplay)
        //     {
        //         this.bereplay = true;
        //         this.eff.play();
        //     }
        // }
    }
    isClosed():boolean
    {
        return false;
    }
}