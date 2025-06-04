// components/CanvasArea.jsx
import React, { useRef, useContext, useEffect } from "react";
import { DiaryContext } from "../hooks/useCanvasDrawing";

export default function CanvasArea() {
  const canvasRef = useRef(null);
  const { 
    color, brushSize, brushType, brushOpacity, usePressure, 
    isUsingFillBucket, currentDate, saveDrawing, saveDrawingWithSnapshot, 
    loadDrawing, undo, redo
  } = useContext(DiaryContext);
  const lastPos = useRef({ x: 0, y: 0 });
  
  // Utility function to convert hex color to rgba
  const convertHexToRGBA = (hex, opacity) => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Return rgba color string
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  useEffect(() => {
    if (canvasRef.current) {
      loadDrawing(canvasRef.current);
    }
  }, [currentDate]);

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo: Ctrl+Z or Command+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo(canvasRef.current);
      }
      
      // Redo: Ctrl+Y or Command+Y or Ctrl+Shift+Z or Command+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo(canvasRef.current);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);
  const handleDrawStart = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    
    // Get the correct position
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Save starting position
    lastPos.current = { x, y };
    
    // Handle fill bucket tool    
    if (brushType === 'fill') {
      // Apply fill with opacity
      const fillRgbaColor = convertHexToRGBA(color, brushOpacity);
      floodFill(ctx, Math.floor(x), Math.floor(y), fillRgbaColor);
      
      // Save the drawing after fill with undo snapshot
      saveDrawingWithSnapshot(canvasRef.current);
      return;
    }
    
    // Set base line width
    const baseWidth = brushSize;
    const pressureWidth = usePressure && e.pressure !== undefined && e.pressure !== 0 
      ? baseWidth * Math.max(0.1, e.pressure) 
      : baseWidth;
    
    ctx.lineWidth = pressureWidth;
    
    // Apply brush type settings
    applyBrushSettings(ctx);
    
    // Store drawing state
    canvasRef.current.isDrawing = true;
    canvasRef.current.lastDrawnPath = null;
    canvasRef.current.currentPath = [];
    
    // Create a backup of the current canvas state
    canvasRef.current.backupCanvas = document.createElement('canvas');
    canvasRef.current.backupCanvas.width = canvasRef.current.width;
    canvasRef.current.backupCanvas.height = canvasRef.current.height;
    const backupCtx = canvasRef.current.backupCanvas.getContext('2d');
    backupCtx.drawImage(canvasRef.current, 0, 0);
    
    // For pixel and splatter, draw immediately at the starting point
    if (brushType === 'pixel') {
      // Apply the color with opacity for discrete brushes
      const rgbaColor = convertHexToRGBA(color, brushOpacity);
      ctx.fillStyle = rgbaColor;
      drawPixel(ctx, x, y, pressureWidth);
    } else if (brushType === 'splatter') {
      // Apply the color with opacity for discrete brushes
      const rgbaColor = convertHexToRGBA(color, brushOpacity);
      ctx.fillStyle = rgbaColor;
      drawSplatter(ctx, x, y, pressureWidth);
    } else {
      // For continuous brushes, just store the first point in the path
      canvasRef.current.currentPath.push({ x, y, width: pressureWidth });
    }
  };

  // Helper function to apply brush-specific settings
  const applyBrushSettings = (ctx) => {
    // Reset any existing transforms first
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    switch (brushType) {
      case 'square':
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        break;
      case 'round':
      default:
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
    }
  };// Draw a pixel-style square
  const drawPixel = (ctx, x, y, size) => {
    // For pixel brush, draw squares instead of lines
    ctx.fillRect(
      Math.floor(x - size / 2), 
      Math.floor(y - size / 2), 
      size, 
      size
    );
  };
    // Draw a splatter pattern
  const drawSplatter = (ctx, x, y, size) => {
    const dropCount = Math.floor(size / 2) + 3;
    const splatterRadius = size * 2;
    
    // Main dot
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Splatter drops around
    for (let i = 0; i < dropCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * splatterRadius;
      const dropSize = (Math.random() * size / 2) + (size / 4);
      
      const dropX = x + Math.cos(angle) * distance;
      const dropY = y + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(dropX, dropY, dropSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };
    // Draw a smooth path with consistent opacity
  const drawSmoothPath = (ctx, pathPoints) => {
    if (pathPoints.length < 2) return;
    
    // Get a temporary canvas for drawing the stroke with consistent opacity
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Configure the temp context with the same settings
    tempCtx.lineCap = ctx.lineCap;
    tempCtx.lineJoin = ctx.lineJoin;
    tempCtx.lineWidth = ctx.lineWidth;
    
    // Use a solid color for drawing on the temp canvas
    const baseColor = color.replace('#', '');
    const r = parseInt(baseColor.substring(0, 2), 16);
    const g = parseInt(baseColor.substring(2, 4), 16);
    const b = parseInt(baseColor.substring(4, 6), 16);
    tempCtx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    
    // Draw the full path on the temp canvas
    tempCtx.beginPath();
    tempCtx.moveTo(pathPoints[0].x, pathPoints[0].y);
    
    for (let i = 1; i < pathPoints.length; i++) {
      tempCtx.lineTo(pathPoints[i].x, pathPoints[i].y);
    }
    
    tempCtx.stroke();
    
    // Clear the main canvas area where we'll draw
    // We don't want to clear the entire canvas as it would erase previous strokes
    // Instead, get the current image data and draw with the desired opacity
    
    // Draw the temp canvas onto the main canvas with the desired opacity
    ctx.save();
    ctx.globalAlpha = brushOpacity;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
  };  const handleDraw = (e) => {
    // Don't process drawing movements for fill bucket
    if (brushType === 'fill' || !canvasRef.current.isDrawing) return;
    
    const ctx = canvasRef.current.getContext("2d");
    
    // Get current position
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate pressure width
    const baseWidth = brushSize;
    const pressureWidth = usePressure && e.pressure !== undefined && e.pressure !== 0 
      ? baseWidth * Math.max(0.1, e.pressure) 
      : baseWidth;
    
    ctx.lineWidth = pressureWidth;
      
    // Apply different brush behaviors based on type
    switch (brushType) {
      case 'pixel':
        // For discrete brushes, apply color with opacity directly
        const pixelColor = convertHexToRGBA(color, brushOpacity);
        ctx.fillStyle = pixelColor;
        drawPixel(ctx, x, y, pressureWidth);
        break;
        
      case 'splatter':
        // For discrete brushes, apply color with opacity directly
        const splatterColor = convertHexToRGBA(color, brushOpacity);
        ctx.fillStyle = splatterColor;
        // Only draw splatter occasionally for performance
        if (Math.random() > 0.7 || 
            Math.abs(x - lastPos.current.x) > pressureWidth * 2 || 
            Math.abs(y - lastPos.current.y) > pressureWidth * 2) {
          drawSplatter(ctx, x, y, pressureWidth);
        }
        break;
        
      case 'square':
      case 'round':
      default:
        // For continuous brushes, add point to path
        canvasRef.current.currentPath.push({ x, y, width: pressureWidth });
        
        // Restore the backup (original state before this stroke)
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(canvasRef.current.backupCanvas, 0, 0);
          // Draw the continuous path with consistent opacity
        drawSmoothPath(ctx, canvasRef.current.currentPath);
        break;
    }
      
    // Save the last position
    lastPos.current = { x, y };
  };  const handleDrawEnd = () => {
    // Don't process drawing end for fill bucket (already handled in handleDrawStart)
    if (brushType === 'fill' || !canvasRef.current.isDrawing) return;
    
    canvasRef.current.isDrawing = false;
    
    // For continuous brushes, finalize the stroke by committing it to the canvas
    if ((brushType === 'round' || brushType === 'square') && canvasRef.current.currentPath.length > 1) {
      // The stroke is already drawn on the canvas at this point
      // Just make sure it's finalized with the proper opacity
      const ctx = canvasRef.current.getContext("2d");
      
      // We'll keep the last drawn state as our final state
      // No need to redraw here as we've been maintaining the stroke during drawing
    }
    
    // Clean up temporary resources
    canvasRef.current.currentPath = [];
    canvasRef.current.backupCanvas = null;
    
    // Save the drawing to local storage with snapshot for undo/redo
    saveDrawingWithSnapshot(canvasRef.current);
  };
    // Flood fill algorithm (bucket tool)
  const floodFill = (ctx, x, y, fillColor) => {
    // Get the canvas dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    // Get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Convert target coordinates to array index (each pixel is 4 values: R,G,B,A)
    const targetIdx = (y * width + x) * 4;
    
    // Get the color of the target pixel
    const targetColor = {
      r: data[targetIdx],
      g: data[targetIdx + 1],
      b: data[targetIdx + 2],
      a: data[targetIdx + 3]
    };
    
    // Parse the fill color
    let fillColorObj;
    if (fillColor.startsWith('rgba')) {
      // Parse rgba format
      const matches = fillColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (matches) {
        fillColorObj = {
          r: parseInt(matches[1]),
          g: parseInt(matches[2]),
          b: parseInt(matches[3]),
          a: Math.round(parseFloat(matches[4]) * 255)
        };
      }
    } else {
      // Parse hex format
      const hex = fillColor.replace('#', '');
      fillColorObj = {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: 255
      };
    }
    
    // Don't fill if target color is the same as fill color
    if (
      targetColor.r === fillColorObj.r &&
      targetColor.g === fillColorObj.g &&
      targetColor.b === fillColorObj.b &&
      targetColor.a === fillColorObj.a
    ) {
      return;
    }
    
    // Stack for flood fill algorithm
    const stack = [];
    stack.push([x, y]);
    
    // Color similarity tolerance
    const tolerance = 30;
    
    // Check if a pixel's color is similar to the target color
    const isSimilarColor = (idx) => {
      return (
        Math.abs(data[idx] - targetColor.r) <= tolerance &&
        Math.abs(data[idx + 1] - targetColor.g) <= tolerance &&
        Math.abs(data[idx + 2] - targetColor.b) <= tolerance &&
        Math.abs(data[idx + 3] - targetColor.a) <= tolerance
      );
    };
    
    // Process the flood fill
    while (stack.length > 0) {
      const [curX, curY] = stack.pop();
      
      // Skip if outside canvas bounds
      if (curX < 0 || curY < 0 || curX >= width || curY >= height) {
        continue;
      }
      
      const idx = (curY * width + curX) * 4;
      
      // Skip if pixel is not similar to target color or already filled
      if (!isSimilarColor(idx)) {
        continue;
      }
      
      // Fill the pixel
      data[idx] = fillColorObj.r;
      data[idx + 1] = fillColorObj.g;
      data[idx + 2] = fillColorObj.b;
      data[idx + 3] = fillColorObj.a;
      
      // Add neighboring pixels to stack
      stack.push([curX + 1, curY]);
      stack.push([curX - 1, curY]);
      stack.push([curX, curY + 1]);
      stack.push([curX, curY - 1]);
    }
    
    // Put the modified image data back to canvas
    ctx.putImageData(imageData, 0, 0);
  };  return (
    <canvas
      ref={canvasRef}
      width={865}
      height={600}
      className="border-2 border-pink rounded-lg bg-white touch-none"
      onPointerDown={handleDrawStart}
      onPointerMove={handleDraw}
      onPointerUp={handleDrawEnd}
      onPointerLeave={handleDrawEnd}
      style={{ touchAction: 'none' }} // Prevents scrolling while drawing on touch devices
    />
  );
}
