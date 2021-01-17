// Device types enum
let deviceTypes = {
  BULB: 1,
  LAMP: 2,
  THERMOMETER: 3,
};

let devicePreviews = [];
let addDevicesRegion = document.querySelector(".modalDevices");
function initializeAddDevicesRegion() {
  addDevicesRegion.innerHTML = "";
  for (deviceType in deviceTypes) {
    console.log(deviceType, deviceTypes[deviceType]);
    let previewElem = document.createElement("div");
    previewElem.classList.add("devicePreview");

    addDevicesRegion.appendChild(previewElem);
  }
  console.log(addDevicesRegion);
}
initializeAddDevicesRegion();
