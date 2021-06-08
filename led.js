/*
 *  Zdog LED bulb Illustration code
 */

class LEDBulb {
  constructor(canvElement, isPreviewElem = false, createIllo = true) {
    this.name = "LED Bulb";
    this.rotate = { x: 2.4, y: -0.8, z: 0 };
    this.illo = null;
    this.statuses = ["OFF", "ON"];

    if (createIllo) this.createIllo(canvElement, isPreviewElem);
  }

  createIllo(canvElement, isPreviewElem) {
    // The main illustration
    this.illo = new Zdog.Illustration({
      element: canvElement,
      resize: true,
      zoom: isPreviewElem ? 8 : 5,
      rotate: this.rotate,
      translate: { x: 0, y: -1 },
    });

    this.ledCylider = new Zdog.Cylinder({
      addTo: this.illo,
      color: red,
      diameter: 8,
      stroke: 0,
      length: 8,
      backface: redLight,
    });

    this.ledTop = new Zdog.Hemisphere({
      addTo: this.illo,
      color: red,
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
      color: grayDark,
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
      color: redLight + "55",
      visible: false,
    });

    return this.show();
  }

  setZoom(zoom) {
    this.illo.zoom = zoom;
    return this.show();
  }

  changeStatus(status) {
    switch (status) {
      case "OFF":
        this.ledTop.color = red;
        this.ledCylider.color = red;
        this.ledCylider.backface = redLight;
        this.glow.visible = false;
        return this.show();
      case "ON":
        this.ledTop.color = redLight;
        this.ledCylider.color = redLight;
        this.ledCylider.backface = redLight2;
        this.glow.visible = true;
        return this.show();
      default:
        if (!(status in this.statuses))
          console.error(`Invalid status change for ${this.name}`);
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
