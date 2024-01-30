export class gamepadAPI {
  controller;
  turbo = false;
  buttons = [];
  buttonsCache = [];
  buttonsStatus = [];
  axesStatus = [];

   connect(evt) {
    this.controller = evt.gamepad;
    this.turbo = true;
    console.log("Gamepad connected.");
    console.table(this.controller)
  }

   disconnect(evt) {
    this.turbo = false;
    delete this.controller;
    console.log("Gamepad disconnected.");
  }

   updateInputs() {
    // Clear the buttons cache
    this.buttonsCache = [];

    // Move the buttons status from the previous frame to the cache
    for (let k = 0; k < this.buttonsStatus.length; k++) {
      this.buttonsCache[k] = this.buttonsStatus[k];
    }

    // Clear the buttons status
    this.buttonsStatus = [];

    // Get the gamepad object
    const c = this.controller || {};
    console.table(c);
    // Loop through buttons and push the pressed ones to the array
    const pressed = [];
    if (c.buttons) {
      for (let b = 0; b < c.buttons.length; b++) {
        if (c.buttons[b].pressed) {
          pressed.push(this.buttons[b]);
        }
      }
    }

    // Loop through axes and push their values to the array
    const axes = [];
    if (c.axes) {
      for (let a = 0; a < c.axes.length; a++) {
        axes.push(c.axes[a].toFixed(2));
      }
    }

    // Assign received values
    this.axesStatus = axes;
    this.buttonsStatus = pressed;

    // Return buttons for debugging purposes
    return pressed;
  }

   buttonPressed(button, hold) {
    let newPress = false;

    // Loop through pressed buttons
    for (let i = 0; i < this.buttonsStatus.length; i++) {
      // If we found the button we're looking for
      if (this.buttonsStatus[i] === button) {
        // Set the boolean variable to true
        newPress = true;

        // If we want to check the single press
        if (!hold) {
          // Loop through the cached states from the previous frame
          for (let j = 0; j < this.buttonsCache.length; j++) {
            // If the button was already pressed, ignore new press
            newPress = this.buttonsCache[j] !== button;
          }
        }
      }
    }
    return newPress;
  }
}
