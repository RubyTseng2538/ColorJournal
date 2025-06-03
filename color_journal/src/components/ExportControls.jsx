// components/ExportControls.jsx
import React, { useContext } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function ExportControls() {
  const { exportCurrentDrawing } = useContext(DiaryContext);

  return (
    <button onClick={exportCurrentDrawing} className="mt-4 px-2 py-1 bg-blue-500 text-white rounded">
      Export Entry
    </button>
  );
}