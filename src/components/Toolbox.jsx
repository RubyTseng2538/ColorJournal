// components/Toolbox.jsx
import React, { useContext } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function Toolbox() {
  const { 
    color, setColor, 
    brushSize, setBrushSize, 
    brushOpacity, setBrushOpacity,
    brushType, setBrushType, 
    usePressure, setUsePressure, 
    clearDrawing, 
    undo, redo, undoStack, redoStack
  } = useContext(DiaryContext);
  
  // Brush icons or names for different brush types
  const brushTypes = [
    { id: 'round', name: 'Round', icon: '●' },
    { id: 'square', name: 'Square', icon: '■' },
    { id: 'splatter', name: 'Splatter', icon: '💦' },
    { id: 'pixel', name: 'Pixel', icon: '🔲' },
    { id: 'fill', name: 'Fill Bucket', icon: '🪣' }
  ];
  
  return (
    <div className="flex gap-5 mb-4 items-center flex-wrap">
      <div className="flex items-center">
        <span className="mr-2 text-sm text-darkPink">Color:</span>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
          className="w-8 h-8 cursor-pointer" 
          style={{ padding: '0', border: 'none' }}
        />
      </div>
      
      <div className="flex items-center">
        <span className="mr-2 text-sm text-darkPink">Size:</span>
        <input 
          type="range" 
          min="1" 
          max="100" 
          value={brushSize} 
          onChange={(e) => setBrushSize(e.target.value)}
          className="cursor-pointer"
        />
        <span className="ml-2 text-sm text-maroon">{brushSize}</span>
      </div>
      
      <div className="flex items-center">
        <span className="mr-2 text-sm text-darkPink">Opacity:</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={brushOpacity * 100} 
          onChange={(e) => setBrushOpacity(e.target.value / 100)}
          className="cursor-pointer"
        />
        <span className="ml-2 text-sm text-maroon">{Math.round(brushOpacity * 100)}%</span>
      </div>
      
      <div className="flex items-center">
        <span className="mr-2 text-sm text-darkPink">Brush:</span>
        <div className="flex space-x-1">
          {brushTypes.map((brush) => (
            <button
              key={brush.id}
              onClick={() => setBrushType(brush.id)}
              className={`w-8 h-8 flex items-center justify-center text-lg rounded-md transition-colors ${
                brushType === brush.id 
                  ? 'bg-darkPink text-lightPink' 
                  : 'bg-lightPink text-darkPink hover:bg-pink'
              }`}
              title={brush.name}
            >
              {brush.icon}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center mt-2">
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={usePressure} 
            onChange={(e) => setUsePressure(e.target.checked)}
            className="sr-only peer" 
          />
          <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-darkPink"></div>
          <span className="ml-2 text-sm text-darkPink">Pressure Sensitivity</span>
        </label>
      </div>
        <button 
        onClick={clearDrawing} 
        className="px-3 py-1 bg-darkPink text-lightPink rounded-lg hover:bg-maroon hover:text-lightPink transition-colors mt-2"
      >
        Clear
      </button>
      
      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => undo(document.querySelector('canvas'))} 
          disabled={undoStack.length === 0}
          className={`px-3 py-1 rounded-lg transition-colors ${
            undoStack.length > 0 
              ? 'bg-darkPink text-lightPink hover:bg-maroon hover:text-lightPink' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        
        <button 
          onClick={() => redo(document.querySelector('canvas'))} 
          disabled={redoStack.length === 0}
          className={`px-3 py-1 rounded-lg transition-colors ${
            redoStack.length > 0 
              ? 'bg-darkPink text-lightPink hover:bg-maroon hover:text-lightPink' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          Redo
        </button>
      </div>
    </div>
  );
}