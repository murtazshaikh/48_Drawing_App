export type ShapeType = "rectangle" | "circle" | "line" | "none";

export interface Shape {
  id: string;
  type: ShapeType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dash?: number[];
}