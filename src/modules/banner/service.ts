import type { Context } from "@medusajs/framework/types";
import {
	InjectManager,
	MedusaContext,
	MedusaService,
} from "@medusajs/framework/utils";
import type { EntityManager } from "@mikro-orm/knex";
import Banner from "./models/banner";

type BannerFilters = {
  type?: "mobile" | "desktop";
  is_active?: boolean;
};

class BannerModuleService extends MedusaService({
	Banner,
}) {
	@InjectManager()
	async createBanner(
		data: any,
		@MedusaContext() sharedContext?: Context<EntityManager>,
	): Promise<any> {
		// Check if we already have 5 banners for this type
		const existingBanners = await super.listBanners(
			{ type: data.type },
			undefined,
			sharedContext
		);

		if (existingBanners.length >= 5) {
			throw new Error(`Maximum 5 banners allowed for ${data.type} type`);
		}

		return await super.createBanners(data, sharedContext);
	}

	@InjectManager()
	async getActiveBannersByType(
		type: "mobile" | "desktop",
		@MedusaContext() sharedContext?: Context<EntityManager>,
	): Promise<any[]> {
		return await super.listBanners(
			{ type, is_active: true },
			undefined,
			sharedContext
		);
	}

	@InjectManager()
	async getAllBannersByType(
		type: "mobile" | "desktop",
		@MedusaContext() sharedContext?: Context<EntityManager>,
	): Promise<any[]> {
		return await super.listBanners(
			{ type },
			undefined,
			sharedContext
		);
	}
}

export default BannerModuleService;
