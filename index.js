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
  BULB: Bulb,
  LAMP: Lamp,
  THERMOMETER: Thermometer,
};

// This array will contain the objects in the "add devices" modal
// that preview the devices.
let devicePreviewObjects = [];

let addDevicesRegion = document.querySelector(".modalDevices");
initializeAddDevicesModal();

// Function that adds preview elements to the "add devices" modal.
// Each preview element is a div with the class "devicePreview",
// has a <canvas> that shows an illustrtation of the device,
// <span> with title of the device, and a button to add it to
// the space.
function initializeAddDevicesModal() {
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
}

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

// Function to add Devices to the Device space visualizer
function addDeviceToSpace(deviceType) {
  let deviceObject = {
    deviceType,
    x: 0.1,
    y: 0.1,
    status: "OFF",
    name: new deviceTypes[deviceType](null, false, false).name,
    id: deviceType + "",
  };

  // Count the number of devices in the space already
  // with the same type, and set the name accordingly.
  let sameTypeCount = 1;
  devicesOnSpace.forEach((el) => {
    if (el.deviceType === deviceType) sameTypeCount++;
  });
  deviceObject.name += " " + sameTypeCount;
  deviceObject.id += sameTypeCount;

  // Add the device's JS object to the array.
  devicesOnSpace.push(deviceObject);

  // Section below creates the HTML elements and append them into the
  // dotted area.

  // Create the outer div that you add the canvas, input, text elements to.
  // This element is the "draggable" element that can move around.
  // (Draggability functionality is implemented using interact.js framework)
  let deviceElem = document.createElement("div");
  deviceElem.classList.add("draggable", "deviceContainer");
  deviceElem.id = deviceObject.id;

  // The canvas element that contians the illustration for each device.
  // This is later passed into the device class's constructors.
  let deviceCanvElem = document.createElement("canvas");
  deviceCanvElem.classList.add("deviceCanv");

  // The text input element containing the generated name of the device by default.
  let deviceNameTextInput = document.createElement("input");
  deviceNameTextInput.type = "text";
  deviceNameTextInput.value = deviceObject.name;
  deviceNameTextInput.classList.add("deviceNameInput");

  // The input status shown to the user - I am creating a <select> tag
  // and calling it a "menu".
  let deviceStatusMenu = document.createElement("select");

  // Create the statuses available to the device as options in the menu.
  for (statusChoice of new deviceTypes[deviceType](null, false, false)
    .statuses) {
    let statusOption = document.createElement("option");
    statusOption.innerText = statusChoice;
    statusOption.value = statusChoice;

    // Choose the "OFF" option by default.
    if (statusChoice == "OFF") statusOption.selected = true;

    // Add this option to the menu.
    deviceStatusMenu.appendChild(statusOption);
  }
  deviceStatusMenu.classList.add("deviceStatusMenu");

  // Add the children elements to the deviceElem div.
  deviceElem.appendChild(deviceCanvElem);
  deviceElem.appendChild(deviceNameTextInput);
  deviceElem.appendChild(deviceStatusMenu);

  // Add the deviceElem div to the device space/visualizer/dotted region.
  document.querySelector("#visualizer").appendChild(deviceElem);

  // The canvas gets the appropriate illustration for the device displayed.
  let deviceIllo = new deviceTypes[deviceType](deviceCanvElem);
  deviceIllo = deviceIllo.show();

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

  // Bind (one-way) the name changes in the text input element with the
  // JS object representing this device, and with the device object that 
  // represents its illustration.
  deviceNameTextInput.onchange = (ev) => {
    let newName = ev.target.value;
    deviceObject.name = newName;
    deviceIllo.name = newName;
  };

  // Add this device object to the deviceIllosOnSpace array.
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

  // console.log(deviceObj);
}

// When the window is resized, the illustrations have to re-render.
// However, the "resize" event fires every frame of the browser UI,
// so we add a timeout - The event is placed on a 200ms delay.
// 'windowResizer' is a variable for this timeout functionality.
// Code from: https://stackoverflow.com/a/60204716
let windowResizer;
window.addEventListener("resize", () => {
  // Clear any existing timeout.
  clearTimeout(windowResizer);

  // Create a new timeout on a 200ms delay.
  windowResizer = setTimeout(() => {
    // Execute these functions on a timeout.
    renderDevicePreviews();
    placeDeviceSpaceDevices();
    renderDeviceSpaceDevices();
  }, 200);
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

// Function to place the draggable device divs in the correct location
// on screen (within the dotted region).
function placeDeviceSpaceDevices() {
  // Get the width and height of the dotted region.
  const spaceW = document.getElementById("visualizer").clientWidth;
  const spaceH = document.getElementById("visualizer").clientHeight;

  devicesOnSpace.forEach((devObj) => {
    let deviceDiv = document.getElementById(devObj.id);
    const newX = Math.round(spaceW * devObj.x, 2);
    const newY = Math.round(spaceH * devObj.y, 2);

    deviceDiv.setAttribute("data-x", newX);
    deviceDiv.setAttribute("data-y", newY);
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
