declare module 'youtube-notification' {
  export interface NotifierOptions {
    /**
     * The ip/domain name that will be used as a callback URL by the hub
     *
     * @type {string}
     */
    hubCallback: string;
    /**
     * The secretkey for the requests to hub
     *
     * @type {?string}
     */
    secret?: string;
    /**
     * If the notifier will be used with a middleware
     *
     * @type {boolean}
     */
    middleware?: boolean;
    /**
     * The port to listen on
     *
     * @type {?number}
     */
    port?: number;
    /**
     * The path on which server will interact with the hub
     *
     * @type {string}
     */
    path?: string;
    /**
     * The hub URL
     *
     * @type {string}
     */
    hubUrl?: string;
  }

  export interface Notification {
    video: {
      id: string;
      title: string;
      link: string;
    };
    channel: {
      id: string;
      name: string;
      link: string;
    };
    published: Date;
    updated: Date;
  }

  export interface SubscriptionUpdate {
    /** The Subscription type */
    type: 'subscribe' | 'unsubscribe';
    /** The channel id */
    channel: string;
    /** The amount of seconds before the subscription ends */
    leaseSeconds: number;
  }

  /**
   * The options the notifier was instantiated with.
   * @name Notifier#options
   * @type {NotifierOptions}
   */
  import { EventEmitter } from 'stream';
  export default class Notifier extends EventEmitter {
    /**
     * The ip/domain name that will be used as a callback URL by the hub
     *
     * @type {string}
     */
    public hubCallback: string;
    /**
     * The hub URL
     *
     * @type {string}
     */
    public hubUrl: string;
    /**
     * The secretkey for the requests to hub
     *
     * @type {?string}
     */
    public secret?: string;
    /**
     * If the notifier will be used with a middleware
     *
     * @type {boolean}
     */
    public middleware: boolean;
    /**
     * The port to listen on
     *
     * @type {number}
     */
    public port: number;
    /**
     * The path on which server will interact with the hub
     *
     * @type {string}
     */
    public path: string;
    /**
     * The server to interact with the hub
     *
     * @type {Express|null}
     */
    public server: Express | null;
    /**
     * Array of recieved channels to ignore duplicate update for
     *
     * @private
     * @type {string[]}
     */
    private _received: string[];

    /**
     *
     * @constructor
     * @param {NotifierOptions} [options={}] The options for the notifier
     */
    constructor(options: NotifierOptions);
    /**
     * Create a server and start listening on the port.
     *
     * This should not be used if you are using middleware.
     */
    public setup(): void;
    /**
     * Creates an Express middleware handler for PubSubHubbub
     *
     * @param  {Object}   req HTTP request object
     * @param  {Object}   res HTTP response object
     * @return {Function} Middleware handler
     */
    public listener(): (req: Request, res: Response) => void;
    /**
     * Subsribe to a channel.
     *
     * @param {string[]|string} channels The channel id or an array of channel ids to subscribe to
     */
    public subscribe(channels: string | string[]): void;
    /**
     * Unsubsribe from a channel.
     *
     * @param {string[]|string} channels The channel id or an array of channel ids to unsubscribe from
     */
    public unsubscribe(channels: string | string[]): void;
  }
}
