//数据中心
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DataKey;
(function (DataKey) {
    DataKey[DataKey["BOARD_BEGIN"] = 0] = "BOARD_BEGIN";
    DataKey[DataKey["DEVICE_ID"] = 1] = "DEVICE_ID";
    DataKey[DataKey["DEVICE"] = 2] = "DEVICE";
    DataKey[DataKey["USER_ID"] = 3] = "USER_ID";
    DataKey[DataKey["ROLE_ID"] = 4] = "ROLE_ID";
    DataKey[DataKey["ROLE"] = 5] = "ROLE";
    DataKey[DataKey["ROLE_SNAPS"] = 6] = "ROLE_SNAPS";
    DataKey[DataKey["BOARD_END"] = 7] = "BOARD_END";
})(DataKey || (DataKey = {}));
var DataCenter = (function () {
    function DataCenter() {
        this.datas = new Array(DataKey.BOARD_END);
    }
    DataCenter.prototype.get = function (key) {
        return this.datas[key];
    };
    DataCenter.prototype.set = function (key, value) {
        this.datas[key] = value;
    };
    return DataCenter;
}());
__reflect(DataCenter.prototype, "DataCenter", ["IDataCenter"]);
var DS;
//# sourceMappingURL=DataCenter.js.map