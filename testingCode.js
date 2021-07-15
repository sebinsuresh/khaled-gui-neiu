// Testing/Demoing via console. Copy and paste these to browser console.

// =============================================
// Demo A. Creating LED, showing label, changing name
// 1. add device
spaceMan.addDevice("LED");
// 2. click & open labels
spaceMan.devices[0].label.show();
// 3. change name
spaceMan.devices[0].name = "New name for this!";
// =============================================

// =============================================
// Demo B. Connecting and disconnecting devices & seeing how the labels change.
// 1. add devices
spaceMan.addDevice("LED");
spaceMan.addDevice("RPI");

// 2. click & open labels
spaceMan.devices[0].label.show();
spaceMan.devices[1].label.show();

// 3. watch props in LED
spaceMan.devices[0].label.watchProps.push({
  propName: "isConnected",
  editable: false,
});
spaceMan.devices[0].label.watchProps.push({
  propName: "connectedTo",
  editable: false,
});

// 4. Connect devices
spaceMan.connectDevices("RPI1", "LED1");

// 5. disconnect devices
spaceMan.disconnectDevices("RPI1", "LED1");
// =============================================

// =============================================
// Demo C. Watching an object type property from parent
// 1. add devices
spaceMan.addDevice("LED");

// 2. click & open labels
spaceMan.devices[0].label.show();

// 3. watch position prop from parent (object type)
spaceMan.devices[0].label.watchProps.push({
  propName: "position",
  editable: false,
});
// =============================================
