/* 
  LED Bulb.
*/
import Device from "../device.js";
import { colors, TAU } from "../helpers/helpers.js";

export default class LEDBulb extends Device {
  constructor(spaceMan, isPreviewElem = false) {
    super(
      "LED",
      spaceMan.devices.reduce((acc, el) => {
        return acc + (el.deviceTypeStr == "LED" ? 1 : 0);
      }, 0),
      isPreviewElem
    );
  }

  // Creates and return illustration for the LED.
  // This must be called after placing the device container on screen already.
  // Otherwise, the width and height of the canvas would not be set properly
  // by Zdog, and the illustration won't be rendered correctly.
  createIllustration(isPreviewElem) {
    // The main illustration
    this.illo = new Zdog.Illustration({
      element: this.canvElem,
      resize: true,
      zoom: isPreviewElem ? 8 : 5,
      rotate: { x: 2.4, y: -0.8, z: 0 },
      translate: { x: 0, y: -1 },
    });

    this.ledCylider = new Zdog.Cylinder({
      addTo: this.illo,
      color: colors["red"],
      diameter: 8,
      stroke: 0,
      length: 8,
      backface: colors["redLight"],
    });

    this.ledTop = new Zdog.Hemisphere({
      addTo: this.illo,
      color: colors["red"],
      diameter: 8,
      stroke: 0,
      translate: { z: 4 },
    });

    this.pinGroup = new Zdog.Group({
      addTo: this.illo,
      translate: {
        z: -8,
      },
    });

    this.pin1 = new Zdog.Cylinder({
      addTo: this.pinGroup,
      color: colors["grayDark"],
      stroke: 0,
      diameter: 1,
      length: 8,
      translate: { x: -2 },
    });

    this.pin2 = this.pin1.copy({
      translate: { x: 2 },
    });

    this.glow = new Zdog.Shape({
      addTo: this.illo,
      stroke: 20,
      translate: {
        z: 2,
      },
      color: colors["redLight"] + "55",
      visible: false,
    });

    return this.show();
  }

  // Change the status of the LED.
  changeStatus(newStatus) {
    if (this.statuses.includes(newStatus)) {
      this.status = newStatus;
    }
    switch (newStatus) {
      case "OFF":
        this.ledTop.color = colors["red"];
        this.ledCylider.color = colors["red"];
        this.ledCylider.backface = colors["redLight"];
        this.glow.visible = false;
        return this.show();
      case "ON":
        this.ledTop.color = colors["redLight"];
        this.ledCylider.color = colors["redLight"];
        this.ledCylider.backface = colors["redLight2"];
        this.glow.visible = true;
        return this.show();
      default:
        if (!this.statuses.includes(newStatus))
          console.error(`Invalid status change for ${this.name}`);
        return this.show();
    }
  }
}
