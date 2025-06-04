// components/DatePicker.jsx
import React, { useContext } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function DatePicker() {
  const { currentDate, setCurrentDate } = useContext(DiaryContext);
  return (
    <div className="mb-4 flex items-center gap-2 text-maroon">
      <label>Date:</label>
      <input 
        type="date" 
        value={currentDate} 
        onChange={(e) => setCurrentDate(e.target.value)} 
        className="border-2 border-pink p-1 bg-lightPink focus:border-darkPink focus:outline-none focus:ring-2 focus:ring-darkPink" 
      />
    </div>
  );
}