import { useCallback, useEffect } from 'react';

import {usePDFEditorContext} from '../editor-provider';

export type UseHandleObjectDeleteOptions = {
  /**
   * Callback function called before object deletion
   */
  onBeforeObjectDelete?: (object: fabric.Object) => void;
};

/**
 * Hook to handle object deletion using the Delete key
 * @param opt {UseHandleObjectDeleteOptions}
 */
export const useHandleObjectDelete = (opt?: UseHandleObjectDeleteOptions) => {
// eslint-disable-next-line @typescript-eslint/no-empty-function
const { onBeforeObjectDelete = () => {} } = opt || {};

  const { fabricCanvas,isFabricInitialized } = usePDFEditorContext()
  const handler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        const activeObject = fabricCanvas?.getActiveObject();
        if (activeObject) {

            onBeforeObjectDelete(activeObject);
          
          if (activeObject.type === 'activeSelection') {
            // If it's a group, iterate through all objects and remove them
            (activeObject as fabric.ActiveSelection).forEachObject(
              (object: fabric.Object) => fabricCanvas?.remove(object),
            );
          } else {
            // If it's a single object, remove it
            fabricCanvas?.remove(activeObject);
          }
          fabricCanvas?.discardActiveObject(); // Deselect objects
          fabricCanvas?.requestRenderAll(); // Re-render canvas
        }
      }
    },
    [fabricCanvas, onBeforeObjectDelete],
  );

  useEffect(() => {
    if (isFabricInitialized) {
      document.addEventListener('keydown', handler);
      return () => {
        document.removeEventListener('keydown', handler);
      };
    }
    return;
  }, [isFabricInitialized, handler]);
};
