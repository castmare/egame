/// <reference path="../lib/egret3d.d.ts" />

interface IState
{
    start(app: egret3d.framework.Application);
    update(delta: number);
}
//需加上这个反射标记，场景才能通过名字找到这个类，并自动创建他
@egret3d.reflect.userCode
class main implements egret3d.framework.IUserCode
{
    app: egret3d.framework.Application;
    state: IState;
    onStart(app: egret3d.framework.Application)
    {

        console.log("i am here.");
        this.app = app;

        this.addBtn("test_ui", () => new t.test_ui());
        this.addBtn("test_load", () => new test_load());
        this.addBtn("test_loadprefab", () => new test_loadprefab());
        this.addBtn("test_anim", () => new test_anim());
        this.addBtn("test_pick", () => new test_pick());
        this.addBtn("test_loadScene", () => new test_loadScene());
        this.addBtn("test_multipleplayer_anim", () => new test_multipleplayer_anim());
        this.addBtn("test_uvroll", () => new t.test_uvroll());

        this.addBtn("test_light1", () => new t.test_light1());
        this.addBtn("test_light_d1", () => new t.light_d1());

        this.addBtn("test_normalmap", () => new t.Test_NormalMap());

        this.addBtn("test_posteffect", () => new t.test_posteffect());

        this.addBtn("test_rendertexture", () => new t.test_rendertexture());
        this.addBtn("test_sound", () => new t.test_sound());

        this.addBtn("test_blend", () => new t.test_blend());
    }
    private x: number = 0;
    private y: number = 100;
    private btns: HTMLButtonElement[] = [];
    private addBtn(text: string, act: () => IState)
    {
        var btn = document.createElement("button");
        this.btns.push(btn);
        btn.textContent = text;
        btn.onclick = () =>
        {
            this.clearBtn();
            this.state = act();
            this.state.start(this.app);
        }
        btn.style.top = this.y + "px";
        btn.style.left = this.x + "px";
        if (this.y + 24 > 400)
        {
            this.y = 100;
            this.x += 200;
        }
        else
        {
            this.y += 24;
        }
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);

    }
    private clearBtn()
    {
        for (var i = 0; i < this.btns.length; i++)
        {
            this.app.container.removeChild(this.btns[i]);
        }
        this.btns.length = 0;
    }
    onUpdate(delta: number)
    {
        if (this.state != null)
            this.state.update(delta);
    }
    isClosed(): boolean
    {
        return false;
    }
}
