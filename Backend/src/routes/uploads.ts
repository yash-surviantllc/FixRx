import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { requireConsumerOrVendor } from '@/middleware/auth';
import { UploadController } from '@/controllers/uploadController';
import { asyncHandler } from '@/middleware/errorHandler';
import multer from 'multer';
import { config } from '@/config/environment';
import Joi from 'joi';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: config.fileUpload.maxSize, // 5MB
    files: 10, // Maximum 10 files per request
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = config.fileUpload.allowedTypes;
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  },
});

// Upload single file
router.post(
  '/single',
  requireConsumerOrVendor,
  upload.single('file'),
  validateRequest({
    body: {
      category: Joi.string().valid('avatar', 'portfolio', 'certification', 'rating').required(),
      description: Joi.string().max(200).optional(),
    }
  }),
  asyncHandler(UploadController.uploadSingle)
);

// Upload multiple files
router.post(
  '/multiple',
  requireConsumerOrVendor,
  upload.array('files', 10),
  validateRequest({
    body: {
      category: Joi.string().valid('portfolio', 'certification', 'rating').required(),
      description: Joi.string().max(200).optional(),
    }
  }),
  asyncHandler(UploadController.uploadMultiple)
);

// Upload avatar
router.post(
  '/avatar',
  requireConsumerOrVendor,
  upload.single('avatar'),
  asyncHandler(UploadController.uploadAvatar)
);

// Upload portfolio images
router.post(
  '/portfolio',
  requireConsumerOrVendor,
  upload.array('images', 10),
  validateRequest({
    body: {
      descriptions: Joi.array().items(Joi.string().max(200)).optional(),
    }
  }),
  asyncHandler(UploadController.uploadPortfolio)
);

// Upload certifications
router.post(
  '/certifications',
  requireConsumerOrVendor,
  upload.array('files', 5),
  validateRequest({
    body: {
      names: Joi.array().items(Joi.string().max(100)).optional(),
      descriptions: Joi.array().items(Joi.string().max(200)).optional(),
    }
  }),
  asyncHandler(UploadController.uploadCertifications)
);

// Upload rating images
router.post(
  '/rating-images',
  requireConsumerOrVendor,
  upload.array('images', 5),
  validateRequest({
    body: {
      ratingId: Joi.string().required(),
    }
  }),
  asyncHandler(UploadController.uploadRatingImages)
);

// Get file by ID
router.get(
  '/:fileId',
  validateRequest({
    params: {
      fileId: Joi.string().required(),
    }
  }),
  asyncHandler(UploadController.getFile)
);

// Delete file
router.delete(
  '/:fileId',
  requireConsumerOrVendor,
  validateRequest({
    params: {
      fileId: Joi.string().required(),
    }
  }),
  asyncHandler(UploadController.deleteFile)
);

// Get user's uploaded files
router.get(
  '/user/files',
  requireConsumerOrVendor,
  validateRequest({
    query: {
      category: Joi.string().valid('avatar', 'portfolio', 'certification', 'rating').optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(50).default(20),
    }
  }),
  asyncHandler(UploadController.getUserFiles)
);

// Get file metadata
router.get(
  '/:fileId/metadata',
  validateRequest({
    params: {
      fileId: Joi.string().required(),
    }
  }),
  asyncHandler(UploadController.getFileMetadata)
);

// Generate presigned URL for direct upload (for large files)
router.post(
  '/presigned-url',
  requireConsumerOrVendor,
  validateRequest({
    body: {
      fileName: Joi.string().required(),
      fileType: Joi.string().required(),
      category: Joi.string().valid('avatar', 'portfolio', 'certification', 'rating').required(),
      fileSize: Joi.number().max(config.fileUpload.maxSize).required(),
    }
  }),
  asyncHandler(UploadController.generatePresignedUrl)
);

// Confirm presigned upload
router.post(
  '/confirm-upload',
  requireConsumerOrVendor,
  validateRequest({
    body: {
      uploadId: Joi.string().required(),
      fileKey: Joi.string().required(),
    }
  }),
  asyncHandler(UploadController.confirmUpload)
);

// Get upload statistics
router.get(
  '/stats/overview',
  requireConsumerOrVendor,
  asyncHandler(UploadController.getUploadStats)
);

// Bulk delete files
router.delete(
  '/bulk',
  requireConsumerOrVendor,
  validateRequest({
    body: {
      fileIds: Joi.array().items(Joi.string()).min(1).max(20).required(),
    }
  }),
  asyncHandler(UploadController.bulkDeleteFiles)
);

export default router;
