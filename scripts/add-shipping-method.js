const { MedusaApp } = require("@medusajs/medusa");

async function addShippingMethod() {
  const { container } = await MedusaApp({});
  
  try {
    console.log("Adding shipping method to cart...");
    
    // Get the cart service
    const cartService = container.resolve("cartService");
    
    // Get the cart
    const cart = await cartService.retrieve("cart_01K7WRJPQ8VE7TXMBR1TQJ0Z4Z", {
      relations: ["shipping_methods", "shipping_address", "items"]
    });
    
    console.log("Cart retrieved:", cart.id);
    console.log("Cart items:", cart.items.length);
    console.log("Cart shipping methods:", cart.shipping_methods.length);
    
    // Try to add a shipping method
    const shippingMethod = await cartService.addShippingMethod("cart_01K7WRJPQ8VE7TXMBR1TQJ0Z4Z", "sloc_1btafy6qa", {
      name: "Free Shipping",
      amount: 0
    });
    
    console.log("✅ Added shipping method:", shippingMethod);
    
  } catch (error) {
    console.error("❌ Error adding shipping method:", error.message);
    console.error("Error details:", error);
  }
}

module.exports = addShippingMethod;
