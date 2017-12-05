//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isThemeLoadEnd = false;
        _this.isResourceLoadEnd = false;
        return _this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    Main.prototype.onThemeLoadComplete = function () {
        this.isThemeLoadEnd = true;
        this.createScene();
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    };
    Main.prototype.createScene = function () {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    Main.prototype.getDeviceSerial = function () {
        var deviceSerial = window.localStorage.getItem("device_serial");
        if (deviceSerial == null) {
            deviceSerial = "" + Math.round(Math.random() * 100000);
            window.localStorage.setItem("device_serial", deviceSerial);
        }
        return deviceSerial;
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.startCreateScene = function () {
        // let protoFile = RES.getRes("up_proto");
        // let proto = protobuf.parse(protoFile, {keepCase:true});
        // let UpMsg = proto.root.lookupType("up_msg");
        // let message = UpMsg.create({ _sequence: 1, _repeat :false, _user_id: 1001  });
        // let encodedData = UpMsg.encode(message).finish();
        // let decodedData = UpMsg.decode(encodedData);
        // console.log("message", message, encodedData, decodedData);
        // let protoFile2 = RES.getRes("common_proto");
        // let proto2 = protobuf.parse(protoFile2, {keepCase:true});
        // let Role = proto2.root.lookupType("role_st");
        // let message2 = Role.create({ _role_id: 101, _elf_id :2, _name: "NickName", _level:0 });
        // let encodedData2 = Role.encode(message2).finish();
        // let decodedData2 = Role.decode(encodedData2);
        // console.log("message2", message2, encodedData2, decodedData2);
        // let protoFile3 = RES.getRes("down_proto");
        // let proto3 = protobuf.parse(protoFile3 + protoFile2, {keepCase:true});
        // let Role2 = proto3.root.lookupType("role_st");
        // let DownMsg = proto3.root.lookupType("down_msg");
        // let message3 = DownMsg.create( {login:{result:3, user_id:3}});
        // let encodedData3 = DownMsg.encode(message3).finish();
        // let decodedData3 = DownMsg.decode(encodedData3);
        // console.log("message3", message3, encodedData3, decodedData3);
        // let net = new Network()
        // net.Connect("192.168.5.7", 13001),
        DS = new DataCenter();
        var device = this.getDeviceSerial();
        console.log("device", device);
        var device_id = "1#2-" + device;
        DS.set(DataKey.DEVICE_ID, device_id);
        DS.set(DataKey.DEVICE, device);
        RPC.Init();
        //RPC.Call("login", {device_id: "lifan-host", version : "1.0.0"}, (reply) =>{ console.log("reply", reply); });
        //启用场景控制器
        // var viewManager: ViewManager = new ViewManager();
        // this.addChild(viewManager);
        // viewManager.start();
        unitCfg = new Config("unit_json");
        skillCfg = new Config("skill_config_json");
        var conf = unitCfg.getByField("id", 1001 + "");
        var view = new GameView();
        this.addChild(view);
        view.start();
        // //开启自定义event
        // let msgPipe = new MsgPipe();
        // msgPipe.bind("192.168.5.7", 13002);
        // msgPipe.loop((msg)=>{
        //     console.log("get msg", msg);
        // });
        // let register = RPC.CreateUpProroData("rtnotify", {register: {user_id: 1}});
        // msgPipe.push(register);
        // let timer = new egret.Timer(1000, 5);
        // timer.addEventListener(egret.TimerEvent.TIMER, ()=>{
        //     let keepalive = RPC.CreateUpProroData("rtnotify", {keepalive: {time:new Date().getUTCSeconds()}});
        //     msgPipe.push(keepalive);
        // }, this);
        // timer.start();
        // let rand1 = new Random(1010);
        // let rand2 = new Random(1010);
        // for(let i = 0; i < 10; i++){
        //     console.log("rand1", rand1.rand());
        //     console.log("rand2", rand2.rand());
        // }
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map