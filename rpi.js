/* 
  Raspberry Pi Device.

  This device can connect other devices to it.
*/
import Device from "./device.js";

export default class RPi extends Device {
  constructor(spaceMan, isPreviewElem = false) {
    super(
      "RPI",
      spaceMan.devices.reduce(
        (acc, el) => {
          return acc + (el.deviceType == RPi ? 1 : 0);
        },
        0,
        isPreviewElem
      )
    );

    this.illo = this.createIllustration(isPreviewElem);

    this.statuses = ["ON"];
    this.status = "ON";

    this.connectedDevices = [];
  }

  // Creates and return illustration for the Raspberry Pi device.
  createIllustration(isPreviewElem) {
    return null;
  }

  // Change the status of the RPi.
  changeStatus(newStatus) {
    this.status = newStatus;
    // TODO: Code for updating the illustration
    return this.illo;
  }

  // Remove the connected device from this RPi.
  // TODO: implement the method, and add comment on what it does.
  removeConnectedDevice(idToRemove) {}
}
