/// <reference path="Reflect.d.ts" />
declare namespace egret3d {
    const license = "白鹭时代授权 莉莉丝科技有限公司  内测使用";
}
declare namespace egret3d.framework {
    interface INotify {
        notify(trans: any, type: NotifyType): any;
    }
    enum NotifyType {
        AddChild = 0,
        RemoveChild = 1,
        ChangeVisible = 2,
        AddCamera = 3,
        AddCanvasRender = 4,
    }
    class Application {
        webgl: WebGLRenderingContext;
        stats: Stats.Stats;
        container: HTMLDivElement;
        width: number;
        height: number;
        limitFrame: boolean;
        notify: INotify;
        private _timeScale;
        timeScale: number;
        private version;
        private build;
        private _tar;
        private _standDeltaTime;
        targetFrame: number;
        start(div: HTMLDivElement): void;
        markNotify(trans: any, type: NotifyType): void;
        private doNotify(trans, type);
        checkFilter(trans: any): boolean;
        showFps(): void;
        closeFps(): void;
        private beStepNumber;
        private update(delta);
        preusercodetimer: number;
        usercodetime: number;
        getUserUpdateTimer(): number;
        private beginTimer;
        private lastTimer;
        private totalTime;
        getTotalTime(): number;
        private _deltaTime;
        readonly deltaTime: number;
        private pretimer;
        private updateTimer;
        getUpdateTimer(): any;
        isFrustumCulling: boolean;
        private loop();
        private _scene;
        private initScene();
        getScene(): Scene;
        private _assetmgr;
        private initAssetMgr();
        getAssetMgr(): AssetMgr;
        private _inputmgr;
        private initInputMgr();
        getInputMgr(): InputMgr;
        private _userCode;
        private _userCodeNew;
        private _editorCode;
        private _editorCodeNew;
        private _bePlay;
        be2dstate: boolean;
        curcameraindex: number;
        bePlay: boolean;
        private _bePause;
        bePause: boolean;
        private _beStepForward;
        beStepForward: boolean;
        private updateUserCode(delta);
        private updateEditorCode(delta);
        addUserCodeDirect(program: IUserCode): void;
        addUserCode(classname: string): void;
        addEditorCode(classname: string): void;
        addEditorCodeDirect(program: IEditorCode): void;
    }
    interface IUserCode {
        onStart(app: egret3d.framework.Application): any;
        onUpdate(delta: number): any;
        isClosed(): boolean;
    }
    interface IEditorCode {
        onStart(app: egret3d.framework.Application): any;
        onUpdate(delta: number): any;
        isClosed(): boolean;
    }
}
declare namespace egret3d.framework {
    class SceneMgr {
        private static _ins;
        static readonly ins: SceneMgr;
        static app: Application;
        static scene: Scene;
    }
}
declare namespace Stats {
    class Stats {
        constructor(app: egret3d.framework.Application);
        update(): void;
        app: egret3d.framework.Application;
        container: HTMLDivElement;
        private mode;
        private REVISION;
        private beginTime;
        private prevTime;
        private frames;
        private fpsPanel;
        private msPanel;
        private memPanel;
        private ratePanel;
        private userratePanel;
        private showPanel(id);
        private addPanel(panel);
        private begin();
        private end();
    }
}
declare namespace egret3d.reflect {
    function getPrototypes(): {
        [id: string]: any;
    };
    function getPrototype(name: string): any;
    function createInstance(prototype: any, matchTag: {
        [id: string]: string;
    }): any;
    function getClassName(prototype: any): any;
    function getClassTag(prototype: any, tag: string): any;
    function getMeta(prototype: any): any;
    function attr_Class(constructorObj: any): void;
    function attr_Func(customInfo?: {
        [id: string]: string;
    }): (target: any, propertyKey: string, value: any) => void;
    function attr_Field(customInfo?: {
        [id: string]: string;
    }): (target: Object, propertyKey: string) => void;
    function userCode(constructorObj: any): void;
    function editorCode(constructorObj: any): void;
    function selfClone(constructorObj: any): void;
    function nodeComponent(constructorObj: any): void;
    function nodeComponentInspector(constructorObj: any): void;
    function nodeRender(constructorObj: any): void;
    function nodeCamera(constructorObj: any): void;
    function nodeLight(constructorObj: any): void;
    function nodeBoxCollider(constructorObj: any): void;
    function nodeSphereCollider(constructorObj: any): void;
    function nodeEffectBatcher(constructorObj: any): void;
    function nodeMeshCollider(constructorObj: any): void;
    function nodeCanvasRendererCollider(constructorObj: any): void;
    function node2DComponent(constructorObj: any): void;
    function pluginMenuItem(constructorObj: any): void;
    function pluginWindow(constructorObj: any): void;
    function pluginExt(constructorObj: any): void;
    function compValue(integer?: boolean, defvalue?: number, min?: number, max?: number): (target: Object, propertyKey: string) => void;
    function compCall(customInfo?: {
        [id: string]: string;
    }): (target: any, propertyKey: string, value: any) => void;
    function SerializeType(constructorObj: any): void;
    function Field(valueType: string, defaultValue?: any, enumRealType?: string): (target: Object, propertyKey: string) => void;
    function UIComment(comment: string): (target: Object, propertyKey: string) => void;
    enum FieldUIStyle {
        None = 0,
        RangeFloat = 1,
        MultiLineString = 2,
        Enum = 3,
    }
    function UIStyle(style: string, min?: number, max?: number, defvalue?: any): (target: Object, propertyKey: string) => void;
}
declare namespace egret3d.framework {
    class Canvas {
        constructor();
        is2dUI: boolean;
        parentTrans: Transform;
        batcher: Batcher2D;
        webgl: WebGLRenderingContext;
        scene: Scene;
        addChild(node: Transform2D): void;
        removeChild(node: Transform2D): void;
        getChildren(): Transform2D[];
        getChildCount(): number;
        getChild(index: number): Transform2D;
        private pointDown;
        private pointSelect;
        private pointEvent;
        private pointX;
        private pointY;
        update(delta: number, touch: Boolean, XOnScreenSpace: number, YOnScreenSpace: number): void;
        private lastMat;
        afterRender: Function;
        render(context: RenderContext, assetmgr: AssetMgr): void;
        pushRawData(mat: Material, data: number[]): void;
        private context;
        assetmgr: AssetMgr;
        drawScene(node: Transform2D, context: RenderContext, assetmgr: AssetMgr): void;
        pixelWidth: number;
        pixelHeight: number;
        private rootNode;
        getRoot(): Transform2D;
    }
}
declare namespace egret3d.framework {
    class Batcher2D {
        private mesh;
        private drawMode;
        private vboCount;
        private curPass;
        private eboCount;
        private dataForVbo;
        private dataForEbo;
        initBuffer(webgl: WebGLRenderingContext, vf: render.VertexFormatMask, drawMode: render.DrawModeEnum): void;
        begin(webgl: WebGLRenderingContext, pass: render.GlDrawPass): void;
        push(webgl: WebGLRenderingContext, vbodata: number[], ebodata: number[]): void;
        end(webgl: WebGLRenderingContext): void;
    }
    class CanvasRenderer implements IRenderer, ICollider {
        constructor();
        subTran: Transform;
        getBound(): any;
        intersectsTransform(tran: Transform): boolean;
        layer: RenderLayerEnum;
        queue: number;
        gameObject: GameObject;
        canvas: Canvas;
        inputmgr: InputMgr;
        cameraTouch: Camera;
        start(): void;
        addChild(node: Transform2D): void;
        removeChild(node: Transform2D): void;
        getChildren(): Transform2D[];
        getChildCount(): number;
        getChild(index: number): Transform2D;
        update(delta: number): void;
        pick2d(ray: egret3d.framework.Ray): Transform2D;
        dopick2d(outv: math.Vector2, tran: Transform2D): Transform2D;
        render(context: RenderContext, assetmgr: AssetMgr, camera: egret3d.framework.Camera): void;
        jsonToAttribute(json: any, assetmgr: egret3d.framework.AssetMgr): void;
        remove(): void;
        clone(): void;
        renderLayer: CullingMask;
    }
}
declare namespace egret3d.framework {
    enum PointEventEnum {
        PointNothing = 0,
        PointDown = 1,
        PointHold = 2,
        PointUp = 3,
    }
    class PointEvent {
        type: PointEventEnum;
        x: number;
        y: number;
        eated: boolean;
        selected: Transform2D;
    }
    class UIEvent {
        funcs: Function[];
        addListener(func: Function): void;
        excute(): void;
        clear(): void;
    }
}
declare namespace egret3d.framework {
    class Overlay2D implements IOverLay {
        constructor();
        init: boolean;
        private camera;
        private app;
        private inputmgr;
        start(camera: Camera): void;
        canvas: Canvas;
        autoAsp: boolean;
        addChild(node: Transform2D): void;
        removeChild(node: Transform2D): void;
        getChildren(): Transform2D[];
        getChildCount(): number;
        getChild(index: number): Transform2D;
        render(context: RenderContext, assetmgr: AssetMgr, camera: Camera): void;
        update(delta: number): void;
        pick2d(mx: number, my: number): Transform2D;
        dopick2d(outv: math.Vector2, tran: Transform2D): Transform2D;
        calScreenPosToCanvasPos(mousePos: egret3d.math.Vector2, canvasPos: egret3d.math.Vector2): void;
    }
}
declare namespace egret3d.math {
    class Vector2 {
        constructor(x?: number, y?: number);
        x: number;
        y: number;
        toString(): string;
    }
    class Rect {
        constructor(x?: number, y?: number, w?: number, h?: number);
        x: number;
        y: number;
        w: number;
        h: number;
        toString(): string;
    }
    class Border {
        constructor(l?: number, t?: number, r?: number, b?: number);
        l: number;
        t: number;
        r: number;
        b: number;
    }
    class Color {
        constructor(r?: number, g?: number, b?: number, a?: number);
        r: number;
        g: number;
        b: number;
        a: number;
        toString(): string;
    }
    class Vector3 {
        constructor(x?: number, y?: number, z?: number);
        x: number;
        y: number;
        z: number;
        toString(): string;
    }
    class Vector4 {
        constructor(x?: number, y?: number, z?: number, w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
        toString(): string;
    }
    class Quaternion {
        constructor(x?: number, y?: number, z?: number, w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
        toString(): string;
    }
    class Matrix {
        rawData: Float32Array;
        constructor(datas?: Float32Array);
        toString(): string;
    }
    class Matrix3x2 {
        rawData: Float32Array;
        constructor(datas?: Float32Array);
        toString(): string;
    }
}
declare namespace egret3d.framework {
    interface I2DComponent {
        start(): any;
        update(delta: number): any;
        transform: Transform2D;
        onPointEvent(canvas: Canvas, ev: PointEvent, oncap: boolean): any;
        remove(): any;
    }
    interface IRectRenderer extends I2DComponent {
        render(canvas: Canvas): any;
        updateTran(): any;
    }
    class C2DComponent {
        comp: I2DComponent;
        init: boolean;
        constructor(comp: I2DComponent, init?: boolean);
    }
    class Transform2D {
        private _canvas;
        canvas: Canvas;
        name: string;
        parent: Transform2D;
        children: Transform2D[];
        width: number;
        height: number;
        pivot: math.Vector2;
        hideFlags: HideFlags;
        private _visible;
        readonly visibleInScene: boolean;
        visible: boolean;
        readonly transform: this;
        insId: InsID;
        private dirty;
        private dirtyChild;
        private dirtyWorldDecompose;
        localTranslate: math.Vector2;
        localScale: math.Vector2;
        localRotate: number;
        private localMatrix;
        private worldMatrix;
        private worldRotate;
        private worldTranslate;
        private worldScale;
        addChild(node: Transform2D): void;
        addChildAt(node: Transform2D, index: number): void;
        removeChild(node: Transform2D): void;
        removeAllChild(): void;
        markDirty(): void;
        updateTran(parentChange: boolean): void;
        updateWorldTran(): void;
        getWorldTranslate(): math.Vector2;
        getWorldScale(): math.Vector2;
        getWorldRotate(): math.Angelref;
        getLocalMatrix(): egret3d.math.Matrix3x2;
        getWorldMatrix(): egret3d.math.Matrix3x2;
        setWorldPosition(pos: math.Vector2): void;
        dispose(): void;
        renderer: IRectRenderer;
        components: C2DComponent[];
        update(delta: number): void;
        addComponent(type: string): I2DComponent;
        addComponentDirect(comp: I2DComponent): I2DComponent;
        removeComponent(comp: I2DComponent): void;
        removeComponentByTypeName(type: string): C2DComponent;
        removeAllComponents(): void;
        getComponent(type: string): I2DComponent;
        getComponents(): I2DComponent[];
        getComponentsInChildren(type: string): I2DComponent[];
        private getNodeCompoents(node, _type, comps);
        onCapturePointEvent(canvas: Canvas, ev: PointEvent): void;
        ContainsCanvasPoint(pworld: math.Vector2): boolean;
        onPointEvent(canvas: Canvas, ev: PointEvent): void;
    }
}
declare namespace egret3d.framework {
    enum TransitionType {
        None = 0,
        ColorTint = 1,
        SpriteSwap = 2,
    }
    class Button implements IRectRenderer {
        private _transition;
        transition: TransitionType;
        private _originalColor;
        private _originalSprite;
        private _targetImage;
        targetImage: Image2D;
        private _pressedSprite;
        pressedGraphic: Sprite;
        private _normalColor;
        normalColor: math.Color;
        private _pressedColor;
        pressedColor: math.Color;
        private _fadeDuration;
        fadeDuration: number;
        render(canvas: Canvas): void;
        updateTran(): void;
        start(): void;
        update(delta: number): void;
        transform: Transform2D;
        remove(): void;
        onPointEvent(canvas: Canvas, ev: PointEvent, oncap: boolean): void;
        onClick: UIEvent;
        private _downInThis;
        private _dragOut;
        private showNormal();
        private showPress();
        private changeColor(targetColor);
        private changeSprite(sprite);
    }
}
declare namespace egret3d.framework {
    class Image2D implements IRectRenderer {
        constructor();
        private datar;
        private _sprite;
        color: math.Color;
        mat: Material;
        private _imageType;
        imageType: ImageType;
        private _fillMethod;
        fillMethod: FillMethod;
        private _fillAmmount;
        fillAmmount: FillMethod;
        setTexture(texture: Texture, border?: math.Border, rect?: math.Rect): void;
        sprite: Sprite;
        render(canvas: Canvas): void;
        start(): void;
        update(delta: number): void;
        transform: Transform2D;
        remove(): void;
        onPointEvent(canvas: Canvas, ev: PointEvent, oncap: boolean): void;
        private prepareData();
        updateTran(): void;
        private updateQuadData(x0, y0, x1, y1, x2, y2, x3, y3, quadIndex?, mirror?);
        private updateSimpleData(x0, y0, x1, y1, x2, y2, x3, y3);
        private updateSlicedData(x0, y0, x1, y1, x2, y2, x3, y3);
        private updateFilledData(x0, y0, x1, y1, x2, y2, x3, y3);
        private updateTiledData(x0, y0, x1, y1, x2, y2, x3, y3);
    }
    enum ImageType {
        Simple = 0,
        Sliced = 1,
        Tiled = 2,
        Filled = 3,
    }
    enum FillMethod {
        Horizontal = 0,
        Vertical = 1,
        Radial_90 = 2,
        Radial_180 = 3,
        Radial_360 = 4,
    }
}
declare namespace egret3d.framework {
    class Label implements IRectRenderer {
        private _text;
        text: string;
        private _font;
        font: Font;
        private _fontsize;
        fontsize: number;
        linespace: number;
        horizontalType: HorizontalType;
        verticalType: VerticalType;
        private indexarr;
        private remainarrx;
        updateData(_font: egret3d.framework.Font): void;
        private data_begin;
        private datar;
        color: math.Color;
        color2: math.Color;
        mat: Material;
        private dirtyData;
        render(canvas: Canvas): void;
        updateTran(): void;
        start(): void;
        update(delta: number): void;
        transform: Transform2D;
        remove(): void;
        onPointEvent(canvas: Canvas, ev: PointEvent, oncap: boolean): void;
    }
    enum HorizontalType {
        Center = 0,
        Left = 1,
        Right = 2,
    }
    enum VerticalType {
        Center = 0,
        Top = 1,
        Boom = 2,
    }
}
declare namespace egret3d.framework {
    class RawImage2D implements IRectRenderer {
        private datar;
        private _image;
        image: Texture;
        color: math.Color;
        mat: Material;
        render(canvas: Canvas): void;
        updateTran(): void;
        start(): void;
        update(delta: number): void;
        transform: Transform2D;
        remove(): void;
        onPointEvent(canvas: Canvas, ev: PointEvent, oncap: boolean): void;
    }
}
declare namespace egret3d.framework {
    class ResID {
        constructor();
        private static idAll;
        private static next();
        private id;
        getID(): number;
    }
    class ConstText {
        constructor(text: string);
        private name;
        getText(): string;
    }
    interface IAsset {
        defaultAsset: boolean;
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): any;
        caclByteLength(): number;
    }
}
declare namespace egret3d.framework {
    enum AssetTypeEnum {
        Unknown = 0,
        Auto = 1,
        Bundle = 2,
        CompressBundle = 3,
        GLVertexShader = 4,
        GLFragmentShader = 5,
        Shader = 6,
        Texture = 7,
        TextureDesc = 8,
        Mesh = 9,
        Prefab = 10,
        Material = 11,
        Aniclip = 12,
        Scene = 13,
        Atlas = 14,
        Font = 15,
        TextAsset = 16,
        PackBin = 17,
        PackTxt = 18,
        pathAsset = 19,
        PVR = 20,
    }
    class StateLoad {
        iserror: boolean;
        isfinish: boolean;
        resstate: {
            [id: string]: {
                res: IAsset;
                state: number;
            };
        };
        curtask: number;
        totaltask: number;
        readonly progress: number;
        logs: string[];
        errs: Error[];
        url: string;
    }
    class AssetBundle {
        name: string;
        private id;
        assetmgr: AssetMgr;
        private files;
        private packages;
        url: string;
        path: string;
        constructor(url: string);
        parse(json: any): void;
        unload(): void;
        load(assetmgr: AssetMgr, stateinfo: {
            state: StateLoad;
            type: AssetTypeEnum;
            onstate: (state: StateLoad) => void;
        }): void;
        mapNamed: {
            [id: string]: number;
        };
    }
    class AssetMgr {
        app: Application;
        webgl: WebGLRenderingContext;
        shaderPool: egret3d.render.ShaderPool;
        constructor(app: Application);
        initDefAsset(): void;
        mapShader: {
            [id: string]: Shader;
        };
        getShader(name: string): Shader;
        mapDefaultMesh: {
            [id: string]: Mesh;
        };
        getDefaultMesh(name: string): Mesh;
        mapDefaultTexture: {
            [id: string]: Texture;
        };
        getDefaultTexture(name: string): Texture;
        mapBundle: {
            [id: string]: AssetBundle;
        };
        mapRes: {
            [id: number]: AssetRef;
        };
        mapNamed: {
            [id: string]: number[];
        };
        getAsset(id: number): IAsset;
        getAssetByName(name: string, bundlename?: string): IAsset;
        getAssetBundle(bundlename: string): AssetBundle;
        unuse(res: IAsset, disposeNow?: boolean): void;
        use(res: IAsset): void;
        releaseUnuseAsset(): void;
        getAssetsRefcount(): {
            [id: string]: number;
        };
        private mapInLoad;
        removeAssetBundle(name: string): void;
        private assetUrlDic;
        getAssetUrl(asset: IAsset): string;
        private bundlePackBin;
        private bundlePackJson;
        loadResByPack(packnum: number, url: string, type: AssetTypeEnum, onstate: (state: StateLoad) => void, state: StateLoad): void;
        loadSingleRes(url: string, type: AssetTypeEnum, onstate: (state: StateLoad) => void, state: StateLoad): void;
        private waitStateDic;
        doWaitState(name: string, state: StateLoad): void;
        private queueState;
        private curloadinfo;
        loadByQueue(): void;
        loadCompressBundle(url: string, onstate?: (state: StateLoad) => void): void;
        load(url: string, type?: AssetTypeEnum, onstate?: (state: StateLoad) => void): void;
        unload(url: string, onstate?: () => void): void;
        loadScene(sceneName: string, onComplete: () => void): void;
        saveScene(fun: (data: SaveInfo, resourses?: string[]) => void): void;
        savePrefab(trans: Transform, prefabName: string, fun: (data: SaveInfo, resourses?: string[]) => void): void;
        saveMaterial(mat: Material, fun: (data: SaveInfo) => void): void;
        loadSingleResImmediate(url: string, type: AssetTypeEnum): any;
        loadImmediate(url: string, type?: AssetTypeEnum): any;
        getFileName(url: string): string;
        calcType(url: string): AssetTypeEnum;
    }
    class AssetRef {
        asset: IAsset;
        refcount: number;
    }
    class SaveInfo {
        files: {
            [key: string]: string;
        };
    }
}
declare namespace egret3d.framework {
    class DefMesh {
        static initDefaultMesh(assetmgr: AssetMgr): void;
        private static createDefaultMesh(name, meshData, webgl);
    }
}
declare namespace egret3d.framework {
    class DefShader {
        static vscode: string;
        static fscode: string;
        static fscode2: string;
        static fscodeui: string;
        static vscodeuifont: string;
        static fscodeuifont: string;
        static vsdiffuse: string;
        static fsdiffuse: string;
        static vsline: string;
        static fsline: string;
        static vsmaterialcolor: string;
        static initDefaultShader(assetmgr: AssetMgr): void;
    }
}
declare namespace egret3d.framework {
    class DefTexture {
        static initDefaultTexture(assetmgr: AssetMgr): void;
    }
}
declare namespace egret3d.framework {
    class AnimationClip implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        Parse(buf: ArrayBuffer): void;
        fps: number;
        loop: boolean;
        boneCount: number;
        bones: string[];
        frameCount: number;
        frames: {
            [fid: string]: Float32Array;
        };
        subclipCount: number;
        subclips: SubClip[];
    }
    class PoseBoneMatrix {
        t: math.Vector3;
        r: math.Quaternion;
        static caclByteLength(): number;
        Clone(): PoseBoneMatrix;
        load(read: io.BinReader): void;
        static createDefault(): PoseBoneMatrix;
        copyFrom(src: PoseBoneMatrix): void;
        copyFromData(src: Float32Array, seek: number): void;
        invert(): void;
        lerpInWorld(_tpose: PoseBoneMatrix, from: PoseBoneMatrix, to: PoseBoneMatrix, v: number): void;
        lerpInWorldWithData(_tpose: PoseBoneMatrix, from: PoseBoneMatrix, todata: Float32Array, toseek: number, v: number): void;
        static sMultiply(left: PoseBoneMatrix, right: PoseBoneMatrix, target?: PoseBoneMatrix): PoseBoneMatrix;
        static sMultiplyDataAndMatrix(leftdata: Float32Array, leftseek: number, right: PoseBoneMatrix, target?: PoseBoneMatrix): PoseBoneMatrix;
        static sLerp(left: PoseBoneMatrix, right: PoseBoneMatrix, v: number, target?: PoseBoneMatrix): PoseBoneMatrix;
    }
    class SubClip {
        name: string;
        loop: boolean;
        startframe: number;
        endframe: number;
        static caclByteLength(): number;
    }
}
declare namespace egret3d.framework {
    class Atlas implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        texturewidth: number;
        textureheight: number;
        private _texture;
        texture: Texture;
        sprites: {
            [id: string]: Sprite;
        };
        Parse(jsonStr: string, assetmgr: AssetMgr): void;
    }
}
declare namespace egret3d.framework {
    class Font implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        private _texture;
        texture: Texture;
        cmap: {
            [id: string]: Charinfo;
        };
        fontname: string;
        pointSize: number;
        padding: number;
        lineHeight: number;
        baseline: number;
        atlasWidth: number;
        atlasHeight: number;
        Parse(jsonStr: string, assetmgr: AssetMgr): void;
    }
    class Charinfo {
        x: number;
        y: number;
        w: number;
        h: number;
        xSize: number;
        ySize: number;
        xOffset: number;
        yOffset: number;
        xAddvance: number;
        static caclByteLength(): number;
    }
}
declare namespace egret3d.framework {
    class UniformData {
        type: render.UniformTypeEnum;
        value: any;
        defaultValue: any;
        constructor(type: render.UniformTypeEnum, value: any, defaultValue?: any);
    }
    class Material implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        dispose(): void;
        use(): void;
        unuse(disposeNow?: boolean): void;
        caclByteLength(): number;
        initUniformData(passes: render.GlDrawPass[]): void;
        setShader(shader: Shader): void;
        private _changeShaderMap;
        changeShader(shader: Shader): void;
        getLayer(): RenderLayerEnum;
        getQueue(): number;
        getShader(): Shader;
        private shader;
        mapUniform: {
            [id: string]: UniformData;
        };
        private mapUniformTemp;
        setFloat(_id: string, _number: number): void;
        setFloatv(_id: string, _numbers: Float32Array): void;
        setVector4(_id: string, _vector4: math.Vector4): void;
        setVector4v(_id: string, _vector4v: Float32Array): void;
        setMatrix(_id: string, _matrix: math.Matrix): void;
        setMatrixv(_id: string, _matrixv: Float32Array): void;
        setTexture(_id: string, _texture: egret3d.framework.Texture): void;
        uploadUniform(pass: render.GlDrawPass): void;
        draw(context: RenderContext, mesh: Mesh, sm: SubMeshInfo, basetype?: string): void;
        Parse(assetmgr: AssetMgr, json: any): void;
        clone(): Material;
    }
}
declare namespace egret3d.framework {
    class Mesh implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        glMesh: egret3d.render.GlMesh;
        data: egret3d.render.MeshData;
        submesh: SubMeshInfo[];
        Parse(buf: ArrayBuffer, webgl: WebGLRenderingContext): void;
        intersects(ray: Ray, matrix: egret3d.math.Matrix): Pickinfo;
        clone(): Mesh;
    }
    class SubMeshInfo {
        matIndex: number;
        useVertexIndex: number;
        line: boolean;
        start: number;
        size: number;
    }
}
declare namespace egret3d.framework {
    class Pathasset implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(): void;
        dispose(): void;
        caclByteLength(): number;
        paths: egret3d.math.Vector3[];
        private type;
        private instertPointcount;
        private items;
        Parse(json: JSON): void;
        private lines;
        private getpaths();
        private getBeisaierPointAlongCurve(points, rate, clearflag?);
        private vec3Lerp(start, end, lerp, out);
    }
    enum pathtype {
        once = 0,
        loop = 1,
        pingpong = 2,
    }
    enum epointtype {
        VertexPoint = 0,
        ControlPoint = 1,
    }
    class Pointitem {
        point: egret3d.math.Vector3;
        type: epointtype;
    }
}
declare namespace egret3d.framework {
    class Prefab implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        assetbundle: string;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        private trans;
        getCloneTrans(): Transform;
        apply(trans: Transform): void;
        jsonstr: string;
        Parse(jsonStr: string, assetmgr: AssetMgr): void;
    }
}
declare namespace egret3d.framework {
    class Rawscene implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        assetbundle: string;
        use(): void;
        unuse(disposeNow?: boolean): void;
        caclByteLength(): number;
        Parse(txt: string, assetmgr: AssetMgr): void;
        getSceneRoot(): Transform;
        useLightMap(scene: Scene): void;
        dispose(): void;
        private rootNode;
        private lightmaps;
    }
}
declare namespace egret3d.framework {
    class Shader implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        passes: {
            [id: string]: egret3d.render.GlDrawPass[];
        };
        defaultValue: {
            [key: string]: {
                type: string;
                value?: any;
                defaultValue?: any;
                min?: number;
                max?: number;
            };
        };
        layer: RenderLayerEnum;
        queue: number;
        parse(assetmgr: AssetMgr, json: any): void;
        private _parseProperties(assetmgr, properties);
        private _parsePass(assetmgr, json);
    }
}
declare namespace egret3d.framework {
    class Sprite implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        private _texture;
        texture: Texture;
        atlas: string;
        rect: math.Rect;
        border: math.Border;
        private _urange;
        private _vrange;
        readonly urange: math.Vector2;
        readonly vrange: math.Vector2;
    }
}
declare namespace egret3d.framework {
    class Textasset implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(): void;
        dispose(): void;
        content: string;
        caclByteLength(): number;
    }
}
declare namespace egret3d.framework {
    class Texture implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        glTexture: egret3d.render.ITexture;
        caclByteLength(): number;
        private _realName;
        realName: string;
    }
}
declare namespace egret3d.framework {
    class AudioChannel {
        source: AudioBufferSourceNode;
        gainNode: GainNode;
        pannerNode: PannerNode;
        volume: number;
        isplay: boolean;
        stop(): void;
    }
    class AudioEx {
        private constructor();
        clickInit(): void;
        private static g_this;
        static instance(): AudioEx;
        audioContext: AudioContext;
        private static loadArrayBuffer(url, fun);
        isAvailable(): boolean;
        loadAudioBufferFromArrayBuffer(ab: ArrayBuffer, fun: (buf: AudioBuffer, _err: Error) => void): void;
        loadAudioBuffer(url: string, fun: (buf: AudioBuffer, _err: Error) => void): void;
        private getNewChannel();
        private getFreeChannelOnce();
        private channelOnce;
        playOnce(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel;
        playOnceInterrupt(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel;
        playOnceBlocking(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel;
        private channelLoop;
        playLooped(name: string, buf: AudioBuffer): void;
        stopLooped(name: string): void;
        private _soundVolume;
        setSoundVolume(val: number): void;
        private _musicVolume;
        setMusicVolume(val: number): void;
    }
}
declare namespace egret3d.framework {
    class AniPlayer implements INodeComponent {
        gameObject: GameObject;
        private _clipnameCount;
        private _clipnames;
        readonly clipnames: {
            [key: string]: number;
        };
        clips: AnimationClip[];
        autoplay: boolean;
        private playIndex;
        private _playClip;
        bones: TPoseInfo[];
        startPos: PoseBoneMatrix[];
        tpose: {
            [key: string]: PoseBoneMatrix;
        };
        nowpose: {
            [key: string]: PoseBoneMatrix;
        };
        lerppose: {
            [key: string]: PoseBoneMatrix;
        };
        carelist: {
            [id: string]: Transform;
        };
        private _playFrameid;
        _playTimer: number;
        speed: number;
        crossdelta: number;
        crossspeed: number;
        private beRevert;
        private playStyle;
        private percent;
        mix: boolean;
        private init();
        start(): void;
        update(delta: number): void;
        playByIndex(animIndex: number, speed?: number, beRevert?: boolean): void;
        playCrossByIndex(animIndex: number, crosstimer: number, speed?: number, beRevert?: boolean): void;
        play(animName: string, speed?: number, beRevert?: boolean): void;
        playCross(animName: string, crosstimer: number, speed?: number, beRevert?: boolean): void;
        private playAniamtion(index, speed?, beRevert?);
        stop(): void;
        isPlay(): boolean;
        isStop(): boolean;
        remove(): void;
        clone(): void;
        private finishCallBack;
        private thisObject;
        addFinishedEventListener(finishCallBack: Function, thisObject: any): void;
        private checkFrameId(delay);
        fillPoseData(data: Float32Array, bones: Transform[]): void;
        care(node: Transform): void;
    }
    class TPoseInfo {
        name: string;
        tposep: math.Vector3;
        tposeq: math.Quaternion;
    }
    enum PlayStyle {
        NormalPlay = 0,
        FramePlay = 1,
        PingPang = 2,
    }
}
declare namespace egret3d.framework {
    class Asbone implements INodeComponent {
        constructor();
        gameObject: GameObject;
        start(): void;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    interface ICollider {
        gameObject: GameObject;
        subTran: Transform;
        getBound(): any;
        intersectsTransform(tran: Transform): boolean;
    }
    class BoxCollider implements INodeComponent, ICollider {
        gameObject: GameObject;
        subTran: Transform;
        filter: MeshFilter;
        obb: Obb;
        center: math.Vector3;
        size: math.Vector3;
        getBound(): Obb;
        readonly matrix: egret3d.math.Matrix;
        start(): void;
        update(delta: number): void;
        _colliderVisible: boolean;
        colliderVisible: boolean;
        intersectsTransform(tran: Transform): boolean;
        private build();
        private buildMesh();
        private getColliderMesh();
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    interface ICameraPostQueue {
        render(scene: Scene, context: RenderContext, camera: Camera): any;
        renderTarget: render.GlRenderTarget;
    }
    class CameraPostQueue_Depth implements ICameraPostQueue {
        constructor();
        render(scene: Scene, context: RenderContext, camera: Camera): void;
        renderTarget: render.GlRenderTarget;
    }
    class CameraPostQueue_Quad implements ICameraPostQueue {
        material: Material;
        constructor();
        render(scene: Scene, context: RenderContext, camera: Camera): void;
        renderTarget: render.GlRenderTarget;
    }
    class CameraPostQueue_Color implements ICameraPostQueue {
        constructor();
        render(scene: Scene, context: RenderContext, camera: Camera): void;
        renderTarget: render.GlRenderTarget;
    }
    interface IOverLay {
        init: boolean;
        start(camera: Camera): any;
        render(context: RenderContext, assetmgr: AssetMgr, camera: Camera): any;
        update(delta: number): any;
    }
    class Camera implements INodeComponent {
        gameObject: GameObject;
        private _near;
        near: number;
        private _far;
        far: number;
        isMainCamera: boolean;
        CullingMask: CullingMask;
        index: number;
        markDirty(): void;
        start(): void;
        update(delta: number): void;
        clearOption_Color: boolean;
        clearOption_Depth: boolean;
        backgroundColor: egret3d.math.Color;
        viewport: egret3d.math.Rect;
        renderTarget: egret3d.render.GlRenderTarget;
        order: number;
        private overlays;
        addOverLay(overLay: IOverLay): void;
        addOverLayAt(overLay: IOverLay, index: number): void;
        getOverLays(): IOverLay[];
        removeOverLay(overLay: IOverLay): void;
        calcViewMatrix(matrix: egret3d.math.Matrix): void;
        calcViewPortPixel(app: Application, viewPortPixel: math.Rect): void;
        calcProjectMatrix(asp: number, matrix: egret3d.math.Matrix): void;
        creatRayByScreen(screenpos: egret3d.math.Vector2, app: Application): Ray;
        calcWorldPosFromScreenPos(app: Application, screenPos: math.Vector3, outWorldPos: math.Vector3): void;
        calcScreenPosFromWorldPos(app: Application, worldPos: math.Vector3, outScreenPos: math.Vector2): void;
        calcCameraFrame(app: Application): void;
        private matView;
        private matProjP;
        private matProjO;
        private matProj;
        private frameVecs;
        fov: number;
        size: number;
        opvalue: number;
        getPosAtXPanelInViewCoordinateByScreenPos(screenPos: egret3d.math.Vector2, app: Application, z: number, out: egret3d.math.Vector2): void;
        fillRenderer(scene: Scene): void;
        private _fillRenderer(scene, node);
        testFrustumCulling(scene: Scene, node: Transform): boolean;
        _targetAndViewport(target: render.GlRenderTarget, scene: Scene, context: RenderContext, withoutClear: boolean): void;
        _renderOnce(scene: Scene, context: RenderContext, drawtype: string): void;
        postQueues: ICameraPostQueue[];
        renderScene(scene: Scene, context: RenderContext): void;
        remove(): void;
        clone(): void;
    }
    enum CullingMask {
        ui = 1,
        default = 2,
        editor = 4,
        model = 8,
        everything = 4294967295,
        nothing = 0,
        modelbeforeui = 8,
    }
}
declare namespace egret3d.framework {
    class EffectSystem implements IRenderer {
        gameObject: GameObject;
        layer: RenderLayerEnum;
        renderLayer: CullingMask;
        queue: number;
        autoplay: boolean;
        beLoop: boolean;
        state: EffectPlayStateEnum;
        private curFrameId;
        frameId: number;
        static fps: number;
        private playTimer;
        private speed;
        webgl: WebGLRenderingContext;
        private parser;
        vf: number;
        particleVF: number;
        private effectBatchers;
        private particles;
        private matDataGroups;
        setEffect(effectConfig: string): void;
        jsonData: Textasset;
        setJsonData(_jsonData: Textasset): void;
        data: EffectSystemData;
        init(): void;
        private _data;
        readonly totalFrameCount: number;
        start(): void;
        update(delta: number): void;
        private _update(delta);
        private mergeLerpAttribData(realUseCurFrameData, curFrameData);
        private updateEffectBatcher(effectBatcher, curAttrsData, initFrameData, vertexStartIndex);
        render(context: RenderContext, assetmgr: AssetMgr, camera: egret3d.framework.Camera): void;
        clone(): EffectSystem;
        play(speed?: number): void;
        pause(): void;
        stop(): void;
        reset(restSinglemesh?: boolean, resetParticle?: boolean): void;
        private resetSingleMesh();
        private resetparticle();
        private addElements();
        private addInitFrame(elementData);
        setFrameId(id: number): void;
        private checkFrameId();
        remove(): void;
        readonly leftLifeTime: number;
    }
}
declare namespace egret3d.framework {
    class Frustumculling implements INodeComponent {
        constructor();
        gameObject: GameObject;
        start(): void;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    class Guidpath implements INodeComponent {
        private paths;
        private _pathasset;
        pathasset: Pathasset;
        speed: number;
        private isactived;
        play(loopCount?: number): void;
        pause(): void;
        stop(): void;
        replay(loopCount?: number): void;
        private mystrans;
        private datasafe;
        private folowindex;
        isloop: boolean;
        lookforward: boolean;
        private loopCount;
        private oncomplete;
        setpathasset(pathasset: Pathasset, speed?: number, oncomplete?: () => void): void;
        start(): void;
        update(delta: number): void;
        private adjustDir;
        private followmove(delta);
        gameObject: GameObject;
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    enum LightTypeEnum {
        Direction = 0,
        Point = 1,
        Spot = 2,
    }
    class Light implements INodeComponent {
        gameObject: GameObject;
        isOpen: boolean;
        lightName: string;
        type: LightTypeEnum;
        spotAngelCos: number;
        start(): void;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    class MeshCollider implements INodeComponent, ICollider {
        gameObject: GameObject;
        subTran: Transform;
        mesh: Mesh;
        getBound(): Mesh;
        start(): void;
        update(delta: number): void;
        _colliderVisible: boolean;
        colliderVisible: boolean;
        intersectsTransform(tran: Transform): boolean;
        private buildMesh();
        private getColliderMesh();
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    class MeshFilter implements INodeComponent {
        gameObject: GameObject;
        start(): void;
        update(delta: number): void;
        private _mesh;
        mesh: Mesh;
        getMeshOutput(): Mesh;
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    class MeshRenderer implements IRenderer {
        constructor();
        gameObject: GameObject;
        materials: Material[];
        lightmapIndex: number;
        lightmapScaleOffset: math.Vector4;
        layer: RenderLayerEnum;
        renderLayer: egret3d.framework.CullingMask;
        private issetq;
        _queue: number;
        queue: number;
        filter: MeshFilter;
        start(): void;
        private refreshLayerAndQue();
        update(delta: number): void;
        render(context: RenderContext, assetmgr: AssetMgr, camera: egret3d.framework.Camera): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    class SkinnedMeshRenderer implements IRenderer {
        constructor();
        gameObject: GameObject;
        layer: RenderLayerEnum;
        renderLayer: CullingMask;
        private issetq;
        _queue: number;
        queue: number;
        materials: Material[];
        _player: AniPlayer;
        readonly player: AniPlayer;
        private _mesh;
        mesh: Mesh;
        bones: Transform[];
        rootBone: Transform;
        center: math.Vector3;
        size: math.Vector3;
        maxBoneCount: number;
        private _skeletonMatrixData;
        start(): void;
        getMatByIndex(index: number): math.Matrix;
        intersects(ray: Ray): Pickinfo;
        update(delta: number): void;
        render(context: RenderContext, assetmgr: AssetMgr, camera: egret3d.framework.Camera): void;
        remove(): void;
        clone(): void;
        useBoneShader(mat: Material): number;
    }
}
declare namespace egret3d.framework {
    class Spherestruct {
        center: egret3d.math.Vector3;
        radius: number;
        srcradius: number;
        private tempScale;
        constructor(_center: math.Vector3, _r: number);
        update(worldmatrix: math.Matrix): void;
        intersects(bound: any): boolean;
    }
    class SphereCollider implements INodeComponent, ICollider {
        gameObject: GameObject;
        subTran: Transform;
        filter: MeshFilter;
        spherestruct: Spherestruct;
        center: math.Vector3;
        radius: number;
        _worldCenter: math.Vector3;
        readonly worldCenter: math.Vector3;
        getBound(): Spherestruct;
        readonly matrix: egret3d.math.Matrix;
        start(): void;
        update(delta: number): void;
        _colliderVisible: boolean;
        colliderVisible: boolean;
        caclPlaneInDir(v0: math.Vector3, v1: math.Vector3, v2: math.Vector3): boolean;
        intersectsTransform(tran: Transform): boolean;
        private build();
        private buildMesh();
        private getColliderMesh();
        remove(): void;
        clone(): void;
    }
}
declare namespace egret3d.framework {
    class TrailRender_recorde implements IRenderer {
        layer: RenderLayerEnum;
        renderLayer: egret3d.framework.CullingMask;
        queue: number;
        private _startWidth;
        private _endWidth;
        lifetime: number;
        minStickDistance: number;
        maxStickCout: number;
        private _material;
        private _startColor;
        private _endColor;
        private trailTrans;
        private nodes;
        private mesh;
        private dataForVbo;
        private dataForEbo;
        interpolate: boolean;
        interpNumber: number;
        interpPath: TrailNode[];
        private targetPath;
        material: egret3d.framework.Material;
        startColor: egret3d.math.Color;
        endColor: egret3d.math.Color;
        setWidth(startWidth: number, endWidth?: number): void;
        private activeMaxpointlimit;
        setMaxpointcontroll(value?: boolean): void;
        start(): void;
        private app;
        private webgl;
        update(delta: number): void;
        gameObject: GameObject;
        remove(): void;
        private refreshTrailNode(curTime);
        private notRender;
        private updateTrailData(curTime);
        private checkBufferSize();
        render(context: RenderContext, assetmgr: AssetMgr, camera: Camera): void;
        clone(): void;
    }
    class TrailNode {
        location: egret3d.math.Vector3;
        updir: egret3d.math.Vector3;
        time: number;
        handle: egret3d.math.Vector3;
        trailNodes: TrailNode[];
        constructor(p: egret3d.math.Vector3, updir: egret3d.math.Vector3, t: number);
    }
}
declare namespace egret3d.framework {
    class TrailRender implements IRenderer {
        layer: RenderLayerEnum;
        renderLayer: egret3d.framework.CullingMask;
        queue: number;
        private width;
        private _material;
        private _color;
        private mesh;
        private vertexcount;
        private dataForVbo;
        private dataForEbo;
        private sticks;
        private active;
        private reInit;
        start(): void;
        private app;
        private webgl;
        private camerapositon;
        extenedOneSide: boolean;
        update(delta: number): void;
        gameObject: GameObject;
        material: egret3d.framework.Material;
        color: egret3d.math.Color;
        setspeed(upspeed: number): void;
        setWidth(Width: number): void;
        play(): void;
        stop(): void;
        lookAtCamera: boolean;
        private initmesh();
        private intidata();
        private speed;
        private updateTrailData();
        render(context: RenderContext, assetmgr: AssetMgr, camera: Camera): void;
        clone(): void;
        remove(): void;
    }
    class TrailStick {
        location: egret3d.math.Vector3;
        updir: egret3d.math.Vector3;
    }
}
declare namespace egret3d.framework {
    class Pointinfo {
        id: number;
        touch: boolean;
        x: number;
        y: number;
    }
    class InputMgr {
        private inputlast;
        point: Pointinfo;
        touches: {
            [id: number]: Pointinfo;
        };
        keyboardMap: {
            [id: number]: boolean;
        };
        constructor(app: Application);
    }
}
declare namespace egret3d.io {
    class BinBuffer {
        _buf: Uint8Array[];
        private _seekWritePos;
        private _seekWriteIndex;
        private _seekReadPos;
        private _bufSize;
        getLength(): number;
        getBufLength(): number;
        getBytesAvailable(): number;
        constructor(bufSize?: number);
        reset(): void;
        dispose(): void;
        read(target: Uint8Array | number[], offset?: number, length?: number): void;
        write(array: Uint8Array | number[], offset?: number, length?: number): void;
        getBuffer(): Uint8Array;
        getUint8Array(): Uint8Array;
    }
    class Converter {
        static getApplyFun(value: any): any;
        private static dataView;
        static ULongToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static LongToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float64ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int8ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint32toArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint8ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static StringToUtf8Array(str: string): Uint8Array | number[];
        static ArrayToLong(buf: Uint8Array, offset?: number): number;
        static ArrayToULong(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat64(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt16(buf: Uint8Array, offset?: number): number;
        static ArrayToInt8(buf: Uint8Array, offset?: number): number;
        static ArraytoUint32(buf: Uint8Array, offset?: number): number;
        static ArrayToUint16(buf: Uint8Array, offset?: number): number;
        static ArrayToUint8(buf: Uint8Array, offset?: number): number;
        static ArrayToString(buf: Uint8Array, offset?: number): string;
    }
    class BinTool extends BinBuffer {
        readSingle(): number;
        readLong(): number;
        readULong(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
        readBytes(length: number): Uint8Array;
        readStringUtf8(): string;
        readStringUtf8FixLength(length: number): string;
        readUTFBytes(length: number): string;
        readStringAnsi(): string;
        readonly length: number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeLong(num: number): void;
        writeULong(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        writeStringUtf8DataOnly(str: string): void;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace egret3d.io {
    function cloneObj(instanceObj: any, clonedObj?: any): any;
    function fillCloneReference(instanceObj: any, clonedObj: any): any;
    function fillCloneReferenceTypeOrArray(instanceObj: any, clonedObj: any, key: string): void;
    function fillCloneReferenceType(instanceObj: any, clonedObj: any, key: string, instanceParent?: any, clonedParent?: any, instanceKey?: string): void;
    function _cloneObj(instanceObj: any, clonedObj?: any): any;
    function cloneOtherTypeOrArray(instanceObj: any, clonedObj: any, key: string): void;
    function cloneOtherType(instanceObj: any, clonedObj: any, key: string, instanceParent?: any, clonedParent?: any, instanceKey?: string): void;
}
declare namespace egret3d.io {
    function stringToBlob(content: string): Blob;
    function stringToUtf8Array(str: string): number[];
}
declare namespace egret3d.io {
    class SerializeDependent {
        static resoursePaths: string[];
        static GetAssetUrl(asset: any, assetMgr: any): void;
    }
    function SerializeForInspector(obj: any): string;
    function serializeObjForInspector(instanceObj: any, beComponent: boolean, serializedObj?: any): any;
    function serializeOtherTypeOrArrayForInspector(instanceObj: any, serializedObj: any, key: string, beComponent: boolean): void;
    function serializeOtherTypeForInspector(instanceObj: any, serializedObj: any, key: string, beComponent: boolean, arrayInst?: any): void;
    function Serialize(obj: any, assetMgr?: any): string;
    function serializeObj(instanceObj: any, serializedObj?: any, assetMgr?: any): any;
    function serializeOtherTypeOrArray(instanceObj: any, serializedObj: any, key: string, assetMgr?: any): void;
    function serializeOtherType(instanceObj: any, serializedObj: any, key: string, arrayInst?: any, assetMgr?: any): void;
    function deSerialize(serializedObj: string, instanceObj: any, assetMgr: any, bundlename?: string): void;
    function fillReference(serializedObj: any, instanceObj: any): void;
    function dofillReferenceOrArray(serializedObj: any, instanceObj: any, key: string): void;
    function dofillReference(serializedObj: any, instanceObj: any, key: string): void;
    function deSerializeObj(serializedObj: any, instanceObj: any, assetMgr: any, bundlename?: string): void;
    function deSerializeOtherTypeOrArray(serializedObj: any, instanceObj: any, key: string, assetMgr: any, bundlename?: string): void;
    function deSerializeOtherType(serializedObj: any, instanceObj: any, key: string, assetMgr: any, bundlename?: string): void;
    function isArray(type: string): boolean;
    function isArrayOrDic(type: string): boolean;
    function isAsset(type: string): boolean;
    function isAssetInspector(type: string): boolean;
    class ReferenceInfo {
        static oldmap: {
            [id: number]: any;
        };
        static regtypelist: string[];
        static regDefaultType(): void;
        static regType(type: string): void;
        static isRegType(type: string): boolean;
    }
    class EnumMgr {
        static enumMap: {
            [id: string]: any;
        };
    }
}
declare namespace egret3d.io {
    class BinReader {
        private _data;
        constructor(buf: ArrayBuffer, seek?: number);
        private _seek;
        seek(seek: number): void;
        peek(): number;
        length(): number;
        canread(): number;
        readStringAnsi(): string;
        static utf8ArrayToString(array: Uint8Array | number[]): string;
        readStringUtf8(): string;
        readStringUtf8FixLength(length: number): string;
        readSingle(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readUint8Array(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUint8ArrayByOffset(target: Uint8Array, offset: number, length?: number): Uint8Array;
        position: number;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readUTFBytes(length: number): string;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
    }
    class BinWriter {
        _buf: Uint8Array;
        private _data;
        private _length;
        private _seek;
        constructor();
        private sureData(addlen);
        getLength(): number;
        getBuffer(): ArrayBuffer;
        seek(seek: number): void;
        peek(): number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        static stringToUtf8Array(str: string): number[];
        writeStringUtf8DataOnly(str: string): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        readonly length: number;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace egret3d.math {
    function colorSet_White(out: Color): void;
    function colorSet_Black(out: Color): void;
    function colorSet_Gray(out: Color): void;
    function colorMultiply(srca: Color, srcb: Color, out: Color): void;
    function scaleToRef(src: Color, scale: number, out: Color): void;
    function colorClone(src: Color, out: Color): void;
    function colorLerp(srca: Color, srcb: Color, t: number, out: Color): void;
}
declare namespace egret3d.math {
    function calPlaneLineIntersectPoint(planeVector: Vector3, planePoint: Vector3, lineVector: Vector3, linePoint: Vector3, out: Vector3): void;
    function isContain(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2, mp: Vector2): boolean;
    function Multiply(p1: Vector2, p2: Vector2, p0: Vector2): number;
}
declare namespace egret3d.math {
    function matrixGetTranslation(src: Matrix, out: Vector3): void;
    function matrixTranspose(src: Matrix, out: Matrix): void;
    function matrixDecompose(src: Matrix, scale: Vector3, rotation: Quaternion, translation: Vector3): boolean;
    class Angelref {
        v: number;
    }
    function matrix3x2Decompose(src: Matrix3x2, scale: Vector2, rotation: Angelref, translation: Vector2): boolean;
    function matrix2Quaternion(matrix: Matrix, result: Quaternion): void;
    function matrixClone(src: Matrix, out: Matrix): void;
    function matrix3x2Clone(src: Matrix3x2, out: Matrix3x2): void;
    function matrixMakeIdentity(out: Matrix): void;
    function matrix3x2MakeIdentity(out: Matrix3x2): void;
    function matrixInverse(src: Matrix, out: Matrix): void;
    function matrix3x2Inverse(src: Matrix3x2, out: Matrix3x2): void;
    function matrixMakeTransformRTS(pos: Vector3, scale: Vector3, rot: Quaternion, out: Matrix): void;
    function matrix3x2MakeTransformRTS(pos: Vector2, scale: Vector2, rot: number, out: Matrix3x2): void;
    function matrixMakeTranslate(x: number, y: number, z: number, out: Matrix): void;
    function matrix3x2MakeTranslate(x: number, y: number, out: Matrix3x2): void;
    function matrixGetScale(src: Matrix, scale: Vector3): void;
    function matrixMakeScale(xScale: number, yScale: number, zScale: number, out: Matrix): void;
    function matrix3x2TransformVector2(mat: Matrix, inp: Vector2, out: Vector2): void;
    function matrix3x2TransformNormal(mat: Matrix, inp: Vector2, out: Vector2): void;
    function matrix3x2MakeScale(xScale: number, yScale: number, out: Matrix3x2): void;
    function matrixMakeRotateAxisAngle(axis: Vector3, angle: number, out: Matrix): void;
    function matrix3x2MakeRotate(angle: number, out: Matrix3x2): void;
    function matrixMultiply(lhs: Matrix, rhs: Matrix, out: Matrix): void;
    function matrix3x2Multiply(lhs: Matrix3x2, rhs: Matrix3x2, out: Matrix3x2): void;
    function matrixProject_PerspectiveLH(fov: number, aspect: number, znear: number, zfar: number, out: Matrix): void;
    function matrixProject_OrthoLH(width: number, height: number, znear: number, zfar: number, out: Matrix): void;
    function matrixLookatLH(forward: Vector3, up: Vector3, out: Matrix): void;
    function matrixViewLookatLH(eye: Vector3, forward: Vector3, up: Vector3, out: Matrix): void;
    function matrixLerp(left: Matrix, right: Matrix, v: number, out: Matrix): void;
    function matrixTransformVector3(vector: Vector3, transformation: Matrix, result: Vector3): void;
    function matrixTransformNormal(vector: Vector3, transformation: Matrix, result: Vector3): void;
    function matrixGetVector3ByOffset(src: Matrix, offset: number, result: Vector3): void;
    function matrixReset(mat: Matrix): void;
    function matrixZero(mat: Matrix): void;
    function matrixScaleByNum(value: number, mat: Matrix): void;
    function matrixAdd(left: Matrix, right: Matrix, out: Matrix): void;
}
declare namespace egret3d.math {
    function floatClamp(v: number, min?: number, max?: number): number;
    function sign(value: number): number;
    function getKeyCodeByAscii(ev: KeyboardEvent): number;
    function numberLerp(fromV: number, toV: number, v: number): number;
    function x_AXIS(): Vector3;
    function y_AXIS(): Vector3;
    function z_AXIS(): Vector3;
    class CommonStatic {
        static x_axis: egret3d.math.Vector3;
        static y_axis: egret3d.math.Vector3;
        static z_axis: egret3d.math.Vector3;
    }
}
declare namespace egret3d.math {
    function quatNormalize(src: Quaternion, out: Quaternion): void;
    function quatTransformVector(src: Quaternion, vector: Vector3, out: Vector3): void;
    function quatTransformVectorDataAndQuat(src: Float32Array, srcseek: number, vector: Vector3, out: Vector3): void;
    function quatMagnitude(src: Quaternion): number;
    function quatClone(src: Quaternion, out: Quaternion): void;
    function quatToMatrix(src: Quaternion, out: Matrix): void;
    function quatInverse(src: Quaternion, out: Quaternion): void;
    function quatFromYawPitchRoll(yaw: number, pitch: number, roll: number, result: Quaternion): void;
    function quatMultiply(srca: Quaternion, srcb: Quaternion, out: Quaternion): void;
    function quatMultiplyDataAndQuat(srca: Float32Array, srcaseek: number, srcb: Quaternion, out: Quaternion): void;
    function quatMultiplyVector(vector: Vector3, scr: Quaternion, out: Quaternion): void;
    function quatLerp(srca: Quaternion, srcb: Quaternion, out: Quaternion, t: number): void;
    function quatFromAxisAngle(axis: Vector3, angle: number, out: Quaternion): void;
    function quatToAxisAngle(src: Quaternion, axis: Vector3): number;
    function quatFromEulerAngles(ax: number, ay: number, az: number, out: Quaternion): void;
    function quatToEulerAngles(src: Quaternion, out: Vector3): void;
    function quatReset(src: Quaternion): void;
    function quatLookat(pos: Vector3, targetpos: Vector3, out: Quaternion): void;
    function quat2Lookat(pos: Vector3, targetpos: Vector3, out: Quaternion, updir?: egret3d.math.Vector3): void;
    function quatYAxis(pos: Vector3, targetpos: Vector3, out: Quaternion): void;
}
declare namespace egret3d.math {
    function rectSet_One(out: Rect): void;
    function rectSet_Zero(out: Rect): void;
    function rectEqul(src1: Rect, src2: Rect): boolean;
    function rectInner(x: number, y: number, src: Rect): boolean;
}
declare namespace egret3d.math {
    function caclStringByteLength(value: string): number;
}
declare namespace egret3d.math {
    function spriteAnimation(row: number, column: number, index: number, out: Vector4): void;
    function GetPointAlongCurve(curveStart: Vector3, curveStartHandle: Vector3, curveEnd: Vector3, curveEndHandle: Vector3, t: number, out: Vector3, crease?: number): void;
}
declare namespace egret3d.math {
    function vec2Subtract(a: Vector2, b: Vector2, out: Vector2): void;
    function vec2Add(a: Vector2, b: Vector2, out: Vector2): void;
    function vec2Clone(from: Vector2, to: Vector2): void;
    function vec2Distance(a: Vector2, b: Vector2): number;
    function vec2ScaleByNum(from: Vector2, scale: number, out: Vector2): void;
    function vec4Clone(from: Vector4, to: Vector4): void;
    function vec2Length(a: Vector2): number;
    function vec2SLerp(vector: Vector2, vector2: Vector2, v: number, out: Vector2): void;
    function vec2Normalize(from: Vector2, out: Vector2): void;
    function vec2Multiply(a: Vector2, b: Vector2): number;
    function vec2Equal(vector: Vector2, vector2: Vector2, threshold?: number): boolean;
}
declare namespace egret3d.math {
    function vec3Clone(from: Vector3, to: Vector3): void;
    function vec3ToString(result: string): void;
    function vec3Add(a: Vector3, b: Vector3, out: Vector3): void;
    function vec3Subtract(a: Vector3, b: Vector3, out: Vector3): void;
    function vec3Minus(a: Vector3, out: Vector3): void;
    function vec3Length(a: Vector3): number;
    function vec3SqrLength(value: Vector3): number;
    function vec3Set_One(value: Vector3): void;
    function vec3Set_Forward(value: Vector3): void;
    function vec3Set_Back(value: Vector3): void;
    function vec3Set_Up(value: Vector3): void;
    function vec3Set_Down(value: Vector3): void;
    function vec3Set_Left(value: Vector3): void;
    function vec3Set_Right(value: Vector3): void;
    function vec3Normalize(value: Vector3, out: Vector3): void;
    function vec3ScaleByVec3(from: Vector3, scale: Vector3, out: Vector3): void;
    function vec3ScaleByNum(from: Vector3, scale: number, out: Vector3): void;
    function vec3Product(a: Vector3, b: Vector3, out: Vector3): void;
    function vec3Cross(lhs: Vector3, rhs: Vector3, out: Vector3): void;
    function vec3Reflect(inDirection: Vector3, inNormal: Vector3, out: Vector3): void;
    function vec3Dot(lhs: Vector3, rhs: Vector3): number;
    function vec3Project(vector: Vector3, onNormal: Vector3, out: Vector3): void;
    function vec3ProjectOnPlane(vector: Vector3, planeNormal: Vector3, out: Vector3): void;
    function vec3Exclude(excludeThis: Vector3, fromThat: Vector3, out: Vector3): void;
    function vec3Angle(from: Vector3, to: Vector3): number;
    function vec3Distance(a: Vector3, b: Vector3): number;
    function vec3ClampLength(vector: Vector3, maxLength: number, out: Vector3): void;
    function vec3Min(lhs: Vector3, rhs: Vector3, out: Vector3): void;
    function vec3Max(lhs: Vector3, rhs: Vector3, out: Vector3): void;
    function vec3AngleBetween(from: Vector3, to: Vector3): number;
    function vec3Reset(val: Vector3): void;
    function vec3SLerp(vector: Vector3, vector2: Vector3, v: number, out: Vector3): void;
    function vec3SetByFloat(x: number, y: number, z: number, out: Vector3): void;
    function vec3Format(vector: Vector3, maxDot: number, out: Vector3): void;
    function quaternionFormat(vector: Quaternion, maxDot: number, out: Quaternion): void;
    function floatFormat(num: number, maxDot: number): number;
    function vec3Equal(vector: Vector3, vector2: Vector3, threshold?: number): boolean;
}
declare namespace egret3d.framework {
    class EffectSystemData {
        life: number;
        beLoop: boolean;
        elements: EffectElementData[];
        clone(): EffectSystemData;
        dispose(): void;
    }
    class EffectElement {
        transform: Transform;
        data: EffectElementData;
        name: string;
        timelineFrame: {
            [frameIndex: number]: EffectFrameData;
        };
        ref: string;
        actions: IEffectAction[];
        curAttrData: EffectAttrsData;
        effectBatcher: EffectBatcher;
        startIndex: number;
        actionActive: boolean;
        loopFrame: number;
        active: boolean;
        constructor(_data: EffectElementData);
        private recordElementLerpAttributes();
        private recordLerpValues(effectFrameData);
        private recordLerp(effectFrameData, lerpData, key);
        initActions(): void;
        update(): void;
        private updateElementRotation();
        isActiveFrame(frameIndex: number): boolean;
        setActive(_active: boolean): void;
        dispose(): void;
    }
    class EffectElementData {
        name: string;
        type: EffectElementTypeEnum;
        timelineFrame: {
            [frameIndex: number]: EffectFrameData;
        };
        initFrameData: EffectFrameData;
        ref: string;
        beloop: boolean;
        actionData: EffectActionData[];
        emissionData: Emission;
        clone(): EffectElementData;
        dispose(): void;
    }
    class EffectAttrsData {
        pos: math.Vector3;
        euler: math.Vector3;
        color: math.Vector3;
        colorRate: number;
        scale: math.Vector3;
        uv: math.Vector2;
        alpha: number;
        mat: EffectMatData;
        renderModel: RenderModel;
        matrix: math.Matrix;
        tilling: math.Vector2;
        rotationByEuler: math.Quaternion;
        localRotation: math.Quaternion;
        mesh: Mesh;
        meshdataVbo: Float32Array;
        setLerpAttribute(attribute: string, val: any): void;
        getAttribute(attribute: string): any;
        initAttribute(attribute: string): void;
        resetMatrix(): void;
        copyandinit(): EffectAttrsData;
        clone(): EffectAttrsData;
    }
    class EffectFrameData {
        frameIndex: number;
        attrsData: EffectAttrsData;
        lerpDatas: EffectLerpData[];
        clone(): EffectFrameData;
        dispose(): void;
    }
    class EffectLerpData {
        type: EffectLerpTypeEnum;
        fromFrame: number;
        toFrame: ValueData;
        attrsData: EffectAttrsData;
        attrsList: any[];
        clone(): EffectLerpData;
    }
    class EffectActionData {
        actionType: string;
        startFrame: number;
        endFrame: number;
        params: any[];
        clone(): EffectActionData;
    }
    class EffectMatData {
        shader: Shader;
        diffuseTexture: Texture;
        alphaCut: number;
        static beEqual(data0: EffectMatData, data1: EffectMatData): boolean;
        clone(): EffectMatData;
    }
    class EffectBatcher {
        mesh: Mesh;
        mat: Material;
        beBufferInited: boolean;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        effectElements: EffectElement[];
        private _totalVertexCount;
        curTotalVertexCount: number;
        private _indexStartIndex;
        indexStartIndex: number;
        private _vbosize;
        resizeVboSize(value: number): void;
        dispose(): void;
        vertexSize: number;
        constructor(formate: number);
    }
    enum EffectPlayStateEnum {
        None = 0,
        BeReady = 1,
        Play = 2,
        Pause = 3,
        Stop = 4,
        Dispose = 5,
    }
    enum EffectElementTypeEnum {
        SingleMeshType = 0,
        EmissionType = 1,
        MultiMeshType = 2,
    }
    enum EffectLerpTypeEnum {
        Linear = 0,
    }
    enum RenderModel {
        None = 0,
        BillBoard = 1,
        StretchedBillBoard = 2,
        HorizontalBillBoard = 3,
        VerticalBillBoard = 4,
        Mesh = 5,
    }
}
declare namespace egret3d.framework {
    enum ParticleEmissionType {
        burst = 0,
        continue = 1,
    }
    class EmissionData {
        type: ParticleEmissionType;
        emissionName: string;
        time: number;
        count: number;
        constructor();
    }
}
declare namespace egret3d.framework {
    class Emission {
        beLoop: boolean;
        paricleLoop: boolean;
        singleMeshLoop: boolean;
        emissionType: ParticleEmissionType;
        rootpos: egret3d.math.Vector3;
        rootRotAngle: egret3d.math.Vector3;
        rootScale: egret3d.math.Vector3;
        maxEmissionCount: number;
        emissionCount: number;
        time: number;
        pos: ParticleNode;
        moveSpeed: ParticleNode;
        gravity: number;
        euler: ParticleNode;
        eulerNodes: Array<ParticleNode>;
        eulerSpeed: ParticleNode;
        scale: ParticleNode;
        scaleNodes: Array<ParticleNodeNumber>;
        scaleSpeed: ParticleNode;
        color: ParticleNode;
        colorRate: number;
        colorNodes: Array<ParticleNode>;
        colorSpeed: ParticleNode;
        simulationSpeed: ParticleNodeNumber;
        alpha: ParticleNodeNumber;
        alphaNodes: Array<ParticleNodeNumber>;
        alphaSpeed: ParticleNodeNumber;
        uv: ParticleNodeVec2;
        uvType: UVTypeEnum;
        uvRoll: UVRoll;
        uvSprite: UVSprite;
        tilling: math.Vector2;
        mat: EffectMatData;
        life: ValueData;
        renderModel: RenderModel;
        mesh: Mesh;
        particleStartData: egret3d.framework.ParticleStartData;
        private dataForVbo;
        getVboData(vf: number): Float32Array;
        clone(): Emission;
        getworldRotation(): void;
        cloneParticleNodeArray(_array: Array<ParticleNode>): ParticleNode[];
        cloneParticleNodeNumberArray(_array: Array<ParticleNodeNumber>): ParticleNodeNumber[];
    }
    class UVSprite {
        row: number;
        column: number;
        totalCount: number;
        clone(): UVSprite;
    }
    class UVRoll {
        uvSpeed: UVSpeedNode;
        uvSpeedNodes: Array<UVSpeedNode>;
        clone(): UVRoll;
    }
    enum UVTypeEnum {
        NONE = 0,
        UVRoll = 1,
        UVSprite = 2,
    }
}
declare namespace egret3d.framework {
    class ParticleNode {
        x: ValueData;
        y: ValueData;
        z: ValueData;
        key: number;
        constructor();
        getValue(): egret3d.math.Vector3;
        getValueRandom(): egret3d.math.Vector3;
        clone(): ParticleNode;
    }
    class AlphaNode {
        alpha: ValueData;
        key: number;
        getValue(): number;
    }
    class UVSpeedNode {
        u: ValueData;
        v: ValueData;
        key: number;
        getValue(): egret3d.math.Vector2;
        getValueRandom(): egret3d.math.Vector2;
        clone(): UVSpeedNode;
    }
    class ParticleNodeVec2 {
        x: ValueData;
        y: ValueData;
        key: number;
        getValue(): egret3d.math.Vector2;
        getValueRandom(): egret3d.math.Vector2;
        clone(): ParticleNodeVec2;
    }
    class ParticleNodeNumber {
        num: ValueData;
        key: number;
        getValue(): number;
        getValueRandom(): number;
        clone(): ParticleNodeNumber;
    }
}
declare namespace egret3d.framework {
    enum ParticleSystemShape {
        NORMAL = 0,
        BOX = 1,
        SPHERE = 2,
        HEMISPHERE = 3,
        CONE = 4,
        EDGE = 5,
        CIRCLE = 6,
    }
    class ParticleStartData {
        shapeType: ParticleSystemShape;
        private _position;
        position: egret3d.math.Vector3;
        private _direction;
        direction: egret3d.math.Vector3;
        private _width;
        width: number;
        private _height;
        height: number;
        depth: number;
        private _radius;
        radius: number;
        private _angle;
        angle: number;
        readonly randomDirection: egret3d.math.Vector3;
        readonly boxDirection: egret3d.math.Vector3;
        readonly sphereDirection: egret3d.math.Vector3;
        readonly hemisphereDirection: egret3d.math.Vector3;
        emitFrom: emitfromenum;
        readonly coneDirection: egret3d.math.Vector3;
        readonly circleDirection: egret3d.math.Vector3;
        readonly edgeDirection: math.Vector3;
        private getposition(dir, length);
        clone(): ParticleStartData;
    }
    enum emitfromenum {
        base = 0,
        volume = 1,
    }
}
declare namespace egret3d.framework {
    class ValueData {
        isRandom: boolean;
        private _value;
        private _valueLimitMin;
        private _valueLimitMax;
        private beInited;
        value: number;
        valueLimitMin: number;
        valueLimitMax: number;
        clone(): ValueData;
        getValue(): number;
        getValueRandom(): number;
        constructor();
        static RandomRange(min: number, max: number, isInteger?: boolean): number;
    }
}
declare namespace egret3d.framework {
    class Curve3 {
        private _beizerPoints;
        private _bezierPointNum;
        beizerPoints: egret3d.math.Vector3[];
        bezierPointNum: number;
        static CreateLinearBezier(start: egret3d.math.Vector3, end: egret3d.math.Vector3, indices: number): Curve3;
        static GetLerpBezier(nodes: egret3d.framework.ParticleNode[]): Curve3;
        static CreateQuadraticBezier(v0: egret3d.math.Vector3, v1: egret3d.math.Vector3, v2: egret3d.math.Vector3, bezierPointNum: number): Curve3;
        static CreateCubicBezier(v0: egret3d.math.Vector3, v1: egret3d.math.Vector3, v2: egret3d.math.Vector3, v3: egret3d.math.Vector3, bezierPointNum: number): Curve3;
        constructor(points: egret3d.math.Vector3[], nbPoints: number);
        getPoints(): math.Vector3[];
    }
}
declare namespace egret3d.framework {
    interface IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): any;
        update(frameIndex: number): any;
    }
    class LinearAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        attriname: string;
        attrival: any;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class DestroyAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class LoopAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class UVRollAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        speedu: number;
        speedv: number;
        startu: number;
        startv: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class UVSpriteAnimationAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        fps: number;
        row: number;
        colum: number;
        private frameInternal;
        private spriteIndex;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class RotationAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        velocity: any;
        frameInternal: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class RoseCurveAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        radius: number;
        polar: any;
        level: number;
        frameInternal: number;
        speed: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class TrailAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        radius: number;
        position: any;
        eular: any;
        width: number;
        frameInternal: number;
        speed: number;
        transform: egret3d.framework.Transform;
        startRotation: egret3d.math.Quaternion;
        color: any;
        alpha: number;
        offsetTransalte: egret3d.math.Vector3;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class BreathAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        attriname: string;
        startvalue: any;
        targetvalue: any;
        loopframe: number;
        halfloopframe: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        curTargetFrame: number;
        update(frameIndex: number): void;
        swap(): void;
        getLerpValue(frameIndex: number): any;
    }
}
declare namespace egret3d.framework {
    class EffectParser {
        asMgr: AssetMgr;
        Parse(str: string, assetmgr: AssetMgr): EffectSystemData;
        _parseSingleMeshTypeData(elementData: any, element: EffectElementData): void;
        _parseEmissionTypeData(elementData: any, element: EffectElementData): void;
        _parseEmissionShape(_startdata: any, element: EffectElementData): void;
        _parseToObjData(attrib: string, content: any): any;
        _parseToParticleNode(content: string): ParticleNode;
        _parseToValueData(content: string): ValueData;
        _parseToNumberArray(content: string): number[];
    }
}
declare namespace egret3d.framework {
    class EffectUtil {
        static lookatbyXAxis(pos: egret3d.math.Vector3, xAxis: egret3d.math.Vector3, yAxis: egret3d.math.Vector3, zAxis: egret3d.math.Vector3, targetpos: egret3d.math.Vector3, quat: egret3d.math.Quaternion): void;
        static RandomRange(min: number, max: number, isInteger?: boolean): number;
        static vecMuliNum(vec: egret3d.math.Vector3, num: number): egret3d.math.Vector3;
        static parseVector3(value: any): egret3d.math.Vector3;
        static parseEffectVec3(value: any): ParticleNode;
        static parseEffectVec2(value: any): ParticleNodeVec2;
        static parseEffectNum(value: any): ParticleNodeNumber;
        static parseEffectNumNode(value: any): ParticleNodeNumber;
        static parseEffectValueData(value: any): ValueData;
        static parseEffectUVSpeed(value: any): UVSpeedNode;
        static lookat(eye: egret3d.math.Vector3, targetpos: egret3d.math.Vector3, out: egret3d.math.Quaternion, up?: egret3d.math.Vector3): void;
        static RotateVector3(source: egret3d.math.Vector3, direction: egret3d.math.Vector3, out: egret3d.math.Vector3): void;
        static bindAxisBillboard(localAxis: egret3d.math.Vector3, out: egret3d.math.Quaternion): void;
        static lookatVerticalBillboard(eye: egret3d.math.Vector3, targetpos: egret3d.math.Vector3, out: egret3d.math.Quaternion, up?: egret3d.math.Vector3): void;
        static quatLookatZ(eye: egret3d.math.Vector3, targetpos: egret3d.math.Vector3, out: egret3d.math.Quaternion, forward?: egret3d.math.Vector3): void;
        static quatLookatX(eye: egret3d.math.Vector3, targetpos: egret3d.math.Vector3, out: egret3d.math.Quaternion, right?: egret3d.math.Vector3): void;
    }
}
declare namespace egret3d.framework {
    class EmissionBatcher {
        private webgl;
        gameObject: GameObject;
        data: Emission;
        mesh: Mesh;
        mat: Material;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        particles: Particle[];
        private vertexSize;
        formate: number;
        effectSys: EffectSystem;
        emissionElement: EmissionElement;
        constructor(_data: Emission, effectSys: EffectSystem, emissionElement: EmissionElement);
        initMesh(): void;
        curVerCount: number;
        curIndexCount: number;
        addParticle(): void;
        private refreshBuffer();
        update(delta: number): void;
        render(context: RenderContext, assetmgr: AssetMgr, camera: egret3d.framework.Camera): void;
        dispose(): void;
    }
}
declare namespace egret3d.framework {
    class Particle {
        gameObject: GameObject;
        renderModel: RenderModel;
        localMatrix: math.Matrix;
        private startScale;
        startRotation: egret3d.math.Quaternion;
        rotationByShape: math.Quaternion;
        euler: math.Vector3;
        rotationByEuler: math.Quaternion;
        localTranslate: math.Vector3;
        localRotation: math.Quaternion;
        localScale: math.Vector3;
        color: math.Vector3;
        colorRate: number;
        uv: math.Vector2;
        alpha: number;
        tilling: math.Vector2;
        private totalLife;
        private curLife;
        private format;
        private speedDir;
        private movespeed;
        private simulationSpeed;
        startFrameId: number;
        data: Emission;
        private batcher;
        private emisson;
        private vertexSize;
        private vertexCount;
        sourceVbo: Float32Array;
        vertexStartIndex: number;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        constructor(batcher: EmissionBatcher);
        uploadData(array: Float32Array): void;
        initByData(): void;
        actived: boolean;
        update(delta: number): void;
        private matToBatcher;
        private _updateLocalMatrix(delta);
        private _updateRotation(delta);
        private matToworld;
        private _updateElementRotation();
        private _updatePos(delta);
        private _updateEuler(delta);
        private _startNode;
        private endNode;
        private _updateScale(delta);
        private _updateColor(delta);
        private tempStartNode;
        private tempEndNode;
        private _updateNode(nodes, life, out, nodetype?);
        private _startNodeNum;
        private _curNodeNum;
        private _updateAlpha(delta);
        private _startUVSpeedNode;
        private _curUVSpeedNode;
        private spriteIndex;
        private _updateUV(delta);
        private tex_ST;
        private _updateVBO();
        dispose(): void;
    }
    enum nodeType {
        none = 0,
        alpha = 1,
        scale = 2,
    }
}
declare namespace egret3d.framework {
    class Particles {
        gameObject: GameObject;
        name: string;
        emissionElements: EmissionElement[];
        private vf;
        effectSys: EffectSystem;
        loopFrame: number;
        constructor(sys: EffectSystem);
        addEmission(_emissionNew: EffectElementData): void;
        update(delta: number): void;
        render(context: RenderContext, assetmgr: AssetMgr, camera: egret3d.framework.Camera): void;
        dispose(): void;
    }
    class EmissionElement {
        webgl: WebGLRenderingContext;
        gameObject: GameObject;
        emissionBatchers: EmissionBatcher[];
        private curbatcher;
        deadParticles: Particle[];
        private beloop;
        active: boolean;
        emission: Emission;
        private vf;
        private curTime;
        private numcount;
        private isover;
        private _continueSpaceTime;
        effectSys: EffectSystem;
        perVertexCount: number;
        perIndexxCount: number;
        private maxVertexCount;
        private localtranslate;
        private localScale;
        private localrotate;
        private eluerAngle;
        constructor(_emission: EffectElementData, sys: EffectSystem);
        private worldRotation;
        getWorldRotation(): egret3d.math.Quaternion;
        matToBatcher: egret3d.math.Matrix;
        private matToWorld;
        getmatrixToWorld(): egret3d.math.Matrix;
        update(delta: number): void;
        updateBatcher(delta: number): void;
        updateEmission(delta: number): void;
        addParticle(count?: number): void;
        private addBatcher();
        render(context: RenderContext, assetmgr: AssetMgr, camera: egret3d.framework.Camera): void;
        dispose(): void;
        isOver(): boolean;
    }
}
declare namespace egret3d.framework {
    enum HideFlags {
        None = 0,
        HideInHierarchy = 1,
        HideInInspector = 2,
        DontSaveInEditor = 4,
        NotEditable = 8,
        DontSaveInBuild = 16,
        DontUnloadUnusedAsset = 32,
        DontSave = 52,
        HideAndDontSave = 61,
    }
    interface INodeComponent {
        start(): any;
        update(delta: number): any;
        gameObject: GameObject;
        remove(): any;
        clone(): any;
    }
    class NodeComponent {
        comp: INodeComponent;
        init: boolean;
        constructor(comp: INodeComponent, init?: boolean);
    }
    class GameObject {
        getScene(): Scene;
        layer: number;
        hideFlags: HideFlags;
        transform: Transform;
        components: NodeComponent[];
        private componentsInit;
        renderer: IRenderer;
        camera: Camera;
        light: Light;
        collider: ICollider;
        private _visible;
        readonly visibleInScene: boolean;
        visible: boolean;
        getName(): string;
        init(): void;
        update(delta: number): void;
        addComponentDirect(comp: INodeComponent): INodeComponent;
        getComponent(type: string): INodeComponent;
        getComponents(): INodeComponent[];
        getComponentsInChildren(type: string): INodeComponent[];
        private _getComponentsInChildren(type, obj, array);
        getComponentInParent(type: string): INodeComponent;
        addComponent(type: string): INodeComponent;
        removeComponent(comp: INodeComponent): void;
        private remove(comp);
        removeComponentByTypeName(type: string): void;
        removeAllComponents(): void;
        dispose(): void;
    }
}
declare namespace egret3d.framework {
    class RenderContext {
        constructor(webgl: WebGLRenderingContext);
        drawtype: string;
        webgl: WebGLRenderingContext;
        viewPortPixel: egret3d.math.Rect;
        eyePos: egret3d.math.Vector4;
        matrixView: egret3d.math.Matrix;
        matrixProject: egret3d.math.Matrix;
        matrixModel: egret3d.math.Matrix;
        matrixModelViewProject: egret3d.math.Matrix;
        matrixModelView: egret3d.math.Matrix;
        matrixViewProject: egret3d.math.Matrix;
        floatTimer: number;
        intLightCount: number;
        vec4LightPos: Float32Array;
        vec4LightDir: Float32Array;
        floatLightSpotAngleCos: Float32Array;
        lightmap: egret3d.framework.Texture;
        lightmapUV: number;
        lightmapOffset: egret3d.math.Vector4;
        updateCamera(app: Application, camera: Camera): void;
        updateLights(lights: Light[]): void;
        updateOverlay(): void;
        updateModel(model: Transform): void;
        updateModeTrail(): void;
    }
    enum RenderLayerEnum {
        Common = 0,
        Transparent = 1,
        Overlay = 2,
    }
    interface IRenderer extends INodeComponent {
        layer: RenderLayerEnum;
        renderLayer: CullingMask;
        queue: number;
        render(context: RenderContext, assetmgr: AssetMgr, camera: egret3d.framework.Camera): any;
    }
    class RenderList {
        constructor();
        clear(): void;
        addRenderer(renderer: IRenderer): void;
        renderLayers: RenderLayer[];
    }
    class RenderLayer {
        needSort: boolean;
        list: IRenderer[];
        constructor(_sort?: boolean);
    }
}
declare namespace egret3d.framework {
    class Scene {
        app: Application;
        webgl: WebGLRenderingContext;
        constructor(app: Application);
        name: string;
        private rootNode;
        renderList: RenderList;
        private assetmgr;
        renderCameras: Camera[];
        private _mainCamera;
        mainCamera: Camera;
        private renderContext;
        private renderLights;
        lightmaps: Texture[];
        update(delta: number): void;
        private RealCameraNumber;
        private _renderCamera(camindex);
        private updateScene(node, delta);
        private objupdateInEditor(node, delta);
        private objupdate(node, delta);
        private collectCameraAndLight(node);
        addChild(node: Transform): void;
        removeChild(node: Transform): void;
        getChildren(): Transform[];
        getChildCount(): number;
        getChild(index: number): Transform;
        getChildByName(name: string): Transform;
        getRoot(): Transform;
        pickAll(ray: Ray, isPickMesh?: boolean): Array<Pickinfo>;
        pick(ray: Ray, isPickMesh?: boolean): Pickinfo;
        private doPick(ray, pickall?, isPickMesh?);
        private pickMesh(ray, tran, pickedList);
        private pickCollider(ray, tran, pickedList);
    }
}
declare namespace egret3d.framework {
    class Taskstate {
        finish: boolean;
        error: boolean;
        message: string;
        cancel: boolean;
        taskCall: (taskstate, state: Taskstate) => void;
        taskInterface: ITask;
    }
    interface ITask {
        move(delta: number, laststate: Taskstate, state: Taskstate): any;
    }
    class TaskMgr {
        tasks: Taskstate[];
        addTaskCall(task: (laststate: Taskstate, state: Taskstate) => void): void;
        addTask(task: ITask): void;
        laststate: Taskstate;
        move(delta: number): void;
        cancel(): void;
    }
}
declare namespace egret3d.framework {
    class Aabb {
        minimum: egret3d.math.Vector3;
        maximum: egret3d.math.Vector3;
        private srcmin;
        private srcmax;
        private opmin;
        private opmax;
        private _center;
        constructor(_minimum: egret3d.math.Vector3, _maximum: egret3d.math.Vector3);
        update(worldmatrix: egret3d.math.Matrix): void;
        addVector3(vec: egret3d.math.Vector3): void;
        containsVector3(vec: egret3d.math.Vector3): boolean;
        intersectAABB(aabb: Aabb): boolean;
        addAABB(aabb: egret3d.framework.Aabb): void;
        readonly center: egret3d.math.Vector3;
        clear(): void;
        clone(): Aabb;
        getVec3(vecs: egret3d.math.Vector3[]): void;
    }
}
declare namespace egret3d.framework {
    class Obb {
        center: egret3d.math.Vector3;
        halfsize: egret3d.math.Vector3;
        private directions;
        vectors: egret3d.math.Vector3[];
        buildByMaxMin(minimum: egret3d.math.Vector3, maximum: egret3d.math.Vector3): void;
        buildByCenterSize(center: egret3d.math.Vector3, size: egret3d.math.Vector3): void;
        update(worldmatrix: egret3d.math.Matrix): void;
        caclWorldVecs(vecs: egret3d.math.Vector3[], worldmatrix: egret3d.math.Matrix): void;
        intersects(_obb: Obb): boolean;
        private computeBoxExtents(axis, box);
        private axisOverlap(axis, box0, box1);
        private extentsOverlap(min0, max0, min1, max1);
        clone(): Obb;
        dispose(): void;
    }
}
declare namespace egret3d.framework {
    class Pickinfo {
        pickedtran: Transform;
        distance: number;
        hitposition: egret3d.math.Vector3;
        bu: number;
        bv: number;
        faceId: number;
        subMeshId: number;
        constructor(_bu: number, _bv: number, _distance: number);
    }
}
declare namespace egret3d.framework {
    class Ray {
        origin: egret3d.math.Vector3;
        direction: egret3d.math.Vector3;
        constructor(_origin: egret3d.math.Vector3, _dir: egret3d.math.Vector3);
        intersectAABB(_aabb: Aabb): boolean;
        intersectPlaneTransform(tran: Transform): Pickinfo;
        private intersectPlane(planePoint, planeNormal);
        intersectCollider(tran: Transform): Pickinfo;
        intersectBoxMinMax(minimum: egret3d.math.Vector3, maximum: egret3d.math.Vector3): boolean;
        intersectsSphere(center: egret3d.math.Vector3, radius: number): boolean;
        intersectsTriangle(vertex0: egret3d.math.Vector3, vertex1: egret3d.math.Vector3, vertex2: egret3d.math.Vector3): Pickinfo;
    }
}
declare namespace egret3d.framework {
    class Transform {
        private _scene;
        scene: Scene;
        name: string;
        insId: InsID;
        prefab: string;
        private aabbdirty;
        markAABBDirty(): void;
        private aabbchilddirty;
        markAABBChildDirty(): void;
        aabb: Aabb;
        aabbchild: Aabb;
        caclAABB(): void;
        caclAABBChild(): void;
        buildAABB(): Aabb;
        children: Transform[];
        parent: Transform;
        addChild(node: Transform): void;
        addChildAt(node: Transform, index: number): void;
        removeAllChild(): void;
        removeChild(node: Transform): void;
        find(name: string): Transform;
        checkImpactTran(tran: Transform): boolean;
        checkImpact(): Array<Transform>;
        private doImpact(tran, impacted);
        markDirty(): void;
        updateTran(parentChange: boolean): void;
        updateWorldTran(): void;
        updateAABBChild(): void;
        private dirty;
        private dirtyChild;
        private dirtyWorldDecompose;
        localRotate: egret3d.math.Quaternion;
        localTranslate: egret3d.math.Vector3;
        localScale: egret3d.math.Vector3;
        private localMatrix;
        private _localEulerAngles;
        localEulerAngles: egret3d.math.Vector3;
        private worldMatrix;
        private worldRotate;
        private worldTranslate;
        private worldScale;
        getWorldTranslate(): math.Vector3;
        getWorldScale(): math.Vector3;
        getWorldRotate(): math.Quaternion;
        getLocalMatrix(): egret3d.math.Matrix;
        getWorldMatrix(): egret3d.math.Matrix;
        getForwardInWorld(out: egret3d.math.Vector3): void;
        getRightInWorld(out: egret3d.math.Vector3): void;
        getUpInWorld(out: egret3d.math.Vector3): void;
        setWorldMatrix(mat: math.Matrix): void;
        setWorldPosition(pos: math.Vector3): void;
        lookat(trans: Transform): void;
        lookatPoint(point: math.Vector3): void;
        private _gameObject;
        readonly gameObject: GameObject;
        clone(): Transform;
        readonly beDispose: boolean;
        private _beDispose;
        dispose(): void;
    }
    class InsID {
        constructor();
        private static idAll;
        private static next();
        private id;
        getInsID(): number;
    }
}
declare namespace egret3d.framework {
    class EnumUtil {
        static getEnumObjByType(enumType: string): any;
    }
}
declare namespace egret3d.framework {
    class NumberUtil {
        static KEY_A: number;
        static KEY_D: number;
        static KEY_E: number;
        static KEY_Q: number;
        static KEY_R: number;
        static KEY_S: number;
        static KEY_W: number;
        static KEY_a: number;
        static KEY_d: number;
        static KEY_e: number;
        static KEY_q: number;
        static KEY_r: number;
        static KEY_s: number;
        static KEY_w: number;
    }
}
declare namespace egret3d.framework {
    class RegexpUtil {
        static textureRegexp: RegExp;
        static vectorRegexp: RegExp;
        static floatRegexp: RegExp;
        static rangeRegexp: RegExp;
        static vector4Regexp: RegExp;
        static vector3FloatOrRangeRegexp: RegExp;
    }
}
declare namespace egret3d.framework {
    class StringUtil {
        static COMPONENT_CAMERA: string;
        static COMPONENT_BOXCOLLIDER: string;
        static COMPONENT_LIGHT: string;
        static COMPONENT_MESHFILTER: string;
        static COMPONENT_MESHRENDER: string;
        static COMPONENT_EFFECTSYSTEM: string;
        static COMPONENT_LABEL: string;
        static COMPONENT_IMAGE: string;
        static COMPONENT_RAWIMAGE: string;
        static COMPONENT_BUTTON: string;
        static COMPONENT_SKINMESHRENDER: string;
        static COMPONENT_CAMERACONTROLLER: string;
        static COMPONENT_CANVASRENDER: string;
        static COMPONENT_ANIPLAYER: string;
        static UIStyle_RangeFloat: string;
        static UIStyle_Enum: string;
        static RESOURCES_MESH_CUBE: string;
        static replaceAll(srcStr: string, fromStr: string, toStr: string): string;
        static trimAll(str: string): string;
        static firstCharToLowerCase(str: string): string;
    }
}
declare namespace egret3d.framework {
    enum PrimitiveType {
        Sphere = 0,
        Capsule = 1,
        Cylinder = 2,
        Cube = 3,
        Plane = 4,
        Quad = 5,
        Pyramid = 6,
    }
    enum Primitive2DType {
        RawImage2D = 0,
        Image2D = 1,
        Label = 2,
        Button = 3,
    }
    class TransformUtil {
        static CreatePrimitive(type: PrimitiveType, app: Application): Transform;
        static Create2DPrimitive(type: Primitive2DType, app: Application): Transform2D;
        private static create2D_rawImage(img, app);
        private static create2D_image2D(img, app);
        private static create2D_label(label, app);
        private static create2D_button(btn, app);
    }
}
declare namespace egret3d.io {
    function loadText(url: string, fun: (_txt: string, _err: Error) => void): void;
    function loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error) => void): void;
    function loadBlob(url: string, fun: (_blob: Blob, _err: Error) => void): void;
    function loadImg(url: string, fun: (_tex: HTMLImageElement, _err: Error) => void, progress: (progre: number) => void): void;
}
declare namespace egret3d.math {
    class Pool {
        static collect_all(): void;
        private static _vector4_one;
        static readonly vector4_one: Vector4;
        private static unused_vector4;
        static new_vector4(): Vector4;
        static clone_vector4(src: Vector4): Vector4;
        static delete_vector4(v: Vector4): void;
        static collect_vector4(): void;
        private static _color_one;
        static readonly color_one: Color;
        private static unused_color;
        static new_color(): Color;
        static delete_color(v: Color): void;
        static collect_color(): void;
        private static _vector3_up;
        static readonly vector3_up: Vector3;
        private static _vector3_right;
        static readonly vector3_right: Vector3;
        private static _vector3_forward;
        static readonly vector3_forward: Vector3;
        private static _vector3_zero;
        static readonly vector3_zero: Vector3;
        private static _vector3_one;
        static readonly vector3_one: Vector3;
        private static unused_vector3;
        static new_vector3(): Vector3;
        static clone_vector3(src: Vector3): Vector3;
        static delete_vector3(v: Vector3): void;
        static collect_vector3(): void;
        private static _vector2_up;
        static readonly vector2_up: Vector2;
        private static _vector2_right;
        static readonly vector2_right: Vector2;
        private static unused_vector2;
        static new_vector2(): Vector2;
        static clone_vector2(src: Vector2): Vector2;
        static delete_vector2(v: Vector2): void;
        static delete_vector2Array(vs: Vector2[]): void;
        static collect_vector2(): void;
        private static unused_matrix3x2;
        static new_matrix3x2(): Matrix3x2;
        static clone_matrix3x2(src: Matrix3x2): Matrix3x2;
        static delete_matrix3x2(v: Matrix3x2): void;
        static collect_matrix3x2(): void;
        private static unused_matrix;
        static new_matrix(): Matrix;
        static clone_matrix(src: Matrix): Matrix;
        static delete_matrix(v: Matrix): void;
        static collect_matrix(): void;
        private static unused_quaternion;
        static new_quaternion(): Quaternion;
        static clone_quaternion(src: Quaternion): Quaternion;
        static delete_quaternion(v: Quaternion): void;
        static collect_quaternion(): void;
    }
}
declare namespace egret3d.render {
    class Caps {
        maxTexturesImageUnits: number;
        maxTextureSize: number;
        maxCubemapTextureSize: number;
        maxRenderTextureSize: number;
        standardDerivatives: boolean;
        s3tc: WEBGL_compressed_texture_s3tc;
        textureFloat: boolean;
        textureAnisotropicFilterExtension: EXT_texture_filter_anisotropic;
        maxAnisotropy: number;
        instancedArrays: ANGLE_instanced_arrays;
        uintIndices: boolean;
        highPrecisionShaderSupported: boolean;
        fragmentDepthSupported: boolean;
        textureFloatLinearFiltering: boolean;
        textureLOD: boolean;
        drawBuffersExtension: any;
        pvrtcExtension: any;
    }
    class Webglkit {
        private static _maxVertexAttribArray;
        static SetMaxVertexAttribArray(webgl: WebGLRenderingContext, count: number): void;
        private static _texNumber;
        static GetTextureNumber(webgl: WebGLRenderingContext, index: number): number;
        static FUNC_ADD: number;
        static FUNC_SUBTRACT: number;
        static FUNC_REVERSE_SUBTRACT: number;
        static ONE: number;
        static ZERO: number;
        static SRC_ALPHA: number;
        static SRC_COLOR: number;
        static ONE_MINUS_SRC_ALPHA: number;
        static ONE_MINUS_SRC_COLOR: number;
        static ONE_MINUS_DST_ALPHA: number;
        static ONE_MINUS_DST_COLOR: number;
        static LEQUAL: number;
        static EQUAL: number;
        static GEQUAL: number;
        static NOTEQUAL: number;
        static LESS: number;
        static GREATER: number;
        static ALWAYS: number;
        static NEVER: number;
        static caps: Caps;
        static initConst(webgl: WebGLRenderingContext): void;
    }
}
declare namespace egret3d.render {
    enum ShowFaceStateEnum {
        ALL = 0,
        CCW = 1,
        CW = 2,
    }
    enum DrawModeEnum {
        VboTri = 0,
        VboLine = 1,
        EboTri = 2,
        EboLine = 3,
    }
    enum BlendModeEnum {
        Close = 0,
        Blend = 1,
        Blend_PreMultiply = 2,
        Add = 3,
        Add_PreMultiply = 4,
    }
    class GlDrawPass {
        program: GlProgram;
        state_showface: ShowFaceStateEnum;
        state_zwrite: boolean;
        state_ztest: boolean;
        state_ztest_method: number;
        state_blend: boolean;
        state_blendEquation: number;
        state_blendSrcRGB: number;
        state_blendDestRGB: number;
        state_blendSrcAlpha: number;
        state_blendDestALpha: number;
        uniforms: {
            [id: string]: {
                change: boolean;
                location: WebGLUniformLocation;
                type: UniformTypeEnum;
                value: any;
            };
        };
        uniformallchange: boolean;
        setProgram(program: GlProgram, uniformDefault?: boolean): void;
        setAlphaBlend(mode: BlendModeEnum): void;
        uniformFloat(name: string, number: number): void;
        uniformFloatv(name: string, numbers: Float32Array): void;
        uniformVec4(name: string, vec: math.Vector4): void;
        uniformVec4v(name: string, vecdata: Float32Array): void;
        uniformMatrix(name: string, mat: math.Matrix): void;
        uniformMatrixV(name: string, matdata: Float32Array): void;
        uniformTexture(name: string, tex: render.ITexture): void;
        static textureID: number[];
        use(webgl: WebGLRenderingContext, applyUniForm?: boolean): void;
        applyUniformSaved(webgl: WebGLRenderingContext): void;
        applyUniform_Float(webgl: WebGLRenderingContext, key: string, value: number): void;
        applyUniform_Floatv(webgl: WebGLRenderingContext, key: string, value: Float32Array): void;
        applyUniform_Float4(webgl: WebGLRenderingContext, key: string, value: math.Vector4): void;
        applyUniform_Float4v(webgl: WebGLRenderingContext, key: string, values: Float32Array): void;
        applyUniform_Float4x4(webgl: WebGLRenderingContext, key: string, value: math.Matrix): void;
        applyUniform_Float4x4v(webgl: WebGLRenderingContext, key: string, values: Float32Array): void;
        applyUniform_FloatTexture(webgl: WebGLRenderingContext, texindex: number, key: string, value: ITexture): void;
        draw(webgl: WebGLRenderingContext, mesh: GlMesh, drawmode?: DrawModeEnum, drawindexindex?: number, drawbegin?: number, drawcount?: number): void;
    }
}
declare namespace egret3d.render {
    enum VertexFormatMask {
        Position = 1,
        Normal = 2,
        Tangent = 4,
        Color = 8,
        UV0 = 16,
        UV1 = 32,
        BlendIndex4 = 64,
        BlendWeight4 = 128,
        ColorEX = 256,
    }
    class Number4 {
        v0: number;
        v1: number;
        v2: number;
        v3: number;
    }
    enum MeshTypeEnum {
        Static = 0,
        Dynamic = 1,
        Stream = 2,
    }
    class DrawInfo {
        private static _ins;
        static readonly ins: DrawInfo;
        triCount: number;
        vboCount: number;
        renderCount: number;
    }
    class GlMesh {
        initBuffer(webgl: WebGLRenderingContext, vf: VertexFormatMask, vertexCount: number, mode?: MeshTypeEnum): void;
        addIndex(webgl: WebGLRenderingContext, indexcount: number): number;
        resetVboSize(webgl: WebGLRenderingContext, vertexCount: number): void;
        resetEboSize(webgl: WebGLRenderingContext, eboindex: number, indexcount: number): void;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
        mode: number;
        vbo: WebGLBuffer;
        vertexCount: number;
        vertexByteSize: number;
        ebos: WebGLBuffer[];
        indexCounts: number[];
        bindIndex: number;
        vertexFormat: VertexFormatMask;
        bind(webgl: WebGLRenderingContext, shadercode: GlProgram, bindEbo?: number): void;
        uploadVertexSubData(webgl: WebGLRenderingContext, varray: Float32Array, offset?: number): void;
        uploadIndexSubData(webgl: WebGLRenderingContext, eboindex: number, data: Uint16Array, offset?: number): void;
        drawArrayTris(webgl: WebGLRenderingContext, start?: number, count?: number): void;
        drawArrayLines(webgl: WebGLRenderingContext, start?: number, count?: number): void;
        drawElementTris(webgl: WebGLRenderingContext, start?: number, count?: number): void;
        drawElementLines(webgl: WebGLRenderingContext, start?: number, count?: number): void;
    }
}
declare namespace egret3d.render {
    class MeshData {
        pos: egret3d.math.Vector3[];
        color: egret3d.math.Color[];
        colorex: egret3d.math.Color[];
        uv: egret3d.math.Vector2[];
        uv2: egret3d.math.Vector2[];
        normal: egret3d.math.Vector3[];
        tangent: egret3d.math.Vector3[];
        blendIndex: Number4[];
        blendWeight: Number4[];
        trisindex: number[];
        static addQuadPos(data: MeshData, quad: egret3d.math.Vector3[]): void;
        static addQuadPos_Quad(data: MeshData, quad: egret3d.math.Vector3[]): void;
        static addQuadVec3ByValue(array: egret3d.math.Vector3[], value: egret3d.math.Vector3): void;
        static addQuadVec3(array: egret3d.math.Vector3[], quad: egret3d.math.Vector3[]): void;
        static addQuadVec2(array: egret3d.math.Vector2[], quad: egret3d.math.Vector2[]): void;
        static genQuad(size: number): MeshData;
        static genQuad_forparticle(size: number): MeshData;
        static genPlaneCCW(size: number): MeshData;
        static genCylinderCCW(height: number, radius: number, segment?: number): MeshData;
        static genPyramid(height: number, halfsize: number): MeshData;
        static genSphereCCW(radius?: number, widthSegments?: number, heightSegments?: number): MeshData;
        static genBoxCCW(size: number): MeshData;
        static genBoxByArray(array: egret3d.math.Vector3[]): MeshData;
        static genBoxByArray_Quad(array: egret3d.math.Vector3[]): MeshData;
        static genCircleLineCCW(radius: number, segment?: number, wide?: number): MeshData;
        caclByteLength(): number;
        static calcByteSize(vf: VertexFormatMask): number;
        genVertexDataArray(vf: VertexFormatMask): Float32Array;
        genIndexDataArray(): Uint16Array;
        genIndexDataArrayTri2Line(): Uint16Array;
        genIndexDataArrayQuad2Line(): Uint16Array;
    }
}
declare namespace egret3d.render {
    class StaticMeshRenderer {
        material: GlDrawPass;
        mesh: GlMesh;
        eboIndex: number;
        drawMode: DrawModeEnum;
        drawbegin: number;
        drawcount: number;
        draw(webgl: WebGLRenderingContext): void;
    }
    class BatchRenderer {
        curmaterial: GlDrawPass;
        mesh: GlMesh;
        drawMode: DrawModeEnum;
        vboCount: number;
        eboCount: number;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        initBuffer(webgl: WebGLRenderingContext, vf: VertexFormatMask, drawMode: DrawModeEnum): void;
        begin(webgl: WebGLRenderingContext, mat: GlDrawPass): void;
        push(webgl: WebGLRenderingContext, vbodata: number[], ebodata: number[]): void;
        end(webgl: WebGLRenderingContext): void;
    }
}
declare namespace egret3d.render {
    class GlWindow {
        renderTarget: egret3d.render.GlRenderTarget;
        clearop_Color: boolean;
        backColor: egret3d.math.Color;
        clearop_Depth: boolean;
        clearop_Stencil: boolean;
        viewport: egret3d.math.Rect;
        use(webgl: WebGLRenderingContext): void;
    }
}
declare namespace egret3d.render {
    enum UniformTypeEnum {
        Texture = 0,
        Float = 1,
        Floatv = 2,
        Float4 = 3,
        Float4v = 4,
        Float4x4 = 5,
        Float4x4v = 6,
    }
    class Uniform {
        name: string;
        type: UniformTypeEnum;
        location: WebGLUniformLocation;
    }
    enum ShaderTypeEnum {
        VS = 0,
        FS = 1,
    }
    class GlShader {
        constructor(name: string, type: ShaderTypeEnum, shader: WebGLShader, code: string);
        name: string;
        type: ShaderTypeEnum;
        shader: WebGLShader;
        mapUniform: {
            [id: string]: {
                name: string;
                type: UniformTypeEnum;
            };
        };
        private _scanUniform(txt);
    }
    class GlProgram {
        constructor(vs: GlShader, fs: GlShader, program: WebGLProgram);
        initAttribute(webgl: WebGLRenderingContext): void;
        vs: GlShader;
        fs: GlShader;
        program: WebGLProgram;
        posPos: number;
        posNormal: number;
        posTangent: number;
        posColor: number;
        posUV0: number;
        posUV2: number;
        posBlendIndex4: number;
        posBlendWeight4: number;
        posColorEx: number;
        mapUniform: {
            [id: string]: Uniform;
        };
        use(webgl: WebGLRenderingContext): void;
    }
    class ShaderPool {
        mapVS: {
            [id: string]: GlShader;
        };
        mapFS: {
            [id: string]: GlShader;
        };
        mapProgram: {
            [id: string]: GlProgram;
        };
        disposeVS(webgl: WebGLRenderingContext, id: string): void;
        disposeFS(webgl: WebGLRenderingContext, id: string): void;
        disposeProgram(webgl: WebGLRenderingContext, id: string): void;
        disposeAll(webgl: WebGLRenderingContext): void;
        compileVS(webgl: WebGLRenderingContext, name: string, code: string): GlShader;
        compileFS(webgl: WebGLRenderingContext, name: string, code: string): GlShader;
        linkProgram(webgl: WebGLRenderingContext, nameVS: string, nameFS: string): GlProgram;
    }
}
declare namespace egret3d.render {
    enum TextureFormatEnum {
        RGBA = 1,
        RGB = 2,
        Gray = 3,
        PVRTC4_RGB = 4,
        PVRTC4_RGBA = 4,
        PVRTC2_RGB = 4,
        PVRTC2_RGBA = 4,
    }
    class TextureReader {
        constructor(webgl: WebGLRenderingContext, texRGBA: WebGLTexture, width: number, height: number, gray?: boolean);
        width: number;
        height: number;
        data: Uint8Array;
        gray: boolean;
        getPixel(u: number, v: number): any;
    }
    interface ITexture {
        texture: WebGLTexture;
        width: number;
        height: number;
        isFrameBuffer(): boolean;
        dispose(webgl: WebGLRenderingContext): any;
        caclByteLength(): number;
    }
    class GlRenderTarget implements ITexture {
        width: number;
        height: number;
        constructor(webgl: WebGLRenderingContext, width: number, height: number, depth?: boolean, stencil?: boolean);
        fbo: WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        texture: WebGLTexture;
        use(webgl: WebGLRenderingContext): void;
        static useNull(webgl: WebGLRenderingContext): void;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
        isFrameBuffer(): boolean;
    }
    class GlTexture2D implements ITexture {
        ext: any;
        constructor(webgl: WebGLRenderingContext, format?: TextureFormatEnum, mipmap?: boolean, linear?: boolean);
        private getExt(name);
        uploadImage(img: HTMLImageElement, mipmap: boolean, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean): void;
        uploadByteArray(mipmap: boolean, linear: boolean, width: number, height: number, data: Uint8Array, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean): void;
        webgl: WebGLRenderingContext;
        loaded: boolean;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number;
        height: number;
        mipmap: boolean;
        caclByteLength(): number;
        reader: TextureReader;
        getReader(redOnly?: boolean): TextureReader;
        dispose(webgl: WebGLRenderingContext): void;
        isFrameBuffer(): boolean;
        private static mapTexture;
        static formGrayArray(webgl: WebGLRenderingContext, array: number[] | Float32Array | Float64Array, width: number, height: number): GlTexture2D;
        static staticTexture(webgl: WebGLRenderingContext, name: string): GlTexture2D;
    }
    class WriteableTexture2D implements ITexture {
        constructor(webgl: WebGLRenderingContext, format: TextureFormatEnum, width: number, height: number, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean);
        linear: boolean;
        premultiply: boolean;
        repeat: boolean;
        mirroredU: boolean;
        mirroredV: boolean;
        updateRect(data: Uint8Array, x: number, y: number, width: number, height: number): void;
        updateRectImg(data: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, x: number, y: number): void;
        isFrameBuffer(): boolean;
        webgl: WebGLRenderingContext;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        formatGL: number;
        width: number;
        height: number;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
    }
}
