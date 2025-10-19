const { MedusaApp } = require("@medusajs/medusa");

async function createShippingOption() {
  const { container } = await MedusaApp({});
  const shippingOptionService = container.resolve("shippingOptionService");
  const regionService = container.resolve("regionService");

  try {
    // Get the India region
    const region = await regionService.retrieve("reg_01K7VZS04JT1RNB8GCPHCBD425");
    console.log("Found region:", region.name);

    // Create a shipping option for the region
    const shippingOption = await shippingOptionService.create({
      name: "Standard Shipping",
      price_type: "flat_rate",
      amount: 0, // Free shipping
      is_return: false,
      admin_only: false,
      requirements: [],
      data: {
        name: "Standard Shipping",
        description: "Free standard shipping within India"
      },
      metadata: {
        delivery_days: "3-5 business days",
        free_shipping_threshold: 999
      }
    });

    console.log("Created shipping option:", shippingOption.id);

    // Associate the shipping option with the region
    await regionService.addShippingOption(region.id, shippingOption.id);
    console.log("Associated shipping option with region");

    console.log("✅ Shipping option created and associated successfully!");
  } catch (error) {
    console.error("❌ Error creating shipping option:", error.message);
  }
}

module.exports = async () => {
  await createShippingOption();
};
