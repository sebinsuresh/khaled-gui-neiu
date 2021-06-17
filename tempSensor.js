/* 
  Temp Sensor device.
*/
import Device from "./device.js";
import { colors, TAU } from "./helpers.js";

export default class TempSensor extends Device {
  constructor(spaceMan, isPreviewElem = false) {
    super(
      "TEMPSENSOR",
      spaceMan.devices.reduce((acc, el) => {
        return acc + (el.deviceTypeStr == "TEMPSENSOR" ? 1 : 0);
      }, 0),
      isPreviewElem
    );
  }

  // Creates and return illustration for the device.
  // This must be called after placing the device container on screen already.
  // Otherwise, the width and height of the canvas would not be set properly
  // by Zdog, and the illustration won't be rendered correctly.
  createIllustration(isPreviewElem) {
    // The main illustration
    this.illo = new Zdog.Illustration({
      element: this.canvElem,
      resize: true,
      zoom: isPreviewElem ? 6 : 4,
      rotate: { x: 0.9, y: 0, z: -0.5 },
      translate: { x: 5, y: -2 },
    });

    // The chip
    this.mainChip = new Zdog.Box({
      addTo: this.illo,
      color: colors["dark"],
      width: 10,
      height: 10,
      depth: 5,
      stroke: 2,
      frontFace: colors["dark2"],
    });

    this.pins = new Zdog.Group({
      addTo: this.illo,
    });

    this.pin1 = new Zdog.Shape({
      addTo: this.pins,
      color: colors["yellow"],
      stroke: 1,
      translate: { x: -6, y: -4, z: 0 },
      closed: false,
      path: [
        { x: 0, y: 0, z: 0 },
        { x: -3, y: 0, z: 0 },
        { x: -6, y: -2, z: 0 },
        { x: -12, y: -2, z: 0 },
      ],
    });

    this.pin2 = this.pin1.copyGraph({
      translate: { x: -6, y: 0, z: 0 },
      path: [
        { x: 0, y: 0, z: 0 },
        { x: -12, y: 0, z: 0 },
      ],
    });

    this.pin3 = this.pin1.copyGraph({
      translate: { x: -6, y: 4, z: 0 },
      path: [
        { x: 0, y: 0, z: 0 },
        { x: -3, y: 0, z: 0 },
        { x: -6, y: 2, z: 0 },
        { x: -12, y: 2, z: 0 },
      ],
    });

    // Set up a font to use
    this.myFont = new Zdog.Font({
      src: "./Poppins-Light.ttf",
    });

    this.textGroup = new Zdog.Group({
      addTo: this.illo,
      translate: { x: -1, y: -1, z: 3 },
    });

    this.tempText = new Zdog.Text({
      addTo: this.textGroup,
      font: this.myFont,
      value: "--",
      fontSize: 4,
      fill: true,
      textAlign: "center",
      color: colors["dark"],
      stroke: 0.1,
      rotate: { z: TAU / 4 },
    });

    // Offset to prevent z-fighting, and
    // show the text properly. Read here:
    // https://zzz.dog/extras#z-fighting
    this.textBalance = new Zdog.Shape({
      addTo: this.textGroup,
      translate: { z: 5 },
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
        this.tempText.value = "--";
        this.tempText.color = colors["dark"];
        return this.show();
      case "ON":
        this.tempText.value = "72°";
        this.tempText.color = colors["gray"];
        return this.show();
      default:
        if (!this.statuses.includes(newStatus))
          console.error(`Invalid status change for ${this.name}`);
        return this.show();
    }
  }
}
