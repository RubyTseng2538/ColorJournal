// components/CanvasArea.jsx
import React, { useRef, useContext, useEffect } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function CanvasArea() {
  const canvasRef = useRef(null);
  const { color, brushSize, currentDate, saveDrawing, loadDrawing } = useContext(DiaryContext);

  useEffect(() => {
    if (canvasRef.current) {
      loadDrawing(canvasRef.current);
    }
  }, [currentDate]);

  const handleDrawStart = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvasRef.current.isDrawing = true;
  };

  const handleDraw = (e) => {
    if (!canvasRef.current.isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleDrawEnd = () => {
    canvasRef.current.isDrawing = false;
    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
    saveDrawing(canvasRef.current);
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="border rounded bg-white"
      onMouseDown={handleDrawStart}
      onMouseMove={handleDraw}
      onMouseUp={handleDrawEnd}
      onMouseLeave={handleDrawEnd}
    />
  );
}