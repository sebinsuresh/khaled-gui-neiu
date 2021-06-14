/* 
  Label class that contains the label Key:value pairs and functionality
  for each device.

  The functions that modify the values will update the HTML elements as 
  well as the JS objects.
 */
export default class Label {
  constructor(parentObject) {
    this.parent = parentObject;
    this.object = {
      name: parentObject.name,
      comment: "Default comment. Click to type in a new comment.",
    };

    // TODO: finish this
    // this.elem = document.createElement("div");
    // this.elem.classList.add("labelDiv");
  }

  // Show the label HTML element.
  show() {
    this.elem.classList.remove("invisible");
  }

  // Hide the label HTML element.
  hide() {
    this.elem.classList.add("invisible");
  }

  // Change the value for a given key in this label.
  // This will also update the value in the HTML element.
  setObjectVal(key, val) {
    this.object[key] = val;
    // TODO: set the values within this.elem HTMLelement
  }
}
