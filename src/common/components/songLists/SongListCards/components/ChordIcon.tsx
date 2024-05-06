import React from "react";
import { ReactComponent as SvgIcon } from "../../../../assets/ukulele2.svg";

type ChordIconProps = {
    size?: number | string;
};

export default function ChordIcon({ size = 24 }: ChordIconProps) {
    return (
        <div>
            <SvgIcon
                height={size}
                width={size}
                style={{
                    filter: "grayscale(100%) invert(100%) brightness(50%)"
                }}
            />
        </div>
    );
}
