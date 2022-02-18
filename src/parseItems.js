import userExists from "./userExists.js";
import dirFlat from "dirflat";

const allJobs = {
    ...Object.assign({}, ...await dirFlat("./src/jobs").then(async jobs => 
        await Promise.all(
            jobs.map(async (job, i) => {
                const data = await import("." + job);

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

async function parseUser(id) {
    await userExists(id);

    const user = await db.db("Bot").collection("Users").findOne({ id: id });
    const timeUntilWork = user.items[3] - Date.now() < 0 ? 0 : user.items[3] - Date.now();

    return {
        id: user.id,
        tobeyTalk: user.items[0],
        currency: user.items[1],
        job: {
            id: user.items[2],
            timeUntilWork: timeUntilWork,
            readableTimeUntilWork: timeUntilWork > 0 ? timeUntilWork > 60 * 1000 ? `${Math.floor(timeUntilWork / (60 * 1000))} minutes` : `${Math.floor(timeUntilWork / 1000)} seconds` : `0 time units`,
            ...(user.items ? jobs[user.items[2]] || {} : {})
        }
    };
}

export default parseUser;