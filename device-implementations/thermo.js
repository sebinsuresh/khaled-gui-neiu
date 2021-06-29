/* 
  Thermometer device.
*/
import Device from "../device.js";
import { colors, TAU } from "../helpers/helpers.js";

export default class Thermometer extends Device {
  constructor(spaceMan, isPreviewElem = false) {
    super(
      "THERMOMETER",
      spaceMan.devices.reduce((acc, el) => {
        return acc + (el.deviceTypeStr == "THERMOMETER" ? 1 : 0);
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
      zoom: isPreviewElem ? 25 : 15,
      rotate: { x: -0.3, y: 0.6 },
    });
    this.base = new Zdog.Cylinder({
      addTo: this.illo,
      diameter: 6,
      length: 2,
      stroke: false,
      color: colors["blue1"],
      frontFace: colors["blue2"],
      backface: colors["blue0"],
      fill: true,
    });
    this.screen = new Zdog.Ellipse({
      addTo: this.base,
      diameter: 4.5,
      stroke: 0.5,
      fill: true,
      color: colors["blue0"],
      translate: { z: 1.25 },
    });
    this.arcGroup = new Zdog.Group({
      addTo: this.screen,
      translate: { z: 0.25 },
    });
    this.line1 = new Zdog.Shape({
      addTo: this.arcGroup,
      color: colors["blue1"],
      stroke: 0.25,
      path: [{ y: -2 }, { y: -1.5 }],
    });
    this.line1.copy({
      rotate: { z: TAU / 3 },
    });
    this.line1.copy({
      rotate: { z: TAU / 6 },
    });
    this.line1.copy({
      rotate: { z: -TAU / 3 },
    });
    this.line1.copy({
      rotate: { z: -TAU / 6 },
    });
    this.smallerLinesGroup1 = new Zdog.Group({
      addTo: this.arcGroup,
    });
    this.smallLine1 = new Zdog.Shape({
      addTo: this.smallerLinesGroup1,
      color: colors["blue1"],
      stroke: 0.125,
      path: [{ y: -2 }, { y: -1.75 }],
      rotate: { z: TAU / 24 },
    });
    this.smallLine1.copy({
      rotate: { z: TAU / 12 },
    });
    this.smallLine1.copy({
      rotate: { z: (3 * TAU) / 24 },
    });
    this.smallerLinesGroup2 = this.smallerLinesGroup1.copyGraph({
      rotate: {
        z: TAU / 6,
      },
    });
    this.smallerLinesGroup3 = this.smallerLinesGroup1.copyGraph({
      rotate: {
        z: -TAU / 6,
      },
    });
    this.smallerLinesGroup4 = this.smallerLinesGroup1.copyGraph({
      rotate: {
        z: -TAU / 3,
      },
    });
    // fixes z-fighting
    // https://zzz.dog/extras#z-fighting
    this.line1_offset = new Zdog.Ellipse({
      addTo: this.arcGroup,
      color: colors["blue1"],
      stroke: 0.2,
      diameter: 0.5,
      translate: { y: 1.25 },
    });
    this.screenReflection = new Zdog.Ellipse({
      addTo: this.screen,
      color: colors["blue3"],
      stroke: 0.2,
      diameter: 4.75,
      quarters: 1,
    });
    this.baseReflectionGroup = new Zdog.Group({
      addTo: this.base,
    });
    this.baseReflection = new Zdog.Shape({
      addTo: this.baseReflectionGroup,
      color: "white",
      stroke: 0.25,
      path: [
        { y: -2.85, z: 0.75 },
        { y: -2.85, z: -0.75 },
      ],
      rotate: { z: TAU / 12 },
    });
    // Offset to fix the z-fighting on the reflection
    this.baseReflectionOffset = new Zdog.Shape({
      addTo: this.baseReflectionGroup,
      translate: { x: 2.4, y: -3.25, z: -2.1 },
      color: "white",
      visible: false,
    });

    // Set up a font to use
    this.myFont = new Zdog.Font({
      src: "../fonts/Poppins-Light.ttf",
    });

    this.IlloOffText = new Zdog.Text({
      addTo: this.arcGroup,
      font: this.myFont,
      value: "73",
      fontSize: 1,
      fill: true,
      textAlign: "center",
      stroke: 0.01,
      color: colors["blue0"],
      translate: { y: 0.5 },
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
        this.IlloOffText.visible = false;
        this.line1_offset.color = colors["blue1"];
        for (let i = 0; i < 5; i++) {
          this.arcGroup.children[i].color = colors["blue1"];
        }
        for (let i = 0; i < 3; i++) {
          this.smallerLinesGroup1.children[i].color = colors["blue1"];
          this.smallerLinesGroup2.children[i].color = colors["blue1"];
          this.smallerLinesGroup3.children[i].color = colors["blue1"];
          this.smallerLinesGroup4.children[i].color = colors["blue1"];
        }
        return this.show();
      case "ON":
        this.IlloOffText.visible = true;
        this.IlloOffText.color = "white";
        this.line1_offset.color = colors["yellow"];
        for (let i = 0; i < 5; i++) {
          this.arcGroup.children[i].color = colors["yellow"];
        }
        for (let i = 0; i < 3; i++) {
          this.smallerLinesGroup1.children[i].color = colors["yellow"];
          this.smallerLinesGroup2.children[i].color = colors["yellow"];
          this.smallerLinesGroup3.children[i].color = colors["yellow"];
          this.smallerLinesGroup4.children[i].color = colors["yellow"];
        }
        return this.show();
      default:
        if (!this.statuses.includes(newStatus))
          console.error(`Invalid status change for ${this.name}`);
        return this.show();
    }
  }
}
