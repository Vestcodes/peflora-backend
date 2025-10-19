const { MedusaApp } = require("@medusajs/medusa");

async function createShippingOption() {
  const { container } = await MedusaApp({});
  
  try {
    console.log("Creating shipping option using Medusa services...");
    
    // Get the shipping module service
    const shippingModuleService = container.resolve("shippingModuleService");
    
    // Create a shipping option
    const shippingOption = await shippingModuleService.createShippingOptions({
      name: "Free Shipping",
      price_type: "flat",
      service_zone_id: "sz_454ruq5eo",
      shipping_profile_id: "sp_01K7V1QZD4A8J6JJ8G1NRAVN24",
      provider_id: "manual_manual",
      data: {
        name: "Free Shipping",
        amount: 0
      }
    });
    
    console.log("✅ Created shipping option:", shippingOption);
    
  } catch (error) {
    console.error("❌ Error creating shipping option:", error.message);
  }
}

// Export as default function
module.exports = createShippingOption;
