// components/Gallery.jsx
import React, { useContext } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function Gallery() {
  const { getAllEntries, setCurrentDate } = useContext(DiaryContext);
  const entries = getAllEntries();

  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {entries.map(([date, img]) => (
        <img
          key={date}
          src={img}
          alt={`Entry for ${date}`}
          onClick={() => setCurrentDate(date)}
          className="cursor-pointer border"
        />
      ))}
    </div>
  );
}