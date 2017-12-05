/**随机函数**/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Random = (function () {
    function Random(seed) {
        if (seed === void 0) { seed = 1; }
        this.seed = seed;
        this.next = seed;
    }
    Random.prototype.rand = function () {
        this.next = this.next * 1103515245 + 12345;
        if (this.next > 0xffffffff) {
            this.next = this.next % 0xffffffff;
        }
        return (this.next >> 16) & 0xffff; /* equal to (next / 65536) % 32768*/
    };
    return Random;
}());
__reflect(Random.prototype, "Random");
//# sourceMappingURL=Random.js.map