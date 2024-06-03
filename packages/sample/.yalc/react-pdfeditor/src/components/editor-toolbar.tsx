import { Box, Divider, Flex } from '@chakra-ui/react';
import { map } from 'lodash';
import { FC } from 'react';

import {
  ActionGroup,
  Actions,
  TOOLBAR_HEIGHT,
  Z_INDEX,
  PRIMARY_TOOL_FABRIC_OBJECT_MAPPING,
  FabricObjectTypes,
} from '../constants';
import { usePDFEditorContext } from '../editor-provider';
import { PDFEditorToolbarButton } from './editor-toolbar-button';
import { SubToolbar } from './sub-toolbar';

export type EditorToolbarProps = {
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
};

export const EditorToolbar: FC<EditorToolbarProps> = ({
  leftComponent,
  rightComponent,
}) => {
  const {
    toolbarStates: { select, watchGroup, actions },
    setIsDrawing,
    fabricCanvas,
  } = usePDFEditorContext();
  // This function is called when an action button in the toolbar is clicked
  const onActionClick = (group: ActionGroup, action: Actions) => {
    // Get the currently active fabric object on the canvas
    const fabricActiveObject = fabricCanvas?.getActiveObject();
    // Check if the fabric object has a type and if it is different from the clicked action
    if (
      fabricActiveObject?.type &&
      PRIMARY_TOOL_FABRIC_OBJECT_MAPPING[
        fabricActiveObject.type as FabricObjectTypes
      ] !== action
    ) {
      // If the fabric object type is different, discard the active object and re-render the canvas
      fabricCanvas?.discardActiveObject();
      fabricCanvas?.renderAll();
    }
    // Select the specified group and action in the toolbar
    select(group, action);
    // If the action is not 'Hand', 'Text Selection' or 'Selection' tool, then enable the drawing mode
    if (
      action !== 'Hand' &&
      action !== 'Select Text' &&
      action !== 'Select Markup'
    ) {
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
    }
  };

  const currentAction = watchGroup('annotations');
  return (
    <Box w='100%' bg='white' pos='relative'>
      <Flex
        h={`${TOOLBAR_HEIGHT}px`}
        align='center'
        w='100%'
        overflowX='auto'
        zIndex={Z_INDEX.TOOLBAR}
      >
        <Box flex='1'>
          {/* Developer-provided component 1 */}
          {leftComponent}
        </Box>
        <Flex h='100%'>
          {/* Centered component */}
          {map(actions, ({ action, icon, isDisabled, isSelected, group }) => (
            <PDFEditorToolbarButton
              key={action}
              value={action}
              onClick={() =>
                onActionClick(group as ActionGroup, action as Actions)
              }
              icon={icon}
              isDisabled={isDisabled}
              isSelected={isSelected}
            />
          ))}
        </Flex>
        <Box flex='1'>
          {/* Developer-provided component 2 */}
          {rightComponent}
        </Box>
      </Flex>
      <Divider />
      <SubToolbar currentAction={currentAction} />
    </Box>
  );
};
