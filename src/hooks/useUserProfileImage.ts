import React from "react";
import { getAbsoluteUrl, getUrl } from "../api/urls";

export const useUserProfileImage = (userGuid: string) => {
    return "/static/assets/profile-image-default.png";
};
