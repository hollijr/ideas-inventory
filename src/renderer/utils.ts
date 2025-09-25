import { imageFileTypes } from "./constants";

export function validImageFileType(file: File) {
    return imageFileTypes.includes(file.type);
}