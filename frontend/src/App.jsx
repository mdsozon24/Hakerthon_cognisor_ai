import { useState } from 'react';

export default function App() {
  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setLoading(true);
    setResultImage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/detect', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResultImage(`data:image/jpeg;base64,${data.image_base64}`);
    } catch (error) {
      console.error("Error during detection:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Bus Stop Detection System</h2>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload} 
        style={{ marginBottom: '20px' }}
      />
      
      <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
        {image && (
          <div>
            <h3>Original Image</h3>
            <img src={image} alt="Original" style={{ maxWidth: '400px', borderRadius: '8px' }} />
          </div>
        )}
        
        {loading && <div style={{ marginTop: '50px' }}><strong>Processing with YOLO...</strong></div>}
        
        {resultImage && !loading && (
          <div>
            <h3>Detection Result</h3>
            <img src={resultImage} alt="Detected Objects" style={{ maxWidth: '400px', borderRadius: '8px', border: '2px solid #4CAF50' }} />
          </div>
        )}
      </div>
    </div>
  );
}