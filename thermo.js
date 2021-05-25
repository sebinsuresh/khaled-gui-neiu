/*
 *  Zdog Thermometer Illustration code
 */

class Thermometer {
  constructor(canvElement, isPreviewElem = false){
    this.name = "Thermometer";
    this.rotate = { x: -0.3, y: 0.6 };
    this.illo = null;
    this.statuses = ["OFF", "ON"];

    this.createIllo(canvElement, isPreviewElem);
  }

  createIllo(canvElement, isPreviewElem){
    this.illo = new Zdog.Illustration({
      element: canvElement,
      resize: true,
      zoom: isPreviewElem ? 25 : 15,
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
      color: blue1,
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
      color: blue1,
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
      color: blue1,
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
      color: blue0,
      translate: { y: 0.5 },
      visible: false,
    });
    return this.show();
  }

  setZoom(zoom) {
    this.illo.zoom = zoom;
    return this;
  }

  changeStatus(status) {
    switch(status) {
      case 'OFF':
        this.IlloOffText.visible = false;
        this.line1_offset.color = blue1;
        for (let i = 0; i < 5; i++) {
          this.arcGroup.children[i].color = blue1;
        }
        for (let i = 0; i < 3; i++) {
          this.smallerLinesGroup1.children[i].color = blue1;
          this.smallerLinesGroup2.children[i].color = blue1;
          this.smallerLinesGroup3.children[i].color = blue1;
          this.smallerLinesGroup4.children[i].color = blue1;
        }
        return this.show();
      case 'ON':
        this.IlloOffText.visible = true;
        this.IlloOffText.color = "white";
        this.line1_offset.color = yellow;
        for (let i = 0; i < 5; i++) {
          this.arcGroup.children[i].color = yellow;
        }
        for (let i = 0; i < 3; i++) {
          this.smallerLinesGroup1.children[i].color = yellow;
          this.smallerLinesGroup2.children[i].color = yellow;
          this.smallerLinesGroup3.children[i].color = yellow;
          this.smallerLinesGroup4.children[i].color = yellow;
        }
        return this.show();
      default:
        if (!(status in this.statuses))
          console.error(`Invalid status change for $(this.name)`);
        return this.show();
    }
  }

  hoverEnter() {
    return this.changeStatus("ON");
  }
  
  hoverLeave() {
    return this.changeStatus("OFF");
  }
  
  show() {
    this.illo.updateRenderGraph();
    return this;
  }
}

const createThermo = () => ({
  rotate: { x: -0.3, y: 0.6 },
  illo: null,
  setZoom(zoom) {
    this.illo.zoom = zoom;
    return this;
  },
  create(canvElement, isPreviewElem=false) {
    this.illo = new Zdog.Illustration({
      element: canvElement,
      resize: true,
      zoom: isPreviewElem ? 25 : 15,
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
      color: blue1,
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
      color: blue1,
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
      color: blue1,
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
      color: blue0,
      translate: { y: 0.5 },
      visible: false,
    });
    return this;
  },
  statuses: ["OFF", "ON"],
  changeStatus(status) {
    switch(status) {
      case 'OFF':
        this.IlloOffText.visible = false;
        this.line1_offset.color = blue1;
        for (let i = 0; i < 5; i++) {
          this.arcGroup.children[i].color = blue1;
        }
        for (let i = 0; i < 3; i++) {
          this.smallerLinesGroup1.children[i].color = blue1;
          this.smallerLinesGroup2.children[i].color = blue1;
          this.smallerLinesGroup3.children[i].color = blue1;
          this.smallerLinesGroup4.children[i].color = blue1;
        }
        return this.show();
      case 'ON':
        this.IlloOffText.visible = true;
        this.IlloOffText.color = "white";
        this.line1_offset.color = yellow;
        for (let i = 0; i < 5; i++) {
          this.arcGroup.children[i].color = yellow;
        }
        for (let i = 0; i < 3; i++) {
          this.smallerLinesGroup1.children[i].color = yellow;
          this.smallerLinesGroup2.children[i].color = yellow;
          this.smallerLinesGroup3.children[i].color = yellow;
          this.smallerLinesGroup4.children[i].color = yellow;
        }
        return this.show();
      default:
        return this.show();
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
