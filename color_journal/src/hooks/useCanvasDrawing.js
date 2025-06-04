import React, { createContext, useState } from "react";

export const DiaryContext = createContext();

export function DiaryProvider({ children }) {  const [color, setColor] = useState("#ff69b4");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1); // Value between 0 and 1
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [usePressure, setUsePressure] = useState(false);
  const [brushType, setBrushType] = useState("round"); // Options: round, square, splatter, pixel, fill
  const [isUsingFillBucket, setIsUsingFillBucket] = useState(false); // Toggle for fill bucket tool

  const saveDrawing = (canvas) => {
    const data = canvas.toDataURL();
    localStorage.setItem("color-diary-" + currentDate, data);
  };

  const loadDrawing = (canvas) => {
    const saved = localStorage.getItem("color-diary-" + currentDate);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (saved) {
      const img = new Image();
      img.src = saved;
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  };

  const clearDrawing = () => {
    localStorage.removeItem("color-diary-" + currentDate);
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getAllEntries = () => {
    return Object.entries(localStorage)
      .filter(([k]) => k.startsWith("color-diary-"))
      .map(([k, v]) => [k.replace("color-diary-", ""), v]);
  };

  const exportCurrentDrawing = () => {
    const canvas = document.querySelector("canvas");
    const link = document.createElement("a");
    link.download = `diary-${currentDate}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };  return (
    <DiaryContext.Provider
      value={{
        color,
        setColor,
        brushSize,
        setBrushSize,
        brushOpacity,
        setBrushOpacity,
        currentDate,
        setCurrentDate,        usePressure,
        setUsePressure,
        brushType,
        setBrushType,
        isUsingFillBucket,
        setIsUsingFillBucket,
        saveDrawing,
        loadDrawing,
        clearDrawing,
        getAllEntries,
        exportCurrentDrawing,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
}