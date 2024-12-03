import multer from 'multer';

// Configure multer to store file in memory as buffer
const storage = multer.memoryStorage();

const uploadFile = multer({ storage }).single('resume'); // Single file upload with field name 'resume'

export { uploadFile };
