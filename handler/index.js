const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild
        await client.guilds.cache
           // .get("replace this with your guild id")
            //.commands.set(arrayOfSlashCommands);

        // Register for all the guilds the bot is in
        await client.application.commands.set(arrayOfSlashCommands);
    });

    // mongoose (temporary disabled)
    
    /*const { mongooseConnectionString } = require('../config.json')
    if (!mongooseConnectionString) return;

    mongoose.connect(mongooseConnectionString).then(() => console.log('Connected to mongodb'));*/
};

