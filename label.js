export default class Label {
  constructor(parentObject) {
    this.parent = parentObject;
    this.object = {
      name: parentObject.name,
      comment: "default comment",
    };

    // TODO: finish this
    // this.elem = document.createElement("div");
    // this.elem.classList.add("labelDiv");
  }

  setObjectVal(key, val) {
    this.object[key] = val;
    // TODO: set the values within this.elem HTMLelement
  }
}
