// Device types enum
let deviceTypes = {
  BULB: 1,
  LAMP: 2,
  THERMOMETER: 3,
};

let devicePreviewIllos = [];
let addDevicesRegion = document.querySelector(".modalDevices");
initializeAddDevicesRegion();

// Function that adds preview elements to the add devices modal.
// Each preview element is a div with the class "devicePreview",
// has a canvas that shows an illustrtation of the device, span
// with title of the device, and a button to add it to the space.
function initializeAddDevicesRegion() {
  addDevicesRegion.innerHTML = "";
  devicePreviewIllos = [];
  for (let deviceType in deviceTypes) {
    // Create new div within the region
    let previewElem = document.createElement("div");
    previewElem.classList.add("devicePreview");

    // Add the preview containing div to the region
    addDevicesRegion.appendChild(previewElem);

    let deviceName = "";
    let previewCanvas = document.createElement("canvas");
    previewCanvas.classList.add("previewCanvas");
    previewElem.appendChild(previewCanvas);
    let prevIllo; // Illustration element for each device type

    switch (deviceTypes[deviceType]) {
      case deviceTypes.BULB:
        deviceName = "Light Bulb";
        prevIllo = createBulb().create(previewCanvas).setZoom(15);
        break;
      case deviceTypes.LAMP:
        deviceName = "Table Lamp";
        prevIllo = createLamp().create(previewCanvas).setZoom(20);
        break;
      case deviceTypes.THERMOMETER:
        deviceName = "Thermometer";
        prevIllo = createThermo().create(previewCanvas).setZoom(25);
        break;
      default:
        break;
    }

    if (prevIllo) {
      // Show illustration
      prevIllo = prevIllo.show();
      // Add the preview illustation to the array
      devicePreviewIllos.push(previewElem);

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
    titleElem.innerText = deviceName;
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

function addDeviceToSpace(deviceType) {
  console.log(`Add ${deviceType} to Device Space`);
}
