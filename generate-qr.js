const QRCode = require("qrcode");

const url = "https://sbc-ai-school.vercel.app";

QRCode.toFile(
  "sbc-ai-school-qr.png",
  url,
  {
    width: 1000,
    margin: 2,
  },
  function (err) {
    if (err) throw err;
    console.log("QR Code created successfully!");
  }
);