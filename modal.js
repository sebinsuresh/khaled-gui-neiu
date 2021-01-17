// The plus button on the screen was clicked
function addPlusClicked() {
  showAddModal();
}

// The X button on Add device modal was clicked
function modalCloseClicked() {
  hideAddModal();
}

// Show the Add Device modal
function showAddModal() {
  document.querySelector(".modalbg").classList.remove("invisible");
}

// Hide the Add Device modal
function hideAddModal() {
  document.querySelector(".modalbg").classList.add("invisible");
}
