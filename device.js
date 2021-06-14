import deviceTypes from "./deviceTypes.js";
import Label from "./label.js";

export default class Device {
  constructor(deviceType, numDevicesThisType = 0) {
    this.indexThisType = numDevicesThisType + 1;
    this.id = deviceType + this.indexThisType;
    this.name = deviceTypes[deviceType].name;

    this.element = createElem();
    this.canvElem = createCanvElem();
    this.element.appendChild(this.canvElem);

    this.statuses = ["OFF", "ON"];
    this.status = "OFF";

    this.position = {
      x: 0.1,
      y: 0.1,
    };

    this.isConnected = false;
    this.connectedTo = null;
    this.connectedDevices = null;

    this.label = new Label(this);
  }

  createElem() {
    const elem = document.createElement("div");
    elem.classList.add("devicePreview");

    elem.id = this.id;

    return elem;
  }

  createCanvElem() {
    const canvElem = document.createElement("canvas");
    canvElem.classList.add("previewCanvas");

    return canvElem;
  }

  setZoom(zoomVal) {
    this.illo.zoom = zoomVal;
  }

  show() {
    this.illo.updateRenderGraph();
  }

  // TODO
  delete() {}

  updateLabel(key, val) {
    this.label.setObjectVal(key, val);
  }
}
