export const createOrder = async (orderData) => {
    try {
        const response = await fetch("http://localhost:5005/api/orders/create", {
            method: "POST",
            body: JSON.stringify(orderData),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("❌ Fetch error:", error);
        return { success: false, message: "Something went wrong!" };
    }
};
