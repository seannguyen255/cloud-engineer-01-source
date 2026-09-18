require("dotenv").config();

const express = require("express");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");


const app = express();
const upload = multer({ storage: multer.memoryStorage() });



// Ket noi toi container tren Azure Blob Storage
const blobService = BlobServiceClient.fromConnectionString("");
const container = blobService.getContainerClient("");

app.use(express.static("public"));

// Lay danh sach hinh trong container
app.get("/api/images", async (req, res) => {
  try {
    const images = [];
    for await (const blob of container.listBlobsFlat()) {
      images.push({
        name: blob.name,
        url: container.getBlockBlobClient(blob.name).url,
      });
    }
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload 1 hinh len container
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Chua chon file" });

    const blobName = Date.now() + "-" + req.file.originalname;
    const blockBlob = container.getBlockBlobClient(blobName);

    await blockBlob.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    res.json({ name: blobName, url: blockBlob.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8088);
