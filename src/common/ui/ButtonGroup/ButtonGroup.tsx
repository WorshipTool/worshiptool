import { ButtonGroup as Group, SxProps, Theme } from "@mui/material";

type ButtonGroupProps = {
    children?: React.ReactNode[];
    sx?: SxProps<Theme>;
};

export const ButtonGroup = (props: ButtonGroupProps) => {
    return <Group sx={props.sx}>{props.children}</Group>;
};
