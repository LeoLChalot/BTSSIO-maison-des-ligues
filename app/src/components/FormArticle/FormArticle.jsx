import React, { useState } from 'react'
import axios from 'axios'

const FormArticle = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleMultipleChange(event) {
    setUploadedFiles([...event.target.files]);
  }

  function handleMultipleSubmit(event) {
    event.preventDefault();
    const url = 'http://localhost:3000/m2l/uploadFiles';
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: function(progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    };

    axios.post(url, formData, config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });
  }

  return (
    <div className="App">
      <form onSubmit={handleMultipleSubmit}>
        <input type="file" multiple onChange={handleMultipleChange} />
        <button type="submit">Upload</button>
        <progress value={uploadProgress} max="100"></progress>
      </form>
    </div>
  );
}

export default FormArticle
