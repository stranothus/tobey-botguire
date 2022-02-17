import tobeyTalk from "../tobeyTalk.js";
import userExists from "../userExists.js";

export default {
    name: "talk",
    aliases: [
        "chat"
    ],
    execute: async (msg, args) => {
        await userExists(msg.author.id);
        
        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: { "items.0": msg.channel.id + "|" + msg.guild.id }});

        tobeyTalk(msg);
    }
}