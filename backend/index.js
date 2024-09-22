const express = require('express');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const atob = require('atob');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({limit: '5mb'})); 

const storage = multer.memoryStorage();
const upload = multer({ storage });

function decodeBase64File(file_b64) {
    try {
        const buffer = Buffer.from(file_b64, 'base64');
        const mimeType = 'image/png'; 
        const sizeKB = buffer.length / 1024;
        return { valid: true, mimeType, sizeKB };
    } catch (error) {
        return { valid: false };
    }
}

app.post('/bfhl',
    [
        check('data').isArray().withMessage('Data should be an array'),
        check('file_b64').optional().isString().withMessage('File should be a Base64 string'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { data, file_b64 } = req.body;
        const fullName = "Rajesh_Kumar_Jashti";  
        const dob = "26042003"; 
        const userId = `${fullName}_${dob}`;
        const email = "rajeshkumar_jashti@srmap.edu.in";
        const rollNumber = "AP21110011415";

        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
        const lowercaseAlphabets = alphabets.filter(item => /^[a-z]$/.test(item));
        const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
            ? [lowercaseAlphabets.sort().pop()]
            : [];

        let fileValid = false, fileMimeType = null, fileSizeKB = null;
        if (file_b64) {
            const fileInfo = decodeBase64File(file_b64);
            fileValid = fileInfo.valid;
            if (fileValid) {
                fileMimeType = fileInfo.mimeType;
                fileSizeKB = fileInfo.sizeKB;
            }
        }

        const response = {
            "is_success": true,
            "user_id": userId,
            "email": email,
            "roll_number": rollNumber,
            "numbers": numbers,
            "alphabets": alphabets,
            "highest_lowercase_alphabet": highestLowercaseAlphabet,
            "file_valid": fileValid,
            "file_mime_type": fileMimeType,
            "file_size_kb": fileSizeKB
        };

        res.status(200).json(response);
    });

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
