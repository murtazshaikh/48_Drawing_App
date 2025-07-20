import React from "react";
import { Shape } from "../types";

interface StylePanelProps {
  selectedShape: Shape | undefined;
  updateShape: (changes: Partial<Shape>) => void;
}

const StylePanel: React.FC<StylePanelProps> = ({
  selectedShape,
  updateShape,
}) => {
  if (!selectedShape) return null;

  return (
    <div>
      <h4>Style Panel</h4>
      {selectedShape.type !== "line" && (
        <div>
          <label>Fill:</label>
          <input
            type="color"
            value={selectedShape.fill || "#ffffff"}
            onChange={(e) => updateShape({ fill: e.target.value })}
          />
        </div>
      )}
      <div>
        <label>Stroke:</label>
        <input
          type="color"
          value={selectedShape.stroke || "#000000"}
          onChange={(e) => updateShape({ stroke: e.target.value })}
        />
      </div>
      <div>
        <label>Stroke Width:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={selectedShape.strokeWidth || 2}
          onChange={(e) =>
            updateShape({ strokeWidth: parseInt(e.target.value) })
          }
        />
      </div>
    </div>
  );
};

export default StylePanel;
