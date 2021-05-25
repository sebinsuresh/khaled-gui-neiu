/*
 *  Zdog Table Lamp Illustration code
 */

class Lamp {
  constructor(canvElement, isPreviewElem = false, createIllo = true) {
    this.name = "Table Lamp";
    this.rotate = { x: TAU / 5, z: TAU / 7 };
    this.illo = null;
    this.statuses = ["OFF", "ON"];

    if(createIllo)
      this.createIllo(canvElement, isPreviewElem);
  }

  createIllo(canvElement, isPreviewElem) {
    this.illo = new Zdog.Illustration({
      element: canvElement,
      resize: true,
      rotate: this.rotate,
      translate: { y: 3 },
      zoom: isPreviewElem ? 20 : 15,
    });
    this.base = new Zdog.Cylinder({
      addTo: this.illo,
      diameter: 4,
      length: 0.25,
      stroke: 0.25,
      color: blue1,
      frontFace: blue2,
      fill: true,
    });
    this.stand = new Zdog.Shape({
      addTo: this.base,
      stroke: 0.5,
      color: blue1,
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
      color: blue1,
      translate: { y: 1.5, z: 5 },
      rotate: { x: 1 },
    });
    this.bulbCoverCylinder = new Zdog.Cylinder({
      addTo: this.bulbCoverBase,
      stroke: false,
      diameter: 3,
      length: 1,
      color: blue1,
      frontFace: blue1,
      backface: blue2,
      translate: { z: -0.5 },
    });
    this.bulbGlow = new Zdog.Shape({
      addTo: this.bulbCoverCylinder,
      stroke: 4,
      backface: hexToRgba(yellow, 0.3),
      translate: { z: -1 },
      color: hexToRgba(yellow, 0.3),
      visible: false,
    });

    return this.show();
  }

  setZoom(zoom) {
    this.illo.zoom = zoom;
    return this;
  }

  changeStatus(status) {
    switch (status) {
      case "OFF":
        this.bulbCoverCylinder.color = blue1;
        this.bulbCoverCylinder.children[0].children[1].backface = blue2;
        this.bulbGlow.visible = false;
        this.base.children[0].children[0].backface = blue2;
        return this.show();
      case "ON":
        this.bulbCoverCylinder.color = blue2;
        this.bulbCoverCylinder.children[0].children[1].backface = yellow;
        this.bulbGlow.visible = true;
        this.base.children[1].frontFace = blue3;
        this.base.children[0].children[0].backface = blue3;
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

/* const createLamp = () => ({
  rotate: { x: TAU / 5, z: TAU / 7 },
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
      translate: { y: 3 },
      zoom: isPreviewElem ? 20 : 15,
    });
    this.base = new Zdog.Cylinder({
      addTo: this.illo,
      diameter: 4,
      length: 0.25,
      stroke: 0.25,
      color: blue1,
      frontFace: blue2,
      fill: true,
    });
    this.stand = new Zdog.Shape({
      addTo: this.base,
      stroke: 0.5,
      color: blue1,
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
      color: blue1,
      translate: { y: 1.5, z: 5 },
      rotate: { x: 1 },
    });
    this.bulbCoverCylinder = new Zdog.Cylinder({
      addTo: this.bulbCoverBase,
      stroke: false,
      diameter: 3,
      length: 1,
      color: blue1,
      frontFace: blue1,
      backface: blue2,
      translate: { z: -0.5 },
    });
    this.bulbGlow = new Zdog.Shape({
      addTo: this.bulbCoverCylinder,
      stroke: 4,
      backface: hexToRgba(yellow, 0.3),
      translate: { z: -1 },
      color: hexToRgba(yellow, 0.3),
      visible: false,
    });

    return this;
  },
  statuses: ["OFF", "ON"],
  changeStatus(status) {
    switch(status) {
      case 'OFF':
        this.bulbCoverCylinder.color = blue1;
        this.bulbCoverCylinder.children[0].children[1].backface = blue2;
        this.bulbGlow.visible = false;
        this.base.children[0].children[0].backface = blue2;
        return this.show();
      case 'ON':
        this.bulbCoverCylinder.color = blue2;
        this.bulbCoverCylinder.children[0].children[1].backface = yellow;
        this.bulbGlow.visible = true;
        this.base.children[1].frontFace = blue3;
        this.base.children[0].children[0].backface = blue3;
        return this.show();
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
}); */
