import { useEffect, useRef, useCallback } from 'react';

export type FabricObjectOutsidePreventer = (opt: {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
  scale: number;
}) => void;

type ScalingProperties = {
  left: number;
  top: number;
  scaleX?: number;
  scaleY?: number;
  scale: number;
} | null;

/**
 * TODO: FIX THIS HOOK NOT WORKING IN CASE OF SCALING OTHER THAN 1
 *
 */
export const useFabricObjectOutsidePreventer: FabricObjectOutsidePreventer = ({
  fabricCanvasRef,
  scale: canvasScale,
}) => {
  const scalingProperties = useRef<ScalingProperties>({
    left: 0,
    top: 0,
    scaleX: 0,
    scaleY: 0,
    scale: canvasScale,
  });

  const _setScalingProperties = useCallback(
    (left: number, top: number, scale: number) => {
      if (
        scalingProperties == null ||
        (scalingProperties.current?.['scale'] as any) > scale
      ) {
        scalingProperties.current = {
          left: left,
          top: top,
          scale: scale,
        };
      }
    },
    [canvasScale],
  );

  /**
   * Prevent object from scaling outside canvas
   * @link https://stackoverflow.com/a/46418688/19635757
   *
   * @param e Fabric Event
   */
  const scaling = useCallback(
    (e: any) => {
      const obj = e.target;
      const brOld = obj.getBoundingRect();
      obj.setCoords();
      const brNew = obj.getBoundingRect();

      // left border
      // 1. compute the scale that sets obj.left equal 0
      // 2. compute height if the same scale is applied to Y (we do not allow non-uniform scaling)
      // 3. compute obj.top based on new height
      if (brOld.left >= 0 && brNew.left < 0) {
        const scale = (brOld.width + brOld.left) / obj.width;
        const height = obj.height * scale;
        const top =
          ((brNew.top - brOld.top) / (brNew.height - brOld.height)) *
            (height - brOld.height) +
          brOld.top;
        _setScalingProperties(0, top, scale);
      }

      // top border
      if (brOld.top >= 0 && brNew.top < 0) {
        const scale = (brOld.height + brOld.top) / obj.height;
        const width = obj.width * scale;
        const left =
          ((brNew.left - brOld.left) / (brNew.width - brOld.width)) *
            (width - brOld.width) +
          brOld.left;
        _setScalingProperties(left, 0, scale);
      }

      // right border
      if (
        brOld.left + brOld.width <= obj.canvas.width &&
        brNew.left + brNew.width > obj.canvas.width
      ) {
        const scale = (obj.canvas.width - brOld.left) / obj.width;
        const height = obj.height * scale;
        const top =
          ((brNew.top - brOld.top) / (brNew.height - brOld.height)) *
            (height - brOld.height) +
          brOld.top;
        _setScalingProperties(brNew.left, top, scale);
      }

      // bottom border
      if (
        brOld.top + brOld.height <= obj.canvas.height &&
        brNew.top + brNew.height > obj.canvas.height
      ) {
        const scale = (obj.canvas.height - brOld.top) / obj.height;
        const width = obj.width * scale;
        const left =
          ((brNew.left - brOld.left) / (brNew.width - brOld.width)) *
            (width - brOld.width) +
          brOld.left;
        _setScalingProperties(left, brNew.top, scale);
      }

      if (
        brNew.left < 0 ||
        brNew.top < 0 ||
        brNew.left + brNew.width > obj.canvas.width ||
        brNew.top + brNew.height > obj.canvas.height
      ) {
        obj.left = scalingProperties.current?.['left'];
        obj.top = scalingProperties.current?.['top'];
        obj.scaleX = scalingProperties.current?.['scale'];
        obj.scaleY = scalingProperties.current?.['scale'];
        obj.setCoords();
      } else {
        scalingProperties.current = null;
      }
    },
    [canvasScale],
  );

  /**
   * Prevent object from moving/rotating outside canvas
   * @link https://stackoverflow.com/a/24238960/19635757
   *
   * @param e Fabric event
   * @returns
   */
  const movingRotatingWithinBounds = useCallback(
    (e: any) => {
      const obj = e.target;
      // If object is too big, ignore
      if (obj.height > obj.canvas.height || obj.width > obj.canvas.width) {
        return;
      }
      obj.setCoords();
      const boundingRect = obj.getBoundingRect();

      // Top-left corner
      if (boundingRect.top < 0 || boundingRect.left < 0) {
        obj.set({
          top: Math.max(obj.top, obj.top - boundingRect.top),
          left: Math.max(obj.left, obj.left - boundingRect.left),
        });
      }

      // Bottom-right corner
      if (
        boundingRect.top + boundingRect.height > obj.canvas.height ||
        boundingRect.left + boundingRect.width > obj.canvas.width
      ) {
        obj.set({
          top: Math.min(
            obj.top,
            obj.canvas.height -
              boundingRect.height +
              obj.top -
              boundingRect.top,
          ),
          left: Math.min(
            obj.left,
            obj.canvas.width -
              boundingRect.width +
              obj.left -
              boundingRect.left,
          ),
        });
      }

      obj.setCoords();
    },
    [canvasScale],
  );

  useEffect(() => {
    fabricCanvasRef.current?.on('object:moving', movingRotatingWithinBounds);
    fabricCanvasRef.current?.on('object:scaling', scaling);
    fabricCanvasRef.current?.on('object:rotating', movingRotatingWithinBounds);

    return () => {
      fabricCanvasRef.current?.off('object:moving', movingRotatingWithinBounds);
      fabricCanvasRef.current?.off('object:scaling', scaling);
      fabricCanvasRef.current?.off(
        'object:rotating',
        movingRotatingWithinBounds,
      );
    };
  }, [fabricCanvasRef, canvasScale, movingRotatingWithinBounds, scaling]);
};
