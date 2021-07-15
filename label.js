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
     * Properties to watch from the parent device.
     * @type [{propName : string, editable: boolean}]
     * */
    this.watchProps = [
      { propName: "name", editable: true },
      { propName: "id", editable: false },
      { propName: "comment", editable: true },
    ];

    /**
     * The JS object containing information for this label.
     */
    this.object = {};

    this.elem = this.createElem();
    this.elem.classList.add("noDisplay");
    this.hide();

    /** @type {HTMLDivElement} */
    this.kvPairsContainerElem = null;

    this.parent.element.appendChild(this.elem);

    const interval = 500;
    /**
     * Checks for any changes in parent & updates this.object every
     * <interval> milliseconds.
     * Don't put DOM updating code (not performant) in setInterval!!
     *
     * @type {ReturnType<typeof setInterval>}
     *  */
    this.watcher = setInterval(() => {
      this.updateObject();
    }, interval);
  }

  /**
   * Creates the HTML element for this label.
   * @returns {HTMLDivElement}
   */
  createElem() {
    const elem = document.createElement("div");
    elem.classList.add("labelDiv");

    return elem;
  }

  /**
   * Update Label's object based on the latest values from the parent device.
   */
  updateObject() {
    this.watchProps.forEach((prop) => {
      const key = prop.propName;
      if (!(key in this.parent)) {
        console.warn(
          `Unkown property '${key}' being watched by label (Device: ${this.parent.id})`
        );
      } else if (this.parent[key] !== this.object[key]) {
        console.log("Label object updated");
        this.object[key] = this.parent[key];
      }
    });
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

    // Create k:v pair divs if they don't exist, add listeners, and set
    // data-prop values
    // TODO: replace with proper editable k:v pairs
    const newInnerHTML = JSON.stringify(this.object, null, 2)
      .replaceAll("  ", "&nbsp;&nbsp;")
      .replaceAll("\n", "<br>");
    if (newInnerHTML !== this.elem.innerHTML) {
      console.log("Label element text updated.");
      // console.log("OLD:", this.elem.innerHTML);
      // console.log("NEW:", newInnerHTML);
      this.elem.innerHTML = newInnerHTML;
    }
  }

  /**
   * Delete the label & clear setIntervals
   */
  delete() {
    clearInterval(this.watcher);
    this.elem.innerHTML = "";
    this.object = null;
    this.parent = null;
  }

  /**
   * Show the label HTML element, after setting the k:v pairs to the latest
   * values.
   */
  show() {
    this.updateObject();
    this.setKVPairElems();
    this.elem.classList.remove("hiding");
    this.elem.classList.remove("noDisplay");
    this.isHidden = false;
  }

  // Hide the label HTML element.
  hide() {
    this.elem.classList.add("hiding");
    setTimeout(() => this.elem.classList.add("noDisplay"), 184);
    this.isHidden = true;
  }

  // Toggle the hidden status of the label
  toggleHidden() {
    if (this.isHidden) this.show();
    else this.hide();
  }

  // Change the value for a given key in this label.
  // This will also update the value in the HTML element.
  setObjectVal(key, val) {
    this.object[key] = val;
    this.setKVPairElems();
  }
}
