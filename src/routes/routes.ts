import { SongVariantDto } from "../api/dtos";

export const getVariantUrl = (variantAlias: string) => {
    const alias = variantAlias;

    // Part before first -
    const hex = alias.split("-")[0];
    // Part after first - to the end
    const code = alias.split("-").slice(1).join("-");

    return `/${hex}/${code}`;
};
