// App.jsx
import React from "react";
import CanvasArea from "./components/CanvasArea";
import Toolbox from "./components/Toolbox";
import DatePicker from "./components/DatePicker";
import Gallery from "./components/Gallery";
import ExportControls from "./components/ExportControls";
import EntryViewer from "./components/EntryViewer";

export default function App() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎨 Color Memory Diary</h1>
      <DatePicker />
      <Toolbox />
      <CanvasArea />
      <ExportControls />
      <Gallery />
      <EntryViewer />
    </div>
  );
}
