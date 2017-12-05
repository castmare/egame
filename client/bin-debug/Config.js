var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Config = (function () {
    function Config(file) {
        this.data = RES.getRes(file);
    }
    Config.prototype.get = function (key) {
        //this.data[key];
        for (var rcd in this.data) {
            if (rcd == key) {
                return this.data[rcd][0];
            }
        }
        return null;
    };
    Config.prototype.getByField = function (field, key) {
        for (var rcd in this.data) {
            var r = this.data[rcd][0];
            if (r[field] == key) {
                return r;
            }
        }
        return null;
    };
    return Config;
}());
__reflect(Config.prototype, "Config");
var unitCfg;
var skillCfg;
var elemCfg;
//# sourceMappingURL=Config.js.map