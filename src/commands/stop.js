import fs from "fs";

const badGuys = JSON.parse(await fs.promises.readFile("./src/resources/bad_guys.json"));

export default {
    name: "stop",
    aliases: [
        "shut",
        "shutup",
        "shutit",
        "quiet"
    ],
    execute: async (msg, args) => {
        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: { id: msg.author.id, tobeyTalking: false }}, { upsert: true });

        msg.reply(`Tobey went off to go fight ${badGuys[Math.floor(Math.random() * badGuys.length)]}`);
    }
}