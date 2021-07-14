import { deviceNames } from "./helpers/deviceNames.js";
import Label from "./label.js";
import SpaceManager from "./spaceManager.js";

/** Device superclass that all device classes extend from. */
export default class Device {
  /**
   * Create an isntance of a device.
   *
   * @param {string} deviceTypeStr The string that uniquely identifies this
   * device type. Must match the property key in ./helpers/deviceNames.js for
   * corresponding device.
   * @param {SpaceManager} spaceMan The SpaceManager that manages this instance
   * of the device.
   * @param {boolean} isPreviewElem Sets whether the device illustration is
   * placed within the preview modal.
   */
  constructor(
    deviceTypeStr,
    spaceMan = window.spaceMan,
    isPreviewElem = false
  ) {
    if (!isPreviewElem) {
      this.deviceTypeStr = deviceTypeStr;

      // Find the number of devices of this type already existing in space.
      const numDevicesThisType = spaceMan.devices.reduce((acc, el) => {
        return acc + (el.deviceTypeStr == deviceTypeStr ? 1 : 0);
      }, 0);
      this.indexThisType = numDevicesThisType + 1;
      this.id = this.deviceTypeStr + this.indexThisType;
      this.name = deviceNames[this.deviceTypeStr] + " " + this.indexThisType;

      /**
       * The SpaceManager that manages this instance of device.
       * @type {SpaceManager}
       */
      this.spaceMan = spaceMan;

      /**
       * The position x & y ratios on the visualizer space. Intially placed at
       * random positions.
       * @type {{x: number, y: number}}
       * */
      this.position = {
        x: parseFloat((0.9 * Math.random()).toFixed(2)),
        y: parseFloat((0.9 * Math.random()).toFixed(2)),
      };

      this.element = this.createElem();
      this.canvElem = this.createCanvElem();
      this.deleteBtn = this.createDeleteBtn();
      this.element.appendChild(this.canvElem);
      this.element.appendChild(this.deleteBtn);
      this.illustration = {};

      this.statuses = ["OFF", "ON"];
      this.status = "OFF";

      // Properties to connect devices.
      // For non-RPi:
      this.isConnected = false;
      this.connectedTo = null;
      // For RPi:
      this.connectedDevices = null;

      this.label = new Label(this);
      this.label.hide();
      this.labelBtn = this.createLabelBtn();
      this.element.appendChild(this.labelBtn);
    }
  }

  // Creates the draggable outer-div for the device.
  createElem() {
    const elem = document.createElement("div");
    elem.classList.add("deviceContainer", "draggable");
    elem.title = this.name;

    elem.id = this.id;

    return elem;
  }

  // Creates the canvas element placed inside the draggable device div.
  createCanvElem() {
    const canvElem = document.createElement("canvas");
    canvElem.classList.add("deviceCanv");

    return canvElem;
  }

  // Creates a delete button for the device.
  createDeleteBtn() {
    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerText = "x";
    deleteBtn.title = "Delete this device";

    return deleteBtn;
  }

  /**
   * Creates a button to show/hide label
   * @returns {HTMLDivElement}
   * */
  createLabelBtn() {
    const btn = document.createElement("div");
    btn.classList.add("label-btn");
    btn.innerText = "i";
    btn.title = "Show/hide label";
    btn.onclick = () => this.label.toggleHidden();
    return btn;
  }

  // Sets the zoom level of the illustration.
  setZoom(zoomVal) {
    this.illustration.zdogillo.zoom = zoomVal;
    return this.show();
  }

  // Show/re-render the illustration.
  show() {
    this.illustration.zdogillo.updateRenderGraph();
    return this;
  }

  /**
   * Delete this device :
   * Removes any listeners, HTML elements, and any connections with other
   * devices.
   */
  delete() {
    // Remove interact listeners.
    // Note: I'm not sure if the object won't get garbage-collected if
    // I don't remove this. (This ".draggable" class is how interact-js
    // grabs elements for dragging)
    this.element.classList.remove("draggable");

    // Remove HTML element and children.
    while (this.element.firstChild)
      this.element.removeChild(this.element.firstChild);

    // Remove any connection this device has with some RPi.
    if (this.isConnected) {
      const RPiConnTo = this.spaceMan.devices.find(
        (dev) => dev.id === this.connectedTo
      );
      RPiConnTo.connectedDevices.splice(
        RPiConnTo.connectedDevices.findIndex((dev) => dev.deviceId === this.id),
        1
      );
    }
  }

  // Updates the Label object associated with this device.
  updateLabel(key, val) {
    this.label.setObjectVal(key, val);
  }
}
