export const fetchWithTokenRefresh = async (url, options = {}) => {
    let token = localStorage.getItem("token");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`,
        }
    });

    // Auto-refresh logic
    if (response.status === 401) {
        // const refreshResponse = await fetch("http://localhost:5005/api/refresh-token", {
        const refreshResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/refresh-token`, {

            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem("token", refreshData.token);

            // Retry the original request with the new token
            return fetchWithTokenRefresh(url, options);
        } else {
            console.error("❌ Token refresh failed.");
            return refreshResponse; // Return the error response
        }
    }

    return response;
};
