/*
 *  Zdog Temperature Sensor Illustration code
 */

class TempSensor {
  constructor(canvElement, isPreviewElem = false, createIllo = true) {
    this.name = "Temp Sensor";
    this.rotate = { x: 0.9, y: 0, z: -0.5 };
    this.illo = null;
    this.statuses = ["OFF", "ON"];

    if (createIllo) this.createIllo(canvElement, isPreviewElem);
  }

  createIllo(canvElement, isPreviewElem) {
    // The main illustration
    this.illo = new Zdog.Illustration({
      element: canvElement,
      resize: true,
      zoom: isPreviewElem ? 6 : 4,
      rotate: this.rotate,
      translate: { x: 5, y: -2 },
    });

    // The chip
    this.mainChip = new Zdog.Box({
      addTo: this.illo,
      color: dark,
      width: 10,
      height: 10,
      depth: 5,
      stroke: 2,
      frontFace: dark2,
    });

    this.pins = new Zdog.Group({
      addTo: this.illo,
    });

    this.pin1 = new Zdog.Shape({
      addTo: this.pins,
      color: yellow,
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
      color: dark,
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

  setZoom(zoom) {
    this.illo.zoom = zoom;
    return this.show();
  }

  changeStatus(status) {
    switch (status) {
      case "OFF":
        this.tempText.value = "--";
        this.tempText.color = dark;
        return this.show();
      case "ON":
        this.tempText.value = "72°";
        this.tempText.color = gray;
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
