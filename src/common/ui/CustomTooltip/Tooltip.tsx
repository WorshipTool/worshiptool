import { Tooltip as Tltp, TooltipProps } from "@mui/material";
import React, { ReactElement } from "react";

type CustomTooltipProps = {
    children?: ReactElement;
} & TooltipProps;

const MyComponent = React.forwardRef((innerProps: any, ref) => {
    return (
        <div {...innerProps} ref={ref as any}>
            {innerProps.children}
        </div>
    );
});

export default function Tooltip(props: CustomTooltipProps) {
    return (
        <Tltp {...props}>
            <MyComponent>{props.children}</MyComponent>
        </Tltp>
    );
}
