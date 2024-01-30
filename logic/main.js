import { Constants as CONST } from "./const.js";
import { Assets } from "./const.js";
//import { gamepadAPI } from "./gamepadAPI.js";
import { GamepadHelper } from "./GamepadHelper.js";
import { GBCGamePad } from "./gamePads.js";

const assetsLoaded = () => {
  console.log("assets loaded");

  // trigger resize to trigger redraw for intro
  resizeCanvas();
  gameState = "Stopped";
  gamepadDraw = new GBCGamePad(assets.getAsset("gbc"));
};
const assets = new Assets(
  {
    test: "img/test.jpg",
    gbc: "img/gbc.png"
  },
  assetsLoaded
);

var canvas = document.getElementById("cvGame");
var ctx = canvas.getContext("2d");
var gameLoop;
var canvasMinSize = 0;
var controllers;
var gamepadDraw;

// "Loading", "Stopped", "Running"
var gameState = "Loading";

resizeCanvas();
// Attempt at auto-resize
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight; /*-
    (document.getElementById("fMenu").offsetHeight + CONST.canvasHeightMargin);*/

  if (canvas.width < canvas.height) {
    canvasMinSize = canvas.width;
  } else {
    canvasMinSize = canvas.height;
  }
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);

function clearCanvas() {
  // https://stackoverflow.com/a/6722031
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function draw() {
  controllers = navigator.getGamepads();
  //api.updateInputs();

  clearCanvas();

  if(controllers[0]) {
    gamepadDraw.draw(ctx, controllers[0].buttons);
  }
}


function stopGame() {
  gameState = "Stopped";
  clearInterval(gameLoop);

  // Trigger resize to draw canvas
  resizeCanvas();
}

function startGame() {
  gameState = "Running";
  gameLoop = setInterval(draw, 10);

  // force resize to recalc tilesize
  resizeCanvas();
}

function padConnectedListener(event) {
  controllers = navigator.getGamepads();
  //gamepad = event.gamepad;
  console.log("Gamepad connected.");
  //console.table(this.controller);
}

function padDisconnectedListener(event) {
  controllers = null;
  //gamepad = null;
  console.log("Gamepad disconnected.");
}

// document.getElementById("fMenu").onsubmit = startGameHandler;


//window.addEventListener("gamepadconnected", api.connect);
//window.addEventListener("gamepaddisconnected", api.disconnect);
window.addEventListener("gamepadconnected", padConnectedListener);
window.addEventListener("gamepaddisconnected", padDisconnectedListener);

document.onkeydown = function (evt) {
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key === "Escape" || evt.key === "Esc";
  } else {
    isEscape = evt.keyCode === 27;
  }
  if (isEscape && controllers) {
    switch (gameState) {
      case "Running":
        stopGame();
        break;
      case "Stopped":
        startGame();
        break;
    }
  }
};

DEBUG = true;
