import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function inviteCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{
  id: string
}>) {
  const logger = container.resolve("logger");
  const query = container.resolve("query");
  const notificationModuleService = container.resolve(
    "notification"
  )
  const config = container.resolve("configModule")

  const { data: [invite] } = await query.graph({
    entity: "invite",
    fields: [
      "email",
      "token",
    ],
    filters: {
      id: data.id,
    },
  });

  logger.info(JSON.stringify(invite))

  const backend_url = config.admin.backendUrl !== "/" ? config.admin.backendUrl :
    "http://localhost:9000"
  const adminPath = config.admin.path

  logger.info(JSON.stringify({ backend_url, adminPath }))

  const sentData = await notificationModuleService.createNotifications({
    to: invite.email,
    template: "user-invited",
    channel: "email",
    data: {
      invite_url: `${backend_url}${adminPath}/invite?token=${invite.token}`,
    },
    content: {
      subject: "You have been invited to join Peflora",
      text: "You have been invited to be a part of Peflora admin panel" +
        "\n\n" +
        "Click the link below to accept the invitation:\n\n" +
        `${backend_url}${adminPath}/invite?token=${invite.token}`,
    }
  })

  logger.info(JSON.stringify(sentData))
}

export const config: SubscriberConfig = {
  event: [
    "invite.created",
    "invite.resent",
  ],
}