import fs from "fs";
import userExists from "../userExists.js";

const insults = JSON.parse(await fs.promises.readFile("./src/resources/insults.json"));

export default {
    name: "money",
    aliases: [
        "cash",
        "bank",
        "moolah",
        "monies",
        "bal",
        "balance"
    ],
    execute: async (msg, args) => {
        await userExists(msg.author.id);

        const user = await db.db("Bot").collection("Users").findOne({ id: msg.author.id });

        if(!user || !user.items || !user.items[1]) {
            msg.reply(`You have no money. ${insults[Math.floor(Math.random() * insults.length)]}`);
            return;
        }

        if(user.items[1] === 20) {
            msg.reply(`All you got is this 20 for the rest of the week`);
            return;
        }

        msg.reply(`You have ${user.items[1]} Tobey Coins`);
    }
}