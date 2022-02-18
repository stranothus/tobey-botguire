import fs from "fs";
import dirFlat from "dirflat";
import parseUser from "../parseItems.js";

const insults = JSON.parse(await fs.promises.readFile("./src/resources/insults.json"));
const allJobs = {
    ...Object.assign({}, ...await dirFlat("./src/jobs").then(async jobs => 
        await Promise.all(
            jobs.map(async (job, i) => {
                const data = await import("../." + job);

                if(!(data.default.name && data.default.information && data.default.work && data.default.fired)) return { 0: 0 };

                const obj = {
                    [i + 1]: data.default,
                };

                return obj;
            })
        )
    ))
};
const jobs = Object.keys(allJobs).filter(key => allJobs[key]).reduce((obj, key, i, arr) => ({
    ...obj,
    [key]: allJobs[key]
}), {});

export default {
    name: "work",
    aliases: [
        "labor",
        "job"
    ],
    execute: async (msg, args) => {
        const user = await parseUser(msg.author.id);

        if(args.length) {
            switch(args[0]) {
                case "list":
                    msg.reply(Object.keys(jobs).map(v => `${jobs[v].name} - ${jobs[v].information}`).join("\n"));
                    return;
                break;
                case "current":
                    if(!user.job.id) {
                        await msg.reply(`You don't have a job! Get one from \`Tobey work list\` ${insults[Math.floor(Math.random() * insults.length)]}`);
                    } else {
                        await msg.reply(`You work at ${user.job.name}. ${user.job.information}`);
                    }
                    return;
                break;
                case "quit":
                    if(!user.job.id) {
                        await msg.reply(`You don't have a job to quit from! ${insults[Math.floor(Math.random() * insults.length)]}`);
                    } else {
                        await msg.reply(`You quit from ${user.job.name}. You have to wait an hour before applying to a new job.`);
                        await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: {
                            "items.2": false,
                            "items.3": Date.now() + 1000 * 60 * 60
                        }});
                    }
                    return;
                break;
                case "apply":
                    if(!user.job.id) {
                        if(user.job.timeUntilWork) {
                            await msg.reply(`You lost your previous job too recently. Nobody wants to hire you for another ${user.job.readableTimeUntilWork}. ${insults[Math.floor(Math.random() * insults.length)]}`);
                        } else {
                            const applyingForName = args.slice(1).join(" ");
                            const applyingFor = applyingForName ? Object.keys(jobs).filter(v => jobs[v].name.toLowerCase().includes(applyingForName.toLowerCase())).map(v => jobs[v]) : false;

                            if(applyingFor.length) {
                                if(Math.round(Math.random())) {
                                    await msg.reply(`You were hired for a job at ${applyingFor[0].name}!`);
                                    await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: { "items.2": Object.keys(jobs).filter(v => jobs[v].name === applyingFor[0].name)[0] }});
                                } else {
                                    await msg.reply(`You were rejected for a job at ${applyingFor[0].name}. Now you have to wait an hour before applying again. ${insults[Math.floor(Math.random() * insults.length)]}`);
                                    await db.db("Bot").collection("Users").updateOne({ id: msg.author.id }, { $set: { "items.3": Date.now() + 1000 * 60 * 60 }});
                                }
                            } else {
                                if(applyingForName) {
                                    await msg.reply(`${applyingForName} is not a valid job. ${insults[Math.floor(Math.random() * insults.length)]}`);
                                } else {
                                    await msg.reply(`You need to choose a job to apply to. ${insults[Math.floor(Math.random() * insults.length)]}`);
                                }
                            }
                        }
                    } else {
                        await msg.reply(`You already have a job! You'll need to quit with \`Tobey work quit\` before applying to a new one ${insults[Math.floor(Math.random() * insults.length)]}`);
                    }
                    return;
                break;
            }
        }

        if(!user.job.id) {
            await msg.reply(`You don't have a job! Get one from \`Tobey work list\` ${insults[Math.floor(Math.random() * insults.length)]}`);
            return;
        }

        if(user.job.timeUntilWork) {
            await msg.reply(`There are labor laws... wait another ${user.job.readableTimeUntilWork} before working again. ${insults[Math.floor(Math.random() * insults.length)]}`);
        }

        user.job.work(msg);
    }
}