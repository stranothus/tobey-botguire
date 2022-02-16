import fs from "fs";
import emotional from "emotional";

await new Promise((resolve, reject) => emotional.load(() => resolve(true)));

const spiderManQuotes = [
    ...JSON.parse(await fs.promises.readFile("./src/resources/spider_man_1.json", "utf-8")),
    ...JSON.parse(await fs.promises.readFile("./src/resources/spider_man_2.json", "utf-8")),
    ...JSON.parse(await fs.promises.readFile("./src/resources/spider_man_3.json", "utf-8"))
].map(quote => ({
    quote: quote,
    ...emotional.get(quote)
}));

function tobeyTalk(msg) {
    const sentiment = emotional.get(msg.content);
    let bestQuote = sentiment.assessments.length ? [...spiderManQuotes].sort((a, b) => {
        let scoreA =  Math.random() * a.quote.split(/\s+/).length / 3;
        let scoreB =  Math.random() * b.quote.split(/\s+/).length / 3;

        sentiment.assessments.forEach(v => {
            v[0].forEach(e => {
                e = e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

                if(a.quote.match(new RegExp(e, "gi"))) scoreA += v[1] + v[2];
                if(b.quote.match(new RegExp(e, "gi"))) scoreB += v[1] + v[2];

                a.assessments.forEach(o => o[0].forEach(u => e === u ? scoreA += o[1] + o[2] : null));
                b.assessments.forEach(o => o[0].forEach(u => e === u ? scoreB += o[1] + o[2] : null));
            });
        });

        scoreA /= a.quote.split(/\s+/).length / 3;
        scoreB /= b.quote.split(/\s+/).length / 3;

        return scoreB - scoreA;
    }) : [...spiderManQuotes].sort((a, b) => {
        let scoreA =  Math.random() * a.quote.split(/\s+/).length / 3;
        let scoreB =  Math.random() * b.quote.split(/\s+/).length / 3;

        msg.content.split(/\s+/).map(v => {
            v = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
                
            if(a.quote.match(new RegExp(v, "gi"))) scoreA += Math.random();
            if(b.quote.match(new RegExp(v, "gi"))) scoreB += Math.random();
        });

        scoreA /= a.quote.split(/\s+/).length / 3;
        scoreB /= b.quote.split(/\s+/).length / 3;

        return scoreB - scoreA;
    });

    if(bestQuote[0] === spiderManQuotes[0]) bestQuote[0] = spiderManQuotes[Math.floor(Math.random() * spiderManQuotes.length)];

    msg.channel.send(bestQuote[0].quote);
}

export default tobeyTalk;