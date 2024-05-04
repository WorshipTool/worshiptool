import { Tooltip as Tltp, TooltipProps } from "@mui/material";
import React, { ReactElement } from "react";

type CustomTooltipProps = {
    children?: ReactElement;
} & TooltipProps;

export default function Tooltip(props: CustomTooltipProps) {
    const MyComponent = React.forwardRef(function MyComponent(innerProps, ref) {
        //  Spread the props to the underlying DOM element.
        return (
            <div {...innerProps} ref={ref as any}>
                {props.children}
            </div>
        );
    });

    return (
        <Tltp {...props}>
            <MyComponent />
        </Tltp>
    );
}
