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

    switch (deviceTypes[deviceType]) {
      case deviceTypes.BULB:
        deviceName = "Light Bulb";
        let prevBulb = createBulb().create(previewCanvas).setZoom(15);
        previewElem.onmouseover = (e) => {
          prevBulb = prevBulb.hoverEnter();
          prevBulb = prevBulb.show();
        };
        previewElem.onmouseout = (e) => {
          prevBulb = prevBulb.hoverLeave();
          prevBulb = prevBulb.show();
        };
        // Add the preview illustation to the array
        devicePreviewIllos.push(previewElem);
        prevBulb = prevBulb.show();
        break;
      case deviceTypes.LAMP:
        deviceName = "Table Lamp";
        break;
      case deviceTypes.THERMOMETER:
        deviceName = "Thermometer";
        break;
      default:
        break;
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
