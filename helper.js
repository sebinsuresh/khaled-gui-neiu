/*
 * Bunch of helper functions and initializations for the illustrations.
 */

// TAU = 2*PI -> Needed for Zdog angle calculations
let TAU = Zdog.TAU;

// Initialization for Zfont - text in Zdog Illustrations
Zfont.init(Zdog);

let blue0 = "#0C1220";
let blue1 = "#273348";
let blue2 = "#405566";
let blue3 = "#81B3B9";
let yellow = "#DFCF82";
let strongRed = "#CD2F10";
let bulbYellow = "#E0CB23";
let offWhite = "#F8F9E8";
let darkBlue = "#082B5C";
let lightBlue = "#8BA6BB";

// Converts a hex color code string to 'rgba(..)' string
function hexToRgba(hex, alpha = "1.0") {
  hex = hex.trim().replace("#", "");
  const red = parseInt(hex.substr(0, 2), 16);
  const green = parseInt(hex.substr(2, 2), 16);
  const blue = parseInt(hex.substr(4, 2), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

// Function to find intermediate color between two given hex colors.
// amount is a value between 0 and 1, a and b are strings like "#ababab".
// From https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
function lerpColor(a, b, amount) {
  var ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
}