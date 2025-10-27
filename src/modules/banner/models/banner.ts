import { model } from "@medusajs/framework/utils"

const Banner = model.define("banner", {
  id: model.id().primaryKey(),
  type: model.enum(["mobile", "desktop"]).index("IDX_BANNER_TYPE"),
  title: model.text(),
  subtitle: model.text().nullable(),
  description: model.text().nullable(),
  image: model.text(), // base64-encoded image string
  cta_text: model.text().nullable(),
  cta_link: model.text().nullable(),
  background_color: model.text().nullable(),
  text_color: model.text().nullable(),
  order: model.number().default(0).index("IDX_BANNER_ORDER"),
  is_active: model.boolean().default(true),
})

export default Banner
