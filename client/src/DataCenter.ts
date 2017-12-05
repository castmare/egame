//数据中心

enum DataKey{
    BOARD_BEGIN = 0,
    DEVICE_ID   = 1, // SDKID
    DEVICE      = 2, // 设备号
    USER_ID     = 3, // 玩家ID
    ROLE_ID     = 4, // 角色ID
    ROLE        = 5, // 角色数据
    ROLE_SNAPS  = 6, // 角色快照数组
    BOARD_END
}

interface IDataCenter {
    set(key: DataKey, value:any): void;
    get(key: DataKey): any;
}

class DataCenter implements IDataCenter{
    private datas:Array<any>;
    public constructor(){
        this.datas = new Array<any>(DataKey.BOARD_END);
    }
    public get(key: DataKey): any{
        return this.datas[key];
    }
    public set(key: DataKey, value:any): void{
        this.datas[key] = value;
    }
}

let DS:IDataCenter;

