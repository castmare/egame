class Config{
    private data:any;
    private file:number;
    public constructor(file:string){
        this.data = RES.getRes(file);
    }

    public get(key:any):any{
        //this.data[key];
        for(let rcd in this.data ){
            if( rcd == key ){
                return this.data[rcd][0];
            }
        }
        return null;
    }

    public getByField(field:string, key:any):any{
        for(let rcd in this.data ){
            let r = this.data[rcd][0];
            if( r[field] == key ){
                return r;
            }
        }
        return null;
    }
}

let unitCfg:Config;
let skillCfg:Config;
let elemCfg:Config;
