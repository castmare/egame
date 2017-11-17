/// <reference path="../lib/egret3d.d.ts" />

//需加上这个反射标记，场景才能通过名字找到这个类，并自动创建他
@egret3d.reflect.userCode
class Mesh implements egret3d.framework.IUserCode
{
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;

    private camera: egret3d.framework.Camera;
    
    private baihu: egret3d.framework.Transform;
    
    onStart(app: egret3d.framework.Application) {
        this.app = app;

        this.scene = this.app.getScene();

        // 加载shader
        let shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, (state) => {
            if (state.isfinish) {
                // 加载并显示模型
                let baihuAssetUrl = "resources/prefabs/baihu/baihu.assetbundle.json";
                this.app.getAssetMgr().load(baihuAssetUrl, egret3d.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        let prefab: egret3d.framework.Prefab = this.app.getAssetMgr().getAssetByName("baihu.prefab.json") as egret3d.framework.Prefab;
                        this.baihu = prefab.getCloneTrans();
                        this.scene.addChild(this.baihu);
                        this.baihu.markDirty();
                    }
                });
            }
        });

        //添加一个摄像机
        var objCam = new egret3d.framework.Transform();
        objCam.name = "mainCamera";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera") as egret3d.framework.Camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new egret3d.math.Color(0.0, 0.0, 0.0, 1.0);
        objCam.localTranslate = new egret3d.math.Vector3(5, 2.25, 0);
        objCam.markDirty();//标记为需要刷新
    }

    private timer: number = 0;
    onUpdate(delta: number) {
        this.timer += delta;
        var _sin = Math.sin(this.timer * 0.1);
        var _cos = -Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate.x = _sin * 5;
        objCam.localTranslate.z = _cos * 5;
        // 摄像机对准目标
        if (this.baihu) {
            objCam.lookat(this.baihu);
            objCam.markDirty();//标记为需要刷新
        }
    }

    isClosed(): boolean {
        return false;
    }
}
