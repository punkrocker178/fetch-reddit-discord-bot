import { ApplicationCommandTypes, Embed, InteractionResponseTypes } from "../../deps.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "hot",
  description: "Fetch hot posts from Reddit",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {

    try {
      const listingQueryParams = new URLSearchParams();
      listingQueryParams.append('limit', '5');

      const formData = new FormData();
      formData.append('grant_type', 'client_credentials');

      const headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      const tokenReq = await fetch(
        `https://446ov6467l.execute-api.ap-southeast-1.amazonaws.com/prod/oauth/api/v1/access_token`,
        {
          method: 'POST',
          body: 'grant_type=client_credentials',
          headers: headers
        }
      );

      const tokenRes = await tokenReq.json();

      const listingHeaders = new Headers();
      listingHeaders.append('Authorization', `Bearer ${tokenRes['access_token']}`)

      const listingReq = await fetch(
        `https://446ov6467l.execute-api.ap-southeast-1.amazonaws.com/prod/oauth/hot?${listingQueryParams.toString()}`,
        {
          headers: listingHeaders
        }
      );

      const listingRes = await listingReq.json();

      const embeds = [] as Embed[];
      listingRes.data.children.forEach((child: any) => {
        embeds.push({
          author: {
            name: child.data.author
          },
          title: child.data.title,
          type: 'rich'
        });
      });

      console.log(embeds);
      await Bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            embeds: embeds,
          },
        },
      );

    } catch (error) {
      console.error(error);
    }

  },
});