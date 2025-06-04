// components/ExportControls.jsx
import React, { useContext, useRef } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function ExportControls() {
  const { exportCurrentDrawing, currentDate } = useContext(DiaryContext);
  const fileInputRef = useRef(null);

  // Handler for importing an image
  const handleImport = () => {
    fileInputRef.current.click();
  };
  
  // Process the imported file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the imported image on the canvas, fitting it proportionally
        const { width, height } = canvas;
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgRatio > canvasRatio) {
          // Image is wider than canvas (relative to height)
          drawWidth = width;
          drawHeight = width / imgRatio;
          offsetX = 0;
          offsetY = (height - drawHeight) / 2;
        } else {
          // Image is taller than canvas (relative to width)
          drawHeight = height;
          drawWidth = height * imgRatio;
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Save the imported drawing to the current date
        localStorage.setItem("color-diary-" + currentDate, canvas.toDataURL());
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    
    // Clear the input to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className="flex gap-2 mt-4">
      <button 
        onClick={exportCurrentDrawing} 
        className="px-3 py-1 bg-darkPink text-lightPink rounded-lg hover:bg-maroon hover:text-lightPink transition-colors"
      >
        Export Entry
      </button>
      
      <button 
        onClick={handleImport}
        className="px-3 py-1 bg-darkPink text-lightPink rounded-lg hover:bg-maroon hover:text-lightPink transition-colors"
      >
        Import Entry
      </button>
      
      {/* Hidden file input for importing images */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*" 
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}