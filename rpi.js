/* 
  Raspberry Pi Device.

  This device can connect other devices to it.
*/
import Device from "./device.js";
import { colors, TAU } from "./helpers.js";

export default class RPi extends Device {
  constructor(spaceMan, isPreviewElem = false) {
    super(
      "RPI",
      spaceMan.devices.reduce((acc, el) => {
        return acc + (el.deviceTypeStr == "RPI" ? 1 : 0);
      }, 0),
      isPreviewElem
    );

    this.statuses = ["ON"];
    this.status = "ON";

    // Array of { pinNumber, deviceId } for other devices connected to this RPi.
    this.connectedDevices = [];
  }

  // OVERRIDE for RPi (To make the width 200px):
  // Creates the canvas element placed inside the draggable device div
  createCanvElem() {
    const canvElem = document.createElement("canvas");
    canvElem.classList.add("deviceCanv");
    canvElem.style.width = "200px";

    return canvElem;
  }

  // Creates and return illustration for the Raspberry Pi device.
  // This must be called after placing the device container on screen already.
  // Otherwise, the width and height of the canvas would not be set properly
  // by Zdog, and the illustration won't be rendered correctly.
  createIllustration(isPreviewElem) {
    // The main illustration
    this.illo = new Zdog.Illustration({
      element: this.canvElem,
      resize: true,
      zoom: isPreviewElem ? 3 : 2.75,
      translate: isPreviewElem ? {} : { y: 2.5 },
      rotate: { x: 0.9, y: 0, z: -0.5 },
    });

    // The Group of elements that make up the PCB:
    // The PCB itself and a counter balance point to prevent z-fighting.
    this.pcbGroup = new Zdog.Group({
      addTo: this.illo,
      updateSort: true,
    });

    // The PCB board (simpole green rectangle)
    this.pcb = new Zdog.Box({
      addTo: this.pcbGroup,
      width: 60,
      height: 30,
      depth: 2,
      fill: true,
      color: colors["green"],
      leftFace: colors["greenDark"],
      bottomFace: colors["greenDark"],
      translate: { z: -1 },
    });

    // The counter balance for the PCB to prevent z-fighting
    this.pcbBalance = new Zdog.Shape({
      addTo: this.pcbGroup,
      visible: false,
      translate: { z: -250 },
    });

    // The big silver ports - 2x USB, ethernet
    this.bigPorts = new Zdog.Group({
      addTo: this.illo,
      translate: { z: 3 },
    });

    // The first port among the three
    this.firstPort = new Zdog.Box({
      addTo: this.bigPorts,
      width: 7,
      height: 7,
      depth: 7,

      rearFace: colors["grayDark"],
      leftFace: colors["gray"],
      rightFace: false,
      topFace: false,
      bottomFace: colors["gray"],

      rotate: { x: TAU / 4 },
      translate: { x: 26, y: -11 },
    });

    // second port - moved down
    this.secondPort = this.firstPort.copy({
      translate: { x: 26, y: -1 },
    });

    // third port - moved further down
    this.thirdPort = this.firstPort.copy({
      translate: { x: 26, y: 9 },
    });

    // A "shadow" added to the bottom of the three ports
    this.portsBottom = new Zdog.Rect({
      addTo: this.illo,
      width: 10,
      height: 31,
      depth: 1,
      stroke: 0,
      color: colors["greenDark"],
      fill: true,
      translate: {
        x: 25,
        y: 0,
        z: 0.5,
      },
    });

    // The 40 pins on the board.
    // This Group will contain all of them.
    this.ioPorts = new Zdog.Group({
      addTo: this.illo,
      translate: {
        y: -12,
        z: 3,
      },
      updateSort: true,
    });

    // The first pin base is created manually.
    this.firstPin = new Zdog.Box({
      addTo: this.ioPorts,
      width: 1,
      height: 5,
      depth: 4,
      color: colors["dark"],
      translate: {
        x: -28,
      },
      frontFace: colors["dark2"],
    });

    // The first pin for the first two io pins is added.
    this.firstPinsPin = new Zdog.Cylinder({
      addTo: this.firstPin,
      diameter: 0.75,
      stroke: 0,
      length: 3,
      color: colors["yellowPi"],
      translate: {
        y: -1.5,
        z: 4.25,
      },
    });

    // The first pin is cloned and moved down for the second pin.
    this.firstPinsPin2 = this.firstPinsPin.copy({
      translate: {
        y: 1.5,
        z: 4.25,
      },
    });

    // An array that contains all the pins.
    // The first two pins & their base are added manually to the array.
    this.allPins = [this.firstPin];

    // The remaining 38 pins are added using a loop, by cloning the
    // previous elements.
    for (let i = 1; i < 20; i++) {
      this.allPins[i] = this.allPins[i - 1].copyGraph({
        translate: {
          x: this.allPins[i - 1].translate.x + 2.5,
        },
      });
    }

    // A "shadow" for the io pins region.
    this.pinsBottom = new Zdog.Rect({
      addTo: this.illo,
      width: 50.5,
      height: 7,
      depth: 1,
      stroke: 0,
      color: colors["greenDark"],
      fill: true,
      translate: {
        x: -4.25,
        y: -11.75,
        z: 0.5,
      },
    });

    // The dark base for the CPU chip
    this.cpuBase = new Zdog.Rect({
      addTo: this.illo,
      width: 12,
      height: 12,
      stroke: 0,
      color: colors["dark"],
      fill: true,
      translate: {
        x: -7,
      },
    });

    // The CPU chip itself
    this.cpuChip = new Zdog.Box({
      addTo: this.illo,
      width: 10,
      height: 10,
      depth: 0.25,
      stroke: 0.75,
      color: colors["grayDark"],
      frontFace: colors["gray"],
      translate: {
        x: -7,
        z: 0.5,
      },
    });

    // The other chip next to CPU.
    this.chip2 = new Zdog.Box({
      addTo: this.illo,
      width: 10,
      height: 8,
      depth: 0.25,
      stroke: 0.75,
      color: colors["dark2"],
      frontFace: colors["dark"],
      translate: {
        x: 10,
        z: 0.5,
      },
    });

    // The pins on left side of chip 2 are put in a group.
    // Later, this group is duplicated & flipped to the other
    // side.
    this.chip2PinsGroup = new Zdog.Group({
      addTo: this.chip2,
    });

    // The first pin among the left side pins of chip 2.
    this.chip2Pin1 = new Zdog.Ellipse({
      addTo: this.chip2PinsGroup,
      width: 2,
      height: 0.5,
      stroke: 1,
      quarters: 1,
      color: colors["grayDark"],
      translate: {
        x: -5.5,
        y: -3,
        z: 0,
      },
      rotate: {
        x: -TAU / 4,
        y: -TAU / 2,
      },
    });

    // second pin
    this.chip2Pin2 = this.chip2Pin1.copy({
      translate: {
        x: -5.5,
        y: 0,
        z: 0,
      },
    });

    // third pin
    this.chip2Pin3 = this.chip2Pin1.copy({
      translate: {
        x: -5.5,
        y: 3,
        z: 0,
      },
    });

    // Duplicate the pins for chip2 on left side to the right side,
    // and flip it to the other side.
    this.chip2PinsGroup2 = this.chip2PinsGroup.copyGraph({
      rotate: {
        z: TAU / 2,
      },
    });

    // Group to contain the shadow for chip 2
    this.chip2ShadowGroup = new Zdog.Group({
      addTo: this.illo,
    });

    // The shadow for chip2
    this.chip2Shadow = new Zdog.Rect({
      addTo: this.chip2ShadowGroup,
      width: 13.5,
      height: 8,
      stroke: 1,
      color: colors["greenDark"],
      fill: true,
      translate: {
        x: 10,
        z: -0.5,
      },
    });

    // hidden element to counter z-fighting for chip2's base shadow.
    this.chip2Base_balance = new Zdog.Shape({
      addTo: this.chip2ShadowGroup,
      visible: false,
      translate: {
        x: 10,
        z: -10,
      },
    });

    // Micro USB port in the front-left of the device.
    this.microUsb = new Zdog.Box({
      addTo: this.illo,
      width: 5,
      height: 5,
      depth: 2,
      stroke: 0.1,
      color: colors["grayDark"],
      frontFace: colors["gray"],
      translate: {
        x: -20,
        y: 12,
        z: 1,
      },
    });

    // The hole for the micro USB port.
    this.microUsbHole = new Zdog.Rect({
      addTo: this.microUsb,
      color: colors["dark"],
      width: 4,
      stroke: 0,
      fill: true,
      height: 1.5,
      translate: {
        y: 2.6,
        z: 0,
      },
      rotate: {
        x: TAU / 4,
      },
    });

    // Shadow for the micro USB port.
    this.microUsbShadow = new Zdog.Rect({
      addTo: this.microUsb,
      width: 6,
      height: 6,
      stroke: 1,
      color: colors["greenDark"],
      fill: true,
      translate: {
        x: 0,
        z: -0.5,
      },
    });

    // HDMI port on the device.
    this.hdmi = new Zdog.Box({
      addTo: this.illo,
      width: 7,
      height: 5,
      depth: 2,
      stroke: 0.1,
      color: colors["grayDark"],
      frontFace: colors["gray"],
      translate: {
        x: -5,
        y: 12,
        z: 1,
      },
    });

    // Shadow for the HDMI port.
    this.hdmibHole = new Zdog.Rect({
      addTo: this.hdmi,
      color: colors["dark"],
      width: 6.5,
      stroke: 0,
      height: 1.5,
      fill: true,
      translate: {
        y: 2.6,
        z: 0,
      },
      rotate: {
        x: TAU / 4,
      },
    });

    // Shadow for the HDMI port.
    this.hdmiShadow = new Zdog.Rect({
      addTo: this.hdmi,
      width: 8,
      height: 6,
      stroke: 1,
      color: colors["greenDark"],
      fill: true,
      translate: {
        x: 0,
        z: -0.5,
      },
    });

    // The Raspberry Pi Logo (not exact) is created using a bunch of ellipses
    // arranged within this group.
    this.rpiLogoGroup = new Zdog.Group({
      addTo: this.illo,
      translate: {
        x: -20,
        y: -2,
        z: 0,
      },
    });

    this.circle1 = new Zdog.Ellipse({
      addTo: this.rpiLogoGroup,
      width: 2,
      height: 3,
      stroke: 0.5,
      color: colors["yellowPi"],
      rotate: {
        z: -TAU / 8,
      },
    });

    this.circle2 = this.circle1.copy({
      width: 2,
      translate: {
        x: -2.5,
      },
      rotate: {
        z: TAU / 8,
      },
    });

    this.circle3 = new Zdog.Ellipse({
      addTo: this.rpiLogoGroup,
      width: 2.5,
      height: 3,
      stroke: 0.5,
      color: colors["yellowPi"],
      translate: {
        x: -1.25,
        y: 2,
      },
    });

    this.circle4 = this.circle3.copy({
      width: 2,
      translate: {
        x: -3.5,
        y: 2.75,
      },
    });

    this.circle5 = this.circle4.copy({
      translate: {
        x: 1,
        y: 2.75,
      },
    });

    this.circle6 = this.circle3.copy({
      height: 2.5,
      width: 3,
      translate: {
        x: -1.25,
        y: 4.6,
      },
    });

    this.leaf1 = new Zdog.Ellipse({
      addTo: this.rpiLogoGroup,
      width: 1.5,
      height: 3,
      stroke: 0.5,
      color: colors["yellowPi"],
      translate: {
        x: -2.5,
        y: -2.25,
      },
      rotate: {
        z: -TAU / 6,
      },
    });

    this.life2 = this.leaf1.copy({
      translate: {
        x: 0,
        y: -2.25,
      },
      rotate: {
        z: TAU / 6,
      },
    });

    return this.show();
  }

  // Change the status of the RPi.
  changeStatus(newStatus) {
    if (this.statuses.includes(newStatus)) {
      this.status = newStatus;
    }
    switch (newStatus) {
      case "ON":
        return this.show();
      default:
        if (!this.statuses.includes(newStatus))
          console.error(`Invalid status change for ${this.name}`);
        return this.show();
    }
  }

  // Remove the connected device from this RPi.
  // TODO: implement the method, and add comment on what it does.
  removeConnectedDevice(idToRemove) {}
}
