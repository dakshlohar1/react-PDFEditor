/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fabric } from 'fabric';
import { pick } from 'lodash';

import {
  COLOR_TOOLS_DEFAULT_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_STROKE_WIDTH,
  FabricObjectTypes,
} from './constants';

export interface RectTextBoxOptions extends fabric.IGroupOptions {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: '' | 'normal' | 'italic' | 'oblique' | undefined;
  underline?: boolean;
  fontColor?: string;
  textAlign?: string;
  backgroundColor?: string;
  rectStrokeColor?: string;
  rectBackgroundColor?: string;
  rectStrokeWidth?: number;
  opacity?: number;
  width?: number;
  height?: number;
}

fabric.RectTextBox = fabric.util.createClass(fabric.Group, {
  type: FabricObjectTypes.RECT_TEXT,
  initialize(options: RectTextBoxOptions) {
    const {
      // TODO: Create constants for default values
      text = 'Sample',
      fontFamily = DEFAULT_FONT_FAMILY,
      fontSize = DEFAULT_FONT_SIZE,
      fontWeight = 'normal',
      fontStyle = 'normal',
      underline = false,
      fontColor = COLOR_TOOLS_DEFAULT_COLOR,
      textAlign = 'center',
      backgroundColor = 'transparent',
      rectStrokeColor = COLOR_TOOLS_DEFAULT_COLOR,
      rectBackgroundColor = 'transparent',
      rectStrokeWidth = DEFAULT_STROKE_WIDTH,
      width = 200,
      height = 50,
    } = options;

    const groupOptions = pick(options, [
      'selectable',
      'originX',
      'originY',
      'scaleX',
      'scaleY',
      'left',
      'top',
      'width',
      'height',
      'skewX',
      'skewY',
      'angle',
      'opacity',
      'visible',
      'flipX',
      'flipY',
      'globalCompositeOperation',
    ]);

    const textObj = new fabric.IText(text, {
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      underline,
      fill: fontColor,
      textAlign,
      backgroundColor,
      originX: 'center',
      originY: 'center',
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
    });

    const backgroundOptions = {
      fill: rectBackgroundColor,
      stroke: rectStrokeColor,
      strokeWidth: rectStrokeWidth,
      width,
      height,
      originX: 'center',
      originY: 'center',
    };

    const rectObj = new fabric.Rect({
      ...backgroundOptions,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
    });

    textObj.on('editing:exited', () => {
      this.textElement.set({
        selectable: false,
      });
    });

    textObj.on('changed', () => {
      this.handleGroupSize(width, height);
    });

    this.callSuper('initialize', [rectObj, textObj], {
      ...backgroundOptions,
      ...groupOptions,
      objectCaching: false,
    });
    this.on('mousedblclick', this.handleDoubleClick.bind(this));

    this.textElement = textObj;
    this.rectElement = rectObj;
  },

  handleGroupSize(width: number, height: number) {
    const textWidth = this.textElement.getScaledWidth();
    const textHeight = this.textElement.getScaledHeight();
    const rectWidth = this.rectElement.getScaledWidth();
    const rectHeight = this.rectElement.getScaledHeight();

    //NOTE: - if text width is greater than given default width, then update the rect width with the text width
    // i.e. text exceeds the rect width
    if (textWidth > width) {
      this.rectElement.set('width', textWidth);
    } else {
      //NOTE: - if  text width is less than rect width, then update the rect width with the default width
      // i.e. text is less than the rect width(user cleared the text and entered new text)
      if (textWidth < rectWidth) {
        this.rectElement.set('width', width);
      }
    }

    // NOTE: - same as above, but for height
    if (textHeight > height) {
      this.rectElement.set('height', textHeight);
    } else {
      // NOTE: - same as above, but for height
      if (textHeight < rectHeight) {
        this.rectElement.set('height', height);
      }
    }

    // update group width and height
    this.set('width', this.rectElement.getScaledWidth());
    this.set('height', this.rectElement.getScaledHeight());
  },

  handleDoubleClick(fabricEvent: fabric.IEvent<MouseEvent>) {
    if (!this.selectable) return;
    this.textElement.set({
      selectable: true,
      visible: true,
    });
    this.canvas?.setActiveObject(this.textElement);
    this.textElement.enterEditing(fabricEvent.e);
    this.textElement.selectAll();
    this.canvas?.requestRenderAll();
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'text') {
        this.textElement.set('text', value);
      } else if (key === 'fontFamily') {
        this.textElement.set('fontFamily', value);
        this.handleGroupSize(this.get('width'), this.get('height'));
      } else if (key === 'fontSize') {
        this.textElement.set('fontSize', value);
        this.handleGroupSize(this.get('width'), this.get('height'));
      } else if (key === 'fontWeight') {
        this.textElement.set('fontWeight', value);
        this.handleGroupSize(this.get('width'), this.get('height'));
      } else if (key === 'fontStyle') {
        this.textElement.set('fontStyle', value);
      } else if (key === 'underline') {
        this.textElement.set('underline', value);
      } else if (key === 'fontColor') {
        this.textElement.set('fill', value);
      } else if (key === 'textAlign') {
        this.textElement.set('textAlign', value);
      } else if (key === 'backgroundColor') {
        this.textElement.set('backgroundColor', value);
      } else if (key === 'rectStrokeColor') {
        this.rectElement.set('stroke', value);
      } else if (key === 'rectBackgroundColor') {
        this.rectElement.set('fill', value);
      } else if (key === 'rectStrokeWidth') {
        this.rectElement.set('strokeWidth', value);
      } else if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else {
        this.callSuper('set', key, value);
      }
    }

    return this;
  },

  toObject(): RectTextBoxOptions {
    return {
      type: this.get('type'),
      text: this.textElement.text,
      fontFamily: this.textElement.get('fontFamily'),
      fontSize: this.textElement.get('fontSize'),
      fontWeight: this.textElement.get('fontWeight'),
      fontStyle: this.textElement.get('fontStyle'),
      underline: this.textElement.get('underline'),
      fontColor: this.textElement.get('fill'),
      textAlign: this.textElement.get('textAlign'),
      backgroundColor: this.textElement.get('backgroundColor'),
      rectStrokeColor: this.rectElement.get('stroke'),
      rectBackgroundColor: this.rectElement.get('fill'),
      rectStrokeWidth: this.rectElement.get('strokeWidth'),
      opacity: this.get('opacity'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
    };
  },
});

fabric.RectTextBox.fromObject = function (
  object: RectTextBoxOptions,
  callback,
) {
  callback(new fabric.RectTextBox(object));
};

export interface IRectangleOptions extends fabric.IRectOptions {
  strokeColor?: string;
}

fabric.Rectangle = fabric.util.createClass(fabric.Rect, {
  type: FabricObjectTypes.RECT,
  initialize(options: IRectangleOptions) {
    this.callSuper('initialize', options);
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else if (key === 'strokeColor') {
        this.set('stroke', value);
      } else {
        this.callSuper('set', key, value);
      }
    }
    return this;
  },

  toObject(): IRectangleOptions {
    return {
      type: this.get('type'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      strokeColor: this.get('stroke'),
      fill: this.get('fill'),
      opacity: this.get('opacity'),
      strokeWidth: this.get('strokeWidth'),
      centeredRotation: this.get('centeredRotation'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
    };
  },
});

fabric.Rectangle.fromObject = function (
  object: IRectangleOptions,
  callback: (rect: fabric.Rectangle) => void,
) {
  const rect = new fabric.Rectangle({ ...object, stroke: object.strokeColor });
  callback(rect);
  return rect;
};

export interface ISquareOptions extends fabric.IRectOptions {
  strokeColor?: string;
  size?: number;
}

// A square is a rectangle with equal width and height
// so updating the width or height will update the other property
fabric.Square = fabric.util.createClass(fabric.Rectangle, {
  type: FabricObjectTypes.SQUARE,

  initialize: function (options: ISquareOptions) {
    options || (options = {});
    this.callSuper('initialize', options);
    this.set('width', options.size || options.width || 0);
    this.set('height', options.size || options.height || 0);
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else if (key === 'strokeColor') {
        this.set('stroke', value);
      } else if (key === 'width' || key === 'height' || key === 'size') {
        this.callSuper('set', 'width', value);
        this.callSuper('set', 'height', value);
      } else if (key === 'scaleX' || key === 'scaleY') {
        this.callSuper('set', 'scaleX', value);
        this.callSuper('set', 'scaleY', value);
      } else {
        this.callSuper('set', key, value);
      }
    }
    this.setCoords();
    this.canvas?.requestRenderAll();
    return this;
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      size: this.get('width'),
    });
  },
});

fabric.Square.fromObject = function (
  object: ISquareOptions,
  callback: (rect: fabric.Square) => void,
) {
  const square = new fabric.Square({ ...object, stroke: object.strokeColor });
  callback(square);
  return square;
};

export interface IEditorCircleOptions extends fabric.ICircleOptions {
  strokeColor?: string;
}

fabric.EditorCircle = fabric.util.createClass(fabric.Circle, {
  type: FabricObjectTypes.CIRCLE,

  initialize: function (options: IEditorCircleOptions) {
    options || (options = {});
    this.callSuper('initialize', options);
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else if (key === 'strokeColor') {
        this.set('stroke', value);
      } else {
        this.callSuper('set', key, value);
      }
    }
    return this;
  },

  toObject: function () {
    return {
      type: this.get('type'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      strokeColor: this.get('stroke'),
      fill: this.get('fill'),
      opacity: this.get('opacity'),
      strokeWidth: this.get('strokeWidth'),
      centeredRotation: this.get('centeredRotation'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
      radius: this.get('radius'),
      startAngle: this.get('startAngle'),
      endAngle: this.get('endAngle'),
    };
  },
});

fabric.EditorCircle.fromObject = function (
  object: IEditorCircleOptions,
  callback: (rect: fabric.Circle) => void,
) {
  const circle = new fabric.Circle({ ...object, stroke: object.strokeColor });
  callback(circle);
  return circle;
};

export interface IEditorTriangleOptions extends fabric.ITriangleOptions {
  strokeColor?: string;
}

fabric.EditorTriangle = fabric.util.createClass(fabric.Triangle, {
  type: FabricObjectTypes.TRIANGLE,

  initialize: function (options: IEditorTriangleOptions) {
    options || (options = {});
    this.callSuper('initialize', options);
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else if (key === 'strokeColor') {
        this.set('stroke', value);
      } else {
        this.callSuper('set', key, value);
      }
    }
    return this;
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      type: this.get('type'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      strokeColor: this.get('stroke'),
      fill: this.get('fill'),
      opacity: this.get('opacity'),
      strokeWidth: this.get('strokeWidth'),
      centeredRotation: this.get('centeredRotation'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
    });
  },
});

fabric.EditorTriangle.fromObject = function (
  object: IEditorTriangleOptions,
  callback: (rect: fabric.Triangle) => void,
) {
  const triangle = new fabric.Triangle({
    ...object,
    stroke: object.strokeColor,
  });
  callback(triangle);
  return triangle;
};

export interface ICloudOptions extends fabric.IPathOptions {
  strokeColor?: string;
}

fabric.Cloud = fabric.util.createClass(fabric.Path, {
  type: FabricObjectTypes.CLOUD,

  initialize: function (options: ICloudOptions) {
    options || (options = {});
    this.callSuper(
      'initialize',
      // TODO: create constant for cloud path, cause it will be used when we append the cloud as annotation in pdf using annotpdf
      'M21.105 8.056c.01-.138.015-.275.015-.414A6.728 6.728 0 0 0 14.4.922a6.726 6.726 0 0 0-6.148 4.017A3.225 3.225 0 0 0 7.2 4.762a3.36 3.36 0 0 0-3.332 2.992A4.781 4.781 0 0 0 0 12.442c0 2.647 2.153 4.8 4.8 4.8h14.4c2.646 0 4.8-2.153 4.8-4.8 0-1.912-1.15-3.63-2.895-4.386Z',
      options,
    );
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else if (key === 'strokeColor') {
        this.set('stroke', value);
      } else {
        this.callSuper('set', key, value);
      }
    }
    return this;
  },

  toObject: function () {
    return {
      type: this.get('type'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      strokeColor: this.get('stroke'),
      fill: this.get('fill'),
      opacity: this.get('opacity'),
      strokeWidth: this.get('strokeWidth'),
      centeredRotation: this.get('centeredRotation'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
      path: this.get('path'),
    };
  },
});

fabric.Cloud.fromObject = function (
  object: ICloudOptions,
  callback: (rect: fabric.Path) => void,
) {
  const cloud = new fabric.Cloud({ ...object, stroke: object.strokeColor });
  callback(cloud);
  return cloud;
};

export interface IArrowOptions extends fabric.ILineOptions {
  strokeColor?: string;
}

fabric.Arrow = fabric.util.createClass(fabric.Line, {
  type: FabricObjectTypes.ARROW,

  initialize: function (options: IArrowOptions) {
    options || (options = {});
    this.callSuper(
      'initialize',
      [options.x1, options.y1, options.x2, options.y2],
      {
        ...options,
        stroke: options.strokeColor || options.stroke,
      },
    );
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else if (key === 'strokeColor') {
        this.set('stroke', value);
      } else {
        this.callSuper('set', key, value);
      }
    }
    return this;
  },

  _render: function (ctx: CanvasRenderingContext2D) {
    this.callSuper('_render', ctx);

    // do not render if width/height are zeros or object is not visible
    if (this.width === 0 || this.height === 0 || !this.visible) return;

    ctx.save();

    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff);
    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    //move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
    ctx.moveTo(10, 0);
    ctx.lineTo(-20, 15);
    ctx.lineTo(-20, -15);
    ctx.closePath();
    ctx.fillStyle = this.stroke;
    ctx.fill();

    ctx.restore();
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      type: this.get('type'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      strokeColor: this.get('stroke'),
      fill: this.get('fill'),
      opacity: this.get('opacity'),
      strokeWidth: this.get('strokeWidth'),
      centeredRotation: this.get('centeredRotation'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
      x1: this.get('x1'),
      y1: this.get('y1'),
      x2: this.get('x2'),
      y2: this.get('y2'),
    });
  },
});

fabric.Arrow.async = true;

fabric.Arrow.fromObject = function (
  object: IArrowOptions,
  callback: (rect: fabric.Arrow) => void,
) {
  const arrow = new fabric.Arrow({ ...object, stroke: object.strokeColor });
  callback(arrow);
  return arrow;
};

export interface IEditorLineOptions extends fabric.ILineOptions {
  strokeColor?: string;
}

fabric.EditorLine = fabric.util.createClass(fabric.Line, {
  type: FabricObjectTypes.LINE,

  initialize: function (options: IEditorLineOptions) {
    options || (options = {});
    this.callSuper(
      'initialize',
      [options.x1, options.y1, options.x2, options.y2],
      {
        ...options,
        stroke: options.strokeColor || options.stroke,
        hasControls: false,
        hasBorders: false,
      },
    );
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else if (key === 'strokeColor') {
        this.set('stroke', value);
      } else {
        this.callSuper('set', key, value);
      }
    }
    return this;
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      type: this.get('type'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      strokeColor: this.get('stroke'),
      fill: this.get('fill'),
      opacity: this.get('opacity'),
      strokeWidth: this.get('strokeWidth'),
      centeredRotation: this.get('centeredRotation'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
      x1: this.get('x1'),
      y1: this.get('y1'),
      x2: this.get('x2'),
      y2: this.get('y2'),
    });
  },
});

fabric.EditorLine.fromObject = function (
  object: IEditorLineOptions,
  callback: (rect: fabric.Line) => void,
) {
  const line = new fabric.EditorLine({ ...object, stroke: object.strokeColor });
  callback(line);
  return line;
};

export interface IEditorImageOptions extends fabric.IImageOptions {
  strokeColor?: string;
  url: string;
  border?: boolean;
}

fabric.EditorImage = fabric.util.createClass(fabric.Image, {
  type: FabricObjectTypes.IMAGE,

  initialize: function (options: IEditorImageOptions) {
    const shouldShowBorder = options?.border ?? false;
    options || (options = { url: '' });
    this.url = options.url;

    fabric.util.loadImage(options.url, img => {
      this.setElement(img);
      this.setCoords();
      this.canvas?.requestRenderAll();
    });

    const imageOptions = {
      ...options,
      strokeWidth: shouldShowBorder ? options?.strokeWidth || 1 : 0,
      stroke: shouldShowBorder
        ? options?.strokeColor || COLOR_TOOLS_DEFAULT_COLOR
        : COLOR_TOOLS_DEFAULT_COLOR,
    };
    this.lastStrokeWidth = imageOptions?.strokeWidth || 2;
    this.lastBorderColor =
      imageOptions?.strokeColor || COLOR_TOOLS_DEFAULT_COLOR;
    this.border = shouldShowBorder;
    this.callSuper('initialize', null, imageOptions);
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else if (key === 'strokeColor') {
        this.lastBorderColor = value;
        this.set('stroke', value);
      } else if (key === 'url') {
        fabric.util.loadImage(value, img => {
          this.setElement(img);
          this.setCoords();
          this.canvas?.requestRenderAll();
        });
        this.url = value;
      } else if (key === 'border') {
        this.border = value;
        this.callSuper(
          'set',
          'strokeWidth',
          value ? this.lastStrokeWidth || 2 : 0,
        );
      } else if (key === 'strokeWidth') {
        this.lastStrokeWidth = value;
        if (!this.border) {
          return this;
        }

        this.callSuper('set', key, value);
      } else {
        this.callSuper('set', key, value);
      }
    }
    this.canvas?.requestRenderAll();

    return this;
  },

  toObject: function () {
    return {
      type: this.get('type'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      strokeColor: this.get('stroke'),
      fill: this.get('fill'),
      opacity: this.get('opacity'),
      strokeWidth: this.get('strokeWidth'),
      centeredRotation: this.get('centeredRotation'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
      url: this.url,
      border: this.border,
    };
  },
});

fabric.EditorImage.fromObject = function (
  object: IEditorImageOptions,
  callback: (rect: fabric.EditorImage) => void,
) {
  const image = new fabric.EditorImage(object) as fabric.EditorImage;
  callback(image);
  return image;
};

export type ICalloutOptions = RectTextBoxOptions;

// Define a custom Callout class
fabric.Callout = fabric.util.createClass(fabric.Group, {
  type: FabricObjectTypes.CALLOUT,

  initialize: function (options: ICalloutOptions) {
    options || (options = {});

    const {
      // TODO: Create constants for default values
      text = 'Sample',
      fontFamily = DEFAULT_FONT_FAMILY,
      fontSize = DEFAULT_FONT_SIZE,
      fontWeight = 'normal',
      fontStyle = 'normal',
      underline = false,
      fontColor = COLOR_TOOLS_DEFAULT_COLOR,
      textAlign = 'center',
      backgroundColor = 'transparent',
      rectStrokeColor = COLOR_TOOLS_DEFAULT_COLOR,
      rectBackgroundColor = 'transparent',
      rectStrokeWidth = DEFAULT_STROKE_WIDTH,
    } = options;

    const textOptions = {
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      underline,
      fill: fontColor,
      textAlign,
      backgroundColor,
      originX: 'center',
      originY: 'center',
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
      editable: true,
      evented: true,
    };

    const groupOptions = pick(options, [
      'selectable',
      'originX',
      'originY',
      'scaleX',
      'scaleY',
      'left',
      'top',
      'skewX',
      'skewY',
      'angle',
      'opacity',
      'visible',
      'flipX',
      'flipY',
      'globalCompositeOperation',
    ]);

    // Text
    this.textElement = new fabric.IText(text, textOptions);

    const backgroundOptions = {
      fill: rectBackgroundColor,
      stroke: rectStrokeColor,
      strokeWidth: rectStrokeWidth,
      originX: 'center',
      originY: 'center',
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
      width: this.textElement.width + (options.padding || 8),
      height: this.textElement.height + (options.padding || 8), // 8 is padding
    };

    // Rectangle
    this.rectElement = new fabric.Rect(backgroundOptions);

    const arrowOptions = {
      width: 51, // svg width
      height: 28.24, //svg height
      originX: 'left',
      originY: 'top',
      left: -51 - this.rectElement.width / 2 - this.rectElement.strokeWidth,
      top: -28.24,
      fill: 'transparent',
      stroke: rectStrokeColor,
      strokeWidth: rectStrokeWidth,
      selectable: false,
      evented: false,
    };
    // Arrow (using a custom path)
    this.arrow = new fabric.Path(
      'M52 29.2427H26.2029L4.12983 1M4.12983 1L1 15.634M4.12983 1L19.863 2.80254',
      arrowOptions,
    );

    this.on('mousedblclick', this.handleDoubleClick.bind(this));

    // Grouping all parts
    this.callSuper(
      'initialize',
      [this.rectElement, this.textElement, this.arrow],
      {
        objectCaching: false,
        ...groupOptions,
      },
    );
  },

  handleDoubleClick(fabricEvent: fabric.IEvent<MouseEvent>) {
    if (!this.selectable) return;
    this.textElement.set({
      selectable: true,
      visible: true,
    });
    this.canvas?.setActiveObject(this.textElement);
    this.textElement.enterEditing(fabricEvent.e);
    this.textElement.selectAll();
    this.canvas?.requestRenderAll();
  },

  set(key: string | object, value: any) {
    if (typeof key === 'object') {
      Object.entries(key).forEach(([k, v]) => {
        this.set(k, v);
      });
    } else {
      if (key === 'text') {
        this.textElement.set('text', value);
      } else if (key === 'fontFamily') {
        this.textElement.set('fontFamily', value);
        this.handleGroupSize(this.get('width'), this.get('height'));
      } else if (key === 'fontSize') {
        this.textElement.set('fontSize', value);
        this.handleGroupSize(this.get('width'), this.get('height'));
      } else if (key === 'fontWeight') {
        this.textElement.set('fontWeight', value);
        this.handleGroupSize(this.get('width'), this.get('height'));
      } else if (key === 'fontStyle') {
        this.textElement.set('fontStyle', value);
      } else if (key === 'underline') {
        this.textElement.set('underline', value);
      } else if (key === 'fontColor') {
        this.textElement.set('fill', value);
      } else if (key === 'textAlign') {
        this.textElement.set('textAlign', value);
      } else if (key === 'backgroundColor') {
        this.textElement.set('backgroundColor', value);
      } else if (key === 'rectStrokeColor') {
        this.rectElement.set('stroke', value);
        this.arrow.set('stroke', value);
      } else if (key === 'rectBackgroundColor') {
        this.rectElement.set('fill', value);
        this.arrow.set('stroke', value);
      } else if (key === 'rectStrokeWidth') {
        this.rectElement.set('strokeWidth', value);
        this.arrow.set('stroke', value);
      } else if (key === 'clockwise') {
        this.set('angle', this.get('angle') + 90);
      } else if (key === 'anticlockwise') {
        this.set('angle', this.get('angle') - 90);
      } else {
        this.callSuper('set', key, value);
      }
    }

    return this;
  },

  toObject(): ICalloutOptions {
    return {
      type: this.get('type'),
      text: this.textElement.text,
      fontFamily: this.textElement.get('fontFamily'),
      fontSize: this.textElement.get('fontSize'),
      fontWeight: this.textElement.get('fontWeight'),
      fontStyle: this.textElement.get('fontStyle'),
      underline: this.textElement.get('underline'),
      fontColor: this.textElement.get('fill'),
      textAlign: this.textElement.get('textAlign'),
      backgroundColor: this.textElement.get('backgroundColor'),
      rectStrokeColor: this.rectElement.get('stroke'),
      rectBackgroundColor: this.rectElement.get('fill'),
      rectStrokeWidth: this.rectElement.get('strokeWidth'),
      opacity: this.get('opacity'),
      width: this.get('width'),
      height: this.get('height'),
      scaleX: this.get('scaleX'),
      scaleY: this.get('scaleY'),
      left: this.get('left'),
      top: this.get('top'),
      originX: this.get('originX'),
      originY: this.get('originY'),
      skewX: this.get('skewX'),
      skewY: this.get('skewY'),
      angle: this.get('angle'),
      flipX: this.get('flipX'),
      flipY: this.get('flipY'),
      visible: this.get('visible'),
      selectable: this.get('selectable'),
      globalCompositeOperation: this.get('globalCompositeOperation'),
    };
  },
});

fabric.Callout.fromObject = function (object: ICalloutOptions, callback) {
  callback(new fabric.Callout(object));
};

fabric.Arrow = fabric.util.createClass(fabric.Object, {
  type: FabricObjectTypes.ARROW,

  initialize: function (options: any) {
    options = options || {};
    this.callSuper('initialize', options);
    this.set({
      x1: options.x1 || 0,
      y1: options.y1 || 0,
      x2: options.x2 || 0,
      y2: options.y2 || 0,
      headLength: options.headLength || 10,
      headAngle: options.headAngle || 30,
      stroke: options.stroke || 'black',
      strokeWidth: options.strokeWidth || 2,
      objectCaching: false,
    });
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      headLength: this.headLength,
      headAngle: this.headAngle,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
    });
  },

  _render: function (ctx: any) {
    const angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
    const headLength = this.headLength;
    const headAngle = (this.headAngle * Math.PI) / 180;

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x2, this.y2);
    ctx.lineTo(
      this.x2 - headLength * Math.cos(angle - headAngle),
      this.y2 - headLength * Math.sin(angle - headAngle),
    );
    ctx.moveTo(this.x2, this.y2);
    ctx.lineTo(
      this.x2 - headLength * Math.cos(angle + headAngle),
      this.y2 - headLength * Math.sin(angle + headAngle),
    );
    ctx.stroke();
  },
});

fabric.Arrow.fromObject = function (object: any, callback) {
  return fabric.Object._fromObject('Arrow', object, callback);
};
