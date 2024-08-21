let taxSwitch = document.getElementsByClassName("tax-switch-inp");
taxSwitch[0].addEventListener("click", (err) => {
  let taxPrices = getTaxPrice();
  let originalPrices = getOriginalPrice();
  for (const taxPrice of taxPrices) {
    if (taxPrice.classList.contains("disable")) {
      taxPrice.classList.remove("disable");
      for (const originalPrice of originalPrices) {
        originalPrice.classList.add("disable");
      }
    } else {
      taxPrice.classList.add("disable");
      for (const originalPrice of originalPrices) {
        originalPrice.classList.remove("disable");
      }
    }
  }
});
function getTaxPrice() {
  return (taxPrices = document.getElementsByClassName("taxPrices"));
}
function getOriginalPrice() {
  return (originalPrices = document.getElementsByClassName("originalPrice"));
}
