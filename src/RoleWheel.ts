/* 轮盘：控制角色移动 */

class RoleWheel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.init();
    }

    private init():void {
        var shp:egret.Shape = new egret.Shape();
        shp.x = 100;
        shp.y = 100;
        shp.graphics.lineStyle( 10, 0x00ff00 );
        shp.graphics.beginFill( 0xff0000, 1);
        shp.graphics.drawCircle( 0, 0, 50 );
        shp.graphics.endFill();
    }
} 