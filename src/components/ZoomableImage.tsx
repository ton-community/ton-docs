import React from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

function Controls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools">
      <button onClick={() => zoomIn()}>+</button>
      <button onClick={() => zoomOut()}>-</button>
      <button onClick={() => resetTransform()}>×</button>
    </div>
  );
};

export default function ZoomableImage({ src, alt = "SVG" }) {
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
          <TransformComponent>
            <img src={src} alt={alt} style={{ maxWidth: '100%' }} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}
