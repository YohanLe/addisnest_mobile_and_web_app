
export const setToken = (access_token) => {
    localStorage.setItem("access_token", access_token,);
};
export const setUserId = (userId) => {
    localStorage.setItem("userId", userId,);
};

export const checkToken = () => {
    if (localStorage.getItem("access_token")) {
        const decryptedAccessToken = localStorage.getItem("access_token")
        return {
            access_token: decryptedAccessToken,
        };
    } else {
        return {
            access_token: null,
            refresh_token: null,
        };
    }
};
export const refreshAccessToken = async () => {
    try {
        setToken(localStorage.getItem("access_token"));
        return localStorage.getItem("access_token");
    } catch (error) {
        console.log("Failed to refresh", error);
        throw error;
    }
};

export const clearToken = () => {
    localStorage.clear();
    window.location.href = "/login"
};
