const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const atob = require('atob'); 

const cors = require('cors')

app.use(cors());
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const upload = multer({ storage: multer.memoryStorage() });

function validateBase64File(base64String) {
    try {
        if (!base64String || typeof base64String !== 'string') return false;
        atob(base64String); 
        return true;
    } catch (err) {
        return false;
    }
}


app.post('/bfhl', upload.single('file_b64'), (req, res) => {
    const { data, file_b64 } = req.body;
    const fullName = 'Rajesh_Kumar_Jashti';
    const dob = '26042003'; 
    const email = "rajeshkumar_jashti@srmap.edu.in";
    const rollNumber = "AP21110011415";

    let numbers = [];
    let alphabets = [];
    let highestLowercaseAlphabet = [];

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (/[a-zA-Z]/.test(item)) {
            alphabets.push(item);
        }
    });

    
    const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
    if (lowercaseAlphabets.length > 0) {
        highestLowercaseAlphabet.push(lowercaseAlphabets.sort().reverse()[0]);
    }

    const fileValid = validateBase64File(file_b64);
    const fileMimeType = fileValid ? 'image/png' : null;  
    const fileSizeKb = fileValid ? Buffer.byteLength(file_b64, 'base64') / 1024 : null;

    res.json({
        is_success: true,
        user_id: `${fullName}_${dob}`,
        email: email,
        roll_number: rollNumber,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKb
    });
});


app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
