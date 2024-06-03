import { Icon, useUpdateEffect } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

import { Action } from '../../constants';
import { usePDFEditorContext } from '../../editor-provider';
import { useGroupRadioActions } from '../../hooks';
import { SubToolBarButtonProps, onChangeEventNameProps } from '../../types';
import { SubToolBarButtonContainer } from '../containers';
import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '../icons/pdf-editor-icons';
import { SubToolbarItemTooltip } from '../tooltips';

export type TextAlignmentToolProps = SubToolBarButtonProps & {
  defaultValues: {
    textAlign: 'left' | 'right' | 'center';
  };
} & onChangeEventNameProps;

export const TextAlignmentTool: FunctionComponent<TextAlignmentToolProps> = ({
  isDisabled,
  onChangeEvent,
  defaultValues,
  tooltip,
  valueAccessor
}) => {
  const accessor = valueAccessor || 'textAlign';
  const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;
  const { actions, select, watchGroup } = useGroupRadioActions([
    {
      action: 'left',
      group: 'text-alignment',
      icon: TextAlignLeftIcon,
      isSelected: true,
      isDisabled: disabled,
    },
    {
      action: 'center',
      group: 'text-alignment',
      icon: TextAlignCenterIcon,
      isSelected: false,
      isDisabled: disabled,
    },
    {
      action: 'right',
      group: 'text-alignment',
      icon: TextAlignRightIcon,
      isSelected: false,
      isDisabled: disabled,
    },
  ]);
  const { eventBus } = usePDFEditorContext();

  const currentAction = watchGroup('text-alignment');

  const handleClick = (action: string) => {
    select('text-alignment', action);
    eventBus.dispatch(onChangeEvent, { [accessor]: action });
  };

  useUpdateEffect(() => {
    if (defaultValues?.[accessor] !== undefined) {
      select('text-alignment', defaultValues?.[accessor] as string);
    }
  }, [defaultValues?.[accessor]]);

  /**
   * if defaultValues.checked is not explicitly defined by developer
   * than fillOpacity will always be one
   * and onClick will not update the fillOpacity ever,
   * if defaultValues.checked is defined by developer
   * then fillOpacity will be updated on click
   */
  const getFillOpacity = (action: Action) => {
    return defaultValues?.textAlign !== undefined
      ? currentAction?.action === action.action
        ? 1
        : 0.6
      : 1;
  };

  return (
    <SubToolBarButtonContainer isDisabled={disabled} p='0'>
      {actions.map(action => (
        <SubToolbarItemTooltip
          key={action.action}
          tooltip={`${tooltip} ${action.action}`}
          disabled={disabled}
        >
          <SubToolBarButtonContainer
            onClick={() => handleClick(action.action)}
            isDisabled={disabled}
            shouldApplyStyles
          >
            <Icon as={action.icon} strokeOpacity={getFillOpacity(action)} />
          </SubToolBarButtonContainer>
        </SubToolbarItemTooltip>
      ))}
    </SubToolBarButtonContainer>
  );
};
