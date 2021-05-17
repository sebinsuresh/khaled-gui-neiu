// Device types, their string names, and the create
// functions for them.
// To add more devices: 
// 1. Create another js file for the device
//    a. Make sure the js file has the same const devicename()
//    and the methods within such as create(), turnOn(), 
//    turnOff(), etc.
//    b. Follow the same structure in this file:
//    DEVICENAME: {
//      name: "Name of device as it appears on screen",
//      create: <create function of this device>
//    }
const deviceTypes = {
  BULB: {
    name: "Light Bulb",
    create: createBulb
  },
  LAMP: { 
    name: "Table Lamp",
    create: createLamp
  },
  THERMOMETER: {
    name: "Thermometer",
    create: createThermo
  }
};

let devicePreviewObjects = [];
let addDevicesRegion = document.querySelector(".modalDevices");
initializeAddDevicesRegion();

// Function that adds preview elements to the add devices modal.
// Each preview element is a div with the class "devicePreview",
// has a <canvas> that shows an illustrtation of the device, 
// <span> with title of the device, and a button to add it to 
// the space.
function initializeAddDevicesRegion() {
  
  devicePreviewObjects = [];
  for (let deviceType in deviceTypes) {
    // Create new div within the region
    let previewElem = document.createElement("div");
    previewElem.classList.add("devicePreview");

    // Add the preview containing div to the region
    addDevicesRegion.appendChild(previewElem);

    let previewCanvas = document.createElement("canvas");
    previewCanvas.classList.add("previewCanvas");
    previewElem.appendChild(previewCanvas);
    let prevIllo; // Illustration element for each device type

    switch (deviceTypes[deviceType]) {
      case deviceTypes.BULB:
        // prevIllo = createBulb().create(previewCanvas, true);
        prevIllo = deviceTypes[deviceType].create().create(previewCanvas, true);
        break;
      case deviceTypes.LAMP:
        // prevIllo = createLamp().create(previewCanvas, true);
        prevIllo = deviceTypes[deviceType].create().create(previewCanvas, true);
        break;
      case deviceTypes.THERMOMETER:
        // prevIllo = createThermo().create(previewCanvas, true);
        prevIllo = deviceTypes[deviceType].create().create(previewCanvas, true);
        break;
      default:
        break;
    }

    if (prevIllo) {
      // Show illustration
      prevIllo = prevIllo.show();
      // Add the preview illustation to the array
      devicePreviewObjects.push(prevIllo);

      // Hovering over the preview element div will do something
      // with the illustration (whatever is implemented by hoverEnter)
      if (prevIllo.hoverEnter) {
        previewElem.onmouseover = () => {
          prevIllo = prevIllo.hoverEnter();
          prevIllo = prevIllo.show();
        };
        previewElem.onmouseout = () => {
          prevIllo = prevIllo.hoverLeave();
          prevIllo = prevIllo.show();
        };
      }
    }

    let titleElem = document.createElement("span");
    titleElem.innerText = deviceTypes[deviceType];
    previewElem.appendChild(titleElem);

    let addBtn = document.createElement("div");
    addBtn.classList.add("deviceAddBtn");
    addBtn.innerText = "Add";
    addBtn.onclick = function () {
      addDeviceToSpace(deviceType);
      hideAddModal();
    };
    previewElem.appendChild(addBtn);
  }
}

// Array containing the deviceObject objects
let devicesOnSpace = [];
// Array containing the illustration
// objects obtained using the create() methods
let deviceIllosOnSpace = [];

// Function to add Devices to the Device space visualizer
function addDeviceToSpace(deviceType) {
  let deviceObject = {
    deviceType,
    x: 0.1,
    y: 0.1,
    status: "OFF",
    name: deviceTypes[deviceType],
  };
  devicesOnSpace.push(deviceObject);

  // Count the number of devices in the space already
  // with the same type.
  let sameTypeCount = 0;
  devicesOnSpace.forEach((el) => {
    if (el.deviceType === deviceType) sameTypeCount++;
  });
  deviceObject.name += " " + sameTypeCount;

  // Create HTML elements and append them into the visualizer area
  let deviceElem = document.createElement("div");
  deviceElem.classList.add("draggable", "deviceContainer");
  let deviceCanvElem = document.createElement("canvas");
  deviceCanvElem.classList.add("deviceCanv");
  let deviceNameP = document.createElement("p");
  deviceNameP.innerText = deviceObject.name;
  deviceNameP.classList.add("deviceNameP");
  let deviceStatusP = document.createElement("p");
  deviceStatusP.innerText = "OFF";
  deviceStatusP.classList.add("deviceStatusP");
  deviceElem.appendChild(deviceCanvElem);
  deviceElem.appendChild(deviceNameP);
  deviceElem.appendChild(deviceStatusP);
  document.querySelector("#visualizer").appendChild(deviceElem);

  let deviceIllo;
  switch (deviceTypes[deviceType]) {
    case deviceTypes.BULB:
      deviceIllo = createBulb().create(deviceCanvElem);
      break;
    case deviceTypes.LAMP:
      deviceIllo = createLamp().create(deviceCanvElem);
      break;
    case deviceTypes.THERMOMETER:
      deviceIllo = createThermo().create(deviceCanvElem);
      break;
    default:
      break;
  }
  deviceIllo.show();
  deviceIllosOnSpace.push(deviceIllo);
}

// Set the .draggable objects to have draggable properties
interact(".draggable").draggable({
  autoScroll: false,
  inertia: false,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: false,
    }),
  ],
  listeners: {
    move: dragMoveListener,
    end: dragEndListener,
  },
});

// Listens to move events thrown by the interactable object
function dragMoveListener(event) {
  let target = event.target;
  let x = Math.round((parseFloat(target.getAttribute("data-x")) || 0) + event.dx);
  let y = Math.round((parseFloat(target.getAttribute("data-y")) || 0) + event.dy);

  target.style.transform = `translate(${x}px, ${y}px)`;

  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// Function that gets called when an object drag ends
// TODO: Set the x & y positions in device objects using
// devX & devY from here
function dragEndListener(event) {
  let devX = Math.abs(
    (
      (parseFloat(event.target.getAttribute("data-x")) || 0) /
      event.target.parentElement.clientWidth
    ).toFixed(2)
  );
  let devY = Math.abs(
    (
      (parseFloat(event.target.getAttribute("data-y")) || 0) /
      event.target.parentElement.clientHeight
    ).toFixed(2)
  );
  console.log(devX, devY);
}

// When the window is resized, the illustrations
// have to re-rendered.
window.addEventListener("resize", () => {
  renderDevicePreviews();
  renderDeviceSpaceDevices();
});

// Function to re-render the device illustrations in the
// add device popup/modal
function renderDevicePreviews() {
  devicePreviewObjects.forEach((el) => {
    if (el.show) {
      let _ = el.show();
    }
  });
}

// Function to re-render the device illustrations in the
// visualization region.
// NOTE: The setTimeOut() is needed, otherwise the
//       illustration disappears on window resize.
//       No idea why. It works in the above method 🤷🏽‍♂️
function renderDeviceSpaceDevices() {
  deviceIllosOnSpace.forEach((el) => {
    if (el.show) {
      setTimeout(() => {
        el.show();
      }, 1);
    }
  });
}
