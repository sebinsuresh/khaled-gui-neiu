/* 
  Lamp.
*/
import Device from "../device.js";
import { colors, hexToRgba, TAU } from "../helpers/helpers.js";

export default class Lamp extends Device {
  constructor(spaceMan, isPreviewElem = false) {
    super(
      "LAMP",
      spaceMan.devices.reduce((acc, el) => {
        return acc + (el.deviceTypeStr == "LAMP" ? 1 : 0);
      }, 0),
      isPreviewElem
    );
  }

  // Creates and return illustration for the device.
  // This must be called after placing the device container on screen already.
  // Otherwise, the width and height of the canvas would not be set properly
  // by Zdog, and the illustration won't be rendered correctly.
  createIllustration(isPreviewElem) {
    this.illo = new Zdog.Illustration({
      element: this.canvElem,
      resize: true,
      rotate: { x: TAU / 5, z: TAU / 7 },
      translate: { y: 3 },
      zoom: isPreviewElem ? 20 : 15,
    });
    this.base = new Zdog.Cylinder({
      addTo: this.illo,
      diameter: 4,
      length: 0.25,
      stroke: 0.25,
      color: colors["blue1"],
      frontFace: colors["blue2"],
      fill: true,
    });
    this.stand = new Zdog.Shape({
      addTo: this.base,
      stroke: 0.5,
      color: colors["blue1"],
      closed: false,
      path: [
        { z: 0.25 },
        {
          arc: [
            { y: -2, z: 4.5 },
            { y: 0, z: 5 },
          ],
        },
      ],
    });
    this.bulbCoverBase = new Zdog.Hemisphere({
      addTo: this.stand,
      stroke: false,
      diameter: 3,
      color: colors["blue1"],
      translate: { y: 1.5, z: 5 },
      rotate: { x: 1 },
    });
    this.bulbCoverCylinder = new Zdog.Cylinder({
      addTo: this.bulbCoverBase,
      stroke: false,
      diameter: 3,
      length: 1,
      color: colors["blue1"],
      frontFace: colors["blue1"],
      backface: colors["blue2"],
      translate: { z: -0.5 },
    });
    this.bulbGlow = new Zdog.Shape({
      addTo: this.bulbCoverCylinder,
      stroke: 4,
      backface: hexToRgba(colors["yellow"], 0.3),
      translate: { z: -1 },
      color: hexToRgba(colors["yellow"], 0.3),
      visible: false,
    });

    return this.show();
  }

  // Change the status of the device.
  changeStatus(newStatus) {
    if (this.statuses.includes(newStatus)) {
      this.status = newStatus;
    }
    switch (newStatus) {
      case "OFF":
        this.bulbCoverCylinder.color = colors["blue1"];
        this.bulbCoverCylinder.children[0].children[1].backface =
          colors["blue2"];
        this.bulbGlow.visible = false;
        this.base.children[0].children[0].backface = colors["blue2"];
        return this.show();
      case "ON":
        this.bulbCoverCylinder.color = colors["blue2"];
        this.bulbCoverCylinder.children[0].children[1].backface =
          colors["yellow"];
        this.bulbGlow.visible = true;
        this.base.children[1].frontFace = colors["blue3"];
        this.base.children[0].children[0].backface = colors["blue3"];
        return this.show();
      default:
        if (!this.statuses.includes(newStatus))
          console.error(`Invalid status change for ${this.name}`);
        return this.show();
    }
  }
}
