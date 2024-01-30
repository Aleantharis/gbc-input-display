//import { Assets } from "./const";

class Rectangle{
    x;
    y;
    width;
    height;
    constructor(x, y, width, height) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.height = height
        this.width = width;
    }
}

class ButtonDraw {
    #id;
    #x;
    #y;
    #width;
    #height;
    color;

    constructor(id, x, y, width, height, color) {
        this.#id = id;
        this.#x = x;
        this.#y = y;
        this.#height = height
        this.#width = width;
        this.color = color;
    }

    draw(ctx, scalefactor) {
        ctx.font = Math.floor(50 * scalefactor) + "px Segoe UI";
        ctx.fillStyle = this.color;
        ctx.textBaseline = "bottom";

        ctx.fillText("[Button " + this.#id + "]", 50, 50);
    }

    get rec() {
        return new Rectangle(this.#x, this.#y, this.#width, this.#height);
    }
}

class RectButtonDraw extends ButtonDraw {
    draw(ctx, scalefactor) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.rec.x * scalefactor, this.rec.y * scalefactor, this.rec.width * scalefactor, this.rec.height * scalefactor);
    }
}

class CircleButtonDraw extends ButtonDraw {
    draw(ctx, scalefactor) {
        ctx.fillStyle = this.color
        ctx.beginPath();
        ctx.arc(this.rec.x * scalefactor, this.rec.y * scalefactor, (this.rec.width * scalefactor) / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class BaseGamePad {
    #background;

    constructor(background) {
        this.#background = background;
    }

    get width() {
        return this.#background.width;
    }

    get height() {
        return this.#background.height;
    }

    draw(ctx, buttons) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        var scalefactor = window.innerHeight / this.#background.height > window.innerWidth / this.#background.width ? window.innerWidth / this.#background.width : window.innerHeight / this.#background.height;

        ctx.drawImage(this.#background, 0, 0, this.#background.width * scalefactor, this.#background.height * scalefactor);
        ctx.restore();
    }
}

export class GBCGamePad extends BaseGamePad {
    #btnMap = [];
    #btnDraw = [];

    constructor(background, buttonMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) {
        super(background);
        this.#btnMap = buttonMap;

        // Down
        this.#btnDraw[13] = new RectButtonDraw(13, 333, 2205, 160, 139, "rgba(255, 0, 0, 0.4)");

        // Left
        this.#btnDraw[14] = new RectButtonDraw(14, 195, 2038, 160, 168, "rgba(255, 0, 0, 0.4)");

        // B
        this.#btnDraw[0] = new CircleButtonDraw(0, 1147, 2055, 223, 223, "rgba(255, 0, 0, 0.4)");

        // A
        this.#btnDraw[1] = new CircleButtonDraw(1, 1474, 1946, 226, 226, "rgba(255, 0, 0, 0.4)");
    }

    draw(ctx, buttons) {
        super(ctx, buttons);

        var scalefactor = window.innerHeight / this.height > window.innerWidth / this.width ? window.innerWidth / this.width : window.innerHeight / this.height;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        for (let i = 0; i < buttons.length; i++) {
            const e = buttons[i];

            if (e.touched || e.triggered || e.value > 0) {
                if(this.#btnDraw[this.#btnMap[i]]) {
                    this.#btnDraw[this.#btnMap[i]].draw(ctx, scalefactor);
                }
            }
        }

        ctx.restore();
    }
}