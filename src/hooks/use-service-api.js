export default function UseServiceAPI() {
  async function getOnHandProducts() {
    let result = [];
    try {
      const response = await fetch(`http://103.13.31.71:3001/api/inventory/getOnHandProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
    return result;
  }

  return getOnHandProducts();
}
