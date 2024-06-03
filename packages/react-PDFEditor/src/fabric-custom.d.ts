import * as fabric from 'fabric';
import {
  RectTextBoxOptions,
  IRectangleOptions,
  ISquareOptions,
  IEditorCircleOptions,
  ICloudOptions,
  IArrowOptions,
  IEditorLineOptions,
  ICalloutOptions,
  IEditorImageOptions,
} from './fabric-objects';

declare module 'fabric' {
  namespace fabric {
    class RectTextBox extends fabric.Group {
      constructor(options: RectTextBoxOptions);
    }

    class Rectangle extends fabric.Rect {
      constructor(options: IRectangleOptions);

      static fromObject(
        object: IRectangleOptions,
        callback: (rect: fabric.Rectangle) => void,
      ): void;
    }

    class Square extends fabric.Rect {
      constructor(options: ISquareOptions);

      static fromObject(
        object: ISquareOptions,
        callback: (rect: fabric.Square) => void,
      ): void;
    }

    class EditorCircle extends fabric.Circle {
      constructor(options: IEditorCircleOptions);

      static fromObject(
        object: IEditorCircleOptions,
        callback: (rect: fabric.EditorCircle) => void,
      ): void;
    }

    class EditorTriangle extends fabric.Triangle {
      constructor(options: IEditorTriangleOptions);

      static fromObject(
        object: ITriangleOptions,
        callback: (rect: fabric.EditorTriangle) => void,
      ): void;
    }

    class Cloud extends fabric.Path {
      constructor(options: ICloudOptions);

      static fromObject(
        object: ICloudOptions,
        callback: (rect: fabric.Cloud) => void,
      ): void;
    }

    class Arrow extends fabric.Line {
      constructor(options: IArrowOptions);

      static fromObject(
        object: IArrowOptions,
        callback: (rect: fabric.Arrow) => void,
      ): void;

      static async: boolean;
    }

    class EditorLine extends fabric.Line {
      constructor(options: IEditorLineOptions);

      static fromObject(
        object: IEditorLineOptions,
        callback: (rect: fabric.EditorLine) => void,
      ): void;
    }

    class EditorImage extends fabric.RectTextBox {
      constructor(options: IEditorImageOptions);

      static fromObject(
        object: IEditorImageOptions,
        callback: (rect: fabric.EditorImage) => void,
      ): void;

      static fromURL(
        url: string,
        callback: (image: fabric.EditorImage) => void,
      ): void;
    }

    class Callout extends fabric.RectTextBox {
      constructor(options: ICalloutOptions);

      static fromObject(
        object: ICalloutOptions,
        callback: (rect: fabric.Callout) => void,
      ): void;
    }
  }
}
