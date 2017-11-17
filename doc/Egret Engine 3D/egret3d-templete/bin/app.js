var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Main = (function () {
    function Main() {
        this.timer = 0;
    }
    Main.prototype.onStart = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        var shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, function (state) {
            if (state.isfinish) {
                var baihuAssetUrl = "resources/prefabs/baihu/baihu.assetbundle.json";
                _this.app.getAssetMgr().load(baihuAssetUrl, egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var prefab = _this.app.getAssetMgr().getAssetByName("baihu.prefab.json");
                        _this.baihu = prefab.getCloneTrans();
                        _this.scene.addChild(_this.baihu);
                        _this.baihu.markDirty();
                    }
                });
            }
        });
        var objCam = new egret3d.framework.Transform();
        objCam.name = "mainCamera";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new egret3d.math.Color(0.0, 0.0, 0.0, 1.0);
        objCam.localTranslate = new egret3d.math.Vector3(0, 0, -30);
        objCam.markDirty();
    };
    Main.prototype.onUpdate = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 2.25, -z2 * 5);
        if (this.baihu) {
            objCam.lookat(this.baihu);
            objCam.markDirty();
        }
    };
    Main.prototype.isClosed = function () {
        return false;
    };
    Main = __decorate([
        egret3d.reflect.userCode
    ], Main);
    return Main;
}());
//# sourceMappingURL=app.js.map