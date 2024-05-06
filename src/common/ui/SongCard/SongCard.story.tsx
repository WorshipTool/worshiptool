import { Sheet } from "@pepavlin/sheet-api";
import { SongCard } from "./SongCard";
import { SongVariantDto } from "../../../api/dtos";
import { createStory } from "../../../pages/TestComponents/createStory";

const SongCardStory = () => {
    return (
        <SongCard
            data={
                {
                    guid: "guid",
                    preferredTitle: "Lorem ipsum",
                    sheet: new Sheet(
                        "{V1}Lorem ipsum[C] \nnechodim na uprum\nTestovaci akordy[Am]"
                    ),
                    alias: "13adf4-asf-akaj",
                    public: false
                } as SongVariantDto
            }
            publicityMode="all"
        />
    );
};

createStory(SongCard, SongCardStory);
