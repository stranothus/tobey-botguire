export default {
    name: "talk",
    aliases: [
        "chat"
    ],
    execute: (msg, args) => {
        console.log(`${msg.author.tag} tried to talk with Tobey`);
    }
}