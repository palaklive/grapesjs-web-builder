import { useState, useRef, useEffect, ReactNode } from "react";
import "./ResizablePanel.css";

interface ResizablePanelProps {
  children: ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  position?: "left" | "right";
}

export function ResizablePanel({
  children,
  minWidth = 200,
  maxWidth = 600,
  defaultWidth = 340,
  position = "right",
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = panelRef.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      let newWidth: number;

      if (position === "right") {
        newWidth = containerRect.right - e.clientX;
      } else {
        newWidth = e.clientX - containerRect.left;
      }

      // Clamp width between min and max
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, position]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <div
      ref={panelRef}
      className={`resizable-panel resizable-panel-${position}`}
      style={{ width: `${width}px` }}
    >
      <div
        className={`resize-handle resize-handle-${position}`}
        onMouseDown={handleMouseDown}
        aria-label="Resize panel"
      >
        <div className="resize-handle-bar" />
      </div>
      <div className="resizable-panel-content">{children}</div>
    </div>
  );
}

