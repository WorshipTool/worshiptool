export default function useReadme(){
    const readmeUrl = "/static/documentation.md";

    const getRawData = async () => {
        const result = await fetch(readmeUrl);
        return result.text();
    }

    return {
        getRawData: getRawData
    }
}