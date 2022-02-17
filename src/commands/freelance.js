import fs from "fs";
import userExists from "../userExists.js";

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
        if(!msg.attachments || !msg.attachments.size) {
            msg.reply(`You need to submit a picture to get paid! ${insults[Math.floor(Math.random() * insults.length)]}`);
            return;
        }

        if(Math.round(Math.random())) {
            msg.reply(`JJ doesn't want your picture. ${jameson[Math.floor(Math.random() * jameson.length)]}`);
            return;
        }

        const sum = Math.floor(msg.attachments.map(v => v.size / (1024 ** 2 / 10)).reduce((a, b) => a + b, 0));
        
        await userExists(msg.author.id);
        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $inc: { "items.1": sum }});

        msg.reply(`You got ${sum}!`);
    }
}