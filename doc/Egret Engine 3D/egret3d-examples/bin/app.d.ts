/// <reference path="../lib/egret3d.d.ts" />
declare class Cube implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    private camera;
    private cube;
    onStart(app: egret3d.framework.Application): void;
    private timer;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare class CubeWithTexture implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    private camera;
    private cube;
    onStart(app: egret3d.framework.Application): void;
    private timer;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare class LoadScene implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    private camera;
    onStart(app: egret3d.framework.Application): void;
    private timer;
    private lookAtPoint;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare class Mesh implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    private camera;
    private baihu;
    onStart(app: egret3d.framework.Application): void;
    private timer;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare class ParticleEffect implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    private camera;
    private effectTransform;
    onStart(app: egret3d.framework.Application): void;
    private timer;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare class PickTest implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    inputMgr: egret3d.framework.InputMgr;
    private camera;
    private createGeo(name, type);
    private floor;
    private flag;
    onStart(app: egret3d.framework.Application): void;
    private timer;
    private pointDown;
    private movetarget;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare class SkinnedMesh implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    private camera;
    private elong;
    private cube;
    onStart(app: egret3d.framework.Application): void;
    private timer;
    private lookAtPoint;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
