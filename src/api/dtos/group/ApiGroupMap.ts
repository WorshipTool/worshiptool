import { Group } from "../../../interfaces/group/Group";
import { ApiGroupDto } from "./ApiGroupDto";

export const mapApiToGroup = (dto: ApiGroupDto): Group => {
    return {
        name: dto.name,
        guid: dto.guid,
        selection: dto.selection
    }
}