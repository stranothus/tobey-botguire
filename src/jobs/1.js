import { MessageActionRow, MessageButton } from "discord.js";
import fs from "fs";
import possibility from "../possibility.js";

const azizFire = JSON.parse(await fs.promises.readFile("./src/resources/aziz_fire.json"));

/*
Task map:

How will you deliver the pizza? 
Swing - Rescue a kid and arrive late or arrive early and get a raise!
That scooter thing - Arrive on time
Run - Arrive on time or arrive late
*/

export default {
    name: `Joe's Pizza`,
    information: `Joe's Pizza is famous for its 30 minute promise. If you don't deliver each pizza in time, Mr. Aziz will fire you. `,
    work: async msg => {
        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("1")
                    .setLabel("Swing there")
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId("2")
                    .setLabel("That scooter thing")
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId("3")
                    .setLabel("Run")
                    .setStyle('PRIMARY'),
            );
        
        const reply = await msg.reply({
            content: `Come on, 21 minutes ago, in comes order. Harmattan, Burton & Smith. eight extra-large deep-dish pizzas. In eight minutes, I am defaulting on Joe's 29-minute guarantee. Then, not only am I receiving no money for these pizzas, but I will lose the customer forever to Pizza Yurt. Look, you are my only hope, all right?  You have to make it in time.`,
            components: [buttons]
        });

        const collector = msg.channel.createMessageComponentCollector({
            filter: i => i.user.id === msg.author.id,
            time: 1000 * 10,
            max: 1
        });

        let selected;
        collector.on('collect', async i => {
            selected = i;
        });

        collector.on('end', async collected => {
            if(!selected) selected = { customId: 0 };
            const payment = 8;
            const tip = Math.floor(Math.random() * 5);

            buttons.components.forEach(v => v.setDisabled(true));

            switch(selected.customId) {
                case "1":
                    if(possibility(90)) {
                        selected.update({
                            content: `Nobody but SpiderMan could deliver a pizza that fast! You get an extra large tip of ${tip + 5} as well as your hourly rate (${payment}).`,
                            components: [buttons]
                        });
                        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $inc: {
                            "items.1": payment + tip + 5
                        }});

                        // add possibility of getting a special item from running?
                    } else {
                        if(possibility(99)) {
                            selected.update({
                                content: `You stopped to save a kid, but that made you late to deliver the pizza. At least you didn't get fired. `,
                                components: [buttons]
                            });
                        } else {
                            selected.update({
                                content: `...is that... webbing? On the pizza? Karen reported you to Mr. Aziz and you got fired for ruining the taste. `,
                                components: [buttons]
                            });

                            await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: {
                                "items.2": false
                            }});
                        }
                    }
                break;
                case "3":
                    if(possibility(95)) {
                        selected.update({
                            content: `You delivered the pizzas on time with time to spare and got a tip of ${tip} as well as your normal hourly rate at Joe's Pizza (${payment}).`,
                            components: [buttons]
                        });

                        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $inc: {
                            "items.1": payment + tip
                        }});
                    } else {
                        selected.update({
                            content: `Aunt May doesn't like that scooter thing. You delivered the pizza on time and made ${payment + tip}, but she took 20 back from you. `,
                            components: [buttons]
                        });

                        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $inc: {
                            "items.3": payment + tip - 20
                        }});
                    }
                break;
                case "4":
                    if(possibility(75)) {
                        selected.update({
                            content: `You delivered the pizzas on time, but just barely. No tip for you, just your normal hourly rate at Joe's Pizza (${payment}).`,
                            components: [buttons]
                        });

                        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $inc: {
                            "items.1": payment
                        }});

                        // add possibility of getting a special item from running?
                    } else {
                        selected.update({
                            content: `You were too slow and didn't deliver the pizzas in time. At least you didn't get fired. `,
                            components: [buttons]
                        });
                    }
                break;
                default:
                    if(possibility(75)) {
                        reply.edit({
                            content: `You didn't even try to deliver the pizza. At least you didn't get fired this time.`,
                            components: [buttons]
                        });
                    } else {
                        reply.edit({
                            content: `You didn't even try to deliver the pizza and got fired. ${azizFire[Math.floor(Math.random() * azizFire.length)]}`,
                            components: [buttons]
                        });

                        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: {
                            "items.2": false
                        }});
                    }
                break;
            }

            await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: {
                "items.3": Date.now() + 1000 * 60 * 60
            }});
        });
    },
    fired: msg => {
        msg.reply(`You lost the customer to Pizza Yurt. Maybe you should work there instead. ${azizFire[Math.floor(Math.random() * azizFire.length)]}`);
    }
}