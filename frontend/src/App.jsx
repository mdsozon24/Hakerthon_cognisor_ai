import { useState, useEffect } from 'react';

export default function App() {
  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('bus_stop_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (originalBase64, resultBase64) => {
    const newItem = {
      id: Date.now(),
      original: originalBase64,
      result: resultBase64,
      date: new Date().toLocaleString()
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('bus_stop_history', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('bus_stop_history', JSON.stringify(updatedHistory));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setResultImage(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
        const originalBase64 = reader.result;
        setImage(originalBase64);

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('http://localhost:8000/api/detect', {
            method: 'POST',
            body: formData,
          });
          
          const data = await response.json();
          const finalResultBase64 = `data:image/jpeg;base64,${data.image_base64}`;
          setResultImage(finalResultBase64);
          
          saveToHistory(originalBase64, finalResultBase64);

        } catch (error) {
          console.error("Error during detection:", error);
          alert("Make sure your Python backend is running!");
        } finally {
          setLoading(false);
        }
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans text-gray-800">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Bus Stop Detection System
        </h1>
        <p className="text-gray-500 text-lg">
          Upload an image to detect shelters, seating, and trash cans
        </p>
        
        <div className="mt-8 mx-auto w-full max-w-lg p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition duration-300 shadow-sm">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
          />
        </div>
      </div>
      
      {/* Current Detection Section - Side by Side Layout */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 mb-16 w-full">
        
        {/* Left Side: Original Image */}
        <div className="flex-1 w-full flex flex-col items-center">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Original Image</h3>
          
          {image ? (
             <img src={image} alt="Original" className="w-full max-w-md h-auto rounded-xl shadow-md object-contain border border-gray-200" />
          ) : (
             <div className="w-full max-w-md h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                <p className="text-gray-400 font-medium text-center px-4">Upload an image to see preview</p>
             </div>
          )}
        </div>
        
        {/* Right Side: Detection Result */}
        <div className="flex-1 w-full flex flex-col items-center">
          <h3 className="text-xl font-bold text-green-600 mb-4">Detection Result</h3>
          
          {loading ? (
            <div className="w-full max-w-md h-64 bg-green-50 rounded-xl border-2 border-dashed border-green-300 flex items-center justify-center shadow-inner">
              <p className="text-green-600 font-bold text-lg animate-pulse flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing with YOLO...
              </p>
            </div>
          ) : resultImage ? (
            <img src={resultImage} alt="Detected" className="w-full max-w-md h-auto rounded-xl border-4 border-green-500 shadow-xl shadow-green-100 object-contain ring-4 ring-green-50" />
          ) : (
            <div className="w-full max-w-md h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
               <p className="text-gray-400 font-medium text-center px-4">Result will appear here</p>
            </div>
          )}
        </div>

      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
            Recent Detections
            <span className="bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded-full">{history.length}/5</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                <p className="text-xs text-gray-400 mb-3 font-medium">{item.date}</p>
                <div className="rounded-xl overflow-hidden mb-4 border border-gray-100 bg-gray-50">
                  <img src={item.result} alt="History" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <button 
                  onClick={() => deleteHistoryItem(item.id)}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-lg font-semibold transition-all duration-300"
                >
                  Delete Record
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}