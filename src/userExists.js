async function userExists(id) {
    const userExists = await db.db("Bot").collection("Users").findOne({ id: id });

    if(userExists) return;

    await db.db("Bot").collection("Users").insertOne({
        id: id,
        items: [
            false,
            0
        ]
    });
}

export default userExists;