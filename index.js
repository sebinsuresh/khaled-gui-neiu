// NOTE: The term "illo" is used as short for "illustration".

/* 
To add more devices:
1. Create another js file for the device
   a. Make sure the js file has the same const devicename()
   and the methods within such as create(), turnOn(),
   turnOff(), etc.
2. Add the script before index.js in the HTML file
3. Follow the same structure in this file:
   DEVICENAME: {
     name: "Name of device as it appears on screen",
     create: <create function of this device>
   }
*/

/* 
Device types and their Classes.

To create a device of a particular type, call:
new <deviceTypes[type - eg: BULB]>(
  <canvas Element>,
  <boolean representing whether this is a preview element or not>,
  <boolean representing whether you want to create an illustration or not>
  );

- The first parameter needs to be a <canvas> element already created.
- The second parameter is false by default.
- The third parameter is true by default. Set it to false to use the properties
  of devices (default name, statuses, etc) without creating an illustration 
  object for it.

To get the properties such as the list of statuses available for each device,
create a class instance with "null" for canvas, any value for the second 
parameter,and false for the third parameter (important). This will initialize an
object of the class, without creating a canvas illustration for it.

E.g: To get the statuses available to the Bulb object:
const bulbStatuses = new deviceTypes["BULB"](null, false, false).statuses;
*/
const deviceTypes = {
  RPI: RPi,
  LED: LEDBulb,
  TEMPSENSOR: TempSensor,
  BULB: Bulb,
  LAMP: Lamp,
  THERMOMETER: Thermometer,
};

// This array will contain the objects in the "add devices" modal
// that preview the devices.
let devicePreviewObjects = [];

const addDevicesRegion = document.querySelector(".modalDevices");
const linesCanv = document.getElementById("visualizer-canvas");
const ctx = linesCanv.getContext("2d");

/*
Array containing the deviceObject objects.

These objects will keep track of the type of device, x and y positions as ratios
on screen, status of the device, name of it, and the id for the device.
*/
let devicesOnSpace = [];

/* 
Array containing the illustration objects obtained using the create() methods.

These objects have the methods like show(), setZoom(), changeStatus(), etc. that
are defined in their respective classes. To update the illustration to reflect
changes like that, you need to keep track of those objects & thus this array is
necessary.
 */
let deviceIllosOnSpace = [];

// Boolean to indicate whether an RPi is waiting for the user to click
// on a device to connect it to the RPi.
let rPiWaitingClick = false;

// JS object of the RPi device that is waiting for the user to click
let rPiObjectWaiting = null;

// List of classes that should be ignored for dragging and tapping.
// This is needed because otherwise interact.js would drag them
// instead of treating them as a single tap.
// It's also used to prevent them from being tapped while the
// RPi is waiting for the user to click another device.
const dontDragTapClasses = [
  "deviceNameInput",
  "delete-btn",
  "deviceStatusMenu",
  "connectDevBtn",
];

initializeAddDevicesModal();

// Function that adds preview elements to the "add devices" modal.
// Each preview element is a div with the class "devicePreview",
// has a <canvas> that shows an illustrtation of the device,
// <span> with title of the device, and a button to add it to
// the space.
function initializeAddDevicesModal() {
  devicePreviewObjects = [];

  // Resize the transparent canvas to fit the container width
  linesCanv.width = linesCanv.parentElement.clientWidth;
  linesCanv.height = linesCanv.parentElement.clientHeight;

  for (let deviceType in deviceTypes) {
    // Create new div within the region
    let previewElem = document.createElement("div");
    previewElem.classList.add("devicePreview");

    // Add the preview containing div to the region
    addDevicesRegion.appendChild(previewElem);

    let previewCanvas = document.createElement("canvas");
    previewCanvas.classList.add("previewCanvas");
    previewElem.appendChild(previewCanvas);

    /* 
    Illustration element for each device type.
    Explanation: The (object representing) current device we are looking
    at, is selected from the object containing all the devices
    in the statement "deviceTypes[deviceType]". Each of these objects are
    classes, defined in the files such as bulb.js, thermo.js, etc.
    
    You use the 'new' keyword to create each such object, and pass in the canvas
    element (in which an illustration for the device will appear), and a boolean
    value which tells it that this is a preview element & not an element in the 
    device space (this affects only the zoom level for the moment). Since the 
    below code creates the devices for preview pane, this is set to true, and 
    the canvas gets an appropriate zoom level.
    Each of these classes create objects with some properties and functions, 
    such as rotate, illo, create(), turnOn(), etc.
    */
    let previewDeviceIllo = new deviceTypes[deviceType](previewCanvas, true);

    if (previewDeviceIllo) {
      // Show illustration
      previewDeviceIllo = previewDeviceIllo.show();
      // Add the preview illustation to the array
      devicePreviewObjects.push(previewDeviceIllo);

      // Hovering over the preview element div will do something
      // with the illustration (whatever is implemented by hoverEnter)
      if (previewDeviceIllo.hoverEnter) {
        previewElem.onmouseover = () => {
          previewDeviceIllo = previewDeviceIllo.hoverEnter();
          previewDeviceIllo = previewDeviceIllo.show();
        };
        previewElem.onmouseout = () => {
          previewDeviceIllo = previewDeviceIllo.hoverLeave();
          previewDeviceIllo = previewDeviceIllo.show();
        };
      }
    }

    let titleElem = document.createElement("span");
    titleElem.innerText = previewDeviceIllo.name;
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
  redrawCanvas();
}

// Function to add Devices to the Device space visualizer
function addDeviceToSpace(deviceType) {
  // Find all existing device objects of this type
  const devicesOfSameType = devicesOnSpace.filter(
    (dev) => dev.deviceType == deviceType
  );
  const numDevicesOfSameType = devicesOfSameType.length;

  // Find the index of the new device based on that
  const indexOfNewDevice =
    numDevicesOfSameType == 0
      ? 1
      : devicesOfSameType[numDevicesOfSameType - 1].indexThisType + 1;

  // Get all possible choices of statuses
  const statusChoices = new deviceTypes[deviceType](null, false, false)
    .statuses;

  // Create an object for the new device
  const deviceObject = {
    deviceType,
    x: 0.1,
    y: 0.1,
    status: statusChoices.includes("OFF") ? "OFF" : statusChoices[0],
    // Index of this device - based on number of devices of this type
    // Set the first device's index to 1, and the later devices to the value
    // of the last device + 1.
    indexThisType: indexOfNewDevice,
    name:
      new deviceTypes[deviceType](null, false, false).name +
      " " +
      indexOfNewDevice,
    id: deviceType + "" + indexOfNewDevice,
  };

  // Add the device's JS object to the array.
  devicesOnSpace.push(deviceObject);

  /* 
    Section below creates the HTML elements and append them into the dotted area
  */

  // Create the outer div that you add the canvas, input, text elements to.
  // This element is the "draggable" element that can move around.
  // (Draggability functionality is implemented using interact.js framework)
  const deviceElem = document.createElement("div");
  deviceElem.classList.add("draggable", "deviceContainer");
  deviceElem.id = deviceObject.id;

  // The canvas element that contians the illustration for each device.
  // This is later passed into the device class's constructors.
  const deviceCanvElem = document.createElement("canvas");
  deviceCanvElem.classList.add("deviceCanv");

  // The text input element containing the generated name of the device by default.
  const deviceNameTextInput = document.createElement("input");
  deviceNameTextInput.type = "text";
  deviceNameTextInput.value = deviceObject.name;
  deviceNameTextInput.classList.add("deviceNameInput");

  // If the device is a RPi, make a button to connect devices to it.
  if (deviceType == "RPI") {
    const connectDevicesBtn = document.createElement("div");
    connectDevicesBtn.classList.add("connectDevBtn");
    connectDevicesBtn.innerText = "+ Connect (0)";
    deviceCanvElem.style.width = "200px";

    deviceObject.connectedDeviceIds = [];

    // Listens for a click on the "Connect" button on the RPi device.
    connectDevicesBtn.addEventListener("click", (ev) => {
      // Changes the value of rPiWaitingClick, update the classes on
      // each device illustration (to add/remove dotted outlines),
      // and update the button text.
      // The .on("tap") event on draggable objects will handle adding
      // more devices by clicking them.
      if (rPiWaitingClick) {
        rPiWaitingClick = false;
        connectDevicesBtn.innerText =
          "+ Connect (" + rPiObjectWaiting.connectedDeviceIds.length + ")";

        devicesOnSpace.forEach((dev) => {
          const id = dev.id;
          document.getElementById(id).classList.remove("raspNotAdded");
          document.getElementById(id).classList.remove("raspAdded");
        });
      } else {
        rPiWaitingClick = true;
        rPiObjectWaiting = deviceObject;

        connectDevicesBtn.innerText = "✕ Cancel";

        devicesOnSpace.forEach((dev) => {
          const id = dev.id;
          if (id != deviceObject.id) {
            if (!deviceObject.connectedDeviceIds.includes(id)) {
              document.getElementById(id).classList.add("raspNotAdded");
            } else {
              document.getElementById(id).classList.add("raspAdded");
            }
          }
        });
      }
    });

    deviceElem.appendChild(connectDevicesBtn);
  }

  // The input status shown to the user - I am creating a <select> tag
  // and calling it a "menu".
  const deviceStatusMenu = document.createElement("select");

  // Create the statuses available to the device as options in the menu.
  for (let statusChoice of statusChoices) {
    const statusOption = document.createElement("option");
    statusOption.innerText = statusChoice;
    statusOption.value = statusChoice;

    // Choose the default status option in menu.
    if (statusChoice == deviceObject.status) statusOption.selected = true;

    // Add this option to the menu.
    deviceStatusMenu.appendChild(statusOption);
  }
  deviceStatusMenu.classList.add("deviceStatusMenu");

  // Create a delete button for the devices
  const deleteBtn = document.createElement("div");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerText = "x";
  deleteBtn.title = "Delete this device";

  // Add the children elements to the deviceElem div.
  deviceElem.insertBefore(deviceNameTextInput, deviceElem.firstChild);
  deviceElem.insertBefore(deviceCanvElem, deviceElem.firstChild);
  // deviceElem.appendChild(deviceCanvElem);
  // deviceElem.appendChild(deviceNameTextInput);
  deviceElem.appendChild(deviceStatusMenu);
  deviceElem.appendChild(deleteBtn);

  // Add the deviceElem div to the device space/visualizer/dotted region.
  document.querySelector("#visualizer").appendChild(deviceElem);

  // The canvas gets the appropriate illustration for the device displayed.
  let deviceIllo = new deviceTypes[deviceType](deviceCanvElem);
  deviceIllo = deviceIllo.changeStatus(deviceObject.status).show();

  // Add listener to the status menu - when a choice is selected from the
  // menu, update the illustration (by calling the changeStatus function
  //  of the device object).
  deviceStatusMenu.onchange = (ev) => {
    const choice = ev.target.options.selectedIndex;
    const optionSelected = deviceStatusMenu.options.item(choice);
    const optionTextValue = optionSelected.value;

    // Update the illustration object & the object in this file.
    deviceIllo = deviceIllo.changeStatus(optionTextValue);
    deviceObject.status = optionTextValue;
  };

  deleteBtn.addEventListener("click", (ev) => {
    if (!rPiWaitingClick) {
      // Delete the html element and children
      deviceElem.innerText = "";
      deviceElem.remove();

      // Delete the illustration object
      deviceIllosOnSpace.splice(deviceIllosOnSpace.indexOf(deviceIllo), 1);

      // Delete the JS object
      devicesOnSpace.splice(devicesOnSpace.indexOf(deviceObject), 1);

      // Remove the interactjs listening for this element potentially.
      // I'm not sure if the object won't get garbage-collected if I
      // don't remove this. This .draggable class is how interact-js
      // grabs elements for dragging.
      deviceElem.classList.remove("draggable");

      /* Code for handling deletion of connected devices */

      // Handle removal of devices connected to some RPi
      devicesOnSpace.forEach((devObj) => {
        // For each device object, if they are connected to the
        // item being deleted, remove the item from the array of
        // connectedDevices.
        const listDevicesConnected = devObj.connectedDeviceIds;
        if (listDevicesConnected?.includes(deviceObject.id)) {
          const index = listDevicesConnected.indexOf(deviceObject.id);

          // Remove from array
          listDevicesConnected.splice(index, 1);

          // Update the text on the button
          document
            .getElementById(devObj.id)
            .querySelector(".connectDevBtn").innerText =
            "+ Connect (" + listDevicesConnected.length + ")";
        }
      });

      // Handle the removal of an RPi iteslf:
      // Make sure all of the connected devices are no
      // longer connected.
      deviceObject.connectedDeviceIds?.forEach((devId) => {
        devicesOnSpace.forEach((otherDev) => {
          if (otherDev.id == devId) otherDev.connected = false;
        });
      });
      redrawCanvas();
    }
  });

  // Bind (one-way) the name changes in the text input element with the
  // JS object representing this device, and with the device object that
  // represents its illustration.
  deviceNameTextInput.onchange = (ev) => {
    const newName = ev.target.value;
    deviceObject.name = newName;
    deviceIllo.name = newName;
  };

  // Add this device object to the deviceIllosOnSpace array.
  deviceIllosOnSpace.push(deviceIllo);
}

// Set the .draggable objects to have draggable properties
interact(".draggable")
  .draggable({
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
  })
  .on("tap", tapDraggableListener);

// Remove draggable option from device name input field, delete
// button, and connect device button.
// Also removes the "move" type cursor when hovering over those.
interact("." + dontDragTapClasses.join(", ."))
  .draggable({})
  .styleCursor(false);

// Listens to taps on draggable elements (devices on screen).
function tapDraggableListener(ev) {
  if (rPiWaitingClick) {
    let newTapElement = ev.target;

    // Check classlist for things they shouldnt click on
    // The user can either click on the empty region in the device,
    // or on the illustration itself (<canvas> element)
    let tappedOkElement = true;
    dontDragTapClasses.forEach((class_) => {
      if (newTapElement.classList.contains(class_)) {
        tappedOkElement = false;
      }
    });

    if (tappedOkElement) {
      // Find the actual device container element.
      // For example, if the user clicks on the canvas, the canvas is
      // registered as the element that was clicked on. Instead, we
      // want the .deviceContainer div - which has the ID of the
      // device.
      while (!newTapElement.classList.contains("deviceContainer")) {
        newTapElement = newTapElement.parentElement;
      }

      // The id of the device connecting to RPi
      const tapId = newTapElement.id;
      // console.log(
      //   `Raspberry Pi #${rPiObjectWaiting.id} wants to connect to #${tapId}`
      // );

      // The JS object of the device connecting to RPi
      const tapObject = devicesOnSpace.filter((obj) => obj.id == tapId)[0];

      // Check and make sure it's not rpi itself
      if (tapId != rPiObjectWaiting.id) {
        rPiWaitingClick = false;
        const connectDevicesBtn = document
          .getElementById(rPiObjectWaiting.id)
          .querySelector(".connectDevBtn");

        devicesOnSpace.forEach((dev) => {
          const id = dev.id;
          document.getElementById(id).classList.remove("raspNotAdded");
          document.getElementById(id).classList.remove("raspAdded");
        });
        if (!tapObject.connected) {
          // If the device is not already connected to some RPi
          tapObject.connected = true;
          rPiObjectWaiting.connectedDeviceIds.push(tapId);
        } else if (rPiObjectWaiting.connectedDeviceIds.includes(tapId)) {
          // If the device is already connected to the same RPi, remove it
          tapObject.connected = false;
          rPiObjectWaiting.connectedDeviceIds.splice(
            rPiObjectWaiting.connectedDeviceIds.indexOf(tapId),
            1
          );
        }
        connectDevicesBtn.innerText =
          "+ Connect (" + rPiObjectWaiting.connectedDeviceIds.length + ")";
        redrawCanvas();
      }
    }
  }
}

// Listens to move events thrown by the interactable object
function dragMoveListener(event) {
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

  redrawCanvas();
}

// Function that gets called when an object drag ends.
// Sets the x & y positions in device objects using devX & devY from here.
// The x & y values are values between 0 and 1, representing it's position
// within the device space/dotted region - this might be useful for setting
// the position of the html div, irrespective of resolution/window size.
function dragEndListener(event) {
  const deviceDiv = event.target;
  const deviceId = deviceDiv.id;

  // Find the object for this device from the devicesOnSpace array.
  const deviceObj = devicesOnSpace.find((el) => el.id == deviceId);

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

  redrawCanvas();
}

// When the window is resized, the illustrations have to re-render.
// However, the "resize" event fires every frame of the browser UI,
// so we add a timeout - The event is placed on a 50ms delay.
// 'windowResizer' is a variable for this timeout functionality.
// Code from: https://stackoverflow.com/a/60204716
let windowResizer;
window.addEventListener("resize", () => {
  // Clear any existing timeout.
  clearTimeout(windowResizer);

  // Create a new timeout on a 200ms delay.
  windowResizer = setTimeout(() => {
    // Execute these functions on a timeout.

    // Resize the background canvas. might need to move to a function
    linesCanv.width = linesCanv.parentElement.clientWidth;
    linesCanv.height = linesCanv.parentElement.clientHeight;

    renderDevicePreviews();
    placeDeviceSpaceDevices();
    renderDeviceSpaceDevices();
    redrawCanvas();
  }, 50);
});

// Redraws the background canvas element containing
// the lines connecting devices.
function redrawCanvas() {
  ctx.clearRect(0, 0, linesCanv.width, linesCanv.height);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ffffff40";

  // All the RPi devices that are on screen
  const rPiDevices = devicesOnSpace.filter((dev) => dev.deviceType == "RPI");
  rPiDevices.forEach((dev) => {
    const rPiElement = document.getElementById(dev.id);

    // Coordinates to start the line from
    const startX =
      parseInt(rPiElement.getAttribute("data-x")) +
      ~~(rPiElement.clientWidth / 2);
    const startY =
      parseInt(rPiElement.getAttribute("data-y")) +
      ~~(rPiElement.clientHeight / 2);

    // Find and iterate over all connected devices
    const connDevIds = dev.connectedDeviceIds;
    if (connDevIds) {
      connDevIds.forEach((connDevId) => {
        // Get the HTML element for the connected device
        const connDevElem = document.getElementById(connDevId);

        // Coordinates to end the line on
        const endX =
          parseInt(connDevElem.getAttribute("data-x")) +
          ~~(connDevElem.clientWidth / 2);
        const endY =
          parseInt(connDevElem.getAttribute("data-y")) +
          ~~(connDevElem.clientHeight / 2);

        // Draw the line between the RPi and this connected device
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Clear the rectangle behind each device so the line
        // doesn't appear there
        [rPiElement, connDevElem].forEach((elem) => {
          ctx.clearRect(
            parseInt(elem.getAttribute("data-x")),
            parseInt(elem.getAttribute("data-y")),
            elem.clientWidth,
            elem.clientHeight
          );
        });
      });
    }
  });
}

// Function to re-render the device illustrations in the
// add device popup/modal
function renderDevicePreviews() {
  devicePreviewObjects.forEach((el) => {
    if (el.show) {
      el.show();
    }
  });
}

// Function to place the draggable device divs in the correct location
// on screen (within the dotted region).
function placeDeviceSpaceDevices() {
  // Get the width and height of the dotted region.
  const spaceW = document.getElementById("visualizer").clientWidth;
  const spaceH = document.getElementById("visualizer").clientHeight;

  devicesOnSpace.forEach((devObj) => {
    const deviceDiv = document.getElementById(devObj.id);
    const newX = Math.round(spaceW * devObj.x);
    const newY = Math.round(spaceH * devObj.y);

    deviceDiv.setAttribute("data-x", newX + "");
    deviceDiv.setAttribute("data-y", newY + "");
    deviceDiv.style.transform = `translate(${newX}px, ${newY}px)`;

    // console.log(deviceDiv);
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

// Trying out touch and drag to scroll/move devices in mobile browsers.
// Disabled - because it's not perfect, you have to drag really slow on
// iOS browsers at least.
/* interact(".draggable")
  .on('down', deviceTouchDown)
  .on('up', deviceTouchUp);

function deviceTouchDown(event){
  let visualizerDiv =  document.getElementById("visualizer");
  if (visualizerDiv.style.touchAction != "none")
    visualizerDiv.style.touchAction = "none";
};

function deviceTouchUp(event){
  let visualizerDiv =  document.getElementById("visualizer");
  if (visualizerDiv.style.touchAction == "none")
    visualizerDiv.style.touchAction = "pan-x pan-y";
}; */
