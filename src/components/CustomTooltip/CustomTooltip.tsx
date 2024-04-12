import { Tooltip, TooltipProps } from "@mui/material";
import React, { ReactElement } from "react";

type CustomTooltipProps = {
    children?: ReactElement;
} & TooltipProps;

export default function CustomTooltip(props: CustomTooltipProps) {
    const MyComponent = React.forwardRef(function MyComponent(innerProps, ref) {
        //  Spread the props to the underlying DOM element.
        return (
            <div {...innerProps} ref={ref as any}>
                {props.children}
            </div>
        );
    });

    return (
        <Tooltip {...props}>
            <MyComponent />
        </Tooltip>
    );
}
