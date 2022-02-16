import discord from "discord.js";
import dotenv from "dotenv";
import dirFlat from "dirflat";
import { MongoClient } from "mongodb";

dotenv.config();

const client = new discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_PRESENCES"
    ]
});

global.db = await new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tfjym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err, db) => {
            if(err) console.error(err);

            console.log("DB connected");

            resolve(db);
        }
    );
});

await dirFlat("./src/events").then(async events => await Promise.all(events.map(async event => {
    const data = await import(event).then(data => data.default);

    client.on(data.name, data.execute);
})));

client.login(process.env.TOKEN);

/*
https://discord.com/api/oauth2/authorize?client_id=943320976979001426&permissions=412317239360&scope=bot
*/