const multer = require('multer');
const {
  uploadImage,
  uploadVideo,
  uploadDocument,
  uploadFile,
  deleteFile,
  getFileInfo
} = require('../services/cloudinaryService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else if (file.mimetype.startsWith('application/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Upload image
const uploadImageFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const result = await uploadImage(fileStr, req.body.folder);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Upload video
const uploadVideoFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const result = await uploadVideo(fileStr, req.body.folder);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Upload document
const uploadDocumentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const result = await uploadDocument(fileStr, req.body.folder);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Upload any file type
const uploadAnyFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const result = await uploadFile(fileStr, req.body.folder);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete file
const deleteUploadedFile = async (req, res) => {
  try {
    const { publicId, resourceType = 'image' } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'Public ID is required'
      });
    }

    const result = await deleteFile(publicId, resourceType);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get file info
const getUploadedFileInfo = async (req, res) => {
  try {
    const { publicId, resourceType = 'image' } = req.query;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'Public ID is required'
      });
    }

    const result = await getFileInfo(publicId, resourceType);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadImageFile,
  uploadVideoFile,
  uploadDocumentFile,
  uploadAnyFile,
  deleteUploadedFile,
  getUploadedFileInfo
}; 