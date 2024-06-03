import { useUpdateEffect } from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';

import { usePDFEditorContext } from '../../editor-provider';
import {
  SubToolBarButtonProps,
  SubToolbarItemValueAccessor,
} from '../../types';
import { SubToolBarButtonContainer } from '../containers';
import { SubToolbarItemTooltip } from '../tooltips';

export type SubToolBarButtonComponentProps = SubToolBarButtonProps & {
  onCheck?: (checked: boolean) => void;
  defaultValue?: boolean;
  onChangeEvent: string;
  valueAccessor?: SubToolbarItemValueAccessor;
};

export type BooleanString = 'true' | 'false';

export const SubToolBarButton: FC<SubToolBarButtonComponentProps> = ({
  icon: IconComponent,
  defaultValues,
  onChangeEvent,
  tooltip,
  isDisabled = false,
  valueAccessor = 'value',
  valueClipper,
}) => {
  const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;
  const [isSelected, setIsSelected] = useState(
    !!(
      defaultValues?.[valueAccessor] &&
      !!valueClipper?.[
        defaultValues?.[valueAccessor]?.toString() as BooleanString
      ]
    ),
  );
  const { eventBus } = usePDFEditorContext();

  const handleClick = useCallback(() => {
    if (!disabled) {
      setIsSelected(!isSelected);
      const value = valueClipper?.[isSelected.toString() as BooleanString];
      eventBus.dispatch(onChangeEvent, {
        [valueAccessor]: value || !isSelected,
      });
    }
  }, [
    disabled,
    isSelected,
    onChangeEvent,
    eventBus,
    valueClipper,
    valueAccessor,
  ]);

  useUpdateEffect(() => {
    if (defaultValues?.[valueAccessor] !== undefined) {
      // explicit type conversion to boolean assuming whatever the value it will always be based on value accessor
      setIsSelected(!!defaultValues?.[valueAccessor]);
    }
  }, [defaultValues?.[valueAccessor], valueAccessor, eventBus, onChangeEvent]);

  /**
   * if defaultValues is not explicitly defined by developer
   * than fillOpacity will always be one
   * and onClick will not update the fillOpacity ever,
   * if defaultValues is defined by developer
   * then fillOpacity will be updated on click
   */
  const fillOpacity =
    defaultValues?.[valueAccessor] !== undefined ? (isSelected ? 1 : 0.5) : 1;

  return (
    <SubToolbarItemTooltip tooltip={tooltip} disabled={disabled}>
      <SubToolBarButtonContainer
        onClick={handleClick}
        shouldApplyStyles
        isDisabled={disabled}
      >
        {IconComponent && <IconComponent componentProps={{ fillOpacity }} />}
      </SubToolBarButtonContainer>
    </SubToolbarItemTooltip>
  );
};
