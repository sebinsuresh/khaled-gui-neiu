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

    /** The JS object containing information for this label.*/
    this.object = {};

    /** Indicates whether the HTML element needs an update.*/
    this.needsElemUpdate = false;

    /**
     * The HTML element for the label.
     * @type {HTMLDivElement}
     * */
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
     * Be careful putting DOM updating code (not performant) in setInterval!!
     *
     * @type {ReturnType<typeof setInterval>}
     *  */
    this.watcher = setInterval(() => {
      this.updateObject();

      // DOM-updating code!
      // Updates the HTML element if the label is currently visible and
      // requires an update.
      if (!this.isHidden && this.needsElemUpdate) this.setKVPairElems();
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
   * Also sets this.needsElemUpdate if there are any properties that changed.
   */
  updateObject() {
    // List of updated properties. Used for logging them to console.
    // TODO: Should this array should be made instance level?
    let updatedProps = [];

    // Iterate over all the properties from the parent device being watched,
    // and update any non-existent/unchanged properties in label's object.
    this.watchProps.forEach((prop) => {
      const key = prop.propName;
      if (!(key in this.parent)) {
        // Property not belonging to parent device object is in this.watchProps
        console.warn(
          `Unkown property '${key}' being watched by label (Device: ${this.parent.id})`
        );
      } else if (typeof this.parent[key] === "object") {
        // TODO: NESTED OBJECTS ARE PASSED BY REFERENCE! The changes are not noticed the way it is checking equality below (Eg: try adding position to watchProps): spaceMan.devices[0].label.watchProps.push({propName:"position", editable: false});
        console.error("Cannot watch objects/arrays (yet) :/");
        // Temporary solution: Convert to JSON, store and compare that.
        const oldVal = this.object[key];
        const newVal = JSON.stringify(this.parent[key]);
        if (oldVal !== newVal) {
          this.object[key] = newVal;
          updatedProps.push(key);
        }
      } else if (this.parent[key] !== this.object[key]) {
        // If there is a value mismatch between parent's property and label's
        // object's property, update the label object.
        this.object[key] = this.parent[key];

        updatedProps.push(key);
      }
    });

    if (updatedProps.length > 0) {
      console.log(
        `#${this.parent.id}'s Label obj updated: ${updatedProps.toString()}`
      );
      // Mark the HTML element as needing an update.
      this.needsElemUpdate = true;
    }
  }

  /**
   * Sets (or creates if it doesn't exist) the k:v pair HTML elements and
   * container, and update them with values from this.object.
   * Also sets this.needsElemUpdate to false, since we updated the elem.
   */
  setKVPairElems() {
    if (!this.kvPairsContainerElem) {
      this.kvPairsContainerElem = document.createElement("div");
      this.kvPairsContainerElem.classList.add("kvPairsContainer");
      this.elem.appendChild(this.kvPairsContainerElem);
    }

    // Create k:v pair divs if they don't exist, add listeners, and set
    // data-prop values
    // TODO: replace with proper editable k:v pairs
    const newInnerHTML = JSON.stringify(this.object, null, 2)
      .replaceAll("  ", "&nbsp;&nbsp;")
      .replaceAll("\n", "<br>");
    if (newInnerHTML !== this.kvPairsContainerElem.innerHTML) {
      console.log("Label element text updated.", newInnerHTML);
      this.kvPairsContainerElem.innerHTML = newInnerHTML;
    }

    // Mark the HTML element as updated.
    this.needsElemUpdate = false;
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
   * values. Sets this.isHidden to false.
   */
  show() {
    this.updateObject();
    if (this.needsElemUpdate) this.setKVPairElems();
    this.elem.classList.remove("hiding");
    this.elem.classList.remove("noDisplay");
    this.isHidden = false;
  }

  /** Hide the label HTML element. Sets this.isHidden to true. */
  hide() {
    this.elem.classList.add("hiding");
    setTimeout(() => this.elem.classList.add("noDisplay"), 184);
    this.isHidden = true;
  }

  /** Toggle the hidden status of the label */
  toggleHidden() {
    if (this.isHidden) this.show();
    else this.hide();
  }

  /**
   * Change the value for a given key in this label.
   * This will also update the value in the HTML element.
   */
  setObjectVal(key, val) {
    this.object[key] = val;
    this.setKVPairElems();
  }
}
