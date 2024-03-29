import { POSTPARSEIMAGE_URL } from "../../../../api/constants";
import { PostParseImageResultDTO } from "../../../../api/dtos/dtosSong";
import { getUrl } from "../../../../api/urls";
import useAuth from "../../../../hooks/auth/useAuth";
import { useApiState } from "../../../../tech/ApiState";
import { handleApiCall } from "../../../../tech/handleApiCall";

export default function useImport() {
    const { getAuthHeader } = useAuth();
    // const {postFormData} = useFetch()
    const importImage = async (
        file: File
    ): Promise<PostParseImageResultDTO> => {
        // Create regular axios fetch

        const form = new FormData();
        form.append("file", file, file.name);

        const result: PostParseImageResultDTO = await fetch(
            getUrl(POSTPARSEIMAGE_URL),
            {
                method: "POST",
                body: form
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .catch((error) => {
                return { sheets: [] };
            });

        return result;
    };
    return importImage;
}
