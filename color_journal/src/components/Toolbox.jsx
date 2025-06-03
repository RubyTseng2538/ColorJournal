// components/Toolbox.jsx
import React, { useContext } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function Toolbox() {
  const { color, setColor, brushSize, setBrushSize, clearDrawing } = useContext(DiaryContext);

  return (
    <div className="flex gap-4 mb-4">
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} />
      <button onClick={clearDrawing} className="px-2 py-1 bg-red-500 text-white rounded">
        Clear
      </button>
    </div>
  );
}