import { Constants as CONST } from "./const.js";
import { Assets } from "./const.js";
//import { gamepadAPI } from "./gamepadAPI.js";
import { GamepadHelper } from "./GamepadHelper.js";

const assetsLoaded = () => {
  console.log("assets loaded");

  // trigger resize to trigger redraw for intro
  resizeCanvas();
  gameState = "Stopped";
};
const assets = new Assets(
  {
    test: "img/test.jpg",
    gbc: "img/gbc.png"
  },
  assetsLoaded
);

var DEBUG = false;
var canvas = document.getElementById("cvGame");
var ctx = canvas.getContext("2d");
var gameLoop;
var canvasMinSize = 0;
//const api = new gamepadAPI();
const padHelper = new GamepadHelper();
var controllers;

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

// function debugToggle() {
// 	DEBUG = document.getElementById("cbDebug").checked;

// 	if(logic && logic.gameState) {
// 		logic.gameState.DEBUG = DEBUG;
// 	}
// }
// document.getElementById("cbDebug").addEventListener("change", debugToggle);

// function pointerUpHandler(event) {
// 	// Prevent interaction if gameloop is not running
// 	switch (gameState) {
// 		case "Running":
// 			handleMouseMove(event);
// 			var relX = Math.floor(mouseX / tileSize);
// 			var relY = Math.floor(mouseY / tileSize);

// 			if (relX >= 0 && relX < boardSizes[boardSizeIdx].X && relY >= 0 && relY < boardSizes[boardSizeIdx].Y) {
// 				logic.boardInteraction(relX, relY);
// 			}
// 			return;
// 		case "Success":
// 			isDialogRendered = !isDialogRendered;
// 			drawSuccess();
// 			return;
// 		case "Failure":
// 			isDialogRendered = !isDialogRendered;
// 			drawFailure();
// 			return;
// 		case "Intro":
// 		case "Loading":
// 		default:
// 			return;
// 	}
// }
// canvas.addEventListener("pointerup", pointerUpHandler, false);
// canvas.addEventListener("pointercancel", pointerUpHandler, false);

function clearCanvas() {
  // https://stackoverflow.com/a/6722031
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawDebug() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = Math.floor(canvasMinSize * 0.05) + "px Segoe UI";
  ctx.fillStyle = "White";
  ctx.textBaseline = "bottom";

  //const gamepad = navigator.getGamepads()[0]; // this is just a stub ;)
  var gamepad = controllers[0];
  var debugOutput = "";

  var btnStates = padHelper.getButtonStates(gamepad.buttons);
  for (let i = 0; i < gamepad.buttons.length; i++) {
    var e = btnStates[i];
    if(e.touched || e.triggered || e.value > 0){
      console.log(e);
    }

    debugOutput += (e.touched || e.triggered || e.value) > 0 ? "[Button " + i + "]" : "";
    
  }

  ctx.fillText(debugOutput, 50, 50, canvas.width * 0.8);
  //ctx.fillText(api.buttonsStatus, 0, 0, canvas.width * 0.8);
  //console.log(api.buttonsStatus)
  ctx.restore();
}

function drawBackground() {
  // draw test image
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const img = assets.getAsset("gbc");

  scalefactor = window.innerHeight / img.height > window.innerWidth / img.width ? window.innerWidth / img.width : window.innerHeight / img.height;

  ctx.drawImage(img, 0, 0, img.width * scalefactor, img.height * scalefactor);
  ctx.restore();
}

function draw() {
  controllers = navigator.getGamepads();
  //api.updateInputs();

  clearCanvas();

  drawBackground();

  ctx.beginPath();
  ctx.save();
  //ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  //   ctx.fillRect(
  //     0,
  //     0,
  //     tileSize * boardSizes[boardSizeIdx].X,
  //     tileSize * boardSizes[boardSizeIdx].Y
  //   );

  ctx.restore();
  ctx.closePath();

  if (DEBUG) {
    drawDebug();
  }
}

// function stopGameHandler(event) {
//   event.preventDefault();
//   stopGame(false);
// }

// function startGameHandler(event) {
//   startGame();
// }

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
