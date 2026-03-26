const amountInput = document.getElementById("amount-input");
const upiInput = document.getElementById("upi-input");
const generateButton = document.getElementById("generate-button");
const payLink = document.getElementById("pay-link");
const statusText = document.getElementById("donate-status");
const sourceImage = document.getElementById("source-qr-image");
const qrCanvas = document.getElementById("qr-canvas");
const qrTarget = document.getElementById("generated-qr");

let detectedUpiLink = "";
let qrInstance = null;

function setStatus(message) {
  statusText.textContent = message;
}

function decodeSourceQr() {
  if (!sourceImage || !qrCanvas || typeof jsQR === "undefined") {
    setStatus("QR decoder not available. You can still paste your UPI ID manually.");
    return;
  }

  const context = qrCanvas.getContext("2d");
  qrCanvas.width = sourceImage.naturalWidth || sourceImage.width;
  qrCanvas.height = sourceImage.naturalHeight || sourceImage.height;
  context.drawImage(sourceImage, 0, 0, qrCanvas.width, qrCanvas.height);

  const imageData = context.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
  const decoded = jsQR(imageData.data, imageData.width, imageData.height);

  if (decoded && decoded.data) {
    detectedUpiLink = decoded.data.trim();
    setStatus("Base payment QR detected successfully. Enter an amount to generate a new QR.");
  } else {
    setStatus("Could not auto-detect the payment data. Paste your UPI ID in the fallback field.");
  }
}

function buildPaymentLink(amount) {
  const manualValue = upiInput.value.trim();
  let base = manualValue || detectedUpiLink;

  if (!base) {
    return "";
  }

  if (!base.startsWith("upi://")) {
    base = `upi://pay?pa=${encodeURIComponent(base)}&pn=${encodeURIComponent("Nishant Kumar")}`;
  }

  const url = new URL(base);
  url.searchParams.set("am", amount);
  url.searchParams.set("cu", "INR");

  return url.toString();
}

function renderQr(content) {
  if (!content || typeof QRCode === "undefined") {
    return;
  }

  qrTarget.innerHTML = "";
  qrInstance = new QRCode(qrTarget, {
    text: content,
    width: 280,
    height: 280,
    colorDark: "#0b0b0b",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function handleGenerate() {
  const amount = amountInput.value.trim();

  if (!amount || Number(amount) <= 0) {
    setStatus("Please enter a valid amount like 10, 50, or 100.");
    return;
  }

  const paymentLink = buildPaymentLink(amount);

  if (!paymentLink) {
    setStatus("Payment source not found yet. Wait for auto-detect or paste your UPI ID manually.");
    return;
  }

  renderQr(paymentLink);
  payLink.href = paymentLink;
  setStatus(`Custom QR generated for INR ${amount}. You can scan it or open the payment app button.`);
}

sourceImage.addEventListener("load", decodeSourceQr);
generateButton.addEventListener("click", handleGenerate);

if (sourceImage.complete) {
  decodeSourceQr();
}
