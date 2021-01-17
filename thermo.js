/*
 *  Zdog Thermometer Illustration code
 */
const createThermo = () => ({
  rotate: { x: -0.3, y: 0.6 },
  illo: null,
  setZoom(zoom) {
    this.illo.zoom = zoom;
    return this;
  },
  create(canvElement) {
    this.illo = new Zdog.Illustration({
      element: canvElement,
      resize: true,
      zoom: 30,
      rotate: this.rotate,
    });
    this.base = new Zdog.Cylinder({
      addTo: this.illo,
      diameter: 6,
      length: 2,
      stroke: false,
      color: blue1,
      frontFace: blue2,
      backface: blue0,
      fill: true,
    });
    this.screen = new Zdog.Ellipse({
      addTo: this.base,
      diameter: 4.5,
      stroke: 0.5,
      fill: true,
      color: blue0,
      translate: { z: 1.25 },
    });
    this.arcGroup = new Zdog.Group({
      addTo: this.screen,
      translate: { z: 0.25 },
    });
    this.line1 = new Zdog.Shape({
      addTo: this.arcGroup,
      color: yellow,
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
    this.smallerLinesGroup = new Zdog.Group({
      addTo: this.arcGroup,
    });
    this.smallLine1 = new Zdog.Shape({
      addTo: this.smallerLinesGroup,
      color: yellow,
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
    this.smallerLinesGroup.copyGraph({
      rotate: {
        z: TAU / 6,
      },
    });
    this.smallerLinesGroup.copyGraph({
      rotate: {
        z: -TAU / 6,
      },
    });
    this.smallerLinesGroup.copyGraph({
      rotate: {
        z: -TAU / 3,
      },
    });
    // fixes z-fighting
    // https://zzz.dog/extras#z-fighting
    this.line1_offset = new Zdog.Ellipse({
      addTo: this.arcGroup,
      color: yellow,
      stroke: 0.2,
      diameter: 0.5,
      translate: { y: 1.25 },
    });
    this.screenReflection = new Zdog.Ellipse({
      addTo: this.screen,
      color: blue3,
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
      src: "./Poppins-Light.ttf",
    });

    this.IlloOffText = new Zdog.Text({
      addTo: this.arcGroup,
      font: this.myFont,
      value: "73",
      fontSize: 1,
      fill: true,
      textAlign: "center",
      stroke: 0.01,
      color: "white",
      translate: { y: 0.5 },
    });
    return this;
  },
  show() {
    this.illo.updateRenderGraph();
    return this;
  },
});
