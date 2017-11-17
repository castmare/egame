var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Cube = (function () {
    function Cube() {
        this.timer = 0;
    }
    Cube.prototype.onStart = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        var shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, function (state) {
            if (state.isfinish) {
                var cube = _this.cube = new egret3d.framework.Transform();
                cube.name = "cube";
                var mesh = cube.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_MESHFILTER);
                var smesh = _this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = smesh;
                var renderer = cube.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_MESHRENDER);
                cube.localEulerAngles = new egret3d.math.Vector3(45, 45, 0);
                cube.markDirty();
                _this.scene.addChild(cube);
            }
        });
        var objCam = new egret3d.framework.Transform();
        objCam.name = "mainCamera";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new egret3d.math.Color(0.0, 0.0, 0.0, 1.0);
        objCam.localTranslate = new egret3d.math.Vector3(5, 2.25, 0);
        objCam.markDirty();
    };
    Cube.prototype.onUpdate = function (delta) {
        this.timer += delta;
        var _sin = Math.sin(this.timer * 0.1);
        var _cos = -Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate.x = _sin * 5;
        objCam.localTranslate.z = _cos * 5;
        if (this.cube) {
            objCam.lookat(this.cube);
            objCam.markDirty();
        }
    };
    Cube.prototype.isClosed = function () {
        return false;
    };
    Cube = __decorate([
        egret3d.reflect.userCode
    ], Cube);
    return Cube;
}());
var CubeWithTexture = (function () {
    function CubeWithTexture() {
        this.timer = 0;
    }
    CubeWithTexture.prototype.onStart = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        var shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, function (state) {
            if (state.isfinish) {
                var cube = _this.cube = new egret3d.framework.Transform();
                cube.name = "cube";
                var mesh = cube.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_MESHFILTER);
                var smesh = _this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = smesh;
                var renderer = cube.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_MESHRENDER);
                cube.localEulerAngles = new egret3d.math.Vector3(45, 45, 0);
                cube.markDirty();
                _this.scene.addChild(cube);
                _this.app.getAssetMgr().load("resources/logo.png", egret3d.framework.AssetTypeEnum.Auto, function (s1) {
                    var texture = _this.app.getAssetMgr().getAssetByName("logo.png");
                    var mat = new egret3d.framework.Material();
                    mat.setShader(_this.app.getAssetMgr().getShader("diffuse.shader.json"));
                    mat.setTexture("_MainTex", texture);
                    renderer.materials = [];
                    renderer.materials[0] = mat;
                    cube.markDirty();
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
        objCam.localTranslate = new egret3d.math.Vector3(0, 2.25, 5);
        objCam.markDirty();
    };
    CubeWithTexture.prototype.onUpdate = function (delta) {
        this.timer += delta;
        var _sin = Math.sin(this.timer * 0.1);
        var _cos = -Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate.x = _sin * 5;
        objCam.localTranslate.z = _cos * 5;
        if (this.cube) {
            objCam.lookat(this.cube);
            objCam.markDirty();
        }
    };
    CubeWithTexture.prototype.isClosed = function () {
        return false;
    };
    CubeWithTexture = __decorate([
        egret3d.reflect.userCode
    ], CubeWithTexture);
    return CubeWithTexture;
}());
var LoadScene = (function () {
    function LoadScene() {
        this.timer = 0;
        this.lookAtPoint = new egret3d.math.Vector3(0, 5, 0);
    }
    LoadScene.prototype.onStart = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        var name = "test";
        var shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, function (state) {
            if (state.isfinish) {
                var assetUrl = "resources/scenes/" + name + "/" + name + ".assetbundle.json";
                _this.app.getAssetMgr().load(assetUrl, egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.app.getAssetMgr().loadScene(name + ".scene.json", function () {
                            console.log("load over");
                        });
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
        objCam.localTranslate = new egret3d.math.Vector3(10, 10, 0);
        objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
        objCam.markDirty();
    };
    LoadScene.prototype.onUpdate = function (delta) {
        this.timer += delta;
        var _sin = Math.sin(this.timer * 0.1);
        var _cos = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate.x = _sin * 10;
        objCam.localTranslate.z = _cos * 10;
        objCam.lookatPoint(this.lookAtPoint);
        objCam.markDirty();
    };
    LoadScene.prototype.isClosed = function () {
        return false;
    };
    LoadScene = __decorate([
        egret3d.reflect.userCode
    ], LoadScene);
    return LoadScene;
}());
var Mesh = (function () {
    function Mesh() {
        this.timer = 0;
    }
    Mesh.prototype.onStart = function (app) {
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
        objCam.localTranslate = new egret3d.math.Vector3(5, 2.25, 0);
        objCam.markDirty();
    };
    Mesh.prototype.onUpdate = function (delta) {
        this.timer += delta;
        var _sin = Math.sin(this.timer * 0.1);
        var _cos = -Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate.x = _sin * 5;
        objCam.localTranslate.z = _cos * 5;
        if (this.baihu) {
            objCam.lookat(this.baihu);
            objCam.markDirty();
        }
    };
    Mesh.prototype.isClosed = function () {
        return false;
    };
    Mesh = __decorate([
        egret3d.reflect.userCode
    ], Mesh);
    return Mesh;
}());
var ParticleEffect = (function () {
    function ParticleEffect() {
        this.timer = 0;
    }
    ParticleEffect.prototype.onStart = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        var shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, function (state) {
            if (state.isfinish) {
                var baihuAssetUrl = "resources/effects/fx_ss_female@attack_04-/fx_ss_female@attack_04-.assetbundle.json";
                _this.app.getAssetMgr().load(baihuAssetUrl, egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.effectTransform = new egret3d.framework.Transform();
                        var effect = _this.effectTransform.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM);
                        var text = _this.app.getAssetMgr().getAssetByName("fx_ss_female@attack_04-.effect.json");
                        effect.setJsonData(text);
                        _this.scene.addChild(_this.effectTransform);
                        _this.effectTransform.markDirty();
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
        objCam.localTranslate = new egret3d.math.Vector3(5, 5, 0);
        objCam.markDirty();
    };
    ParticleEffect.prototype.onUpdate = function (delta) {
        this.timer += delta;
        var _sin = Math.sin(this.timer * 0.1);
        var _cos = -Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate.x = _sin * 5;
        objCam.localTranslate.z = _cos * 5;
        if (this.effectTransform) {
            objCam.lookat(this.effectTransform);
            objCam.markDirty();
        }
    };
    ParticleEffect.prototype.isClosed = function () {
        return false;
    };
    ParticleEffect = __decorate([
        egret3d.reflect.userCode
    ], ParticleEffect);
    return ParticleEffect;
}());
var PickTest = (function () {
    function PickTest() {
        this.timer = 0;
        this.pointDown = false;
        this.movetarget = new egret3d.math.Vector3();
    }
    PickTest.prototype.createGeo = function (name, type) {
        var cube = new egret3d.framework.Transform();
        cube.name = name;
        var smesh = this.app.getAssetMgr().getDefaultMesh(type);
        var mesh = cube.gameObject.addComponent("MeshFilter");
        mesh.mesh = (smesh);
        var renderer = cube.gameObject.addComponent("MeshRenderer");
        return cube;
    };
    PickTest.prototype.onStart = function (app) {
        var _this = this;
        this.app = app;
        this.inputMgr = this.app.getInputMgr();
        this.scene = this.app.getScene();
        var shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, function (state) {
            if (state.isfinish) {
                var floor = _this.floor = _this.createGeo("floor", "cube");
                floor.gameObject.addComponent("BoxCollider");
                floor.markDirty();
                floor.localScale.x = 10;
                floor.localScale.y = 0.1;
                floor.localScale.z = 10;
                _this.scene.addChild(floor);
                var flag = _this.flag = _this.createGeo("floor", "pyramid");
                flag.markDirty();
                _this.scene.addChild(flag);
            }
        });
        var objCam = new egret3d.framework.Transform();
        objCam.name = "mainCamera";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new egret3d.math.Color(0.0, 0.0, 0.0, 1.0);
        objCam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
        objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
        objCam.markDirty();
    };
    PickTest.prototype.onUpdate = function (delta) {
        if (!this.flag || !this.floor)
            return;
        if (!this.pointDown && this.inputMgr.point.touch) {
            var ray = this.camera.creatRayByScreen(new egret3d.math.Vector2(this.inputMgr.point.x, this.inputMgr.point.y), this.app);
            var pickinfo = this.scene.pick(ray);
            if (pickinfo != null) {
                this.movetarget = pickinfo.hitposition;
                this.timer = 0;
            }
        }
        this.pointDown = this.inputMgr.point.touch;
        this.timer += delta;
        this.flag.localTranslate.x = this.movetarget.x;
        this.flag.localTranslate.y = this.movetarget.y;
        this.flag.localTranslate.z = this.movetarget.z;
        this.flag.markDirty();
    };
    PickTest.prototype.isClosed = function () {
        return false;
    };
    PickTest = __decorate([
        egret3d.reflect.userCode
    ], PickTest);
    return PickTest;
}());
var SkinnedMesh = (function () {
    function SkinnedMesh() {
        this.timer = 0;
        this.lookAtPoint = new egret3d.math.Vector3(0, 2.5, 0);
    }
    SkinnedMesh.prototype.onStart = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        var shaderAssetUrl = "resources/shader/shader.assetbundle.json";
        this.app.getAssetMgr().loadCompressBundle(shaderAssetUrl, function (state) {
            if (state.isfinish) {
                var baihuAssetUrl = "resources/prefabs/elong/elong.assetbundle.json";
                _this.app.getAssetMgr().load(baihuAssetUrl, egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var prefab = _this.app.getAssetMgr().getAssetByName("elong.prefab.json");
                        _this.elong = prefab.getCloneTrans();
                        _this.elong.localEulerAngles = new egret3d.math.Vector3(0, 150, 0);
                        _this.elong.localScale = new egret3d.math.Vector3(0.5, 0.5, 0.5);
                        _this.scene.addChild(_this.elong);
                        _this.elong.markDirty();
                        var ap = _this.elong.gameObject.getComponent(egret3d.framework.StringUtil.COMPONENT_ANIPLAYER);
                        ap.playByIndex(0);
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
        objCam.localTranslate = new egret3d.math.Vector3(5, 1.5, 0);
        objCam.markDirty();
    };
    SkinnedMesh.prototype.onUpdate = function (delta) {
        this.timer += delta;
        var _sin = Math.sin(this.timer * 0.1);
        var _cos = -Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate.x = _sin * 5;
        objCam.localTranslate.z = _cos * 5;
        objCam.lookatPoint(this.lookAtPoint);
        objCam.markDirty();
    };
    SkinnedMesh.prototype.isClosed = function () {
        return false;
    };
    SkinnedMesh = __decorate([
        egret3d.reflect.userCode
    ], SkinnedMesh);
    return SkinnedMesh;
}());
//# sourceMappingURL=app.js.map