/* 
  Space Manager class.
*/

import RPi from "./rpi.js";
// import LEDBulb from "./led.js";
// import TempSensor from "./tempSensor.js";
// import Bulb from "./bulb.js";
// import Lamp from "./lamp.js";
// import Thermometer from "./thermo.js";

const classNames = {
  RPI: RPi,
  // LED: LEDBulb,
  // TEMPSENSOR: TempSensor,
  // BULB: Bulb,
  // LAMP: Lamp,
  // THERMOMETER: Thermometer,
};

export default class SpaceManager {
  constructor(selector) {
    /* 
    Select the visualizer area that you can add devices to, drag them 
    around in, etc.
    */
    this.vizSpaceElement = document.querySelector(selector);

    /* 
    Array that contains instances of classes representing each device
    placed on screen. Each element is an instance of some class that
    extends the 'Device' class. 
    */
    this.devices = [];
  }

  // Add a device to the smart devices space
  // TODO
  addDevice(deviceType) {}

  // Delete a device from the devices space, given its id string.
  // TODO
  deleteDevice(deviceId) {}

  // Connnect an RPi-like device with the id fromId, to a device with the
  // id toId.
  // TODO
  connectDevices(fromId, toId) {}

  // Disconnect an RPi-like device with the ID fromId and the device with the
  // id toId.
  // TODO
  disconnectDevices(fromId, toId) {}

  // Reload the illustrations on each device on screen.
  // This might be required after the window size gets changed.
  // TODO
  refreshIllustrations() {}
}
