import fs from "fs";
import parseUser from "../parseItems.js";
import possibility from "../possibility.js";

const jameson = JSON.parse(await fs.promises.readFile("./src/resources/jameson.json"));
const insults = JSON.parse(await fs.promises.readFile("./src/resources/insults.json"));

export default {
    name: "freelance",
    aliases: [
        "photo",
        "pic",
        "picture"
    ],
    execute: async (msg, args) => {
        const user = await parseUser(msg.author.id);

        if(user.freelance.timeUntil) {
            await msg.reply(`The Daily Bugle only needs one picture a day... wait another ${user.freelance.readableTimeUntil} before working again. ${insults[Math.floor(Math.random() * insults.length)]}`);
            return;
        }

        if(!msg.attachments || !msg.attachments.size) {
            msg.reply(`You need to submit a picture to get paid! ${insults[Math.floor(Math.random() * insults.length)]}`);
            return;
        }

        if(possibility(50)) {
            await msg.reply(`JJ doesn't want your picture. ${jameson[Math.floor(Math.random() * jameson.length)]}`);
            await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: { "items.4": Date.now() + 1000 * 60 * 60 * 24 }});
            return;
        }

        const sum = Math.floor(msg.attachments.map(v => v.size / (1024 ** 2 / 10)).reduce((a, b) => a + b, 0));
        
        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $inc: { "items.1": sum }, $set: { "items.4": Date.now() + 1000 * 60 * 60 * 24 }});

        await msg.reply(`You got ${sum}!`);
    }
}