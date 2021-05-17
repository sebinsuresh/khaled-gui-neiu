/*
 *  Zdog Light Bulb Illustration code
 */

// Colors for the illustration
let bulbBaseColor = "#868D87";
let baseBottomColor = "#333232";
let bulbColor = hexToRgba(lightBlue, 0.4);
let bulbOnColor = bulbColor;
let bulbHighlightColor = offWhite;
let filamentOffColor = "#A87356";
let filamentOnColor = offWhite;
let innerGlowColor = hexToRgba(offWhite, 0.3);
let outerGlowColor = hexToRgba(bulbYellow, 0.3);
let rayColor = hexToRgba(bulbYellow, 0.3);

const createBulb = () => ({
  rotate: { x: -0.4 + TAU / 4, y: 0.3 },
  illo: null,
  setZoom(zoom) {
    this.illo.zoom = zoom;
    return this;
  },
  create(canvElement, isPreviewElem=false) {
    this.illo = new Zdog.Illustration({
      element: canvElement,
      resize: true,
      rotate: this.rotate,
      translate: { x: 1, y: 3 },
      zoom: isPreviewElem ? 15 : 12,
    });
    this.baseStart = new Zdog.Ellipse({
      addTo: this.illo,
      diameter: 2,
      stroke: 1,
      color: bulbBaseColor,
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
      color: baseBottomColor,
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
      color: bulbColor,
    });
    this.bulbHighlight = new Zdog.Ellipse({
      addTo: this.bulb,
      // color: bulbHighlightColor,
      color: "rgba(0,0,0,0)",
      stroke: 0.1,
      height: 2,
      backface: bulbHighlightColor,
      width: 1,
      fill: true,
      translate: { x: 1.5, y: 1.5, z: 2 },
      rotate: { x: TAU / 2.5, y: TAU / 11, z: 0 },
    });
    this.filament = new Zdog.Shape({
      addTo: this.base3,
      stroke: 0.2,
      color: filamentOffColor,
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
      color: innerGlowColor,
      visible: false,
    });
    this.bulbOuterGlow = new Zdog.Shape({
      addTo: this.bulb,
      stroke: 8,
      color: outerGlowColor,
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
      color: rayColor,
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
    return this;
  },
  statuses: ["OFF", "ON"],
  changeStatus(status) {
    switch(status) {
      case 'OFF':
        this.bulb.color = bulbColor;
        this.bulbHighlight.visible = true;
        this.filament.color = filamentOffColor;
        this.bulbInnerGlow.visible = false;
        this.bulbOuterGlow.visible = false;
        this.outerRays.visible = false;
        return this;
      case 'ON':
        this.bulb.color = bulbOnColor;
        this.bulbHighlight.visible = false;
        this.filament.color = filamentOnColor;
        this.bulbInnerGlow.visible = true;
        this.bulbOuterGlow.visible = true;
        this.outerRays.visible = true;
        return this;
      default:
        return this;
    }
  },
  hoverEnter() {
    return this.changeStatus("ON");
  },
  hoverLeave() {
    return this.changeStatus("OFF");
  },
  show() {
    this.illo.updateRenderGraph();
    return this;
  },
});
