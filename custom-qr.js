const sharp = require("sharp");

async function createQR() {
  await sharp("sbc-ai-school-qr.png")
    .resize(700, 700)
    .png()
    .toFile("sbc-ai-school-qr-enhanced.png");

  console.log("Enhanced QR created!");
}

createQR();