/**队列实现**/

class Queue{
    private data:Array<any>;
    private size:number;
    private elem_size:number;
    private read_pos:number;
    private write_pos:number;
    public constructor(size:number = 0){
        this.size = size;
        this.elem_size = 0;
        this.read_pos = 0;
        this.write_pos = 0;
        if( size > 0 ){
            this.data = new Array<any>(size);
        }
    }
    public push(item:any):void{
        this.resize();
        let pos:number = this.nextWritePos();
        this.data[pos] = item;
    }
    public pop():false|[true, any]{
        if ( this.empty() ) {
            return false;
        }
        let pos:number = this.nextReadPos();
        return [true, this.data[pos]];
    }

    public empty():boolean{
        return this.elem_size == 0;
    }

    private resize(){
        if( this.elem_size < this.size ){
            return;
        }
        let newSize = this.elem_size * 2 + 2;
        if( newSize < this.size ){
            newSize = this.size;
        }
        let newData = new Array<any>(newSize);
        if(this.elem_size > 0){
            for(let i = 0, j = this.read_pos; i < this.elem_size; i++, j++){
                newData[i] = this.data[j%this.size];
            }
        }
        this.data = newData;
        this.size = newSize;
        this.read_pos = 0;
        this.write_pos = this.elem_size;
        
    }

    private nextWritePos():number{
        this.elem_size ++;
        let pos = this.write_pos;
        this.write_pos = (this.write_pos + 1) % this.size;
        return pos;
    }

    private nextReadPos():number{
        this.elem_size --;
        let pos = this.read_pos;
        this.read_pos = (this.read_pos + 1) % this.size;
        return pos;
    }
}