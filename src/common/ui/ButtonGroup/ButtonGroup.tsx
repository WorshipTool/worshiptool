import { ButtonGroup as Group } from "@mui/material";

type ButtonGroupProps = {
    children?: React.ReactNode[];
};

export const ButtonGroup = (props: ButtonGroupProps) => {
    return <Group>{props.children}</Group>;
};
