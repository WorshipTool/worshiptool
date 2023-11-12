import { POSTPARSEIMAGE_URL } from "../../../../api/constants";
import { RequestResult } from "../../../../api/dtos/RequestResult";
import { PostParseImageResultDTO } from "../../../../api/dtos/dtosSong";
import { getUrl } from "../../../../api/urls";
import useFetch from "../../../../hooks/useFetch";

export default function useImport() {
    const {postFormData} = useFetch()
    const importImage = async (file: File) : Promise<RequestResult<PostParseImageResultDTO>> => {
        const form = new FormData();
        form.append("file", file, file.name)
        
        const result = await postFormData({
            url: getUrl(POSTPARSEIMAGE_URL),
            body: form

        })

        return result;


    }
    return importImage;
}