import fs from "fs";
import userExists from "../userExists.js";

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
        await userExists(msg.author.id);

        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: { tobeyTalking: false }});

        msg.reply(`Tobey went off to go fight ${badGuys[Math.floor(Math.random() * badGuys.length)]}`);
    }
}