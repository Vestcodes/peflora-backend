import { ModuleExports } from "@medusajs/types";
import BannerModuleService from "./service";

const service = BannerModuleService;

export default {
  service,
  load: (container) => {
    container.register("bannerModuleService", service);
  },
} as ModuleExports;
