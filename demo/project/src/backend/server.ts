import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// API endpoint to handle image upload and object detection
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // In a real implementation, you would:
    // 1. Process the image using TensorFlow.js or another object detection service
    // 2. Store the image (e.g., in cloud storage)
    // 3. Save the metadata and detection results to the database

    const imageUpload = await prisma.imageUpload.create({
      data: {
        filename: req.file.filename,
        uploadDate: new Date(),
        // Add other relevant data
      }
    });

    res.json({
      message: 'Image uploaded and processed successfully',
      upload: imageUpload
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Failed to process image upload' });
  }
});

// Get all image uploads with their detected objects
app.get('/api/uploads', async (req, res) => {
  try {
    const uploads = await prisma.imageUpload.findMany({
      include: {
        detectedObjects: true
      }
    });
    res.json(uploads);
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});