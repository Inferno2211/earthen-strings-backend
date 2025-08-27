const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'earthen-strings/images', options = {}) => {
    try {
        const {
            eager = undefined,
            public_id = undefined,
            overwrite = true,
            resource_type = 'image',
            allowed_formats = ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            context = undefined,
            use_filename = false,
            unique_filename = true
        } = options;

        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type,
            allowed_formats,
            eager,
            public_id,
            overwrite,
            context,
            use_filename,
            unique_filename
        });

        return {
            success: true,
            public_id: result.public_id,
            url: result.secure_url,
            eager: result.eager || [],
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes
        };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
};

// Upload video to Cloudinary
const uploadVideo = async (file, folder = 'earthen-strings/videos') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: 'video',
            allowed_formats: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
            transformation: [
                { quality: 'auto' }
            ]
        });

        return {
            success: true,
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
            duration: result.duration
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Upload document to Cloudinary
const uploadDocument = async (file, folder = 'earthen-strings/documents') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: 'raw',
            allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
            transformation: []
        });

        return {
            success: true,
            public_id: result.public_id,
            url: result.secure_url,
            format: result.format,
            size: result.bytes
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Upload any file type (auto-detect)
const uploadFile = async (file, folder = 'earthen-strings/files') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: 'auto'
        });

        return {
            success: true,
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
            resource_type: result.resource_type
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Delete file from Cloudinary
const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        return {
            success: true,
            message: 'File deleted successfully',
            result: result
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Get file info from Cloudinary
const getFileInfo = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.api.resource(publicId, {
            resource_type: resourceType
        });

        return {
            success: true,
            data: result
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    uploadImage,
    uploadVideo,
    uploadDocument,
    uploadFile,
    deleteFile,
    getFileInfo
}; 