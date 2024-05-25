// src/Canvas.js
import React, { useRef, useState } from "react";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const removeBackground = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const alpha = imgData.data[i + 3];
      if (alpha < 128) {
        imgData.data[i + 3] = 0;
      }
    }
    context.putImageData(imgData, 0, 0);
  };

  const downloadImage = (type) => {
    const canvas = canvasRef.current;

    // Create an off-screen canvas
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = canvas.width;
    offScreenCanvas.height = canvas.height;
    const offScreenContext = offScreenCanvas.getContext("2d");

    // Fill the off-screen canvas with a white background
    offScreenContext.fillStyle = "white";
    offScreenContext.fillRect(
      0,
      0,
      offScreenCanvas.width,
      offScreenCanvas.height
    );

    // Draw the original canvas onto the off-screen canvas
    offScreenContext.drawImage(canvas, 0, 0);

    // Generate the image from the off-screen canvas
    const link = document.createElement("a");
    link.href = offScreenCanvas.toDataURL(`image/${type}`);
    link.download = `signature.${type}`;
    link.click();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        width="500"
        height="300"
        style={{ border: "1px solid black", background: "white" }}
      />
      <div>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={removeBackground}>Remove Background</button>
        <button onClick={() => downloadImage("png")}>Download as PNG</button>
        <button onClick={() => downloadImage("jpeg")}>Download as JPEG</button>
        <button onClick={() => downloadImage("webp")}>Download as WebP</button>
      </div>
    </div>
  );
};

export default Canvas;
