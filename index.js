const Discord = require('discord.js');
const fs = require("fs");
const fuckIntents = new Discord.Intents(32767);
const client = new Discord.Client({ intents: fuckIntents })
require('dotenv').config()

client.config = require('./config');
client.verify_config = require('./config');
client.verify_session = {}
client.verify_content = {}
client.verify_session_channel = {}
client.verify_user_qnum = {}
client.verify_config = require('./config.json')
client.verify_user_status = {}
client.verify_mod_mail = {}

client.staff_config = require('./config');
client.staff_session = {}
client.staff_content = {}
client.staff_session_channel = {}
client.staff_user_qnum = {}
client.staff_config = require('./config.json')
client.staff_user_status = {}
client.staff_mod_mail = {}

const TmpUserBS = new Map();

client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity("They arent real, dont talk to them dont even aknoledge their preasense!");
});

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
}

client.commands = new Discord.Collection();

const commands = fs.readdirSync("./coms").filter(file => file.endsWith(".js"));
for (const file of commands) {
    const command = require(`./coms/${file}`)
    try {
        client.commands.set(command.name, command)
        console.log(`Successfully loaded command ${command.name}`)
    } catch (error) {
        console.log(`Warning command ${file} failed to load`)
    }
}

client.on('interactionCreate', async interaction => {
    console.log(interaction.message.id)
    if (interaction.customId == "approve_suggest") {
        const channel = await interaction.guild.channels.fetch(client.config.feedback_channel)
        const thread = channel.threads.cache.find(x => x.name === interaction.message.id);
        if (thread.joinable) await thread.join();
        const Verified_em = new Discord.MessageEmbed()
            .setColor('#30fc03')
            .setTitle("Your feedback has been submitted")
            .setDescription("Thank you for giving us your feedback")
        interaction.reply({ embeds: [Verified_em], ephemeral: true })
        const fromusermessagecu = new Discord.MessageEmbed()
            .setColor("#32a852")
            .setTitle(`The user ${interaction.user.username} approved`)
            .setThumbnail(interaction.user.avatarURL())
        thread.send({ embeds: [fromusermessagecu] })
        return;
    }
    if (interaction.customId == "deny_suggest") {
        const modal = new Discord.Modal()
            .setCustomId("denyM=" + interaction.message.id)
            .setTitle('Reason');
        const reason_input_1 = new Discord.TextInputComponent()
            .setCustomId('reason_input_1')
            .setLabel("Please give us some feedback")
            .setStyle('PARAGRAPH');
        const reason_input = new Discord.MessageActionRow().addComponents(reason_input_1);
        modal.addComponents(reason_input);
        return await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith("denyM=")) {
            console.log(interaction.fields.getTextInputValue("reason_input_1"))
            const parsed = interaction.customId.substring(interaction.customId.indexOf('=') + 1);
            const channel = await interaction.guild.channels.fetch(client.config.feedback_channel)
            const thread = channel.threads.cache.find(x => x.name === parsed);
            if (thread.joinable) await thread.join();
            const Verified_em = new Discord.MessageEmbed()
                .setColor('#30fc03')
                .setTitle("Your feedback has been submitted")
                .setDescription("Thank you for giving us your feedback")
            interaction.reply({ embeds: [Verified_em], ephemeral: true })
            const fromusermessagecu = new Discord.MessageEmbed()
                .setColor("#c44c39")
                .setTitle(`The user ${interaction.user.username} disapproved`)
                .setDescription("-" + interaction.fields.getTextInputValue("reason_input_1"))
                .setThumbnail(interaction.user.avatarURL())
            thread.send({ embeds: [fromusermessagecu] })
            return;
        }
    }
})

client.login(process.env.TOKEN);