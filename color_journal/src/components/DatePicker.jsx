// components/DatePicker.jsx
import React, { useContext } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function DatePicker() {
  const { currentDate, setCurrentDate } = useContext(DiaryContext);
  return (
    <div className="mb-4 flex items-center gap-2">
      <label>Date:</label>
      <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="border p-1" />
    </div>
  );
}