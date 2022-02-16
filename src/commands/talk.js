import tobeyTalk from "../tobeyTalk.js";

export default {
    name: "talk",
    aliases: [
        "chat"
    ],
    execute: async (msg, args) => {
        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: { id: msg.author.id, tobeyTalking: msg.channel.id + "|" + msg.guild.id }}, { upsert: true });

        tobeyTalk(msg);
    }
}