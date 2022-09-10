import { client } from "..";
import { WebhookMessageOptions, WebhookClient, WebhookClientDataURL, WebhookClientDataIdWithToken, GuildTextBasedChannel, ThreadChannel, Snowflake } from "discord.js";

interface IWebhookData {
  url?: string;
  token?: string;
  id?: Snowflake;
  channelId?: Snowflake;
}

export class Webhook {
  private _data: IWebhookData;
  private _send: WebhookMessageOptions;
  private _createdWebhook: string;
  
  /**
   * @example
   * new Webhook({ channelId: "938472932450136104" }, 
   *   username: "MM Webhook",
   *   avatarURL: "https://cdn.discordapp.com/avatars/911312019112734760/e0e07764b70c4221bb14e1384c018c71.webp",
   *   content: "Hello, this webhook is sent by MM Utilities#4628!"
   * }).send();
   */
  constructor(data: IWebhookData, sendOptions: WebhookMessageOptions) {
    this._data = data;
    this._send = sendOptions;
  }
  
  private async createWebhook(channelId: Snowflake) {
    let webhookUrl: string;
  
    const channel = client.channels.cache.get(channelId) as GuildTextBasedChannel;
  
    if (!channel || channel instanceof ThreadChannel) return false;
  
    const myWebhooks = (await channel.fetchWebhooks()).filter(
      webhook => webhook.owner.id === client.user!.id
    );
  
    webhookUrl = (
      myWebhooks.size !== 0 ?
      myWebhooks.first().url :
      (await channel.createWebhook(client.user.username, {
        avatar: client.user.displayAvatarURL()
      })).url
    );
  
    this._createdWebhook = webhookUrl;
  }
  
  public async send() {
    let webhookClientData: WebhookClientDataURL | WebhookClientDataIdWithToken | null;
  
    switch (true) {
      case "url" in this._data:
        webhookClientData = { url: this._data.url }
        break;
  
      case "id" in this._data && "token" in this._data:
        webhookClientData = { id: this._data.id, token: this._data.token }
        break;
  
      case "channelId" in this._data:
        await this.createWebhook(this._data.channelId);
        
        webhookClientData = (
          this._createdWebhook ?
          { url: this._createdWebhook } :
          null
        );
        break;
  
      default:
        webhookClientData = null;
    }
  
    if (webhookClientData === null) throw new Error("No valid webhook or channel specified.");
  
    const webhookClient = new WebhookClient(webhookClientData!)
  
    await webhookClient.send(this._send);
  }
}
