import { Icon, useDisclosure } from "@chakra-ui/react";
import { find } from "lodash";
import { FC, useEffect, useState } from "react";
import Select, {
  ActionMeta,
  GroupBase,
  SingleValue,
  StylesConfig,
} from "react-select";

import { Z_INDEX } from "../../constants";
import { SubToolBarButtonProps } from "../../types";
import { SubToolBarButtonContainer } from "../containers";
import { FilledUpArrow } from "../icons";
import { SubToolbarItemTooltip } from "../tooltips";

export type CommonDropdownInputProps = SubToolBarButtonProps & {
  inputWidth: number;
  isDisabled?: boolean;
  options: {
    value: string;
    label: string;
  }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const CommonDropdownInput: FC<CommonDropdownInputProps> = ({
  defaultValue,
  onChange,
  tooltip,
  icon: IconComponent,
  isDisabled,
  options,
  inputWidth,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(
    () => find(options, (option) => option.value === defaultValue) || null
  );

  const customStyles:
    | StylesConfig<
        {
          value: string;
          label: string;
        },
        false,
        GroupBase<{
          value: string;
          label: string;
        }>
      >
    | undefined = {
    container: (provided) => ({
      ...provided,
      width: `${inputWidth}px`,
      height: "24px",
      borderRadius: "2px",
    }),
    control: (provided) => ({
      ...provided,
      height: "24px",
      minHeight: "24px",
      // inside type of border
      borderColor: "#CCD3DC",
      borderWidth: "1px",
      borderRadius: "2px",
      boxShadow: "none",
    }),
    valueContainer: (provided) => ({
      ...provided,
      fontSize: "12px",
      alignItems: "center",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      fontSize: "12px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "24px",
      width: "24px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    placeholder: (provided) => {
      return {
        ...provided,
        fontSize: "12px",
      };
    },
    menuPortal: (provided) => ({
      ...provided,
      zIndex: Z_INDEX.SUB_TOOLBAR,
    }),
  };

  const handleChange = (
    selectedOption: SingleValue<{
      value: string;
      label: string;
    }>,
    _: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    setSelectedOption(selectedOption);

    if (onChange) {
      onChange(selectedOption?.value as string);
    }
  };

  useEffect(() => {
    setSelectedOption(
      find(options, (option) => option.value === defaultValue) || null
    );
  }, [defaultValue, options]);

  return (
    <SubToolbarItemTooltip tooltip={tooltip} disabled={isDisabled}>
      <SubToolBarButtonContainer isDisabled={isDisabled}>
        {IconComponent && <IconComponent value={selectedOption?.value} />}
        <Select
          blurInputOnSelect
          menuIsOpen={isOpen}
          onMenuClose={onClose}
          onMenuOpen={onOpen}
          styles={customStyles}
          value={selectedOption}
          menuPortalTarget={document.body}
          maxMenuHeight={200}
          components={{
            DropdownIndicator: () => (
              <Icon
                as={FilledUpArrow}
                transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                w="100%"
                h="4.67px"
              />
            ),
          }}
          options={options}
          placeholder={defaultValue}
          onChange={handleChange}
          isDisabled={isDisabled}
          isClearable={false}
        />
      </SubToolBarButtonContainer>
    </SubToolbarItemTooltip>
  );
};
