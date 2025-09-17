import type { MedusaContainer } from "@medusajs/framework/types"

export default async function keepAliveJob(container: MedusaContainer) {
  const logger = container.resolve("logger")
  try {
    const response = await fetch("https://peflora-backend.onrender.com")
    const data = await response.json()
    logger.info(`Fetched data: ${JSON.stringify(data)}`)
  } catch (error) {
    logger.error(`Fetch failed: ${error.message}`)
  }
}

export const config = {
  name: "keep-alive",
  schedule: {
    interval: 30000,
  },
}