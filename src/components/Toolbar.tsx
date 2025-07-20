import React from "react";
import { ShapeType } from "../types";

export interface ToolbarProps {
  tool: ShapeType;
  setTool: React.Dispatch<React.SetStateAction<ShapeType>>;
  deleteSelectedShape: () => void;
  saveDrawing: () => void;
  clearAll: () => void;
  selectedId: string | null;
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  deleteSelectedShape,
  saveDrawing,
  clearAll,
  selectedId,
}) => {
  return (
    <div className="toolbar">
      <h4>Tools</h4>
      <button
        className={`tool-button ${tool === "rectangle" ? "active" : ""}`}
        onClick={() => setTool("rectangle")}
      >
        🟥 Rectangle
      </button>
      <button
        className={`tool-button ${tool === "circle" ? "active" : ""}`}
        onClick={() => setTool("circle")}
      >
        ⚪ Circle
      </button>
      <button
        className={`tool-button ${tool === "line" ? "active" : ""}`}
        onClick={() => setTool("line")}
      >
        ➖ Line
      </button>

      <button
        className="tool-button"
        onClick={deleteSelectedShape}
        disabled={!selectedId}
        style={{
          cursor: selectedId ? "pointer" : "not-allowed",
        }}
      >
        🗑️ Erase
      </button>

      <button className="tool-button" onClick={saveDrawing}>
        💾 Save
      </button>

      <button className="tool-button" onClick={clearAll}>
        🧹 Clear All
      </button>
    </div>
  );
};

export default Toolbar;
