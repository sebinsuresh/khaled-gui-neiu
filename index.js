// NOTE: The term "illo" is used as short for "illustration".

// Device types, their string names, and the create
// functions for them.
// To add more devices: 
// 1. Create another js file for the device
//    a. Make sure the js file has the same const devicename()
//    and the methods within such as create(), turnOn(), 
//    turnOff(), etc.
// 2. Follow the same structure in this file:
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
initializeAddDevicesModal();

// Function that adds preview elements to the add devices modal.
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

    // Illustration element for each device type
    // Explanation: The (object representing) the current device we are looking 
    // at, is selected from the object containing all the devices 
    // (deviceTypes[deviceType]).
    // This object has two properties: 'name' and 'create'. 
    // This function 'create' represents a function for the entire object, as 
    // found in the files lamp.js, bulb.js, and thermo.js.
    // Each of these functions returns an object with some properties and 
    // functions, such as rotate, illo, create(), turnOn(), etc.
    // These objects have the create() function, which in turn, is called - 
    // and the canvas element which contains the illustration is passed in as
    // the first parameter. 
    // The second parameter that's passed in is a boolean value that represents
    // whether or not this element is being shown in the preview pane (as 
    // opposed to being shown on the actual device space - within the dotted 
    // rectangle). This only determines the zoom level, as of now.
    // Since the below code creates the devices for preview pane, this is set to
    // true, and the canvas gets an appropriate zoom level.
    let prevIllo = deviceTypes[deviceType].create().create(previewCanvas, true);

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
    titleElem.innerText = deviceTypes[deviceType].name;
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
    name: deviceTypes[deviceType].name,
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

  // Create HTML elements and append them into the visualizer area

  // Create the outer div that you add the canvas, input, text elements to.
  // This element is the "draggable" element that can move around.
  // (Draggability functionality is implemented using interactjs framework)
  let deviceElem = document.createElement("div");
  deviceElem.classList.add("draggable", "deviceContainer");
  deviceElem.id = deviceObject.id;

  // The canvas element that contians the illustration for each device.
  // Notice that the content of the canvas itself is called later in the method.
  // Otherwise, the canvas won't render properly.
  let deviceCanvElem = document.createElement("canvas");
  deviceCanvElem.classList.add("deviceCanv");

  // The text input element containing the generated name of the device by default.
  let deviceNameTextInput = document.createElement("input");
  deviceNameTextInput.type = "text";
  deviceNameTextInput.value = deviceObject.name;
  deviceNameTextInput.classList.add("deviceNameInput");

  // Bind (one-way) the name changes in the text input element and the
  // JS object representing this device.
  deviceNameTextInput.onchange = ((ev) => {
    let newName = ev.target.value;
    deviceObject.name = newName;
  });

  // The input status shown to the user - I am creating a <select> tag
  // and calling it a "menu".
  let deviceStatusMenu = document.createElement("select");
  
  // Create the statuses available to the device as options in the menu.
  for (statusChoice of deviceTypes[deviceType].create().statuses){
    let statusOption = document.createElement("option");
    statusOption.innerText = statusChoice;
    statusOption.value = statusChoice;

    // Choose the "OFF" option by default.
    if (statusChoice == "OFF")
      statusOption.selected = true;

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
  let deviceIllo = deviceTypes[deviceType].create().create(deviceCanvElem);
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
  }

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
})


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
  let x = Math.round((parseFloat(target.getAttribute("data-x")) || 0) + event.dx);
  let y = Math.round((parseFloat(target.getAttribute("data-y")) || 0) + event.dy);

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
  const deviceObj = devicesOnSpace.find(el => el.id == deviceId);

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

  console.log(deviceObj);
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

addDeviceToSpace("THERMOMETER")