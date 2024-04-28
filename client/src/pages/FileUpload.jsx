import React, { useState } from 'react';
import axios from 'axios';
// const {Cloudinary} = require("@cloudinary/url-gen");


export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Function to handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const cld = new Cloudinary({
        cloud: {
          cloudName: 'demo'
        }
      });

    // Function to handle file upload
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Make a POST request to the server to upload the file
            const response = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data);
        } catch (error) {
            setMessage('File upload failed');
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h2>File Upload</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
            {message && <p>{message}</p>}
        </div>
    );
}
