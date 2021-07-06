/**
 *Label class that contains the label Key:value pairs and functionality
 *for each device.
 *The functions that modify the values will update the HTML elements as
 *well as the JS objects.
 */

import Device from "./device.js";

export default class Label {
  /**
   * Create a Label object
   * @param {Device} parentObject The Device object that this label is
   * assigned to.
   */
  constructor(parentObject) {
    this.parent = parentObject;

    /**
     * The JS object containing information for this label.
     */
    this.object = {
      name: parentObject.name,
      id: parentObject.id,
      comment: "Default comment. Click to type in a new comment.",
    };

    this.elem = this.createElem();

    /** @type {HTMLDivElement} */
    this.kvPairsContainerElem = null;

    this.setKVPairElems();
    this.parent.element.appendChild(this.elem);
  }

  /**
   * Creates the HTML element for this label.
   * @returns {HTMLDivElement}
   */
  createElem() {
    const elem = document.createElement("div");
    elem.classList.add("labelDiv");

    // TODO: replace with proper editable k:v pairs
    elem.textContent = JSON.stringify(this.object);

    return elem;
  }

  /**
   * Sets (or creates if it doesn't exist) the k:v pair HTML elements and
   * container, and update them with values from this.object.
   */
  setKVPairElems() {
    if (!this.kvPairsContainerElem) {
      this.kvPairsContainerElem = document.createElement("div");
      this.kvPairsContainerElem.classList.add("kvPairsContainer");
    }

    // Create k:v pair divs if they don't exist, add listeners, and

    // OLD COMMENTS:
    // Delete any existing children - no need to dispose of event listeners,
    // browsers do this automatically.
    // https://stackoverflow.com/questions/6033821/do-i-need-to-remove-event-listeners-before-removing-elements

    // Create new children for each property, fill in values, and add listeners
    // for change.
  }

  /**
   * Show the label HTML element, after setting the k:v pairs to the latest
   * values.
   */
  show() {
    this.setKVPairElems();
    this.elem.classList.remove("noDisplay");
  }

  // Hide the label HTML element.
  hide() {
    this.elem.classList.add("noDisplay");
  }

  // Change the value for a given key in this label.
  // This will also update the value in the HTML element.
  setObjectVal(key, val) {
    this.object[key] = val;
    // TODO: set the values within this.elem HTMLelement
  }
}
