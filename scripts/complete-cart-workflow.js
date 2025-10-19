const { MedusaApp } = require("@medusajs/medusa");

async function completeCartWorkflow() {
  const { container } = require("@medusajs/medusa");
  
  try {
    console.log("Running complete cart workflow...");
    
    // Get the workflow engine
    const workflowEngine = container.resolve("workflowEngine");
    
    // Run the complete cart workflow
    const result = await workflowEngine.run("completeCartWorkflow", {
      input: {
        cartId: "cart_01K7WRJPQ8VE7TXMBR1TQJ0Z4Z"
      }
    });
    
    console.log("✅ Cart completed successfully:", result);
    
  } catch (error) {
    console.error("❌ Error completing cart:", error.message);
    console.error("Error details:", error);
  }
}

module.exports = completeCartWorkflow;
