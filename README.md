<p align='Center'>
<img src='assets/Made_with_DiscordJs.svg'>
<img src='assets/Made_with_NodeJs.svg'>
</p>

# MM-Utilities

Simple Bot for [MM Gamer discord server](https://discord.com/invite/ASr2B3ZZSY)

# Features

- Youtube Feed
- Music
- Ticket
- Suggestion
- Info
- Self Roles
- Afk
- Report

# Selfhosting

#### Requirements

- Node.js (v16.9.0 or higher)
- Discord.js (v13.8.0 or higher)
- Mongoose (v6.x or higher)
- Express (4.x or higher)

#### Setting up

- **Need to make changes to code to make it work correctly**
- Clone the repository and go to the directory
- run `npm install` to install all dependencies
- Configure the `config.json` file

```json
{
  "activityType": "Put activity type here",
  "activityName": "Put activity name here",
  "botColor": "Put HEX here",
  "errColor": "Put HEX here",
  "DeveloperIDs": ["Put Developer Id here"]
}
```

- Configure the `.env` file

```env
PORT=Put expressjs port here
botToken=Put bot token here
guildIds=Put guild ids here spreaded with commas
mongooseConnectionString=Put mongoose connection string here
LAVALINK_HOST=Put lavalink host here
LAVALINK_PASSWORD=Put lavalink password here
SPOTIFY_CLIENT_ID=Put spotify client id here
SPOTIFY_CLIENT_SECRET=Put spotify client secret here
YT_hubCallback=Put youtube hub callback here
YT_SECRET=Put youtube secret here
environment=Put environment here
```

- Run `npm start` to start the bot directly
- Run `npm run build` to build the project and then run `npm start:prod` to start the bot

# Database

This project uses MongoDb for database

# License

MIT License (c) 2022 DeveloperLand

# Contributing

Contributing to this project is welcomed.
