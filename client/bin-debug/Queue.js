/**队列实现**/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Queue = (function () {
    function Queue(size) {
        if (size === void 0) { size = 0; }
        this.size = size;
        this.elem_size = 0;
        this.read_pos = 0;
        this.write_pos = 0;
        if (size > 0) {
            this.data = new Array(size);
        }
    }
    Queue.prototype.push = function (item) {
        this.resize();
        var pos = this.nextWritePos();
        this.data[pos] = item;
    };
    Queue.prototype.pop = function () {
        if (this.empty()) {
            return false;
        }
        var pos = this.nextReadPos();
        return [true, this.data[pos]];
    };
    Queue.prototype.empty = function () {
        return this.elem_size == 0;
    };
    Queue.prototype.resize = function () {
        if (this.elem_size < this.size) {
            return;
        }
        var newSize = this.elem_size * 2 + 2;
        if (newSize < this.size) {
            newSize = this.size;
        }
        var newData = new Array(newSize);
        if (this.elem_size > 0) {
            for (var i = 0, j = this.read_pos; i < this.elem_size; i++, j++) {
                newData[i] = this.data[j % this.size];
            }
        }
        this.data = newData;
        this.size = newSize;
        this.read_pos = 0;
        this.write_pos = this.elem_size;
    };
    Queue.prototype.nextWritePos = function () {
        this.elem_size++;
        var pos = this.write_pos;
        this.write_pos = (this.write_pos + 1) % this.size;
        return pos;
    };
    Queue.prototype.nextReadPos = function () {
        this.elem_size--;
        var pos = this.read_pos;
        this.read_pos = (this.read_pos + 1) % this.size;
        return pos;
    };
    return Queue;
}());
__reflect(Queue.prototype, "Queue");
//# sourceMappingURL=Queue.js.map