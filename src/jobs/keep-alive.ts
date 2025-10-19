import type { MedusaContainer } from "@medusajs/framework/types"

export default async function keepAliveJob(_container: MedusaContainer) {
  try {
    await fetch("https://peflora-backend.onrender.com")
  } catch (_error) {
  }
}

export const config = {
  name: "keep-alive",
  schedule: {
    interval: 30000,
  },
}