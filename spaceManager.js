/* 
  Space Manager class.
*/
export default class SpaceManager {
  constructor(selector) {
    // Select the visualizer area that you can add devices to,
    // drag them around in, etc.
    const vizSpaceElement = document.querySelector(selector);

    // Array that contains instances of classes representing each
    // device placed on screen.
    // Each element is an instance of some class that extends the
    // 'Device' class.
    this.devicesOnSpace = [];
  }

  // Add a device to the smart devices space
  addDevice(deviceType) {}

  // Delete a device from the devices space, given its id string.
  deleteDevice(deviceId) {}

  // Connnect an RPi-like device with the id fromId, to a device with the
  // id toId.
  connectDevices(fromId, toId) {}

  // Disconnect an RPi-like device with the ID fromId and the device with the
  // id toId.
  disconnectDevices(fromId, toId) {}

  // Reload the illustrations on each device on screen.
  // This might be required after the window size gets changed.
  refreshIllustrations() {}
}
