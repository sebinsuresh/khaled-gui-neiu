/* 
  Index JS file - starting point of the Device Space Visualizer code.
  A device space manager is initialized with the appropriate element selector
  query string passed in.
 */

import SpaceManager from "./spaceManager.js";

// Initialize the space manager
// This kickstarts the whole thing. The preview modal is filled in,
// event listeners for buttons are added, and much more.
const spaceMan = new SpaceManager("#visualizer");

// Make the space manager available from JS console in browser.
window.spaceMan = spaceMan;

/*
// Performance Testing. Ignore
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
