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

var canvas = document.getElementById("cvGame");
var ctx = canvas.getContext("2d");
var gameLoop;
var controllers = navigator.getGamepads();
var activeCtrl = 0;
var activeCfg = 0;
var activeTheme = "gbc";
var gamepadDraw;

// keys for manually entering cfg
var gamepadKeys = ["Up", "Down", "Left", "Right", "B", "A", "Start", "Select"];
var keyCfg = {};
var lastPressedButton = [];
var keyCfgIdx = -1;
var singleKey = false;

// "Loading", "Stopped", "Running", "Config", "NoCfg"
var gameState = "Loading";

resizeCanvas();
// Attempt at auto-resize
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - (document.getElementById("fMenu").offsetHeight + CONST.canvasHeightMargin);
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);

function buttonsPressed() {
  let ret = [];

  if (controllers[activeCtrl]) {
    for (let i = 0; i < controllers[activeCtrl].buttons.length; i++) {
      var e = controllers[activeCtrl].buttons[i];
      if (e.touched || e.triggered || e.value > 0) {
        ret.push(i);
      }
    }
  }
  return ret;
}

function clearCanvas() {
  // https://stackoverflow.com/a/6722031
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawCFGMode() {
  lastPressedButton = buttonsPressed();

  // write out which button to set, and what is currently pressed
  ctx.font = Math.floor(50) + "px Segoe UI";
  ctx.fillStyle = "white";
  ctx.textBaseline = "bottom";

  ctx.fillText("Press input for button '" + gamepadKeys[keyCfgIdx] + "'", 50, 50, canvas.width * 0.8);
  ctx.fillText("Currently pressed: " + lastPressedButton, 50, 100, canvas.width * 0.8);
  ctx.fillText("Press any key (keyboard) to confirm.", 50, 200, canvas.width * 0.8);
}

function drawHint() {
  ctx.font = Math.floor(50) + "px Segoe UI";
  ctx.fillStyle = "white";
  ctx.textBaseline = "bottom";

  ctx.fillText("Config state '" + activeCfg + "' has no saved config...", 50, 50, canvas.width * 0.8);
  ctx.fillText("Right-click to start configuring...", 50, 100, canvas.width * 0.8);
}

function draw() {
  controllers = navigator.getGamepads();
  //api.updateInputs();

  clearCanvas();

  switch (gameState) {
    case "Running":
      if (controllers[activeCtrl]) {
        gamepadDraw.draw(canvas, controllers[activeCtrl].buttons);
      }
      break;
    case "Config":
      drawCFGMode();
      break;
    case "NoCfg":
      drawHint();
      break;
  }
}

function loadGamePadObj() {
  switch (activeTheme) {
    case "gbc":
      gamepadDraw = new ImageGBCGamePad(assets.getAsset(activeTheme), keyCfg);
      break;
    case "fgbc-y":
      gamepadDraw = new FlatGBCGamePad(keyCfg, "rgba(243, 173, 4, 1)", "rgba(255, 255, 255, 1)", "rgba(80, 80, 80, 1)", "rgba(0, 0, 0, 1)", "rgba(80, 80, 80, 0.2)", "rgba(0, 0, 0, 0.2)");
      break;
    case "fgbc-g":
      gamepadDraw = new FlatGBCGamePad(keyCfg, "rgba(173, 243, 4, 1)", "rgba(255, 255, 255, 1)", "rgba(80, 80, 80, 1)", "rgba(0, 0, 0, 1)", "rgba(80, 80, 80, 0.2)", "rgba(0, 0, 0, 0.2)");
      break;
    case "fgbc-r":
      gamepadDraw = new FlatGBCGamePad(keyCfg, "rgba(245, 5, 89, 1)", "rgba(255, 255, 255, 1)", "rgba(80, 80, 80, 1)", "rgba(0, 0, 0, 1)", "rgba(80, 80, 80, 0.2)", "rgba(0, 0, 0, 0.2)");
      break;
    default:
      stopGame();
      console.log("theme could not be found");
      break;
  }
}


function stopGame() {
  gameState = "Stopped";
  clearInterval(gameLoop);

  // Trigger resize to draw canvas
  resizeCanvas();
}

function startGame() {
  if (gameState === "Stopped") {
    gameState = "Running";
  }

  if (JSON.stringify(keyCfg) !== '{}') {
    loadGamePadObj();
    document.getElementById("lbControllerInfo").title = JSON.stringify(keyCfg);
  }
  else {
    //gamepadDraw = new GBCGamePad(assets.getAsset(activeTheme));
    // dont use default cfg, instead display text telling them to create cfg by rightclicking text
    gameState = "NoCfg";
  }
  gameLoop = setInterval(draw, 10);

  // force resize to recalc tilesize
  resizeCanvas();
}

function updateActiveTheme() {
  if (gameState === "Running") {
    stopGame();
  }

  activeTheme = document.getElementById("sTheme").value;
  loadGamePadObj();

  if (controllers[activeCtrl]) {
    startGame();
  }
}
updateActiveTheme();
document.getElementById("sTheme").addEventListener("change", updateActiveTheme);

function updateCtrlLabel() {
  document.getElementById("lbControllerInfo").innerText = controllers[activeCtrl] ? controllers[activeCtrl].id : "Please press a button on your controller to start!";
}

function controllerSelectorChanged() {
  if (gameState === "Running") {
    stopGame();
  }

  activeCtrl = document.getElementById("sController").value;
  updateCtrlLabel();

  if (controllers[activeCtrl]) {
    startGame();
  }
}
document.getElementById("sController").addEventListener("change", controllerSelectorChanged);

function loadCfg() {
  var tmp = window.localStorage.getItem("gbc-key-cfg-" + activeCfg);

  if (tmp) {
    keyCfg = JSON.parse(tmp);
  }
}

function btnCfgSelectorchanged() {
  if (gameState === "Running") {
    stopGame();
  }

  keyCfg = {};
  activeCfg = document.getElementById("sConfig").value;
  //load cfg from 
  loadCfg();

  if (keyCfg && (!JSON.stringify(keyCfg) !== '{}')) {
    if (gameState === "NoCfg") {
      gameState = "Stopped";
    }

    startGame();
  }
}
document.getElementById("sConfig").addEventListener("change", btnCfgSelectorchanged);

function updateInputSelector() {
  let sCtrl = document.querySelector("#sController");
  while (sCtrl.options.length > 0) {
    sCtrl.remove(0);
  }

  for (let i = 0; i < controllers.length; i++) {

    let opt = new Option(i + (controllers[i] ? (": " + controllers[i].id) : ""), i);
    sCtrl.add(opt, undefined);
  }

  updateCtrlLabel();
}
updateInputSelector();

function padConnectedListener(event) {
  controllers = navigator.getGamepads();

  console.log("Gamepad connected.");
  updateInputSelector();


  if (gameState === "Stopped") {
    startGame();
  }
}

function padDisconnectedListener(event) {
  controllers = navigator.getGamepads();
  console.log("Gamepad disconnected.");

  // if (gameState === "Running") {
  //   stopGame();
  // }
}

function triggerConfigRead(event) {
  event.preventDefault();
  singleKey = false;
  keyCfg = {};
  lastPressedButton = [];
  keyCfgIdx = 0;


  if (gameState === "Stopped") {
    gameState = "Config";
    startGame();
  }
  gameState = "Config";
}

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function triggerSingleButtonConfigRead(event) {
  if (!(gamepadDraw && gameState != "Config")) {
    return;
  }
  event.preventDefault();

  singleKey = true;

  //determine where was clicked on the canvas
  var pos = getMousePos(event);
  const key = gamepadDraw.getKeyOnCoords(pos.x, pos.y, canvas)
  console.log(key);

  if (key) {
    lastPressedButton = [];
    keyCfgIdx = gamepadKeys.indexOf(key);

    if (gameState === "Stopped") {
      gameState = "Config";
      startGame();
    }
    gameState = "Config";
  }
}

window.addEventListener("gamepadconnected", padConnectedListener);
window.addEventListener("gamepaddisconnected", padDisconnectedListener);
document.getElementById("lbControllerInfo").innerText = "Please press a button on your controller to start!"
document.getElementById("lbControllerInfo").addEventListener('contextmenu', triggerConfigRead);
document.getElementById("cvGame").addEventListener('contextmenu', triggerConfigRead);
document.getElementById("cvGame").addEventListener('click', triggerSingleButtonConfigRead);

document.onkeydown = function (evt) {
  if (controllers) {
    switch (gameState) {
      // case "Running":
      //   stopGame();
      //   break;
      // case "Stopped":
      //   startGame();
      //   break;
      case "Config":
        if (lastPressedButton.length > 0) {
          keyCfg[gamepadKeys[keyCfgIdx++]] = lastPressedButton;
          lastPressedButton = [];
          if (keyCfgIdx == gamepadKeys.length || singleKey) {
            gameState = "Running";
            window.localStorage.setItem("gbc-key-cfg-" + activeCfg, JSON.stringify(keyCfg));
            startGame();
          }
        }
        break;
    }
  }
};

// TODO: move all non-ui specific logic to seperate file, for electron app.

window.bridge && window.bridge.sendCfgs((event, settings) => {
  console.log(settings);
});