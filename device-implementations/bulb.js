/* 
  Bulb.
*/
import Device from "../device.js";
import { colors, TAU } from "../helpers/helpers.js";

export default class Bulb extends Device {
  constructor(spaceMan, isPreviewElem = false) {
    super(
      "BULB",
      spaceMan.devices.reduce((acc, el) => {
        return acc + (el.deviceTypeStr == "BULB" ? 1 : 0);
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
      rotate: { x: -0.4 + TAU / 4, y: 0.3 },
      translate: { x: 1, y: 3 },
      zoom: isPreviewElem ? 15 : 10,
    });
    this.baseStart = new Zdog.Ellipse({
      addTo: this.illo,
      diameter: 2,
      stroke: 1,
      color: colors["bulbBaseColor"],
      fill: true,
    });
    this.base2 = this.baseStart.copy({
      addTo: this.baseStart,
      translate: { z: 1 },
    });
    this.base3 = this.base2.copy({
      addTo: this.base2,
      translate: { z: 1 },
    });
    this.baseBottom = new Zdog.Hemisphere({
      addTo: this.baseStart,
      diameter: 2,
      stroke: false,
      color: colors["baseBottomColor"],
      translate: {
        z: -0.5,
      },
      rotate: {
        y: TAU / 2,
      },
    });
    this.bulb = new Zdog.Shape({
      addTo: this.base3,
      stroke: 6,
      translate: {
        z: 3,
      },
      color: colors["bulbColor"],
    });
    this.bulbHighlight = new Zdog.Ellipse({
      addTo: this.bulb,
      // color: colors["bulbHighlightColor"],
      color: "rgba(0,0,0,0)",
      stroke: 0.1,
      height: 2,
      backface: colors["bulbHighlightColor"],
      width: 1,
      fill: true,
      translate: { x: 1.5, y: 1.5, z: 2 },
      rotate: { x: TAU / 2.5, y: TAU / 11, z: 0 },
    });
    this.filament = new Zdog.Shape({
      addTo: this.base3,
      stroke: 0.2,
      color: colors["filamentOffColor"],
      path: [
        // start
        { x: 0.2, z: 0.5 },
        // 1
        {
          arc: [
            { x: 0.2, z: 1 },
            { x: 1, z: 2 },
          ],
        },
        // 2
        {
          arc: [
            { x: 1.5, z: 2.5 },
            { x: 0.75, z: 2.5 },
          ],
        },
        // 3
        {
          arc: [
            { x: 0.25, z: 2.5 },
            { x: 0.5, z: 2 },
          ],
        },
        // 4
        {
          arc: [
            { x: 1, z: 2 },
            { x: 0.75, z: 2.5 },
          ],
        },
        // 5
        {
          arc: [
            { x: 0.25, z: 3 },
            { x: 0, z: 2.5 },
          ],
        },
        // 6
        {
          arc: [
            { x: -0.35, z: 2.125 },
            { x: 0, z: 1.75 },
          ],
        },
        // 7 - mirror of 6
        {
          arc: [
            { x: 0.35, z: 2.125 },
            { x: 0, z: 2.5 },
          ],
        },
        // 8 - mirror of 5
        {
          arc: [
            { x: -0.25, z: 3 },
            { x: -0.75, z: 2.5 },
          ],
        },
        // 9 - mirror of 4
        {
          arc: [
            { x: -1, z: 2 },
            { x: -0.5, z: 2 },
          ],
        },
        // 10 - mirror of 3
        {
          arc: [
            { x: -0.25, z: 2.5 },
            { x: -0.75, z: 2.5 },
          ],
        },
        // 11 - mirror of 2
        {
          arc: [
            { x: -1.5, z: 2.5 },
            { x: -1, z: 2 },
          ],
        },
        // 12 - mirror of 1
        {
          arc: [
            { x: -0.2, z: 1 },
            { x: -0.2, z: 0.5 },
          ],
        },
      ],
      closed: false,
    });
    this.bulbInnerGlow = new Zdog.Shape({
      addTo: this.bulb,
      stroke: 4,
      color: colors["innerGlowColor"],
      visible: false,
    });
    this.bulbOuterGlow = new Zdog.Shape({
      addTo: this.bulb,
      stroke: 8,
      color: colors["outerGlowColor"],
      visible: false,
    });
    this.outerRays = new Zdog.Group({
      addTo: this.bulb,
      visible: false,
    });
    this.ray1 = new Zdog.Shape({
      addTo: this.outerRays,
      stroke: 0.5,
      path: [{ x: 5 }, { x: 7 }],
      color: colors["rayColor"],
    });
    this.ray1.copy({
      rotate: { y: TAU / 6 },
    });
    this.ray1.copy({
      rotate: { y: TAU / 3 },
    });
    this.ray1.copy({
      rotate: { y: TAU / 2 },
    });
    this.ray1.copy({
      rotate: { y: (2 * TAU) / 3 },
    });
    this.ray1.copy({
      rotate: { y: (5 * TAU) / 6 },
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
        this.bulb.color = colors["bulbColor"];
        this.bulbHighlight.visible = true;
        this.filament.color = colors["filamentOffColor"];
        this.bulbInnerGlow.visible = false;
        this.bulbOuterGlow.visible = false;
        this.outerRays.visible = false;
        return this.show();
      case "ON":
        this.bulb.color = colors["bulbOnColor"];
        this.bulbHighlight.visible = false;
        this.filament.color = colors["filamentOnColor"];
        this.bulbInnerGlow.visible = true;
        this.bulbOuterGlow.visible = true;
        this.outerRays.visible = true;
        return this.show();
      default:
        if (!this.statuses.includes(newStatus))
          console.error(`Invalid status change for ${this.name}`);
        return this.show();
    }
  }
}
