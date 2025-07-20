import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Transformer } from "react-konva";
import Konva from "konva";
import "./App.css";

import Toolbar from "./components/Toolbar";
import StylePanel from "./components/StylePanel";
import { Shape, ShapeType } from "./types";

const App: React.FC = () => {
  const [tool, setTool] = useState<ShapeType>("none");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [drawingShape, setDrawingShape] = useState<Shape | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [clickedOnShape, setClickedOnShape] = useState(false);

  const selectedShapeRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (transformerRef.current && selectedShapeRef.current) {
      transformerRef.current.nodes([selectedShapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  useEffect(() => {
    const saved = localStorage.getItem("drawingData");
    if (saved) {
      setShapes(JSON.parse(saved));
    }
  }, []);

  const handleMouseDown = (e: any) => {
    if (clickedOnShape) {
      setClickedOnShape(false);
      return;
    }

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer || tool === "none") return;

    setSelectedId(null);
    setStartPos({ x: pointer.x, y: pointer.y });
    setIsDrawing(true);

    if (tool === "line") {
      setDrawingShape({
        id: "temp",
        type: "line",
        points: [pointer.x, pointer.y, pointer.x, pointer.y],
        stroke: "black",
        strokeWidth: 2,
      });
    } else if (tool === "rectangle") {
      setDrawingShape({
        id: "temp",
        type: "rectangle",
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        fill: "lightblue",
        stroke: "black",
        strokeWidth: 2,
      });
    } else if (tool === "circle") {
      setDrawingShape({
        id: "temp",
        type: "circle",
        x: pointer.x,
        y: pointer.y,
        radius: 0,
        fill: "lightblue",
        stroke: "black",
        strokeWidth: 2,
      });
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !drawingShape) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    if (drawingShape.type === "line") {
      setDrawingShape({
        ...drawingShape,
        points: [startPos.x, startPos.y, pointer.x, pointer.y],
      });
    } else if (drawingShape.type === "rectangle") {
      setDrawingShape({
        ...drawingShape,
        x: startPos.x,
        y: startPos.y,
        width: pointer.x - startPos.x,
        height: pointer.y - startPos.y,
      });
    } else if (drawingShape.type === "circle") {
      const dx = pointer.x - startPos.x;
      const dy = pointer.y - startPos.y;
      const radius = Math.sqrt(dx * dx + dy * dy) / 2;
      setDrawingShape({
        ...drawingShape,
        x: startPos.x + dx / 2,
        y: startPos.y + dy / 2,
        radius,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !drawingShape) return;
    const newShape = {
      ...drawingShape,
      id: `shape-${shapes.length + 1}`,
    };
    setShapes([...shapes, newShape]);
    setIsDrawing(false);
    setDrawingShape(null);
  };

  const updateSelectedShape = (changes: Partial<Shape>) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === selectedId ? { ...shape, ...changes } : shape
      )
    );
  };

  const deleteSelectedShape = () => {
    if (selectedId) {
      setShapes((prev) => prev.filter((shape) => shape.id !== selectedId));
      setSelectedId(null);
    }
  };

  const clearAll = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all shapes?");
    if (confirmClear) {
      setShapes([]);
      setSelectedId(null);
      localStorage.removeItem("drawingData");
    }
  };

  const saveDrawing = () => {
    const json = JSON.stringify(shapes);
    localStorage.setItem("drawingData", json);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "drawing.json";
    link.href = url;
    link.click();
  };

  const renderShape = (shape: Shape) => {
    const isSelected = shape.id === selectedId;
    const commonProps = {
      ...shape,
      ref: isSelected ? selectedShapeRef : null,
      onClick: (e: any) => {
        setClickedOnShape(true);
        setSelectedId(shape.id);
        e.cancelBubble = true;
      },
      draggable: true,
      onDragEnd: (e: any) => {
        const { x, y } = e.target.position();
        updateSelectedShape({ x, y });
      },
      shadowForStrokeEnabled: false,
      shadowColor: isSelected ? "blue" : undefined,
      shadowBlur: isSelected ? 10 : 0,
    };

    switch (shape.type) {
      case "rectangle":
        return (
          <Rect
            key={shape.id}
            {...commonProps}
            onTransformEnd={(e) => {
              const node = e.target;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              node.scaleX(1);
              node.scaleY(1);
              updateSelectedShape({
                x: node.x(),
                y: node.y(),
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(5, node.height() * scaleY),
              });
            }}
          />
        );
      case "circle":
        return (
          <Circle
            key={shape.id}
            {...commonProps}
            onTransformEnd={(e) => {
              const node = e.target as Konva.Circle;
              const scale = node.scaleX();
              node.scaleX(1);
              node.scaleY(1);
              updateSelectedShape({
                x: node.x(),
                y: node.y(),
                radius: Math.max(5, node.radius() * scale),
              });
            }}
          />
        );
      case "line":
        return <Line key={shape.id} {...commonProps} />;
      default:
        return null;
    }
  };

  const selectedShape = shapes.find((s) => s.id === selectedId);

  return (
    <div className="app-container">
      <div className="sidebar">
        <Toolbar
          tool={tool}
          setTool={setTool}
          deleteSelectedShape={deleteSelectedShape}
          saveDrawing={saveDrawing}
          clearAll={clearAll}
          selectedId={selectedId}
        />
        <StylePanel
          selectedShape={selectedShape}
          updateShape={updateSelectedShape}
        />
      </div>

      <Stage
        width={window.innerWidth - 250}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          if (!isDrawing) setSelectedId(null);
        }}
        style={{ background: "#f9f9f9" }}
      >
        <Layer>
          {shapes.map((shape) => renderShape(shape))}
          {drawingShape && renderShape(drawingShape)}
          {selectedId && (
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
