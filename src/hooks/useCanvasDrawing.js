import React, { createContext, useState } from "react";

export const DiaryContext = createContext();

export function DiaryProvider({ children }) {  const [color, setColor] = useState("#ff69b4");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1); // Value between 0 and 1
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [usePressure, setUsePressure] = useState(false);
  const [brushType, setBrushType] = useState("round"); // Options: round, square, splatter, pixel, fill
  const [isUsingFillBucket, setIsUsingFillBucket] = useState(false); // Toggle for fill bucket tool
  const [undoStack, setUndoStack] = useState([]); // Stack of snapshots for undo
  const [redoStack, setRedoStack] = useState([]); // Stack of snapshots for redo
  const saveDrawing = (canvas) => {
    const data = canvas.toDataURL();
    localStorage.setItem("color-diary-" + currentDate, data);
  };

  // Save drawing with snapshot for undo/redo
  const saveDrawingWithSnapshot = (canvas) => {
    // Take a snapshot first
    addToUndoStack(canvas);
    
    // Then save to localStorage
    saveDrawing(canvas);
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
  };    // Create a snapshot of the current canvas for undo/redo
  const createSnapshot = (canvas) => {
    return canvas.toDataURL();
  };

  // Add current state to undo stack
  const addToUndoStack = (canvas) => {
    setUndoStack(prevStack => {
      const snapshot = createSnapshot(canvas);
      return [...prevStack, snapshot];
    });
    // Clear redo stack when a new action is performed
    setRedoStack([]);
  };

  // Undo the last action
  const undo = (canvas) => {
    if (undoStack.length === 0) return;
    
    const ctx = canvas.getContext("2d");
    
    // Save current state to redo stack before undoing
    setRedoStack(prevStack => {
      const currentSnapshot = createSnapshot(canvas);
      return [...prevStack, currentSnapshot];
    });
    
    // Pop the last state from undo stack
    setUndoStack(prevStack => {
      const newStack = [...prevStack];
      // eslint-disable-next-line
      const previousSnapshot = newStack.pop();
      
      // If this was the last item, we're at the initial state
      if (newStack.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        // Load the previous state
        const previousState = newStack[newStack.length - 1];
        const img = new Image();
        img.src = previousState;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
      }
      
      return newStack;
    });
  };

  // Redo the last undone action
  const redo = (canvas) => {
    if (redoStack.length === 0) return;
    
    const ctx = canvas.getContext("2d");
    
    // Pop the last state from redo stack
    setRedoStack(prevStack => {
      const newStack = [...prevStack];
      const nextSnapshot = newStack.pop();
      
      // Add current state to undo stack
      setUndoStack(prevUndoStack => {
        const currentSnapshot = createSnapshot(canvas);
        return [...prevUndoStack, currentSnapshot];
      });
      
      // Load the next state
      const img = new Image();
      img.src = nextSnapshot;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      
      return newStack;
    });
  };
  
  return (
    <DiaryContext.Provider
      value={{
        color,
        setColor,
        brushSize,
        setBrushSize,
        brushOpacity,
        setBrushOpacity,
        currentDate,
        setCurrentDate,
        usePressure,
        setUsePressure,
        brushType,
        setBrushType,        isUsingFillBucket,
        setIsUsingFillBucket,
        saveDrawing,
        saveDrawingWithSnapshot,
        loadDrawing,
        clearDrawing,
        getAllEntries,
        exportCurrentDrawing,
        undo,
        redo,
        undoStack,
        redoStack
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
}