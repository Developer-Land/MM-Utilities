import {
  GuildTextBasedChannel,
  Message,
  Snowflake,
  ThreadChannel,
  WebhookClient,
  WebhookClientDataIdWithToken,
  WebhookClientDataURL,
  WebhookCreateMessageOptions,
  WebhookEditMessageOptions,
} from 'discord.js';
import { client } from '..';

interface IWebhookData {
  url?: string;
  token?: string;
  id?: Snowflake;
  channelId?: Snowflake;
  messageId?: Snowflake;
  messageUrl?: string;
}

export class Webhook {
  private _createdWebhook: string;
  public webhookData: IWebhookData;
  public messageOptions: WebhookCreateMessageOptions;

  /**
   * @example
   * new Webhook({ channelId: "938472932450136104" },
   *   username: "MM Webhook",
   *   avatarURL: "https://cdn.discordapp.com/avatars/911312019112734760/e0e07764b70c4221bb14e1384c018c71.webp",
   *   content: "Hello, this webhook is sent by MM Utilities#4628!"
   * }).send();
   */
  constructor(
    data: IWebhookData,
    options: WebhookCreateMessageOptions | WebhookEditMessageOptions
  ) {
    this.webhookData = data;
    this.messageOptions = options;
  }

  private async createWebhook(channelId: Snowflake) {
    let webhookUrl: string;

    const channel = client.channels.cache.get(
      channelId
    ) as GuildTextBasedChannel;

    if (!channel || channel instanceof ThreadChannel) return;

    const myWebhooks = (await channel.fetchWebhooks()).filter(
      (webhook) => webhook.owner.id === client.user!.id
    );

    webhookUrl =
      myWebhooks.size !== 0
        ? myWebhooks.first().url
        : (
            await channel.createWebhook({
              name: client.user.username,
              avatar: client.user.displayAvatarURL({ size: 4096 }),
            })
          ).url;

    this._createdWebhook = webhookUrl;
  }

  public async send() {
    let webhookClientData:
      | WebhookClientDataURL
      | WebhookClientDataIdWithToken
      | null;

    switch (true) {
      case 'url' in this.webhookData:
        webhookClientData = { url: this.webhookData.url };
        break;

      case 'id' in this.webhookData && 'token' in this.webhookData:
        webhookClientData = {
          id: this.webhookData.id,
          token: this.webhookData.token,
        };
        break;

      case 'channelId' in this.webhookData:
        await this.createWebhook(this.webhookData.channelId);

        webhookClientData = this._createdWebhook
          ? { url: this._createdWebhook }
          : null;
        break;

      default:
        webhookClientData = null;
    }

    if (webhookClientData === null)
      throw new Error('No valid webhook or channel specified.');

    const webhookClient = new WebhookClient(webhookClientData!);

    return webhookClient.send(this.messageOptions);
  }

  public async edit() {
    let message: Message;
    let channel: GuildTextBasedChannel;

    switch (true) {
      case 'messageUrl' in this.webhookData:
        let url = this.webhookData.messageUrl.split('/');

        url = url.slice(url.length - 3);

        channel = client.channels.cache.get(url[1]) as GuildTextBasedChannel;
        message = await channel.messages.fetch(url[2]);
        break;

      case 'channelId' in this.webhookData && 'messageId' in this.webhookData:
        channel = client.channels.cache.get(
          this.webhookData.channelId
        ) as GuildTextBasedChannel;
        message = await channel.messages.fetch(this.webhookData.messageId);
        break;

      default:
        channel = null;
        message = null;
    }

    if (channel === null || message === null)
      throw new Error(
        'No valid message URL or channel and message ID specified.'
      );

    if (!channel || channel instanceof ThreadChannel) return;

    const foundWebhook = (await channel.fetchWebhooks()).filter((webhook) => {
      return (
        webhook.id === message.webhookId && webhook.owner.id === client.user!.id
      );
    });

    if (!foundWebhook.size) throw new Error("Couldn't find webhook.");

    const webhookClient = new WebhookClient({ url: foundWebhook.first().url });

    ['username', 'avatarURL'].forEach((key) => delete this.messageOptions[key]);

    webhookClient.editMessage(message.id, this.messageOptions);
  }
}
