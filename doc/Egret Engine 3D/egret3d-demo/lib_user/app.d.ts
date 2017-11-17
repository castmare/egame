/// <reference path="../lib/egret3d.d.ts" />
declare namespace t {
    class light_d1 implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: egret3d.framework.Application): void;
        camera: egret3d.framework.Camera;
        light: egret3d.framework.Light;
        timer: number;
        taskmgr: egret3d.framework.TaskMgr;
        update(delta: number): void;
    }
}
interface IState {
    start(app: egret3d.framework.Application): any;
    update(delta: number): any;
}
declare class main implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    state: IState;
    onStart(app: egret3d.framework.Application): void;
    private x;
    private y;
    private btns;
    private addBtn(text, act);
    private clearBtn();
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare namespace t {
    class test_blend implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        camera: egret3d.framework.Camera;
        background: egret3d.framework.Transform;
        parts: egret3d.framework.Transform;
        timer: number;
        taskmgr: egret3d.framework.TaskMgr;
        count: number;
        counttimer: number;
        private angularVelocity;
        private eulerAngle;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcam(laststate, state);
        foreground: egret3d.framework.Transform;
        private addplane(laststate, state);
        start(app: egret3d.framework.Application): void;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_rendertexture implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        sh: egret3d.framework.Shader;
        private initscene(laststate, state);
        private add3dmodelbeforeUi(laststate, state);
        start(app: egret3d.framework.Application): void;
        wath_camer: egret3d.framework.Camera;
        target: egret3d.framework.Transform;
        targetMat: egret3d.framework.Material;
        show_cube: egret3d.framework.Transform;
        showcamera: egret3d.framework.Camera;
        timer: number;
        taskmgr: egret3d.framework.TaskMgr;
        angle: number;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_three_leaved_rose_curve implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        camera: egret3d.framework.Camera;
        cube: egret3d.framework.Transform;
        parts: egret3d.framework.Transform;
        timer: number;
        cube2: egret3d.framework.Transform;
        taskmgr: egret3d.framework.TaskMgr;
        count: number;
        counttimer: number;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        aniplayer: egret3d.framework.AniPlayer;
        role: egret3d.framework.Transform;
        private roleLength;
        private loadRole(laststate, state);
        private addcam(laststate, state);
        private addcube(laststate, state);
        start(app: egret3d.framework.Application): void;
        private angularVelocity;
        private eulerAngle;
        private zeroPoint;
        update(delta: number): void;
    }
}
declare class test_anim implements IState {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    player: egret3d.framework.Transform;
    cubes: {
        [id: string]: egret3d.framework.Transform;
    };
    start(app: egret3d.framework.Application): void;
    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
    timer: number;
    update(delta: number): void;
}
declare class test_effect implements egret3d.framework.IUserCode {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    camera: egret3d.framework.Camera;
    timer: number;
    taskmgr: egret3d.framework.TaskMgr;
    effect: egret3d.framework.EffectSystem;
    label: HTMLLabelElement;
    private loadShader(laststate, state);
    private loadText(laststate, state);
    private addcube(laststate, state);
    private dragon;
    private loadModel(laststate, state);
    onStart(app: egret3d.framework.Application): void;
    private loadEffect(laststate, state);
    private addcam(laststate, state);
    tr: egret3d.framework.Transform;
    ttr: egret3d.framework.Transform;
    eff: egret3d.framework.EffectSystem;
    beclone: boolean;
    effectloaded: boolean;
    bestop: boolean;
    bereplay: boolean;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare namespace t {
    class test_light1 implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        tex: egret3d.framework.Texture;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: egret3d.framework.Application): void;
        camera: egret3d.framework.Camera;
        light: egret3d.framework.Light;
        timer: number;
        taskmgr: egret3d.framework.TaskMgr;
        update(delta: number): void;
    }
}
declare class test_loadScene implements IState {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    start(app: egret3d.framework.Application): void;
    baihu: egret3d.framework.Transform;
    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
    timer: number;
    bere: boolean;
    update(delta: number): void;
    isClosed(): boolean;
}
declare class test_load implements IState {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    start(app: egret3d.framework.Application): void;
    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
    timer: number;
    update(delta: number): void;
}
declare class test_multipleplayer_anim implements IState {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    player: egret3d.framework.Transform;
    cubes: {
        [id: string]: egret3d.framework.Transform;
    };
    infos: {
        [boneCount: number]: {
            abName: string;
            prefabName: string;
            materialCount: number;
        };
    };
    init(): void;
    start(app: egret3d.framework.Application): void;
    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class Test_NormalMap implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        cuber: egret3d.framework.MeshRenderer;
        private normalCube;
        private addnormalcube(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: egret3d.framework.Application): void;
        camera: egret3d.framework.Camera;
        light: egret3d.framework.Light;
        timer: number;
        taskmgr: egret3d.framework.TaskMgr;
        update(delta: number): void;
    }
}
declare class test_pick implements IState {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    start(app: egret3d.framework.Application): void;
    camera: egret3d.framework.Camera;
    cube: egret3d.framework.Transform;
    cube2: egret3d.framework.Transform;
    cube3: egret3d.framework.Transform;
    cube4: egret3d.framework.Transform;
    timer: number;
    movetarget: egret3d.math.Vector3;
    inputMgr: egret3d.framework.InputMgr;
    pointDown: boolean;
    update(delta: number): void;
    isClosed(): boolean;
}
declare namespace t {
    class test_posteffect implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: egret3d.framework.Application): void;
        camera: egret3d.framework.Camera;
        light: egret3d.framework.Light;
        timer: number;
        taskmgr: egret3d.framework.TaskMgr;
        update(delta: number): void;
    }
}
declare class test_loadprefab implements IState {
    app: egret3d.framework.Application;
    scene: egret3d.framework.Scene;
    renderer: egret3d.framework.MeshRenderer[];
    skinRenders: egret3d.framework.SkinnedMeshRenderer[];
    start(app: egret3d.framework.Application): void;
    camera: egret3d.framework.Camera;
    baihu: egret3d.framework.Transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class test_sound implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        camera: egret3d.framework.Camera;
        cube: egret3d.framework.Transform;
        parts: egret3d.framework.Transform;
        timer: number;
        taskmgr: egret3d.framework.TaskMgr;
        count: number;
        counttimer: number;
        private angularVelocity;
        private eulerAngle;
        looped: AudioBuffer;
        once1: AudioBuffer;
        once2: AudioBuffer;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcam(laststate, state);
        private addcube(laststate, state);
        private loadSoundInfe(laststate, state);
        start(app: egret3d.framework.Application): void;
        update(delta: number): void;
    }
}
declare namespace t {
    enum enumcheck {
        AA = 0,
        BB = 1,
        CC = 2,
    }
    class test_ui implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        start(app: egret3d.framework.Application): void;
        img_3: egret3d.framework.Image2D;
        img_4: egret3d.framework.Image2D;
        img_5: egret3d.framework.Image2D;
        img_7: egret3d.framework.Image2D;
        img_8: egret3d.framework.Image2D;
        amount: number;
        camera: egret3d.framework.Camera;
        cube: egret3d.framework.Transform;
        timer: number;
        bere: boolean;
        bere1: boolean;
        update(delta: number): void;
    }
}
declare class testUserCodeUpdate implements egret3d.framework.IUserCode {
    beExecuteInEditorMode: boolean;
    trans: egret3d.framework.Transform;
    timer: number;
    app: egret3d.framework.Application;
    onStart(app: egret3d.framework.Application): void;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare namespace t {
    class test_uvroll implements IState {
        app: egret3d.framework.Application;
        scene: egret3d.framework.Scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcam(laststate, state);
        start(app: egret3d.framework.Application): void;
        camera: egret3d.framework.Camera;
        cube: egret3d.framework.Transform;
        cube1: egret3d.framework.Transform;
        cube2: egret3d.framework.Transform;
        timer: number;
        taskmgr: egret3d.framework.TaskMgr;
        count: number;
        row: number;
        col: number;
        totalframe: number;
        fps: number;
        private cycles;
        update(delta: number): void;
    }
}
declare class CameraController {
    private static g_this;
    static instance(): CameraController;
    gameObject: egret3d.framework.GameObject;
    app: egret3d.framework.Application;
    target: egret3d.framework.Camera;
    moveSpeed: number;
    movemul: number;
    wheelSpeed: number;
    rotateSpeed: number;
    keyMap: {
        [id: number]: boolean;
    };
    beRightClick: boolean;
    update(delta: number): void;
    rotAngle: egret3d.math.Vector3;
    isInit: boolean;
    init(app: egret3d.framework.Application, target: egret3d.framework.Camera): void;
    private moveVector;
    doMove(delta: number): void;
    doRotate(rotateX: number, rotateY: number): void;
    lookat(trans: egret3d.framework.Transform): void;
    checkOnRightClick(mouseEvent: MouseEvent): boolean;
    private doMouseWheel(ev, isFirefox);
    remove(): void;
}
