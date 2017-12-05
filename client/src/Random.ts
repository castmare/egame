
/**随机函数**/

class Random{
    private seed:number;
    private next:number;
    public constructor(seed:number = 1){
        this.seed = seed;
        this.next = seed;
    }
    public rand():number{
        this.next = this.next * 1103515245 + 12345;
        if( this.next > 0xffffffff ){
            this.next = this.next % 0xffffffff;
        }
        return (this.next >> 16) & 0xffff;  /* equal to (next / 65536) % 32768*/
    }
}
