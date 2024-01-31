//import { Assets } from "./const";

class Rectangle {
    x;
    y;
    width;
    height;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height
        this.width = width;
    }
}

class ButtonDraw {
    #id;
    #name;
    #x;
    #y;
    #width;
    #height;
    color;
    activeColor;

    constructor(id, name, x, y, width, height, activeColor, color) {
        this.#id = id;
        this.#name = name;
        this.#x = x;
        this.#y = y;
        this.#height = height
        this.#width = width;
        this.activeColor = activeColor;
        this.color = color;
    }

    draw(ctx, scalefactor, active) {
        ctx.font = Math.floor(50 * scalefactor) + "px Segoe UI";
        ctx.fillStyle = active ? this.activeColor : this.color;
        ctx.textBaseline = "bottom";

        ctx.fillText("[" + this.#id + ": " + this.#name + "]", 50, 50);
    }

    get name() {
        return this.#name;
    }

    get id() {
        return this.#id;
    }

    get rec() {
        return new Rectangle(this.#x, this.#y, this.#width, this.#height);
    }
}

class RectButtonDraw extends ButtonDraw {
    #drawTail;
    #tailDirection;

    constructor(id, name, x, y, width, height, activeColor, color, drawTail, tailDirection) {
        super(id, name, x, y, width, height, activeColor, color);
        this.#drawTail = drawTail;
        this.#tailDirection = tailDirection;
    }

    draw(ctx, scalefactor, active) {
        let scaleX = this.rec.x * scalefactor;
        let scaleY = this.rec.y * scalefactor;
        let scaleW = this.rec.width * scalefactor;
        let scaleH = this.rec.height * scalefactor;

        ctx.fillStyle = active ? this.activeColor : this.color;
        ctx.fillRect(scaleX, scaleY, scaleW, scaleH);

        if (this.#drawTail) {
            switch (this.#tailDirection) {
                case 'R':
                    ctx.beginPath();
                    ctx.moveTo(scaleX + ( scaleW * 1.5), scaleY + (scaleH / 2));
                    ctx.lineTo(scaleX + scaleW, scaleY);
                    ctx.lineTo(scaleX + scaleW, scaleY + scaleH);
                    ctx.fill();
                    break;
                case 'L':
                    ctx.beginPath();
                    ctx.moveTo(scaleX - (scaleW * 0.5), scaleY + (scaleH / 2));
                    ctx.lineTo(scaleX, scaleY);
                    ctx.lineTo(scaleX, scaleY + scaleH);
                    ctx.fill();
                    break;
                case 'U':
                    ctx.beginPath();
                    ctx.moveTo(scaleX + (scaleW / 2), scaleY - (scaleH * 0.5));
                    ctx.lineTo(scaleX, scaleY);
                    ctx.lineTo(scaleX + scaleW, scaleY);
                    ctx.fill();
                    break;
                case 'D':
                    ctx.beginPath();
                    ctx.moveTo(scaleX + (scaleW / 2), scaleY + (scaleH * 1.5));
                    ctx.lineTo(scaleX, scaleY + scaleH);
                    ctx.lineTo(scaleX + scaleW, scaleY + scaleH);
                    ctx.fill();
                    break;
            }
        }
    }
}

class RectButtonDraw2 extends ButtonDraw {
    #activeBtnColor;
    #btnColor;
    #activeTextColor;
    #textColor;
    #text;

    constructor(id, name, x, y, width, height, text, activeBtnColor, btnColor, activeTextColor, textColor) {
        super(id, name, x, y, width, height, "-", "-");
        this.#activeBtnColor = activeBtnColor;
        this.#btnColor = btnColor;
        this.#activeTextColor = activeTextColor;
        this.#textColor = textColor;
        this.#text = text;
    }

    draw(ctx, scalefactor, active) {
        let scaleX = this.rec.x * scalefactor;
        let scaleY = this.rec.y * scalefactor;
        let scaleW = this.rec.width * scalefactor;
        let scaleH = this.rec.height * scalefactor;

        ctx.fillStyle = active ? this.#activeBtnColor : this.#btnColor;
        ctx.fillRect(scaleX, scaleY, scaleW, scaleH);

        ctx.fillStyle = active ? this.#activeTextColor : this.#textColor;
        var fontSize = Math.floor(scaleH * 0.8)
        ctx.font = "bold " + fontSize + "px Segoe UI";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.#text, scaleX + (scaleW * 0.5), scaleY + Math.round(scaleH *0.5)+ 1, scaleW);
    }
}

class CircleButtonDraw extends ButtonDraw {
    draw(ctx, scalefactor, active) {
        ctx.fillStyle = active ? this.activeColor : this.color;
        ctx.beginPath();
        var radius = (this.rec.width * scalefactor) / 2;
        ctx.arc((this.rec.x * scalefactor) + radius, (this.rec.y * scalefactor) + radius, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class BaseGamePad {

    constructor() {
    }

    get width() {
        return -1;
    }

    get height() {
        return -1;
    }

    draw(canvas, buttons) {
    }
}

export class FlatGBCGamePad extends BaseGamePad {    
    #btnMap = [];
    #btnDraw = [];
    #baseWidth = 1000;

    get btnMap() {
        return this.#btnMap;
    }

    get btnDraw() {
        return this.#btnDraw;
    }

    constructor(buttonMap, activeBtnColor, activeTextColor, btnColor, textColor) {
        super();
        this.#btnMap = [];

        // todo: layout buttons on pixel grid, set that as base-width with coords rel. on that grid
        // todo: round button corners for sel/start
        // todo: update round buttons and layout in cross
        // todo: space buttons like in image

        // Up
        var cKey = "Up";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, 100, 50, 50, 50, "U", activeBtnColor, btnColor, activeTextColor, textColor);
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Down
        cKey = "Down";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, 100, 150, 50, 50, "D", activeBtnColor, btnColor, activeTextColor, textColor);
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Left
        cKey = "Left";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, 50, 100, 50, 50, "L", activeBtnColor, btnColor, activeTextColor, textColor);
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Right
        cKey = "Right";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, 150, 100, 50, 50, "R", activeBtnColor, btnColor, activeTextColor, textColor);
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // B
        cKey = "B";
        this.#btnDraw[cKey] = new CircleButtonDraw(buttonMap[cKey], cKey, 1147, 2055, 223, 223, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)");
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // A
        cKey = "A";
        this.#btnDraw[cKey] = new CircleButtonDraw(buttonMap[cKey], cKey, 1474, 1946, 226, 226, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)");
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Select
        cKey = "Select";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, 300, 100, 100, 50, "Select", activeBtnColor, btnColor, activeTextColor, textColor);
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Start
        cKey = "Start";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, 450, 100, 100, 50, "Start", activeBtnColor, btnColor, activeTextColor, textColor);
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }
    }

    draw(canvas, buttons) {
        super.draw(canvas, buttons);
        let ctx = canvas.getContext("2d");

        var scale = canvas.width < canvas.height ? canvas.width : canvas.height;

        var scalefactor = scale / this.#baseWidth;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        for (let i = 0; i < buttons.length; i++) {
            const e = buttons[i];

            //if (e.touched || e.triggered || e.value > 0) {
                if (this.#btnDraw[this.#btnMap[i]]) {
                    this.#btnDraw[this.#btnMap[i]].draw(ctx, scalefactor, (e.touched || e.triggered || e.value > 0));
                }
            //}
        }

        ctx.restore();
    }
}

export class ImageGBCGamePad extends BaseGamePad {
    #background;
    #btnMap = [];
    #btnDraw = [];

    get width() {
        return this.#background.width;
    }
    
    get height() {
        return this.#background.height;
    }

    get btnMap() {
        return this.#btnMap;
    }

    get btnDraw() {
        return this.#btnDraw;
    }

    constructor(background, buttonMap = { "Up": [12], "Down": [13], "Left": [14], "Right": [15], "B": [0], "A": [1], "Select": [8], "Start": [9] }) {
        super();
        this.#background = background;
        //this.#btnMap = buttonMap;
        this.#btnMap = [];

        // Up
        var cKey = "Up";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 333, 1892, 165, 146, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", true, 'D');
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Down
        cKey = "Down";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 333, 2205, 165, 146, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", true, 'U');
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Left
        cKey = "Left";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 195, 2038, 141, 168, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", true, 'R');
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Right
        cKey = "Right";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 499, 2038, 141, 168, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", true, 'L');
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // B
        cKey = "B";
        this.#btnDraw[cKey] = new CircleButtonDraw(buttonMap[cKey], cKey, 1147, 2055, 223, 223, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)");
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // A
        cKey = "A";
        this.#btnDraw[cKey] = new CircleButtonDraw(buttonMap[cKey], cKey, 1474, 1946, 226, 226, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)");
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Select
        cKey = "Select";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 732, 2606, 160, 68, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", false, '-');
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }

        // Start
        cKey = "Start";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 996, 2606, 160, 68, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", false, '-');
        for (let i = 0; i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }
    }

    draw(canvas, buttons) {
        super.draw(canvas, buttons);
        let ctx = canvas.getContext("2d");

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        var scalefactor = canvas.height / this.height > canvas.width / this.width ? canvas.width / this.width : canvas.height / this.height;

        ctx.drawImage(this.#background, 0, 0, this.width * scalefactor, this.height * scalefactor);
        ctx.restore();

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        for (let i = 0; i < buttons.length; i++) {
            const e = buttons[i];

            //if (e.touched || e.triggered || e.value > 0) {
                if (this.#btnDraw[this.#btnMap[i]]) {
                    this.#btnDraw[this.#btnMap[i]].draw(ctx, scalefactor, (e.touched || e.triggered || e.value > 0));
                }
            //}
        }

        ctx.restore();
    }
}