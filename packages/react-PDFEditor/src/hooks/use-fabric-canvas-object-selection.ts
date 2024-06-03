import { useCallback, useEffect } from 'react';
import {
  FabricObjectTypes,
  PRIMARY_TOOL_FABRIC_OBJECT_MAPPING,
} from '../constants';
import { usePDFEditorContext } from '../editor-provider';

export type UseFabricCanvasObjectSelectionOption = Record<string, never>;

export const useFabricCanvasObjectSelection = (
  opt?: UseFabricCanvasObjectSelectionOption,
) => {
  const {
    fabricCanvas,
    toolbarStates: { deselect, select },
    setIsDrawing,
  } = usePDFEditorContext();

  const handleSelection = useCallback((e: fabric.IEvent<Event>) => {
    const selectedObjects = fabricCanvas?.getActiveObjects();
    // When a single object is selected, select the annotation tool based on the object's type
    const shouldSelectMarkupTool = selectedObjects?.length === 1;
    if (shouldSelectMarkupTool) {
      const selectedObject = selectedObjects[0];
      const toolbarType =
        PRIMARY_TOOL_FABRIC_OBJECT_MAPPING[
          selectedObject.type as FabricObjectTypes
        ];
      select('annotations', toolbarType);
      //TODO: - Uncomment the code
      //   setSelectedObject(selectedObject);
    } else {
      // When multiple objects are selected, deselect the annotation tool
      deselect('annotations');
      //TODO: - Uncomment the code
      //   setSelectedObject(null);
    }
    // When ever a selection is made, disable the drawing mode
    // because the user can't draw when an object is selected
    // or they wants to stop drawing
    setIsDrawing(false);
  }, []);

  // Effect for handling the selection events on the fabric canvas
  useEffect(() => {
    // Add event listeners
    fabricCanvas?.on('selection:created', handleSelection);
    fabricCanvas?.on('selection:updated', handleSelection);
    fabricCanvas?.on('selection:cleared', handleSelection);

    // Clean up event listeners when component unmounts
    return () => {
      fabricCanvas?.off('selection:created', handleSelection);
      fabricCanvas?.off('selection:updated', handleSelection);
      fabricCanvas?.off('selection:cleared', handleSelection);
    };
  }, [fabricCanvas, handleSelection]);
};
