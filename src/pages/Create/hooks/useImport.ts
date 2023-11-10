import { POSTPARSEIMAGE_URL } from "../../../apis/constants";
import { getUrl } from "../../../apis/urls";
import useFetch from "../../../hooks/useFetch";

export default function useImport() {
    const {postFormData} = useFetch()
    const importImage = async (file: File) => {
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