/*
 * Bunch of helper functions and initializations for the illustrations.
 */

// TAU = 2*PI -> Needed for Zdog angle calculations
let TAU = Zdog.TAU;

// Initialization for Zfont - text in Zdog Illustrations
Zfont.init(Zdog);

const blue0 = "#0C1220";
const blue1 = "#273348";
const blue2 = "#405566";
const blue3 = "#81B3B9";
const yellow = "#DFCF82";
const strongRed = "#CD2F10";
const bulbYellow = "#E0CB23";
const offWhite = "#F8F9E8";
const darkBlue = "#082B5C";
const lightBlue = "#8BA6BB";
const green = "#1B998B";
const greenDark = "#157A6E";
const dark = "#333745";
const dark2 = "#454B5E";
const yellow = "#ECC05B";
const grayDark = "#ABB4C4";
const gray = "#CED3DC";
const grayLight = "#FBFFFE";

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
