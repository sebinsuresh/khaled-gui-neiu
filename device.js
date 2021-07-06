/* 
  Device superclass that all device classes extend from.

  The constructor requires passing the 'device type' string (must match the 
  property key in deviceNames.js for corresponding device), and the number
  of devices of this type that exist in the space already.
*/
import { deviceNames } from "./helpers/deviceNames.js";
import Label from "./label.js";
import SpaceManager from "./spaceManager.js";

export default class Device {
  constructor(deviceTypeStr, numDevicesThisType = 0, isPreviewElem = false) {
    if (!isPreviewElem) {
      this.indexThisType = numDevicesThisType + 1;
      this.deviceTypeStr = deviceTypeStr;
      this.id = this.deviceTypeStr + this.indexThisType;
      this.name = deviceNames[this.deviceTypeStr] + " " + this.indexThisType;

      // Place the device on random location on screen initially.
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

  // Sets the zoom level of the illustration.
  setZoom(zoomVal) {
    this.illo.zoom = zoomVal;
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
   *
   * @param {SpaceManager} spaceMan The SpaceManager that manages this device
   */
  delete(spaceMan) {
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
      const RPiConnTo = spaceMan.devices.find(
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
