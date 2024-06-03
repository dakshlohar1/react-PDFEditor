import {
  Button,
  ComponentWithAs,
  Icon,
  IconProps,
  Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";

export type PDFEditorToolbarButtonProps = {
  value: string;
  onClick: () => void;
  isDisabled?: boolean;
  isSelected?: boolean;
  icon: ComponentWithAs<"svg", IconProps>;
  children?: React.ReactNode;
};

export const PDFEditorToolbarButton: FC<PDFEditorToolbarButtonProps> = ({
  children,
  icon,
  value,
  onClick,
  isDisabled = false,
  isSelected = false,
}) => {
  const { PdfEditorToolbarIcon, PdfEditorToolbarIconActive } = {
    PdfEditorToolbarIcon: "#646465",
    PdfEditorToolbarIconActive: "#FA6D15",
  };

  return (
    <Tooltip
      label={value}
      aria-label={value}
      isDisabled={isDisabled}
      hasArrow
      placement="bottom-end"
      cursor={isDisabled ? "not-allowed" : "pointer"}
    >
      <Button
        variant="ghost"
        borderRadius="none"
        isDisabled={isDisabled}
        onClick={onClick}
        w="74px"
        h="100%"
      >
        <Icon
          as={icon}
          color={isSelected ? PdfEditorToolbarIconActive : PdfEditorToolbarIcon}
          boxSize="5"
        />
        {children}
      </Button>
    </Tooltip>
  );
};
