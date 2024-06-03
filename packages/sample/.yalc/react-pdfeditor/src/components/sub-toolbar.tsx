import { Box, Divider, Flex } from '@chakra-ui/react';

import { Action, SUB_TOOLBAR_HEIGHT, Z_INDEX } from '../constants';
import { usePDFEditorContext } from '../editor-provider';

export type SubToolbarProps = {
  currentAction: Action | undefined;
};

export const SubToolbar = ({ currentAction }: SubToolbarProps) => {
  const { subToolbarItems } = usePDFEditorContext();
  return (
    <>
      <Flex
        zIndex={Z_INDEX.SUB_TOOLBAR}
        alignItems='center'
        align='center'
        h={`${SUB_TOOLBAR_HEIGHT}px`}
        width='100%'
        overflowX='auto'
        overflowY='hidden'
        bg='whitesmoke'
        transition='opacity 0.3s ease-in-out'
        visibility={currentAction ? 'visible' : 'hidden'}
        opacity={currentAction ? 1 : 0}
      >
        <Box flex='1' />
        <Flex h='100%' color='blackAlpha.700'>
          {subToolbarItems?.map((item, index) => {
            // Step 2: Check the isDisabled property
            let isDisabled = item.isDisabled || false;
            // Step 3: If isDisabled is a function, call it
            if (typeof isDisabled === 'function') {
              isDisabled = isDisabled();
            }
            // Render the UI component for the sub toolbar item
            // Step 4: Use the isDisabled value to disable the sub toolbar item
            return (
              <item.UIComponent
                key={index}
                defaultValues={item.defaultValues}
                onChangeEvent={item.onChangeEvent}
                tooltip={item.tooltip}
                isDisabled={isDisabled}
                valueAccessor={item.valueAccessor}
                valueClipper={item.valueClipper}
              />
            );
          })}
        </Flex>
        <Box flex='1' />
      </Flex>
      <Divider />
    </>
  );
};
