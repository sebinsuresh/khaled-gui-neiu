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

// =============================================
// Other code to test features
/*
// Performance Testing.
const numTimes = 10000;
const newDev = spaceMan.addDevice("LED");

let testObj = {
  name: { value: newDev.name, editable: true },
  id: { value: newDev.id, editable: false },
  comment: {
    value: "Default comment. Click to type in a new comment.",
    editable: true,
  },
};
let testObj2 = {
  name: { value: newDev.name + "2", editable: true },
  id: { value: newDev.id, editable: false },
  comment: {
    value: "Default comment. Click to type in a new comment.",
    editable: true,
  },
};

const t0 = performance.now();
for (let i = 0; i < numTimes; i++) {
  let newString1 = JSON.stringify(testObj, null, 2)
    .replaceAll("  ", "&emsp;&emsp;")
    .replaceAll("\n", "<br/>");

  let newString2 = JSON.stringify(testObj2, null, 2)
    .replaceAll("  ", "&emsp;&emsp;")
    .replaceAll("\n", "<br/>");

  let eq = newString1 === newString2;
}
let time = performance.now() - t0;
console.log(`Time it took for comparing strings: ${time}ms`);

let newString = JSON.stringify(testObj, null, 2)
  .replaceAll("  ", "&emsp;&emsp;")
  .replaceAll("\n", "<br/>");

const t1 = performance.now();
for (let i = 0; i < numTimes; i++) {
  newDev.label.elem.innerHTML = i + newString;
  // newDev.label.elem.innerHTML = newString + i;
  // newDev.label.elem.innerHTML = newString;
}
time = performance.now() - t1;
console.log(`Time it took for updating DOM elements: ${time}ms`);

// Results: About 6-7 times slower to do DOM updates using innerHTML=".." than
// it is to parse an object to JSON and compare strings. Therefore, it is
// worth it to check whether things have changes using string comparison.

// About half a millisecond (0.6ms) to do 10,000 DOM updates
// Even less (0.09ms) for the stringfiy + comparison.
*/

/* 
// Test 2:
const inputElem = document.createElement("input");
inputElem.type = "text";
document.body.appendChild(inputElem);

inputElem.onchange = (ev) => console.log(`changed: ${ev.target}`);

setInterval(() => {
  inputElem === document.activeElement ? null : console.log(inputElem.value);
}, 500);

// To check whether an input field is being focused, compare it against 
// document.activeElement (read-only).
 */
