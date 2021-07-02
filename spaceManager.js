/* 
  Space Manager class.
*/

import RPi from "./device-implementations/rpi.js";
import LEDBulb from "./device-implementations/led.js";
import TempSensor from "./device-implementations/tempSensor.js";
import Bulb from "./device-implementations/bulb.js";
import Lamp from "./device-implementations/lamp.js";
import Thermometer from "./device-implementations/thermo.js";
import Device from "./device.js";

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
    /**
     * Visualizer area that you can add devices to, drag them around in, etc.
     *
     * @type HTMLDivElement
     */
    this.vizSpaceElement = document.querySelector(selector);
    if (!this.vizSpaceElement.id) {
      console.error("The visualizer region element needs to have a unique id");
    }

    /**
     * Array that contains instances of classes representing each device
     * placed on screen. Each element is an instance of some class that
     * extends the 'Device' class.
     * @type Device[]
     */
    this.devices = [];

    this.makeDraggables();

    // Create <canvas> to draw lines connecting devices on.
    this.lineCanvElem = this.createLineCanv();
    this.vizSpaceElement.appendChild(this.lineCanvElem);

    // Get the "context" of the canvas, so the program can draw in the canvas.
    this.lineCanvCtx = this.lineCanvElem.getContext("2d");

    // Timeout object for using with window resize event.
    this.windowResizer = null;
    window.addEventListener("resize", (ev) => {
      this.windowResizeListener.apply(this, [ev]);
    });

    // TODO: Other event listeners
  }

  // When the window is resized, the illustrations have to re-render.
  // However, the "resize" event fires every frame of the browser UI,
  // so we add a timeout - The event is placed on a 50ms delay.
  // 'windowResizer' is a variable for this timeout functionality.
  // Code from: https://stackoverflow.com/a/60204716
  windowResizeListener(ev) {
    // Clear any existing timeout.
    clearTimeout(this.windowResizer);

    // Create a new timeout on a 200ms delay.
    this.windowResizer = setTimeout(() => {
      // Execute these functions on a timeout.

      this.resizeLineDrawingCanvas();
      this.drawLines();
      this.refreshIllustrations();
    }, 50);
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
        // The drag-listener methods requires "this" context access -
        // So that it can access this.devices[]., for example.
        // To pass the context when the event calls the function, use .apply()
        // like below, instead of simply saying "end: this.dragEndListener".
        //
        // Read more about .apply():
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
        move: (ev) => this.dragMoveListener.apply(this, [ev]),
        end: (ev) => this.dragEndListener.apply(this, [ev]),
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

      this.placeDevices();

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

  /* 
  Connnect an RPi-like device with the id fromId, to a device with the id toId.
  The pin number is an optional third parameter. By default it will be set to 
  the next open pin number.
  Returns true if connected appropriately, false otherwise.
   */
  connectDevices(fromId, toId, pinNum = -1) {
    const proceed = this.areDevicesConnectable(fromId, toId);
    if (!proceed) {
      return false;
    }

    const fromDev = this.devices.find((dev) => dev.id == fromId);
    const toDev = this.devices.find((dev) => dev.id == toId);

    // Handle the connection if there are no errors:

    // Get the correct pin number
    if (pinNum === -1) {
      // ^ If pinNum was not specified in method call, find first open pinNum.
      // Pin numbers start at 1, not 0.
      pinNum = 1;
      while (fromDev.connectedDevices.find((dev) => dev.pinNumber == pinNum))
        pinNum++;
    }

    // Connect the devices.
    fromDev.connectedDevices.push({ pinNumber: pinNum, deviceId: toId });
    toDev.isConnected = true;
    toDev.connectedTo = fromId;

    // Draw lines connecting devices
    this.drawLines();

    return true;
  }

  // Logs errors and returns whether or not the two devices are connectable
  areDevicesConnectable(fromId, toId) {
    const fromDev = this.devices.find((dev) => dev.id == fromId);
    const toDev = this.devices.find((dev) => dev.id == toId);

    const errMsg =
      // If either fromDev or toDev aren't valid
      !fromDev || !toDev
        ? `fromId and toId must be valid IDs of devices on screen`
        : // If fromDev is not an RPI
        fromDev.deviceTypeStr !== "RPI"
        ? `fromId must belong to an RPi device. Given: ${fromDev.deviceTypeStr}`
        : // If the device is already connected
        toDev.isConnected
        ? `toId '${toId}' already connected to RPi '${toDev.connectedTo}'`
        : // If there is already a device at that pinNum
        pinNum !== -1 &&
          fromDev.connectedDevices.find((devObj) => devObj.pinNumber == pinNum)
        ? `Device ${foundDevAtPin.deviceId} connected to pin number already`
        : "";

    if (errMsg) {
      console.error(errMsg);
      return false;
    }

    return true;
  }

  // Disconnect an RPi-like device with the ID fromId and the device with the
  // id toId.
  disconnectDevices(fromId, toId, drawLines = true) {
    const proceed = this.areDevicesConnectable(fromId, toId);
    if (!proceed) {
      return false;
    }

    const fromDev = this.devices.find((dev) => dev.id == fromId);
    const toDev = this.devices.find((dev) => dev.id == toId);
    // TODO
  }

  // Place the devices on screen correctly, according to their JS object's
  // position.x & position.y values.
  placeDevices() {
    this.devices.forEach((dev) => {
      // Find the new x & y values using the JS object's position object.
      const newX = Math.round(
        dev.position.x * this.vizSpaceElement.clientWidth
      );
      const newY = Math.round(
        dev.position.y * this.vizSpaceElement.clientHeight
      );

      // Set the location on screen for the deviceContainer HTML element.
      dev.element.style.transform = `translate(${newX}px, ${newY}px)`;

      // Set the data attributes that interactjs use.
      dev.element.dataset.x = newX;
      dev.element.dataset.y = newY;
    });
  }

  // Draw the lines between connected devices on screen.
  drawLines() {
    const ctx = this.lineCanvCtx;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff40";

    ctx.clearRect(0, 0, this.lineCanvElem.width, this.lineCanvElem.height);

    /**
     * List of all RPi devices on screen.
     *
     * @type RPi[]
     */
    const rPiDevices = this.devices.filter(
      (dev) => dev.deviceTypeStr === "RPI"
    );

    rPiDevices.forEach((rPiObj) => {
      const rPiElem = rPiObj.element;

      // Coordinates to start the line from
      const startX = parseInt(rPiElem.dataset.x) + ~~(rPiElem.clientWidth / 2);
      const startY = parseInt(rPiElem.dataset.y) + ~~(rPiElem.clientHeight / 2);

      // Find and iterate over all connected devices
      rPiObj.connectedDevices.forEach((devPinId) => {
        // Get the device object for the connected device
        const connDevice = this.devices.find(
          (dev) => dev.id === devPinId.deviceId
        );

        // Coordinates to end the line on.
        const endX =
          parseInt(connDevice.element.dataset.x) +
          ~~connDevice.element.clientWidth / 2;
        const endY =
          parseInt(connDevice.element.dataset.y) +
          ~~connDevice.element.clientHeight / 2;

        // Draw the line between the RPi and this connected device.
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, endY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Clear the rectangle behind each device so the line
        // doesn't appear there.
        [rPiElem, connDevice.element].forEach((elem) => {
          ctx.clearRect(
            parseInt(elem.dataset.x),
            parseInt(elem.dataset.y),
            elem.clientWidth,
            elem.clientHeight
          );
        });
      });
    });
  }

  // Reload the illustrations on each device on screen.
  // This might be required after the window size gets changed.
  // TODO: Decide if line rendering & other stuff happens here.
  refreshIllustrations() {
    this.devices.forEach((devObj) => {
      devObj.show();
    });
  }

  // Resizes the elements on the line-drawing canvas size to match
  // the parent elements (visualizer space/dotted region) size.
  resizeLineDrawingCanvas() {
    if (this.lineCanvElem) {
      this.lineCanvElem.width = this.vizSpaceElement.clientWidth;
      this.lineCanvElem.height = this.vizSpaceElement.clientHeight;
    }
  }

  // Function to create the canvas element that draws lines between devices.
  createLineCanv() {
    const canvElem = document.createElement("canvas");

    canvElem.class = "visualizer-canvas";
    canvElem.width = this.vizSpaceElement.clientWidth;
    canvElem.height = this.vizSpaceElement.clientHeight;

    return canvElem;
  }

  // Listens to move events thrown by the interactable object
  dragMoveListener(event) {
    let target = event.target;
    let x = Math.round((parseFloat(target.dataset.x) || 0) + event.dx);
    let y = Math.round((parseFloat(target.dataset.y) || 0) + event.dy);

    target.style.transform = `translate(${x}px, ${y}px)`;

    target.dataset.x = x;
    target.dataset.y = y;

    // Draw lines connecting devices.
    this.drawLines();
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
        (parseFloat(deviceDiv.dataset.x) || 0) /
        deviceDiv.parentElement.clientWidth
      ).toFixed(2)
    );
    let devY = Math.abs(
      (
        (parseFloat(deviceDiv.dataset.y) || 0) /
        deviceDiv.parentElement.clientHeight
      ).toFixed(2)
    );

    // Update the object's x & y properties.
    deviceObj.position.x = devX;
    deviceObj.position.y = devY;

    // Draw lines connecting devices.
    this.drawLines();
  }
}
