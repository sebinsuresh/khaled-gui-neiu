/* 
  Space Manager class.
*/

import RPi from "./rpi.js";
import LEDBulb from "./led.js";
import TempSensor from "./tempSensor.js";
import Bulb from "./bulb.js";
import Lamp from "./lamp.js";
import Thermometer from "./thermo.js";

const deviceClasses = {
  RPI: RPi,
  LED: LEDBulb,
  TEMPSENSOR: TempSensor,
  BULB: Bulb,
  LAMP: Lamp,
  THERMOMETER: Thermometer,
};

export default class SpaceManager {
  constructor(selector) {
    /* 
    Select the visualizer area that you can add devices to, drag them 
    around in, etc.
    */
    this.vizSpaceElement = document.querySelector(selector);
    if (!this.vizSpaceElement.id) {
      console.error("The visualizer region element needs to have a unique id");
    }

    /* 
    Array that contains instances of classes representing each device
    placed on screen. Each element is an instance of some class that
    extends the 'Device' class. 
    */
    this.devices = [];

    this.makeDraggables();

    // TODO: Other event listeners
  }

  // Make .draggable class elements draggable using interact.js
  makeDraggables() {
    interact(`#${this.vizSpaceElement.id} .draggable`).draggable({
      autoscroll: false,
      ignoreFrom: `#${this.vizSpaceElement.id} .draggable :not(canvas)`,
      inertia: false,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: false,
        }),
      ],
      listeners: {
        move: this.dragMoveListener,
        end: (ev) => {
          // The dragEndListener method requires "this" context access -
          // So that it can access this.devices[].
          // To pass the context when the event calls the function, use .apply()
          // like this, instead of simply saying "end: this.dragEndListener"
          //
          // Read more about .apply():
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
          this.dragEndListener.apply(this, [ev]);
        },
      },
    });
  }

  // Add a device to the smart devices space, and returns the
  // device object, if it is valid.
  addDevice(deviceType) {
    if (deviceType in deviceClasses) {
      const newDeviceObj = new deviceClasses[deviceType](this, false);
      this.devices.push(newDeviceObj);
      this.vizSpaceElement.appendChild(newDeviceObj.element);
      newDeviceObj.createIllustration(false);

      return newDeviceObj;
    } else {
      console.error("Invalid device type!");
      return null;
    }
  }

  // Delete a device from the devices space, given its id string.
  // TODO
  deleteDevice(deviceId) {}

  // Change status of device specified by the given ID
  changeStatus(deviceId, status) {
    this.devices.find((dev) => dev.id == deviceId).changeStatus(status);
  }

  // Connnect an RPi-like device with the id fromId, to a device with the
  // id toId.
  // TODO
  connectDevices(fromId, toId) {
    const fromDev = this.devices.find((dev) => dev.id == fromId);
    const toDev = this.devices.find((dev) => dev.id == toId);

    // If either fromDev or toDev aren't valid, show error & return

    // If fromDev is not an RPI, show error & return

    // Handle the connection otherwise
  }

  // Disconnect an RPi-like device with the ID fromId and the device with the
  // id toId.
  // TODO
  disconnectDevices(fromId, toId) {}

  // Reload the illustrations on each device on screen.
  // This might be required after the window size gets changed.
  // TODO: Decide if line rendering & other stuff happens here.
  refreshIllustrations() {
    this.devices.forEach((devObj) => {
      devObj.show();
    });
  }

  // Listens to move events thrown by the interactable object
  dragMoveListener(event) {
    let target = event.target;
    let x = Math.round(
      (parseFloat(target.getAttribute("data-x")) || 0) + event.dx
    );
    let y = Math.round(
      (parseFloat(target.getAttribute("data-y")) || 0) + event.dy
    );

    target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);

    // TODO: Lines connecting devices?
    // redrawCanvas();
  }

  // Function that gets called when an object drag ends.
  // Sets the x & y positions in device objects using devX & devY from here.
  // The x & y values are values between 0 and 1, representing it's position
  // within the device space/dotted region - this might be useful for setting
  // the position of the html div, irrespective of resolution/window size.
  dragEndListener(event) {
    const deviceDiv = event.target;
    const deviceId = deviceDiv.id;

    // Find the object for this device from the devices array.
    const deviceObj = this.devices.find((dev) => dev.id == deviceId);

    let devX = Math.abs(
      (
        (parseFloat(deviceDiv.getAttribute("data-x")) || 0) /
        deviceDiv.parentElement.clientWidth
      ).toFixed(2)
    );
    let devY = Math.abs(
      (
        (parseFloat(deviceDiv.getAttribute("data-y")) || 0) /
        deviceDiv.parentElement.clientHeight
      ).toFixed(2)
    );

    // Update the object's x & y properties.
    deviceObj.x = devX;
    deviceObj.y = devY;

    // TODO: Lines connecting devices?
    // redrawCanvas();
  }
}
