/// <reference path="../lib/egret3d.d.ts" />
declare class Main implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    private camera;
    private baihu;
    private cube;
    onStart(app: egret3d.framework.Application): void;
    private timer;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
