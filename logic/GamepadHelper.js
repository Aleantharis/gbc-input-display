// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#sub_classing_with_extends

export class GamepadHelper {
  constructor() {
    this.lastTimestamp = 0;
    this.lastButtonStates = [];
  }

  getButtonStates(buttons) {
    this.lastButtonStates = buttons.map((button, index) => {
      return {
        pressed: button.pressed,
        touched: button.touched,
        value: button.value,
        triggered: this.lastButtonStates[index]
          ? (button.pressed && this.lastButtonStates[index].pressed !== button.pressed)
          : button.pressed,
        released: this.lastButtonStates[index]
          ? (!button.pressed && this.lastButtonStates[index].pressed !== button.pressed)
          : false
      }
    });

    return this.lastButtonStates;
  }

  getElapsedTime(timestamp) {
    // Find time elapsed since last gamepad update
    const elapsedTime = this.lastTimestamp === 0
      ? 0
      : timestamp - this.lastTimestamp;
    // Store current timestamp for next time
    this.lastTimestamp = timestamp;

    // Return delta
    return elapsedTime;
  }

  // ---------------------------------------------------------------------------

  axisDeadzone(axis, outerThreshold, innerThreshold = 0) {
    if (innerThreshold > 0) {
      const multiplier = (axis > 0 ? 1 : -1);
      axis = Math.max(0, (Math.abs(axis) - innerThreshold) / (1 - innerThreshold)) * multiplier;
    }

    if (outerThreshold > 0) {
      axis = Math.max(-1, Math.min(1, axis / (1 - outerThreshold)));
    }

    return axis;
  }

  axisToThrottle(axis) {
    return (axis + 1) / -2;
  }

  axisToButton(axis) {
    return {
      pressed: (axis > -1),
      value: (axis + 1) / 2,
      touched: true
    };
  }

  //   0
  // 3 + 1
  //   2
  axisToFourWay(axis) {
    return (axis > 1)
      ? undefined // centered state
      : Math.round((axis + 1) * 7/4) % 4; // 0 means "top", 2 means "bottom"
  }

  // 7 0 1
  // 6 + 2
  // 5 4 3
  axisToEightWay(axis) {
    return (axis > 1)
      ? undefined // centered state
      : Math.round((axis + 1) * 7/2); // 0 means "top", 4 means "bottom"
  }

  // 7 0 1
  // 6 + 2
  // 5 4 3
  eightWaytoAxes(value) {
    if (value === undefined) {
      return [0,0];
    }
    let x = value % 4 ? 1 : 0;
    x *= value > 4 ? -1 : 1;
    
    let y = ((value +2) % 4) ? 1 : 0;
    y *= value < 2 || value > 6 ? -1 : 1;

    return [x,y];
  }
}
