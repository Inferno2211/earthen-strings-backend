const express = require('express');
const router = express.Router();
const {
  upload,
  uploadImageFile,
  uploadVideoFile,
  uploadDocumentFile,
  uploadAnyFile,
  deleteUploadedFile,
  getUploadedFileInfo
} = require('../controllers/uploadController');

// Upload image
router.post('/image', upload.single('file'), uploadImageFile);

// Upload video
router.post('/video', upload.single('file'), uploadVideoFile);

// Upload document
router.post('/document', upload.single('file'), uploadDocumentFile);

// Upload any file type
router.post('/file', upload.single('file'), uploadAnyFile);

// Delete uploaded file
router.delete('/delete', deleteUploadedFile);

// Get file info
router.get('/info', getUploadedFileInfo);

module.exports = router; 