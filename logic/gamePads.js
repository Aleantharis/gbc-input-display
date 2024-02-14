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

    isWithin(x, y, scalefactor = 1) {
        const scaleX = this.x * scalefactor;
        const scaleY = this.y * scalefactor;
        const scaleW = this.width * scalefactor;
        const scaleH = this.height * scalefactor;

        return ((x >= scaleX && x <= scaleX + scaleW) && (y >= scaleY && y <= scaleY + scaleH));
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
                    ctx.moveTo(scaleX + (scaleW * 1.5), scaleY + (scaleH / 2));
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
    #cornerRadius;
    #disabledBtnColor;
    #disabledTextColor;

    constructor(id, name, x, y, width, height, text, activeBtnColor, btnColor, activeTextColor, textColor, cornerRadius, disabledBtnColor, disabledTextColor) {
        super(id, name, x, y, width, height, "-", "-");
        this.#activeBtnColor = activeBtnColor;
        this.#btnColor = btnColor;
        this.#activeTextColor = activeTextColor;
        this.#textColor = textColor;
        this.#text = text;
        this.#cornerRadius = cornerRadius;
        this.#disabledBtnColor = disabledBtnColor;
        this.#disabledTextColor = disabledTextColor;
    }

    draw(ctx, scalefactor, active) {
        let scaleX = this.rec.x * scalefactor;
        let scaleY = this.rec.y * scalefactor;
        let scaleW = this.rec.width * scalefactor;
        let scaleH = this.rec.height * scalefactor;
        let scaleC = this.#cornerRadius * scalefactor;
        let disabled = this.id === null;

        ctx.beginPath();
        ctx.fillStyle = disabled ? this.#disabledBtnColor : (active ? this.#activeBtnColor : this.#btnColor);
        //ctx.fillRect(scaleX, scaleY, scaleW, scaleH);
        ctx.roundRect(scaleX, scaleY, scaleW, scaleH, scaleC);
        ctx.fill();

        ctx.fillStyle = disabled ? this.#disabledBtnColor : (active ? this.#activeTextColor : this.#textColor);
        var fontSize = Math.floor(scaleH * 0.8)
        ctx.font = "bold " + fontSize + "px Segoe UI";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.#text, scaleX + (scaleW * 0.5), scaleY + Math.round(scaleH * 0.5) + 1, scaleW);
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

class CircleButtonDraw2 extends ButtonDraw {
    #activeBtnColor;
    #btnColor;
    #activeTextColor;
    #textColor;
    #text;
    #disabledBtnColor;
    #disabledTextColor;

    constructor(id, name, x, y, width, height, text, activeBtnColor, btnColor, activeTextColor, textColor, disabledBtnColor, disabledTextColor) {
        super(id, name, x, y, width, height, "-", "-");
        this.#activeBtnColor = activeBtnColor;
        this.#btnColor = btnColor;
        this.#activeTextColor = activeTextColor;
        this.#textColor = textColor;
        this.#text = text;
        this.#disabledBtnColor = disabledBtnColor;
        this.#disabledTextColor = disabledTextColor;
    }

    draw(ctx, scalefactor, active) {
        let scaleX = this.rec.x * scalefactor;
        let scaleY = this.rec.y * scalefactor;
        let scaleW = this.rec.width * scalefactor;
        let scaleH = this.rec.height * scalefactor;
        let disabled = this.id === null;

        ctx.fillStyle = disabled ? this.#disabledBtnColor : (active ? this.#activeBtnColor : this.#btnColor);
        ctx.beginPath();
        var radius = (this.rec.width * scalefactor) / 2;
        ctx.arc((this.rec.x * scalefactor) + radius, (this.rec.y * scalefactor) + radius, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = disabled ? this.#disabledBtnColor : (active ? this.#activeTextColor : this.#textColor);
        var fontSize = Math.floor(scaleH * 0.8)
        ctx.font = "bold " + fontSize + "px Segoe UI";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.#text, scaleX + (scaleW * 0.5), scaleY + Math.round(scaleH * 0.5) + 1, scaleW);
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

    getKeyOnCoords(x, y) {
    }

    draw(canvas, buttons) {
    }
}

export class FlatGBCGamePad extends BaseGamePad {
    #btnMap = [];
    #btnDraw = [];
    #baseWidth = 1000;
    #padding = 50;
    #baseHeight = ((this.#baseWidth - (2 * this.#padding)) / 4) + (2* this.#padding);
    #cornerRad = 5;

    get btnMap() {
        return this.#btnMap;
    }

    get btnDraw() {
        return this.#btnDraw;
    }

    getKeyOnCoords(x, y, canvas) {
        var realHeight = (this.#baseHeight/this.#baseWidth) * canvas.width;
        var scalefactor = canvas.height < realHeight ? ((canvas.height / realHeight) * canvas.width) / this.#baseWidth : canvas.width / this.#baseWidth;

        var keyFound = null;
        this.#btnMap.forEach(mapKey => {
            const btn = this.#btnDraw[mapKey];
            if(btn.rec.isWithin(x, y, scalefactor)) {
                keyFound = btn.name;
            }
        });

        return keyFound;
    }
    
    #addKeyToMap(cKey, buttonMap) {
        for (let i = 0; buttonMap[cKey] && i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }
    }

    constructor(buttonMap, activeBtnColor, activeTextColor, btnColor, textColor, disabledBtnColor, disabledTextColor) {
        super();
        this.#btnMap = [];

        let columnWidth = (this.#baseWidth - (2 * this.#padding)) / 4;
        let btnSpacing = 6;
        let btnSize = (columnWidth - (2 * btnSpacing)) / 3;

        let startBegin = this.#padding + (columnWidth * 1.5);
        let startSpacing = 15;
        let startSize = (columnWidth - startSpacing) / 2;
        let startY = ((this.#padding + columnWidth) / 2);

        let abBegin = this.#padding + (3 * columnWidth);

        // Up
        var cKey = "Up";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, this.#padding + btnSpacing + btnSize, this.#padding, btnSize, btnSize, "U", activeBtnColor, btnColor, activeTextColor, textColor, this.#cornerRad, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // Down
        cKey = "Down";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, this.#padding + btnSpacing + btnSize, this.#padding + (2 * btnSpacing) + (2 * btnSize), btnSize, btnSize, "D", activeBtnColor, btnColor, activeTextColor, textColor, this.#cornerRad, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // Left
        cKey = "Left";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, this.#padding, this.#padding + btnSpacing + btnSize, btnSize, btnSize, "L", activeBtnColor, btnColor, activeTextColor, textColor, this.#cornerRad, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // Right
        cKey = "Right";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, this.#padding + (2 * btnSpacing) + (2 * btnSize), this.#padding + btnSpacing + btnSize, btnSize, btnSize, "R", activeBtnColor, btnColor, activeTextColor, textColor, this.#cornerRad, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // TODO: add x/y to verify layout? also add L/R button left and right of all, also rotate select and start

        // B
        cKey = "B";
        this.#btnDraw[cKey] = new CircleButtonDraw2(buttonMap[cKey], cKey, abBegin + btnSpacing + btnSize, this.#padding + (2 * btnSpacing) + (2 * btnSize), btnSize, btnSize, "B", activeBtnColor, btnColor, activeTextColor, textColor, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // A
        cKey = "A";
        this.#btnDraw[cKey] = new CircleButtonDraw2(buttonMap[cKey], cKey, abBegin + (2 * btnSpacing) + (2 * btnSize), this.#padding + btnSpacing + btnSize, btnSize, btnSize, "A", activeBtnColor, btnColor, activeTextColor, textColor, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // X
        cKey = "X";
        this.#btnDraw[cKey] = new CircleButtonDraw2(null, cKey, abBegin + btnSpacing + btnSize, this.#padding, btnSize, btnSize, "X", activeBtnColor, btnColor, activeTextColor, textColor, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // Y
        cKey = "Y";
        this.#btnDraw[cKey] = new CircleButtonDraw2(null, cKey, abBegin, this.#padding + btnSpacing + btnSize, btnSize, btnSize, "Y", activeBtnColor, btnColor, activeTextColor, textColor, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // Select
        cKey = "Select";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, startBegin, startY, startSize, startSize / 2, "Select", activeBtnColor, btnColor, activeTextColor, textColor, 2 * this.#cornerRad, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);

        // Start
        cKey = "Start";
        this.#btnDraw[cKey] = new RectButtonDraw2(buttonMap[cKey], cKey, startBegin + startSpacing + startSize, startY, startSize, startSize / 2, "Start", activeBtnColor, btnColor, activeTextColor, textColor, 2 * this.#cornerRad, disabledBtnColor, disabledTextColor);
        this.#addKeyToMap(cKey, buttonMap);
    }

    #buttonPressed(id, buttons) {
        const triggered = (i) => (buttons[i].touched || buttons[i].pressed || buttons[i].value > 0);
        return id ? id.some(triggered) : false;
    }

    draw(canvas, buttons) {
        super.draw(canvas, buttons);
        let ctx = canvas.getContext("2d");

        var realHeight = (this.#baseHeight/this.#baseWidth) * canvas.width;
        var scalefactor = canvas.height < realHeight ? ((canvas.height / realHeight) * canvas.width) / this.#baseWidth : canvas.width / this.#baseWidth;

        //ctx.fillRect(0, 0, 50, (this.#baseHeight/this.#baseWidth) * canvas.width);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        for (const key in this.#btnDraw) {
            let keyDraw = this.#btnDraw[key];
            keyDraw.draw(ctx, scalefactor, this.#buttonPressed(keyDraw.id, buttons));
        }

        // for (let i = 0; i < this.#btnDraw.length; i++) {
        //     const e = buttons[this.#btnDraw[i].id];

        //     if (this.#btnDraw[this.#btnMap[i]]) {
        //         this.#btnDraw[this.#btnMap[i]].draw(ctx, scalefactor, (e.touched || e.triggered || e.value > 0));
        //     }
        // }

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
    
    #addKeyToMap(cKey, buttonMap) {
        for (let i = 0; buttonMap[cKey] && i < buttonMap[cKey].length; i++) {
            this.#btnMap[buttonMap[cKey][i]] = cKey;
        }
    }

    constructor(background, buttonMap = { "Up": [12], "Down": [13], "Left": [14], "Right": [15], "B": [0], "A": [1], "Select": [8], "Start": [9] }) {
        super();
        this.#background = background;
        //this.#btnMap = buttonMap;
        this.#btnMap = [];

        // Up
        var cKey = "Up";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 333, 1892, 165, 146, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", true, 'D');
        this.#addKeyToMap(cKey, buttonMap);

        // Down
        cKey = "Down";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 333, 2205, 165, 146, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", true, 'U');
        this.#addKeyToMap(cKey, buttonMap);

        // Left
        cKey = "Left";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 195, 2038, 141, 168, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", true, 'R');
        this.#addKeyToMap(cKey, buttonMap);

        // Right
        cKey = "Right";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 499, 2038, 141, 168, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", true, 'L');
        this.#addKeyToMap(cKey, buttonMap);

        // B
        cKey = "B";
        this.#btnDraw[cKey] = new CircleButtonDraw(buttonMap[cKey], cKey, 1147, 2055, 223, 223, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)");
        this.#addKeyToMap(cKey, buttonMap);

        // A
        cKey = "A";
        this.#btnDraw[cKey] = new CircleButtonDraw(buttonMap[cKey], cKey, 1474, 1946, 226, 226, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)");
        this.#addKeyToMap(cKey, buttonMap);

        // Select
        cKey = "Select";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 732, 2606, 160, 68, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", false, '-');
        this.#addKeyToMap(cKey, buttonMap);

        // Start
        cKey = "Start";
        this.#btnDraw[cKey] = new RectButtonDraw(buttonMap[cKey], cKey, 996, 2606, 160, 68, "rgba(255, 0, 0, 0.4)", "rgba(10, 10, 10, 0.1)", false, '-');
        this.#addKeyToMap(cKey, buttonMap);
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