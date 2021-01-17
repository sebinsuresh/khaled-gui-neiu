// Device types enum
let deviceTypes = {
  BULB: 1,
  LAMP: 2,
  THERMOMETER: 3,
};

let devicePreviews = [];
let addDevicesRegion = document.querySelector(".modalDevices");
initializeAddDevicesRegion();

// Function that adds preview elements to the add devices modal.
// Each preview element is a div with the class "devicePreview",
// has a canvas that shows an illustrtation of the device, span
// with title of the device, and a button to add it to the space.
function initializeAddDevicesRegion() {
  addDevicesRegion.innerHTML = "";
  for (let deviceType in deviceTypes) {
    // Create new div within the region
    let previewElem = document.createElement("div");
    previewElem.classList.add("devicePreview");

    let deviceName = "EMPTY";
    let previewCanvas = document.createElement("canvas");
    previewCanvas.classList.add("previewCanvas");
    previewElem.appendChild(previewCanvas);
    switch (deviceTypes[deviceType]) {
      case deviceTypes.BULB:
        deviceName = "Light Bulb";
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

    // Add the preview containing div to the region
    addDevicesRegion.appendChild(previewElem);
  }

  function addDeviceToSpace(deviceType) {
    console.log(`Add ${deviceType} to Device Space`);
  }
}
