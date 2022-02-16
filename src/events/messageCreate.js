import dirFlat from "dirflat";

const prefix = "Tobey";

const commands = {
    ...Object.assign({}, ...await dirFlat("./src/commands").then(async commands => 
        await Promise.all(
            commands.map(async command => {
                const data = await import("../." + command);
                const obj = {
                    [data.default.name]: data.default.execute,
                    ...Object.assign({}, ...data.default.aliases.map(alias => ({
                        [alias]: data.default.execute
                    })))
                };

                return obj;
            })
        )
    ))
};

export default {
    name: "messageCreate",
    execute: msg => {
        if(msg.author.bot || !msg.guild) return;

        if(msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
            msg.content = msg.content.replace(new RegExp("^" + prefix), "");
        } else if(msg.content.startsWith(`<@!${msg.client.user.id}>`)) {
            msg.content = msg.content.replace(new RegExp(`^<@!${msg.client.user.id}>\\s*`), "");
        } else {
            return;
        }
        
        let args = msg.content.split(/("[^"]*")|\s+/).filter(v => v).map(v => v.replace(/(?:\"$|^\")/g, ""));
        const commandName = args[0].toLowerCase();
        args.splice(0, 1);
        const command = commands[commandName];

        if(!command) return;

        command(msg, args);
    }
};