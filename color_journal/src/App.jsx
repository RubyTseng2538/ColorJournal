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
      <header className="bg-deepMaroon text-lightPink py-4 px-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold">Color Journal</h1>
        <p className="text-pink text-sm mt-1">Express your emotions through color</p>
      </header>
      <DatePicker />
      <Toolbox />
      <CanvasArea />
      <ExportControls />
      <Gallery />
      <EntryViewer />
    </div>
  );
}
