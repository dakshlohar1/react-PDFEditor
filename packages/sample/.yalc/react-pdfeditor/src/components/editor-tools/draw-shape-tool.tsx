import { Icon, useUpdateEffect } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

import { Action, FabricObjectTypes } from '../../constants';
import { usePDFEditorContext } from '../../editor-provider';
import { useGroupRadioActions } from '../../hooks';
import { onChangeEventNameProps, SubToolBarButtonProps } from '../../types';
import { SubToolBarButtonContainer } from '../containers';
import {
  ArrowToolIcon,
  CircleIcon,
  LineIcon,
  RectangleIcon,
  SquareIcon,
  TriangleIcon,
} from '../icons/pdf-editor-icons';
import { SubToolbarItemTooltip } from '../tooltips';

export type DrawShapeToolProps = SubToolBarButtonProps & {
  defaultValues: {
    shape: FabricObjectTypes;
  };
} & onChangeEventNameProps;

export const DrawShapeTool: FunctionComponent<DrawShapeToolProps> = ({
  isDisabled,
  onChangeEvent,
  defaultValues,
  tooltip,
  valueAccessor,
}) => {
  const accessor = valueAccessor || 'shape';
  const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;
  const { actions, select, deselect } = useGroupRadioActions([
    {
      icon: props => <SquareIcon boxSize='20px' {...props} />,
      action: FabricObjectTypes.SQUARE,
      group: 'shape',
      isSelected: false,
      isDisabled: disabled,
      label: 'Square',
    },
    {
      icon: props => <RectangleIcon boxSize='20px' {...props} />,
      action: FabricObjectTypes.RECT,
      group: 'shape',
      isSelected: false,
      isDisabled: disabled,
      label: 'Rectangle',
    },
    {
      icon: props => <CircleIcon boxSize='20px' {...props} />,
      action: FabricObjectTypes.CIRCLE,
      group: 'shape',
      isSelected: false,
      isDisabled: disabled,
      label: 'Circle',
    },
    {
      icon: props => <TriangleIcon boxSize='20px' {...props} />,
      action: FabricObjectTypes.TRIANGLE,
      group: 'shape',
      isSelected: false,
      isDisabled: disabled,
      label: 'Triangle',
    },
    {
      icon: props => <ArrowToolIcon boxSize='20px' {...props} />,
      isSelected: false,
      isDisabled: disabled,
      action: FabricObjectTypes.ARROW,
      group: 'shape',
      label: 'Arrow',
    },
    {
      icon: props => <LineIcon boxSize='20px' {...props} />,
      group: 'shape',
      isSelected: false,
      isDisabled: disabled,
      action: FabricObjectTypes.LINE,
      label: 'Line',
    },
  ]);
  const { eventBus } = usePDFEditorContext();

  const { setCurrentShape } = usePDFEditorContext();

  const handleClick = (action: FabricObjectTypes) => {
    select('shape', action);
    setCurrentShape(action);
    eventBus.dispatch(onChangeEvent, { [accessor]: action });
  };

  useUpdateEffect(() => {
    if (defaultValues?.[accessor] !== undefined) {
      select('shape', defaultValues?.[accessor] as FabricObjectTypes);
    }

    return () => {
      deselect('shape');
      setCurrentShape(undefined);
    };
  }, [defaultValues?.[accessor]]);

  /**
   * if defaultValues.checked is not explicitly defined by developer
   * than fillOpacity will always be one
   * and onClick will not update the fillOpacity ever,
   * if defaultValues.checked is defined by developer
   * then fillOpacity will be updated on click
   */
  const getFillOpacity = (action: Action) => {
    return action.isSelected ? 1 : 0.6;
  };

  return (
    <SubToolBarButtonContainer isDisabled={disabled} p='0'>
      {actions.map(action => (
        <SubToolbarItemTooltip
          key={action.action}
          tooltip={`${tooltip} ${action.label}`}
          disabled={disabled}
        >
          <SubToolBarButtonContainer
            onClick={() => handleClick(action.action)}
            isDisabled={disabled}
            shouldApplyStyles
          >
            <Icon
              as={action.icon}
              fillOpacity={getFillOpacity(action)}
              strokeOpacity={getFillOpacity(action)}
            />
          </SubToolBarButtonContainer>
        </SubToolbarItemTooltip>
      ))}
    </SubToolBarButtonContainer>
  );
};
