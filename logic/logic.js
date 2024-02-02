import { Constants as CONST } from "./const.js";
import { Assets } from "./const.js";
import { FlatGBCGamePad, ImageGBCGamePad } from "./gamePads.js";

const assetsLoaded = () => {
  console.log("assets loaded");

  // trigger resize to trigger redraw for intro
  resizeCanvas();
  loadCfg();
  gameState = "Stopped";
};
const assets = new Assets(
  {
    test: "img/test.jpg",
    gbc: "img/gbc.png"
  },
  assetsLoaded
);

export class Logic {
    #selectedTheme;
    #themes;
    
    #selectedController;
    #controllers;

    #selectedConfigSlot;
    #keyCfg;

    #infoText;
    #secondaryInfoText;

    #canvas;
    #ctx;

    #gamePadObj;
}
