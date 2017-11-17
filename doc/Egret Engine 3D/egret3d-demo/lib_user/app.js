var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var t;
(function (t) {
    var light_d1 = (function () {
        function light_d1() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
        }
        light_d1.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        light_d1.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("compressRes/rock256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("compressRes/rock_n256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        light_d1.prototype.addcube = function (laststate, state) {
            var _this = this;
            var sphereString = "res/prefabs/sphere/resources/Sphere.mesh.bin";
            this.app.getAssetMgr().load(sphereString, egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    for (var i = -4; i < 5; i++) {
                        for (var j = -4; j < 5; j++) {
                            var baihu = new egret3d.framework.Transform();
                            _this.scene.addChild(baihu);
                            baihu.localScale = new egret3d.math.Vector3(0.5, 0.5, 0.5);
                            baihu.localTranslate.x = i;
                            baihu.localTranslate.y = j;
                            baihu.markDirty();
                            var smesh1 = _this.app.getAssetMgr().getAssetByName("Sphere.mesh.bin");
                            var mesh1 = baihu.gameObject.addComponent("MeshFilter");
                            mesh1.mesh = (smesh1);
                            var renderer = baihu.gameObject.addComponent("MeshRenderer");
                            baihu.markDirty();
                            var sh = _this.app.getAssetMgr().getShader("light3.shader.json");
                            renderer.materials = [];
                            renderer.materials.push(new egret3d.framework.Material());
                            renderer.materials[0].setShader(sh);
                            var texture = _this.app.getAssetMgr().getAssetByName("rock256.png");
                            renderer.materials[0].setTexture("_MainTex", texture);
                            var tex2 = _this.app.getAssetMgr().getAssetByName("rock_n256.png");
                            renderer.materials[0].setTexture("_NormalTex", tex2);
                        }
                    }
                    state.finish = true;
                }
            });
        };
        light_d1.prototype.addcamandlight = function (laststate, state) {
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();
            var lighttran = new egret3d.framework.Transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("Light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new egret3d.framework.Transform();
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer");
                var cuber = renderer;
            }
            state.finish = true;
        };
        light_d1.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == egret3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = egret3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == egret3d.framework.LightTypeEnum.Point) {
                        _this.light.type = egret3d.framework.LightTypeEnum.Spot;
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = egret3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        light_d1.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 4, -z2 * 5);
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                objCam.markDirty();
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new egret3d.math.Vector3(x * 3, 3, z * 3);
                objlight.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                objlight.markDirty();
            }
        };
        return light_d1;
    }());
    t.light_d1 = light_d1;
})(t || (t = {}));
var main = (function () {
    function main() {
        this.x = 0;
        this.y = 100;
        this.btns = [];
    }
    main.prototype.onStart = function (app) {
        console.log("i am here.");
        this.app = app;
        this.addBtn("test_ui", function () { return new t.test_ui(); });
        this.addBtn("test_load", function () { return new test_load(); });
        this.addBtn("test_loadprefab", function () { return new test_loadprefab(); });
        this.addBtn("test_anim", function () { return new test_anim(); });
        this.addBtn("test_pick", function () { return new test_pick(); });
        this.addBtn("test_loadScene", function () { return new test_loadScene(); });
        this.addBtn("test_multipleplayer_anim", function () { return new test_multipleplayer_anim(); });
        this.addBtn("test_uvroll", function () { return new t.test_uvroll(); });
        this.addBtn("test_light1", function () { return new t.test_light1(); });
        this.addBtn("test_light_d1", function () { return new t.light_d1(); });
        this.addBtn("test_normalmap", function () { return new t.Test_NormalMap(); });
        this.addBtn("test_posteffect", function () { return new t.test_posteffect(); });
        this.addBtn("test_rendertexture", function () { return new t.test_rendertexture(); });
        this.addBtn("test_sound", function () { return new t.test_sound(); });
        this.addBtn("test_blend", function () { return new t.test_blend(); });
    };
    main.prototype.addBtn = function (text, act) {
        var _this = this;
        var btn = document.createElement("button");
        this.btns.push(btn);
        btn.textContent = text;
        btn.onclick = function () {
            _this.clearBtn();
            _this.state = act();
            _this.state.start(_this.app);
        };
        btn.style.top = this.y + "px";
        btn.style.left = this.x + "px";
        if (this.y + 24 > 400) {
            this.y = 100;
            this.x += 200;
        }
        else {
            this.y += 24;
        }
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);
    };
    main.prototype.clearBtn = function () {
        for (var i = 0; i < this.btns.length; i++) {
            this.app.container.removeChild(this.btns[i]);
        }
        this.btns.length = 0;
    };
    main.prototype.onUpdate = function (delta) {
        if (this.state != null)
            this.state.update(delta);
    };
    main.prototype.isClosed = function () {
        return false;
    };
    main = __decorate([
        egret3d.reflect.userCode
    ], main);
    return main;
}());
var t;
(function (t_1) {
    var test_blend = (function () {
        function test_blend() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
            this.count = 0;
            this.counttimer = 0;
            this.angularVelocity = new egret3d.math.Vector3(10, 0, 0);
            this.eulerAngle = egret3d.math.Pool.new_vector3();
        }
        test_blend.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_blend.prototype.loadText = function (laststate, state) {
            var t = 2;
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    t--;
                    if (t == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("compressRes/trailtest2.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    t--;
                    if (t == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
        };
        test_blend.prototype.addcam = function (laststate, state) {
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, 10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_blend.prototype.addplane = function (laststate, state) {
            {
                {
                    var background = new egret3d.framework.Transform();
                    background.name = "background";
                    background.localScale.x = background.localScale.y = 5;
                    background.localTranslate.z = -1;
                    this.scene.addChild(background);
                    background.markDirty();
                    background.updateWorldTran();
                    var mesh = background.gameObject.addComponent("MeshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("quad");
                    mesh.mesh = (smesh);
                    var renderer = background.gameObject.addComponent("MeshRenderer");
                    var meshRender = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse_bothside.shader.json");
                    if (sh != null) {
                        meshRender.materials = [];
                        meshRender.materials.push(new egret3d.framework.Material());
                        meshRender.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        meshRender.materials[0].setTexture("_MainTex", texture);
                    }
                    this.background = background;
                }
            }
            {
                {
                    var foreground = new egret3d.framework.Transform();
                    foreground.name = "foreground ";
                    foreground.localScale.x = foreground.localScale.y = 5;
                    this.scene.addChild(foreground);
                    foreground.markDirty();
                    foreground.updateWorldTran();
                    var mesh = foreground.gameObject.addComponent("MeshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("quad");
                    mesh.mesh = (smesh);
                    var renderer = foreground.gameObject.addComponent("MeshRenderer");
                    var meshRender = renderer;
                    var sh = this.app.getAssetMgr().getShader("particles_additive.shader.json");
                    if (sh != null) {
                        meshRender.materials = [];
                        meshRender.materials.push(new egret3d.framework.Material());
                        meshRender.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("trailtest2.png");
                        meshRender.materials[0].setTexture("_MainTex", texture);
                    }
                    this.foreground = foreground;
                }
            }
            state.finish = true;
        };
        test_blend.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.addplane.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        };
        test_blend.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.background != undefined) {
                var x = Math.cos(this.timer * 1);
                var y = Math.sin(this.timer * 1);
                this.background.localTranslate.x = 1.5 * x;
                this.background.localTranslate.y = 1.5 * y;
                this.background.markDirty();
            }
        };
        return test_blend;
    }());
    t_1.test_blend = test_blend;
})(t || (t = {}));
var t;
(function (t) {
    var test_rendertexture = (function () {
        function test_rendertexture() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
        }
        test_rendertexture.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                state.finish = true;
            });
        };
        test_rendertexture.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_rendertexture.prototype.initscene = function (laststate, state) {
            {
                var objCam = new egret3d.framework.Transform();
                objCam.name = "cam_show";
                this.scene.addChild(objCam);
                this.showcamera = objCam.gameObject.addComponent("Camera");
                this.showcamera.order = 0;
                this.showcamera.near = 0.01;
                this.showcamera.far = 30;
                this.showcamera.fov = Math.PI * 0.3;
                objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                objCam.markDirty();
            }
            {
                var o2ds = new egret3d.framework.Overlay2D();
                this.showcamera.addOverLay(o2ds);
                {
                    var t2d = new egret3d.framework.Transform2D();
                    t2d.name = "ceng1";
                    t2d.localTranslate.x = 200;
                    t2d.localTranslate.y = 200;
                    t2d.width = 300;
                    t2d.height = 300;
                    t2d.pivot.x = 0;
                    t2d.pivot.y = 0;
                    t2d.markDirty();
                    var rawiamge = t2d.addComponent("RawImage2D");
                    rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("zg256.png");
                    o2ds.addChild(t2d);
                }
                {
                    var cube1 = new egret3d.framework.Transform();
                    cube1.name = "cube1";
                    this.scene.addChild(cube1);
                    cube1.localScale.x = 8;
                    cube1.localScale.y = 1;
                    cube1.localScale.z = 1;
                    cube1.markDirty();
                    var mesh1 = cube1.gameObject.addComponent("MeshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh1.mesh = (smesh);
                    var renderer = cube1.gameObject.addComponent("MeshRenderer");
                }
            }
            state.finish = true;
        };
        test_rendertexture.prototype.add3dmodelbeforeUi = function (laststate, state) {
            {
                var modelcam = new egret3d.framework.Transform();
                modelcam.name = "modelcam";
                this.scene.addChild(modelcam);
                this.wath_camer = modelcam.gameObject.addComponent("Camera");
                this.wath_camer.order = 1;
                this.wath_camer.clearOption_Color = false;
                this.wath_camer.clearOption_Depth = true;
                this.wath_camer.CullingMask = egret3d.framework.CullingMask.modelbeforeui | egret3d.framework.CullingMask.ui;
                modelcam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
                modelcam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                modelcam.markDirty();
            }
            {
                var cube = new egret3d.framework.Transform();
                cube.name = "cube";
                this.scene.addChild(cube);
                cube.localScale.x = 3;
                cube.localScale.y = 3;
                cube.localScale.z = 3;
                cube.markDirty();
                var mesh = cube.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer");
                renderer.renderLayer = egret3d.framework.CullingMask.modelbeforeui;
                var cuber = renderer;
                this.sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                if (this.sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(this.sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
                this.target = cube;
                {
                    var o2d1 = new egret3d.framework.Overlay2D();
                    this.wath_camer.addOverLay(o2d1);
                    {
                        var t2d = new egret3d.framework.Transform2D();
                        t2d.name = "ceng2";
                        t2d.localTranslate.x = 300;
                        t2d.localTranslate.y = 100;
                        t2d.width = 150;
                        t2d.height = 150;
                        t2d.pivot.x = 0;
                        t2d.pivot.y = 0;
                        t2d.markDirty();
                        var rawiamge = t2d.addComponent("RawImage2D");
                        rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("zg256.png");
                        o2d1.addChild(t2d);
                    }
                }
            }
            state.finish = true;
        };
        test_rendertexture.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            this.taskmgr.addTaskCall(this.add3dmodelbeforeUi.bind(this));
        };
        test_rendertexture.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            if (this.target == undefined)
                return;
            this.timer += delta;
            egret3d.math.quatFromAxisAngle(egret3d.math.Pool.vector3_up, this.timer * 3, this.target.localRotate);
            this.target.markDirty();
        };
        return test_rendertexture;
    }());
    t.test_rendertexture = test_rendertexture;
})(t || (t = {}));
var t;
(function (t) {
    var test_three_leaved_rose_curve = (function () {
        function test_three_leaved_rose_curve() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
            this.count = 0;
            this.counttimer = 0;
            this.angularVelocity = new egret3d.math.Vector3(10, 0, 0);
            this.eulerAngle = egret3d.math.Pool.new_vector3();
            this.zeroPoint = new egret3d.math.Vector3(0, 0, 0);
        }
        test_three_leaved_rose_curve.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_three_leaved_rose_curve.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("compressRes/trailtest2_00000.imgdesc.json", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_three_leaved_rose_curve.prototype.loadRole = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().loadCompressBundle("compressRes/prefabs/dragon/dragon.assetbundle.json", function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("dragon.prefab.json");
                    _this.role = _prefab.getCloneTrans();
                    _this.role.name = "dragon";
                    _this.scene.addChild(_this.role);
                    var trailtrans = new egret3d.framework.Transform();
                    trailtrans.localTranslate.y = 0.005;
                    _this.role.addChild(trailtrans);
                    egret3d.math.quatFromAxisAngle(egret3d.math.Pool.vector3_forward, 90, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("TrailRender");
                    trailrender.setspeed(0.35);
                    trailrender.setWidth(0.5);
                    var mat = new egret3d.framework.Material();
                    var shader = _this.app.getAssetMgr().getShader("transparent_bothside.shader.json");
                    var tex = _this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json");
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex);
                    trailrender.material = mat;
                    state.finish = true;
                }
            });
        };
        test_three_leaved_rose_curve.prototype.addcam = function (laststate, state) {
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 0.01;
            this.camera.far = 1000;
            objCam.localTranslate = new egret3d.math.Vector3(0, 10, 10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_three_leaved_rose_curve.prototype.addcube = function (laststate, state) {
            {
                {
                    var cube = new egret3d.framework.Transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = 0.5;
                    cube.localScale.z = 2;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("MeshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("MeshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube = cube;
                    var trailtrans = new egret3d.framework.Transform();
                    trailtrans.localTranslate.z = -0.5;
                    this.cube.addChild(trailtrans);
                    egret3d.math.quatFromAxisAngle(egret3d.math.Pool.vector3_forward, 90, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("TrailRender");
                    trailrender.setspeed(0.25);
                    trailrender.setWidth(0.25);
                    var mat = new egret3d.framework.Material();
                    var shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json");
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json");
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex);
                    trailrender.material = mat;
                }
                {
                    var ref_cube = new egret3d.framework.Transform();
                    ref_cube.name = "ref_cube";
                    ref_cube.localScale.x = ref_cube.localScale.y = ref_cube.localScale.z = 1;
                    this.scene.addChild(ref_cube);
                    var mesh = ref_cube.gameObject.addComponent("MeshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = ref_cube.gameObject.addComponent("MeshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("shader/def");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube2 = ref_cube;
                }
            }
            state.finish = true;
        };
        test_three_leaved_rose_curve.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        };
        test_three_leaved_rose_curve.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.role != null) {
                var a = 5;
                {
                    var theta = this.timer * 0.5;
                    this.role.localTranslate.x = a * Math.cos(3 * theta) * Math.cos(theta);
                    this.role.localTranslate.z = a * Math.cos(3 * theta) * Math.sin(theta);
                }
                {
                    var deltaTheta = this.timer * 0.5 + 0.001;
                    var targetPoint = egret3d.math.Pool.new_vector3();
                    targetPoint.x = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                    targetPoint.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                    this.role.lookatPoint(targetPoint);
                    egret3d.math.Pool.delete_vector3(targetPoint);
                    var q = egret3d.math.Pool.new_quaternion();
                    egret3d.math.quatFromEulerAngles(-90, 0, 0, q);
                    egret3d.math.quatMultiply(this.role.localRotate, q, this.role.localRotate);
                    egret3d.math.Pool.delete_quaternion(q);
                }
                this.role.markDirty();
                this.role.updateWorldTran();
            }
            if (this.cube != null) {
                var a = 5;
                {
                    var theta = this.timer * 0.5;
                    this.cube.localTranslate.x = a * Math.cos(3 * theta) * Math.cos(theta);
                    this.cube.localTranslate.z = a * Math.cos(3 * theta) * Math.sin(theta);
                }
                {
                    var deltaTheta = this.timer * 0.5 + 0.001;
                    var targetPoint = egret3d.math.Pool.new_vector3();
                    targetPoint.x = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                    targetPoint.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                    this.cube.lookatPoint(targetPoint);
                    egret3d.math.Pool.delete_vector3(targetPoint);
                }
                this.cube.markDirty();
                this.cube.updateWorldTran();
            }
            if (this.cube2) {
                this.cube2.lookatPoint(this.cube.getWorldTranslate());
                this.cube2.markDirty();
            }
        };
        return test_three_leaved_rose_curve;
    }());
    t.test_three_leaved_rose_curve = test_three_leaved_rose_curve;
})(t || (t = {}));
var test_anim = (function () {
    function test_anim() {
        this.cubes = {};
        this.timer = 0;
    }
    test_anim.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var baihu = new egret3d.framework.Transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;
        this.scene.addChild(baihu);
        {
            var lighttran = new egret3d.framework.Transform();
            this.scene.addChild(lighttran);
            var light = lighttran.gameObject.addComponent("Light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
        }
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/elong/elong.assetbundle.json", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("elong.prefab.json");
                        baihu = _prefab.getCloneTrans();
                        _this.player = baihu;
                        _this.scene.addChild(baihu);
                        baihu.localScale = new egret3d.math.Vector3(0.2, 0.2, 0.2);
                        baihu.localTranslate = new egret3d.math.Vector3(0, 0, 0);
                        objCam.lookat(baihu);
                        objCam.markDirty();
                        var ap = baihu.gameObject.getComponent("AniPlayer");
                        document.onkeydown = function (ev) {
                            if (ev.code == "KeyM") {
                                ap.playCrossByIndex(0, 0.2);
                            }
                            else if (ev.code == "KeyN") {
                                ap.playCrossByIndex(1, 0.2);
                            }
                        };
                        var wingroot = baihu.find("Bip001 Xtra18Nub");
                        var trans = new egret3d.framework.Transform();
                        trans.name = "cube11";
                        var mesh = trans.gameObject.addComponent("MeshFilter");
                        var smesh = _this.app.getAssetMgr().getDefaultMesh("cube");
                        mesh.mesh = smesh;
                        var renderer = trans.gameObject.addComponent("MeshRenderer");
                        wingroot.addChild(trans);
                        trans.localTranslate = new egret3d.math.Vector3(0, 0, 0);
                        renderer.materials = [];
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials[0].setShader(_this.app.getAssetMgr().getShader("shader/def"));
                    }
                });
            }
        });
        this.cube = baihu;
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();
    };
    test_anim.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 1.1);
        var z2 = Math.cos(this.timer * 1.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();
        objCam.updateWorldTran();
    };
    return test_anim;
}());
var test_effect = (function () {
    function test_effect() {
        this.timer = 0;
        this.taskmgr = new egret3d.framework.TaskMgr();
        this.beclone = false;
        this.effectloaded = false;
        this.bestop = false;
        this.bereplay = false;
    }
    test_effect.prototype.loadShader = function (laststate, state) {
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
            if (_state.isfinish) {
                state.finish = true;
            }
        });
    };
    test_effect.prototype.loadText = function (laststate, state) {
        this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
            if (s.isfinish) {
                state.finish = true;
            }
            else {
                state.error = true;
            }
        });
    };
    test_effect.prototype.addcube = function (laststate, state) {
        {
            {
                var cube = new egret3d.framework.Transform();
                cube.name = "cube";
                cube.localTranslate.x = 0;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
        }
        state.finish = true;
    };
    test_effect.prototype.loadModel = function (laststate, state) {
        var _this = this;
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (s) {
            if (s.isfinish) {
                _this.app.getAssetMgr().loadCompressBundle("compressRes/prefabs/fx_shuijing_cj/fx_shuijing_cj.assetbundle.json", function (_s) {
                    if (_s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("fx_shuijing_cj.prefab.json");
                        _this.dragon = _prefab.getCloneTrans();
                        _this.scene.addChild(_this.dragon);
                        state.finish = true;
                    }
                });
            }
        });
    };
    test_effect.prototype.onStart = function (app) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        this.taskmgr.addTaskCall(this.loadEffect.bind(this));
    };
    test_effect.prototype.loadEffect = function (laststate, state) {
        var _this = this;
        var names = ["fx_ss_female@attack_04-", "fx_ss_female@attack_03", "fx_ss_female@attack_02", "fx_0_zs_male@attack_02", "fx_shuijing_cj", "fx_fs_female@attack_02", "fx_0005_sword_sword", "fx_0005_sword_sword", "fx_0_zs_male@attack_02", "fx_fs_female@attack_02"];
        var name = "fx_ss_female@attack_04-";
        this.app.getAssetMgr().loadCompressBundle("compressRes/particleEffect/" + name + "/" + name + ".assetbundle.json", function (_state) {
            if (_state.isfinish) {
                _this.tr = new egret3d.framework.Transform();
                _this.effect = _this.tr.gameObject.addComponent(egret3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM);
                var text = _this.app.getAssetMgr().getAssetByName(name + ".effect.json");
                _this.effect.setJsonData(text);
                _this.scene.addChild(_this.tr);
                _this.tr.markDirty();
                state.finish = true;
                _this.effectloaded = true;
            }
        });
    };
    test_effect.prototype.addcam = function (laststate, state) {
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 200;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new egret3d.math.Color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new egret3d.math.Vector3(0, 0, 20);
        objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
        objCam.markDirty();
        state.finish = true;
    };
    test_effect.prototype.onUpdate = function (delta) {
        this.taskmgr.move(delta);
    };
    test_effect.prototype.isClosed = function () {
        return false;
    };
    test_effect = __decorate([
        egret3d.reflect.userCode
    ], test_effect);
    return test_effect;
}());
var t;
(function (t) {
    var test_light1 = (function () {
        function test_light1() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
        }
        test_light1.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_light1.prototype.loadText = function (laststate, state) {
            this.tex = new egret3d.framework.Texture();
            this.tex.glTexture = new egret3d.render.WriteableTexture2D(this.app.webgl, egret3d.render.TextureFormatEnum.RGBA, 512, 512, true);
            var wt = this.tex.glTexture;
            var da = new Uint8Array(256 * 256 * 4);
            for (var x = 0; x < 256; x++)
                for (var y = 0; y < 256; y++) {
                    var seek = y * 256 * 4 + x * 4;
                    da[seek] = 235;
                    da[seek + 1] = 50;
                    da[seek + 2] = 230;
                    da[seek + 3] = 230;
                }
            wt.updateRect(da, 256, 256, 256, 256);
            var img = new Image();
            img.onload = function (e) {
                state.finish = true;
                wt.updateRectImg(img, 0, 0);
            };
            img.src = "compressRes/zg256.png";
        };
        test_light1.prototype.addcube = function (laststate, state) {
            for (var i = -4; i < 5; i++) {
                for (var j = -4; j < 5; j++) {
                    var cube = new egret3d.framework.Transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                    cube.localTranslate.x = i;
                    cube.localTranslate.z = j;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("MeshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("MeshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);
                        cuber.materials[0].setTexture("_MainTex", this.tex);
                    }
                }
            }
            state.finish = true;
        };
        test_light1.prototype.addcamandlight = function (laststate, state) {
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();
            var lighttran = new egret3d.framework.Transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("Light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new egret3d.framework.Transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
            state.finish = true;
        };
        test_light1.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == egret3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = egret3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == egret3d.framework.LightTypeEnum.Point) {
                        _this.light.type = egret3d.framework.LightTypeEnum.Spot;
                        _this.light.spotAngelCos = Math.cos(0.2 * Math.PI);
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = egret3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        test_light1.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new egret3d.math.Vector3(x2 * 10, 2.25, -z2 * 10);
                objCam.updateWorldTran();
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new egret3d.math.Vector3(x * 5, 3, z * 5);
                objlight.updateWorldTran();
                objlight.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            }
        };
        return test_light1;
    }());
    t.test_light1 = test_light1;
})(t || (t = {}));
var test_loadScene = (function () {
    function test_loadScene() {
        this.timer = 0;
        this.bere = false;
    }
    test_loadScene.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.cube = new egret3d.framework.Transform();
        this.scene.addChild(this.cube);
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (state) {
            if (state.isfinish) {
                var name_1 = "test";
                _this.app.getAssetMgr().load("res/scenes/" + name_1 + "/" + name_1 + ".assetbundle.json", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    console.log(s.curtask + "/" + s.totaltask);
                    if (s.isfinish) {
                        _this.app.getAssetMgr().loadScene(name_1 + ".scene.json", function () {
                            console.log("load over");
                        });
                    }
                });
            }
        });
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        objCam.localTranslate = new egret3d.math.Vector3(-10, 25, -10);
        objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
        objCam.markDirty();
        CameraController.instance().init(this.app, this.camera);
    };
    test_loadScene.prototype.update = function (delta) {
        this.timer += delta;
        CameraController.instance().update(delta);
    };
    test_loadScene.prototype.isClosed = function () {
        return false;
    };
    test_loadScene = __decorate([
        egret3d.reflect.userCode
    ], test_loadScene);
    return test_loadScene;
}());
var test_load = (function () {
    function test_load() {
        this.timer = 0;
    }
    test_load.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var baihu = new egret3d.framework.Transform();
        baihu.name = "baihu";
        egret3d.math.quatFromEulerAngles(-90, 0, 0, baihu.localRotate);
        this.scene.addChild(baihu);
        var lighttran = new egret3d.framework.Transform();
        this.scene.addChild(lighttran);
        var light = lighttran.gameObject.addComponent("Light");
        lighttran.localTranslate.x = 50;
        lighttran.localTranslate.y = 50;
        lighttran.markDirty();
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/baihu/resources/res_baihu_baihu.FBX_baihu.mesh.bin", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var smesh1 = _this.app.getAssetMgr().getAssetByName("res_baihu_baihu.FBX_baihu.mesh.bin");
                        var mesh1 = baihu.gameObject.addComponent("MeshFilter");
                        mesh1.mesh = smesh1.clone();
                        var renderer = baihu.gameObject.addComponent("MeshRenderer");
                        var collider = baihu.gameObject.addComponent("BoxCollider");
                        baihu.markDirty();
                        var sh = _this.app.getAssetMgr().getShader("diffuse.shader.json");
                        renderer.materials = [];
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials.push(new egret3d.framework.Material());
                        renderer.materials[0].setShader(sh);
                        renderer.materials[1].setShader(sh);
                        renderer.materials[2].setShader(sh);
                        renderer.materials[3].setShader(sh);
                        _this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihu.imgdesc.json", egret3d.framework.AssetTypeEnum.Auto, function (s2) {
                            if (s2.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("baihu.imgdesc.json");
                                renderer.materials[0].setTexture("_MainTex", texture);
                            }
                        });
                        _this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuan.png", egret3d.framework.AssetTypeEnum.Auto, function (s2) {
                            if (s2.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("baihuan.png");
                                renderer.materials[1].setTexture("_MainTex", texture);
                            }
                        });
                        _this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuya.png", egret3d.framework.AssetTypeEnum.Auto, function (s2) {
                            if (s2.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("baihuya.png");
                                renderer.materials[2].setTexture("_MainTex", texture);
                            }
                        });
                        _this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihumao.png", egret3d.framework.AssetTypeEnum.Auto, function (s2) {
                            if (s2.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("baihumao.png");
                                renderer.materials[3].setTexture("_MainTex", texture);
                            }
                        });
                    }
                });
            }
        });
        this.cube = baihu;
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();
    };
    test_load.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();
        objCam.updateWorldTran();
    };
    return test_load;
}());
var test_multipleplayer_anim = (function () {
    function test_multipleplayer_anim() {
        this.cubes = {};
        this.infos = {};
        this.timer = 0;
    }
    test_multipleplayer_anim.prototype.init = function () {
        this.infos[53] = { abName: "prefabs/elong/elong.assetbundle.json", prefabName: "elong.prefab.json", materialCount: 1 };
    };
    test_multipleplayer_anim.prototype.start = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        this.init();
        var baihu = new egret3d.framework.Transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;
        this.scene.addChild(baihu);
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (state) {
            if (state.isfinish) {
                var data_1 = _this.infos[53];
                _this.app.getAssetMgr().load("res/" + data_1.abName, egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName(data_1.prefabName);
                        var a = 10;
                        var b = 10;
                        for (var i = -7; i <= 7; i++) {
                            for (var j = -7; j <= 7; j++) {
                                var trans = _prefab.getCloneTrans();
                                _this.scene.addChild(trans);
                                trans.localScale = new egret3d.math.Vector3(1, 1, 1);
                                trans.localTranslate = new egret3d.math.Vector3(i * 5, 0, j * 5);
                                if (i == 0 && j == 0) {
                                    objCam.lookat(trans);
                                }
                                var ap = trans.gameObject.getComponent("AniPlayer");
                                ap.autoplay = true;
                            }
                        }
                        objCam.markDirty();
                    }
                });
            }
        });
        this.cube = baihu;
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 199;
        objCam.localTranslate = new egret3d.math.Vector3(0, 86, 0);
        objCam.markDirty();
    };
    test_multipleplayer_anim.prototype.update = function (delta) {
    };
    return test_multipleplayer_anim;
}());
var t;
(function (t) {
    var Test_NormalMap = (function () {
        function Test_NormalMap() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
        }
        Test_NormalMap.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        Test_NormalMap.prototype.loadText = function (laststate, state) {
            var c = 0;
            c++;
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            c++;
            this.app.getAssetMgr().load("compressRes/map_diffuse.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            c++;
            this.app.getAssetMgr().load("compressRes/map_normal.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        Test_NormalMap.prototype.addnormalcube = function (laststate, state) {
            this.normalCube = new egret3d.framework.Transform();
            this.normalCube.name = "cube";
            this.normalCube.localScale.x = this.normalCube.localScale.y = this.normalCube.localScale.z = 3;
            this.scene.addChild(this.normalCube);
            var mesh = this.normalCube.gameObject.addComponent("MeshFilter");
            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = this.normalCube.gameObject.addComponent("MeshRenderer");
            this.cuber = renderer;
            var sh = this.app.getAssetMgr().getShader("normalmap.shader.json");
            if (sh != null) {
                this.cuber.materials = [];
                this.cuber.materials.push(new egret3d.framework.Material());
                this.cuber.materials[0].setShader(sh);
                var texture = this.app.getAssetMgr().getAssetByName("map_diffuse.png");
                this.cuber.materials[0].setTexture("_MainTex", texture);
                var normalTexture = this.app.getAssetMgr().getAssetByName("map_normal.png");
                this.cuber.materials[0].setTexture("_NormalTex", normalTexture);
            }
            state.finish = true;
        };
        Test_NormalMap.prototype.addcube = function (laststate, state) {
            var cube = new egret3d.framework.Transform();
            cube.name = "cube";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 2;
            cube.localTranslate.x = 3;
            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("MeshFilter");
            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = cube.gameObject.addComponent("MeshRenderer");
            var cuber = renderer;
            var sh = this.app.getAssetMgr().getShader("light1.shader.json");
            if (sh != null) {
                cuber.materials = [];
                cuber.materials.push(new egret3d.framework.Material());
                cuber.materials[0].setShader(sh);
                var texture = this.app.getAssetMgr().getAssetByName("map_diffuse.png");
                cuber.materials[0].setTexture("_MainTex", texture);
            }
            state.finish = true;
        };
        Test_NormalMap.prototype.addcamandlight = function (laststate, state) {
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();
            var lighttran = new egret3d.framework.Transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("Light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new egret3d.framework.Transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
            state.finish = true;
        };
        Test_NormalMap.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == egret3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = egret3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == egret3d.framework.LightTypeEnum.Point) {
                        _this.light.type = egret3d.framework.LightTypeEnum.Spot;
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = egret3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addnormalcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        Test_NormalMap.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new egret3d.math.Vector3(x2 * 10, 2.25, -z2 * 10);
                objCam.updateWorldTran();
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new egret3d.math.Vector3(x * 5, 3, z * 5);
                objlight.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            }
        };
        return Test_NormalMap;
    }());
    t.Test_NormalMap = Test_NormalMap;
})(t || (t = {}));
var test_pick = (function () {
    function test_pick() {
        this.timer = 0;
        this.movetarget = new egret3d.math.Vector3();
        this.pointDown = false;
    }
    test_pick.prototype.start = function (app) {
        console.log("i am here.");
        this.app = app;
        this.inputMgr = this.app.getInputMgr();
        this.scene = this.app.getScene();
        var cuber;
        console.warn("Finish it.");
        var cube = new egret3d.framework.Transform();
        cube.name = "cube";
        cube.localScale.x = 10;
        cube.localScale.y = 0.1;
        cube.localScale.z = 10;
        this.scene.addChild(cube);
        var mesh = cube.gameObject.addComponent("MeshFilter");
        mesh.mesh = (this.app.getAssetMgr().getDefaultMesh("cube"));
        var renderer = cube.gameObject.addComponent("MeshRenderer");
        cube.gameObject.addComponent("BoxCollider");
        cube.markDirty();
        var smesh = this.app.getAssetMgr().getDefaultMesh("pyramid");
        cuber = renderer;
        this.cube = cube;
        {
            this.cube2 = new egret3d.framework.Transform();
            this.cube2.name = "cube2";
            this.scene.addChild(this.cube2);
            this.cube2.localScale.x = this.cube2.localScale.y = this.cube2.localScale.z = 1;
            this.cube2.localTranslate.x = -5;
            this.cube2.markDirty();
            var mesh = this.cube2.gameObject.addComponent("MeshFilter");
            mesh.mesh = (smesh);
            var renderer = this.cube2.gameObject.addComponent("MeshRenderer");
            var coll = this.cube2.gameObject.addComponent("SphereCollider");
            coll.center = new egret3d.math.Vector3(0, 1, 0);
            coll.radius = 1;
        }
        this.cube3 = this.cube2.clone();
        this.scene.addChild(this.cube3);
        {
            this.cube3 = new egret3d.framework.Transform();
            this.cube3.name = "cube3";
            this.scene.addChild(this.cube3);
            this.cube3.localScale.x = this.cube3.localScale.y = this.cube3.localScale.z = 1;
            this.cube3.localTranslate.x = -5;
            this.cube3.markDirty();
            var mesh = this.cube3.gameObject.addComponent("MeshFilter");
            mesh.mesh = (smesh);
            var renderer = this.cube3.gameObject.addComponent("MeshRenderer");
            var coll = this.cube3.gameObject.addComponent("BoxCollider");
            coll.colliderVisible = true;
        }
        {
            this.cube4 = new egret3d.framework.Transform();
            this.cube4.name = "cube4";
            this.scene.addChild(this.cube4);
            this.cube4.localScale.x = this.cube4.localScale.y = this.cube4.localScale.z = 1;
            this.cube4.localTranslate.x = 5;
            this.cube4.markDirty();
            var mesh = this.cube4.gameObject.addComponent("MeshFilter");
            mesh.mesh = (smesh);
            var renderer = this.cube4.gameObject.addComponent("MeshRenderer");
            var coll = this.cube4.gameObject.addComponent("BoxCollider");
            coll.colliderVisible = true;
        }
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new egret3d.math.Vector3(0, 10, -10);
        objCam.lookat(this.cube);
        objCam.markDirty();
    };
    test_pick.prototype.update = function (delta) {
        if (this.pointDown == false && this.inputMgr.point.touch == true) {
            var ray = this.camera.creatRayByScreen(new egret3d.math.Vector2(this.inputMgr.point.x, this.inputMgr.point.y), this.app);
            var pickinfo = this.scene.pick(ray);
            if (pickinfo != null) {
                this.movetarget = pickinfo.hitposition;
                this.timer = 0;
            }
        }
        this.pointDown = this.inputMgr.point.touch;
        this.timer += delta;
        egret3d.math.vec3SLerp(this.cube2.localTranslate, this.movetarget, this.timer, this.cube2.localTranslate);
        this.cube2.markDirty();
    };
    test_pick.prototype.isClosed = function () {
        return false;
    };
    test_pick = __decorate([
        egret3d.reflect.userCode
    ], test_pick);
    return test_pick;
}());
var t;
(function (t) {
    var test_posteffect = (function () {
        function test_posteffect() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
        }
        test_posteffect.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_posteffect.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_posteffect.prototype.addcube = function (laststate, state) {
            for (var i = -4; i < 5; i++) {
                for (var j = -4; j < 5; j++) {
                    var cube = new egret3d.framework.Transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                    cube.localTranslate.x = i;
                    cube.localTranslate.z = j;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("MeshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("MeshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                }
            }
            state.finish = true;
        };
        test_posteffect.prototype.addcamandlight = function (laststate, state) {
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 1;
            this.camera.far = 15;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();
            {
                var color = new egret3d.framework.CameraPostQueue_Color();
                color.renderTarget = new egret3d.render.GlRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                this.camera.postQueues.push(color);
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
            this.light = lighttran.gameObject.addComponent("Light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new egret3d.framework.Transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
            state.finish = true;
        };
        test_posteffect.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == egret3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = egret3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == egret3d.framework.LightTypeEnum.Point) {
                        _this.light.type = egret3d.framework.LightTypeEnum.Spot;
                        _this.light.spotAngelCos = Math.cos(0.2 * Math.PI);
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = egret3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        test_posteffect.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new egret3d.math.Vector3(x2 * 10, 2.25, -z2 * 10);
                objCam.updateWorldTran();
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new egret3d.math.Vector3(x * 5, 3, z * 5);
                objlight.updateWorldTran();
                objlight.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            }
        };
        return test_posteffect;
    }());
    t.test_posteffect = test_posteffect;
})(t || (t = {}));
var test_loadprefab = (function () {
    function test_loadprefab() {
        this.timer = 0;
    }
    test_loadprefab.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new egret3d.math.Vector3(0, 0, 0);
        var names = ["baihu", "0060_duyanshou", "0001_fashion", "193_meirenyu"];
        var name = names[0];
        this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/" + name + "/" + name + ".assetbundle.json", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName(name + ".prefab.json");
                        _this.baihu = _prefab.getCloneTrans();
                        _this.scene.addChild(_this.baihu);
                        _this.baihu.markDirty();
                    }
                });
            }
        });
        var objCam = new egret3d.framework.Transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("Camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new egret3d.math.Color(0.5, 0.0, 0.0, 1.0);
        objCam.localTranslate = new egret3d.math.Vector3(0, 0, -30);
        objCam.markDirty();
    };
    test_loadprefab.prototype.update = function (delta) {
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
    return test_loadprefab;
}());
var t;
(function (t) {
    var test_sound = (function () {
        function test_sound() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
            this.count = 0;
            this.counttimer = 0;
            this.angularVelocity = new egret3d.math.Vector3(10, 0, 0);
            this.eulerAngle = egret3d.math.Pool.new_vector3();
            this.looped = null;
            this.once1 = null;
            this.once2 = null;
        }
        test_sound.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                state.finish = true;
            });
        };
        test_sound.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_sound.prototype.addcam = function (laststate, state) {
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_sound.prototype.addcube = function (laststate, state) {
            {
                {
                    var cube = new egret3d.framework.Transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("MeshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("MeshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new egret3d.framework.Material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube = cube;
                }
            }
            state.finish = true;
        };
        test_sound.prototype.loadSoundInfe = function (laststate, state) {
            var _this = this;
            {
                egret3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/music1.mp3", function (buf, err) {
                    _this.looped = buf;
                    egret3d.framework.AudioEx.instance().playLooped("abc", _this.looped);
                });
                egret3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/sound1.mp3", function (buf, err) {
                    _this.once1 = buf;
                });
                egret3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/sound2.mp3", function (buf, err) {
                    _this.once2 = buf;
                    egret3d.framework.AudioEx.instance().playOnce("once2", _this.once2);
                });
                {
                    var button = document.createElement("button");
                    button.textContent = "play once1";
                    button.onclick = function () {
                        egret3d.framework.AudioEx.instance().playOnce("once1", _this.once1);
                    };
                    button.style.top = "130px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "play once2";
                    button.onclick = function () {
                        egret3d.framework.AudioEx.instance().playOnce("once2", _this.once2);
                    };
                    button.style.top = "130px";
                    button.style.left = "90px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "play loop";
                    button.onclick = function () {
                        egret3d.framework.AudioEx.instance().playLooped("abc", _this.looped);
                    };
                    button.style.top = "160px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "stop loop";
                    button.onclick = function () {
                        egret3d.framework.AudioEx.instance().stopLooped("abc");
                    };
                    button.style.top = "160px";
                    button.style.left = "90px";
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
                    input.oninput = function (e) {
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
        };
        test_sound.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadSoundInfe.bind(this));
        };
        test_sound.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.cube != null) {
                var cubeTransform = this.cube.gameObject.transform;
                this.eulerAngle.x = delta * this.angularVelocity.x * 10;
                this.eulerAngle.y = delta * this.angularVelocity.y;
                this.eulerAngle.z = delta * this.angularVelocity.z;
                var rotateVelocity = egret3d.math.Pool.new_quaternion();
                egret3d.math.quatFromEulerAngles(this.eulerAngle.x, this.eulerAngle.y, this.eulerAngle.z, rotateVelocity);
                egret3d.math.quatMultiply(rotateVelocity, cubeTransform.localRotate, cubeTransform.localRotate);
                cubeTransform.markDirty();
            }
        };
        return test_sound;
    }());
    t.test_sound = test_sound;
})(t || (t = {}));
var t;
(function (t_2) {
    var enumcheck;
    (function (enumcheck) {
        enumcheck[enumcheck["AA"] = 0] = "AA";
        enumcheck[enumcheck["BB"] = 1] = "BB";
        enumcheck[enumcheck["CC"] = 2] = "CC";
    })(enumcheck = t_2.enumcheck || (t_2.enumcheck = {}));
    var enummap = {};
    var test_ui = (function () {
        function test_ui() {
            this.amount = 1;
            this.timer = 0;
            this.bere = false;
            this.bere1 = false;
        }
        test_ui.prototype.start = function (app) {
            var _this = this;
            enummap["enumcheck"] = enumcheck;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var cuber;
            console.warn("Finish it.");
            this.app.getAssetMgr().load("compressRes/zg256.png");
            var sh = this.app.getAssetMgr().getShader("color");
            if (sh != null) {
                cuber.materials = [];
                cuber.materials.push(new egret3d.framework.Material());
                cuber.materials[0].setShader(sh);
                this.app.getAssetMgr().load("compressRes/zg256.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        console.warn("Finish load img.");
                        var texture = _this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                });
            }
            var cube = new egret3d.framework.Transform();
            cube.name = "cube";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("MeshFilter");
            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = cube.gameObject.addComponent("MeshRenderer");
            cuber = renderer;
            this.cube = cube;
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 0.01;
            this.camera.far = 10;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookat(cube);
            objCam.markDirty();
            var o2d = new egret3d.framework.Overlay2D();
            this.camera.addOverLay(o2d);
            {
                var t2d = new egret3d.framework.Transform2D();
                t2d.width = 150;
                t2d.height = 150;
                t2d.pivot.x = 0;
                t2d.pivot.y = 0;
                t2d.markDirty();
                t2d.addComponent("RawImage2D");
                o2d.addChild(t2d);
            }
            {
                var t2d_1 = new egret3d.framework.Transform2D();
                t2d_1.width = 150;
                t2d_1.height = 150;
                t2d_1.pivot.x = 0;
                t2d_1.pivot.y = 0;
                t2d_1.localTranslate.x = 150;
                var img_1_1 = t2d_1.addComponent("Image2D");
                img_1_1.imageType = egret3d.framework.ImageType.Simple;
                o2d.addChild(t2d_1);
                var t2d_2 = new egret3d.framework.Transform2D();
                t2d_2.width = 150;
                t2d_2.height = 150;
                t2d_2.pivot.x = 0;
                t2d_2.pivot.y = 0;
                t2d_2.localTranslate.x = 300;
                var img_2_1 = t2d_2.addComponent("Image2D");
                img_2_1.imageType = egret3d.framework.ImageType.Sliced;
                o2d.addChild(t2d_2);
                var t2d_3 = new egret3d.framework.Transform2D();
                t2d_3.width = 150;
                t2d_3.height = 150;
                t2d_3.pivot.x = 0;
                t2d_3.pivot.y = 0;
                t2d_3.localTranslate.x = 450;
                this.img_3 = t2d_3.addComponent("Image2D");
                this.img_3.imageType = egret3d.framework.ImageType.Filled;
                this.img_3.fillMethod = egret3d.framework.FillMethod.Vertical;
                this.img_3.fillAmmount = 1;
                o2d.addChild(t2d_3);
                var t2d_4 = new egret3d.framework.Transform2D();
                t2d_4.width = 150;
                t2d_4.height = 150;
                t2d_4.pivot.x = 0;
                t2d_4.pivot.y = 0;
                t2d_4.localTranslate.x = 600;
                this.img_4 = t2d_4.addComponent("Image2D");
                this.img_4.imageType = egret3d.framework.ImageType.Filled;
                this.img_4.fillMethod = egret3d.framework.FillMethod.Horizontal;
                this.img_4.fillAmmount = 1;
                o2d.addChild(t2d_4);
                var t2d_5 = new egret3d.framework.Transform2D();
                t2d_5.width = 150;
                t2d_5.height = 150;
                t2d_5.pivot.x = 0;
                t2d_5.pivot.y = 0;
                t2d_5.localTranslate.x = 750;
                this.img_5 = t2d_5.addComponent("Image2D");
                this.img_5.imageType = egret3d.framework.ImageType.Filled;
                this.img_5.fillMethod = egret3d.framework.FillMethod.Radial_90;
                this.img_5.fillAmmount = 1;
                o2d.addChild(t2d_5);
                var t2d_6 = new egret3d.framework.Transform2D();
                t2d_6.width = 150;
                t2d_6.height = 150;
                t2d_6.pivot.x = 0;
                t2d_6.pivot.y = 0;
                t2d_6.localTranslate.x = 150;
                t2d_6.localTranslate.y = 150;
                var img_6_1 = t2d_6.addComponent("Image2D");
                img_6_1.imageType = egret3d.framework.ImageType.Tiled;
                o2d.addChild(t2d_6);
                var t2d_7 = new egret3d.framework.Transform2D();
                t2d_7.width = 150;
                t2d_7.height = 150;
                t2d_7.pivot.x = 0;
                t2d_7.pivot.y = 0;
                t2d_7.localTranslate.x = 300;
                t2d_7.localTranslate.y = 150;
                this.img_7 = t2d_7.addComponent("Image2D");
                this.img_7.imageType = egret3d.framework.ImageType.Filled;
                this.img_7.fillMethod = egret3d.framework.FillMethod.Radial_180;
                this.img_7.fillAmmount = 1;
                o2d.addChild(t2d_7);
                var t2d_8 = new egret3d.framework.Transform2D();
                t2d_8.width = 150;
                t2d_8.height = 150;
                t2d_8.pivot.x = 0;
                t2d_8.pivot.y = 0;
                t2d_8.localTranslate.x = 450;
                t2d_8.localTranslate.y = 150;
                this.img_8 = t2d_8.addComponent("Image2D");
                this.img_8.imageType = egret3d.framework.ImageType.Filled;
                this.img_8.fillMethod = egret3d.framework.FillMethod.Radial_360;
                this.img_8.fillAmmount = 1;
                o2d.addChild(t2d_8);
                var t2d_9 = new egret3d.framework.Transform2D();
                t2d_9.width = 150;
                t2d_9.height = 50;
                t2d_9.pivot.x = 0;
                t2d_9.pivot.y = 0;
                t2d_9.localTranslate.x = 150;
                t2d_9.localTranslate.y = 300;
                var btn = t2d_9.addComponent("Button");
                var img9_1 = t2d_9.addComponent("Image2D");
                img9_1.imageType = egret3d.framework.ImageType.Sliced;
                btn.targetImage = img9_1;
                btn.transition = egret3d.framework.TransitionType.ColorTint;
                btn.onClick.addListener(function () {
                    console.log("按钮点下了");
                });
                o2d.addChild(t2d_9);
                var lab = new egret3d.framework.Transform2D();
                lab.name = "lab111";
                lab.width = 150;
                lab.height = 50;
                lab.pivot.x = 0;
                lab.pivot.y = 0;
                lab.localTranslate.y = -10;
                lab.markDirty();
                var label = lab.addComponent("Label");
                label.text = "这是按钮";
                label.fontsize = 25;
                label.color = new egret3d.math.Color(1, 0, 0, 1);
                t2d_9.addChild(lab);
                this.app.getAssetMgr().load("compressRes/1.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.app.getAssetMgr().load("compressRes/resources/1.atlas.json", egret3d.framework.AssetTypeEnum.Auto, function (state) {
                            var atlas = _this.app.getAssetMgr().getAssetByName("1.atlas.json");
                            img_1_1.setTexture(atlas.texture);
                            img_2_1.sprite = atlas.sprites["card_role_1_face"];
                            img_2_1.sprite.border = new egret3d.math.Border(10, 10, 10, 10);
                            _this.img_3.sprite = atlas.sprites["card_role_1_face"];
                            _this.img_4.sprite = atlas.sprites["card_role_1_face"];
                            _this.img_5.sprite = atlas.sprites["card_role_1_face"];
                            img_6_1.sprite = atlas.sprites["card_role_1_face"];
                            _this.img_7.sprite = atlas.sprites["card_role_1_face"];
                            _this.img_8.sprite = atlas.sprites["card_role_1_face"];
                        });
                    }
                });
                this.app.getAssetMgr().load("compressRes/uisprite.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var texture = _this.app.getAssetMgr().getAssetByName("uisprite.png");
                        img9_1.setTexture(texture, new egret3d.math.Border(15, 15, 15, 15));
                    }
                });
                this.app.getAssetMgr().load("compressRes/STXINGKA.TTF.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.app.getAssetMgr().load("compressRes/resources/STXINGKA.font.json", egret3d.framework.AssetTypeEnum.Auto, function (s1) {
                            label.font = _this.app.getAssetMgr().getAssetByName("STXINGKA.font.json");
                        });
                    }
                });
            }
            var t = new egret3d.framework.Transform();
            t.localScale.x = t.localScale.y = t.localScale.z = 1;
            var c2d = t.gameObject.addComponent("CanvasRenderer");
            t.localTranslate.y = 1;
            this.scene.addChild(t);
            {
                var t2d = new egret3d.framework.Transform2D();
                t2d.width = 400;
                t2d.height = 400;
                t2d.pivot.x = 0;
                t2d.pivot.y = 0;
                t2d.markDirty();
                t2d.addComponent("RawImage2D");
                c2d.addChild(t2d);
            }
            for (var i = 0; i < 10; i++) {
                var t2d = new egret3d.framework.Transform2D();
                t2d.width = 50;
                t2d.height = 50;
                t2d.pivot.x = 0;
                t2d.pivot.y = 0;
                t2d.localTranslate.x = 100 * i;
                t2d.localRotate = i;
                t2d.markDirty();
                var img = t2d.addComponent("RawImage2D");
                img.color.b = i * 0.1;
                img.image = this.app.getAssetMgr().getDefaultTexture("white");
                c2d.addChild(t2d);
            }
        };
        test_ui.prototype.update = function (delta) {
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            var objCam = this.camera.gameObject.transform;
            objCam.localTranslate = new egret3d.math.Vector3(x2 * 5, 2.25, -z2 * 5);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            if (this.timer > 5 && !this.bere) {
                this.bere = true;
                this.app.closeFps();
            }
            if (this.timer > 10 && !this.bere1) {
                this.bere1 = true;
                this.app.showFps();
            }
            if ((this.amount + delta / 2) > 1)
                this.amount = 0;
            else
                this.amount += delta / 2;
            this.img_3.fillAmmount = this.amount;
            this.img_4.fillAmmount = this.amount;
            this.img_5.fillAmmount = this.amount;
            this.img_7.fillAmmount = this.amount;
            this.img_8.fillAmmount = this.amount;
        };
        return test_ui;
    }());
    t_2.test_ui = test_ui;
})(t || (t = {}));
var testUserCodeUpdate = (function () {
    function testUserCodeUpdate() {
        this.beExecuteInEditorMode = false;
        this.timer = 0;
    }
    testUserCodeUpdate.prototype.onStart = function (app) {
        this.app = app;
    };
    testUserCodeUpdate.prototype.onUpdate = function (delta) {
        if (this.trans == null || this.trans == undefined) {
            this.trans = this.app.getScene().getChildByName("Cube");
        }
        if (this.trans == null || this.trans == undefined)
            return;
        this.timer += delta * 15;
        egret3d.math.quatFromAxisAngle(new egret3d.math.Vector3(0, 1, 0), this.timer, this.trans.localRotate);
        this.trans.markDirty();
    };
    testUserCodeUpdate.prototype.isClosed = function () {
        return false;
    };
    testUserCodeUpdate = __decorate([
        egret3d.reflect.userCode
    ], testUserCodeUpdate);
    return testUserCodeUpdate;
}());
var t;
(function (t) {
    var test_uvroll = (function () {
        function test_uvroll() {
            this.timer = 0;
            this.taskmgr = new egret3d.framework.TaskMgr();
            this.count = 0;
            this.row = 3;
            this.col = 3;
            this.totalframe = 9;
            this.fps = 2;
        }
        test_uvroll.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().loadCompressBundle("compressRes/shader/shader.assetbundle.json", function (_state) {
                if (_state.isfinish)
                    state.finish = true;
            });
        };
        test_uvroll.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("compressRes/uvSprite.png", egret3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_uvroll.prototype.addcube = function (laststate, state) {
            {
                var cube = new egret3d.framework.Transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                cube.localTranslate.x = -1;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("MeshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("sample_uvsprite.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new egret3d.framework.Material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("uvSprite.png");
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
                var mesh1 = cube1.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh1.mesh = (smesh);
                var renderer1 = cube1.gameObject.addComponent("MeshRenderer");
                var cuber1 = renderer1;
                var sh = this.app.getAssetMgr().getShader("uvroll.shader.json");
                if (sh != null) {
                    cuber1.materials = [];
                    cuber1.materials.push(new egret3d.framework.Material());
                    cuber1.materials[0].setShader(sh);
                    var texture1 = this.app.getAssetMgr().getAssetByName("uvSprite.png");
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
                var mesh1 = cube2.gameObject.addComponent("MeshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh1.mesh = (smesh);
                var renderer2 = cube2.gameObject.addComponent("MeshRenderer");
                var sh = this.app.getAssetMgr().getShader("selftimer_uvroll.shader.json");
                if (sh != null) {
                    renderer2.materials = [];
                    renderer2.materials.push(new egret3d.framework.Material());
                    renderer2.materials[0].setShader(sh);
                    var texture1 = this.app.getAssetMgr().getAssetByName("uvSprite.png");
                    renderer2.materials[0].setTexture("_MainTex", texture1);
                }
                this.cube2 = cube2;
            }
            state.finish = true;
        };
        test_uvroll.prototype.addcam = function (laststate, state) {
            var objCam = new egret3d.framework.Transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("Camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            objCam.localTranslate = new egret3d.math.Vector3(0, 0, -10);
            objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_uvroll.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        };
        test_uvroll.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.cube != null) {
                var curframe = Math.floor(this.timer * this.fps);
                curframe = curframe % this.totalframe;
                var vec41 = new egret3d.math.Vector4();
                egret3d.math.spriteAnimation(3, 3, curframe, vec41);
                var renderer = this.cube.gameObject.getComponent("MeshRenderer");
                renderer.materials[0].setVector4("_MainTex_ST", vec41);
            }
            if (this.cube2 != null) {
                var renderer2 = this.cube2.gameObject.getComponent("MeshRenderer");
                renderer2.materials[0].setVector4("_MainTex_ST", new egret3d.math.Vector4(1.0, 1.0, 0, 0));
                renderer2.materials[0].setFloat("_SpeedU", 3.0);
                renderer2.materials[0].setFloat("_SpeedV", 1.0);
                renderer2.materials[0].setFloat("self_timer", this.timer);
            }
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.lookatPoint(new egret3d.math.Vector3(0, 0, 0));
                objCam.markDirty();
            }
        };
        return test_uvroll;
    }());
    t.test_uvroll = test_uvroll;
})(t || (t = {}));
var CameraController = (function () {
    function CameraController() {
        this.moveSpeed = 10;
        this.movemul = 5;
        this.wheelSpeed = 1;
        this.rotateSpeed = 0.1;
        this.keyMap = {};
        this.beRightClick = false;
        this.isInit = false;
        this.moveVector = new egret3d.math.Vector3(0, 0, 1);
    }
    CameraController.instance = function () {
        if (CameraController.g_this == null) {
            CameraController.g_this = new CameraController();
        }
        return CameraController.g_this;
    };
    CameraController.prototype.update = function (delta) {
        if (this.beRightClick) {
            this.doMove(delta);
        }
    };
    CameraController.prototype.init = function (app, target) {
        var _this = this;
        this.isInit = true;
        this.app = app;
        this.target = target;
        this.rotAngle = new egret3d.math.Vector3();
        egret3d.math.quatToEulerAngles(this.target.gameObject.transform.localRotate, this.rotAngle);
        this.app.webgl.canvas.addEventListener("mousedown", function (ev) {
            _this.checkOnRightClick(ev);
        }, false);
        this.app.webgl.canvas.addEventListener("mouseup", function (ev) {
            _this.beRightClick = false;
        }, false);
        this.app.webgl.canvas.addEventListener("mousemove", function (ev) {
            if (_this.beRightClick) {
                _this.doRotate(ev.movementX, ev.movementY);
            }
        }, false);
        this.app.webgl.canvas.addEventListener("keydown", function (ev) {
            _this.keyMap[ev.keyCode] = true;
        }, false);
        this.app.webgl.canvas.addEventListener("keyup", function (ev) {
            _this.moveSpeed = 10;
            _this.keyMap[ev.keyCode] = false;
        }, false);
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
            this.app.webgl.canvas.addEventListener("DOMMouseScroll", function (ev) {
                _this.doMouseWheel(ev, true);
            }, false);
        }
        else {
            this.app.webgl.canvas.addEventListener("mousewheel", function (ev) {
                _this.doMouseWheel(ev, false);
            }, false);
        }
        this.app.webgl.canvas.addEventListener("mouseout", function (ev) {
            _this.beRightClick = false;
        }, false);
        document.oncontextmenu = function (ev) {
            ev.preventDefault();
        };
    };
    CameraController.prototype.doMove = function (delta) {
        if (this.target == null)
            return;
        if ((this.keyMap[egret3d.framework.NumberUtil.KEY_W] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_W])
            || (this.keyMap[egret3d.framework.NumberUtil.KEY_w] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_w])) {
            this.moveSpeed += this.movemul * delta;
            this.target.gameObject.transform.getForwardInWorld(this.moveVector);
            egret3d.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
            egret3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
        }
        if ((this.keyMap[egret3d.framework.NumberUtil.KEY_S] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_S])
            || (this.keyMap[egret3d.framework.NumberUtil.KEY_s] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_s])) {
            this.moveSpeed += this.movemul * delta;
            this.target.gameObject.transform.getForwardInWorld(this.moveVector);
            egret3d.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
            egret3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
        }
        if ((this.keyMap[egret3d.framework.NumberUtil.KEY_A] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_A])
            || (this.keyMap[egret3d.framework.NumberUtil.KEY_a] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_a])) {
            this.moveSpeed += this.movemul * delta;
            this.target.gameObject.transform.getRightInWorld(this.moveVector);
            egret3d.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
            egret3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
        }
        if ((this.keyMap[egret3d.framework.NumberUtil.KEY_D] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_D])
            || (this.keyMap[egret3d.framework.NumberUtil.KEY_d] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_d])) {
            this.moveSpeed += this.movemul * delta;
            this.target.gameObject.transform.getRightInWorld(this.moveVector);
            egret3d.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
            egret3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
        }
        if ((this.keyMap[egret3d.framework.NumberUtil.KEY_Q] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_Q])
            || (this.keyMap[egret3d.framework.NumberUtil.KEY_q] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_q])) {
            this.moveSpeed += this.movemul * delta;
            this.target.gameObject.transform.getUpInWorld(this.moveVector);
            egret3d.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
            egret3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
        }
        if ((this.keyMap[egret3d.framework.NumberUtil.KEY_E] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_E])
            || (this.keyMap[egret3d.framework.NumberUtil.KEY_e] != undefined && this.keyMap[egret3d.framework.NumberUtil.KEY_e])) {
            this.moveSpeed += this.movemul * delta;
            this.target.gameObject.transform.getUpInWorld(this.moveVector);
            egret3d.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
            egret3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
        }
        this.target.gameObject.transform.markDirty();
    };
    CameraController.prototype.doRotate = function (rotateX, rotateY) {
        this.rotAngle.x += rotateY * this.rotateSpeed;
        this.rotAngle.y += rotateX * this.rotateSpeed;
        this.rotAngle.x %= 360;
        this.rotAngle.y %= 360;
        egret3d.math.quatFromEulerAngles(this.rotAngle.x, this.rotAngle.y, this.rotAngle.z, this.target.gameObject.transform.localRotate);
    };
    CameraController.prototype.lookat = function (trans) {
        this.target.gameObject.transform.lookat(trans);
        this.target.gameObject.transform.markDirty();
        egret3d.math.quatToEulerAngles(this.target.gameObject.transform.localRotate, this.rotAngle);
    };
    CameraController.prototype.checkOnRightClick = function (mouseEvent) {
        var value = mouseEvent.button;
        if (value == 2) {
            this.beRightClick = true;
            return true;
        }
        else if (value == 0) {
            this.beRightClick = false;
            return false;
        }
    };
    CameraController.prototype.doMouseWheel = function (ev, isFirefox) {
        if (!this.target)
            return;
        if (this.target.opvalue == 0) {
        }
        else {
            this.target.gameObject.transform.getForwardInWorld(this.moveVector);
            if (isFirefox) {
                egret3d.math.vec3ScaleByNum(this.moveVector, this.wheelSpeed * (ev.detail * (-0.5)), this.moveVector);
            }
            else {
                egret3d.math.vec3ScaleByNum(this.moveVector, this.wheelSpeed * ev.deltaY * (-0.01), this.moveVector);
            }
            egret3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
            this.target.gameObject.transform.markDirty();
        }
    };
    CameraController.prototype.remove = function () {
    };
    return CameraController;
}());
//# sourceMappingURL=app.js.map