import type { SubscriberConfig } from "@medusajs/framework";

// subscriber function
export default async function productCreateHandler() {
	console.log("A product was created");
}

// subscriber config
export const config: SubscriberConfig = {
	event: "product.created",
};
