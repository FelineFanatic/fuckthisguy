module.exports = async(client, message) => {
    const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")

    if (message.author.bot) return;

    if (message.guild == null && client.verify_mod_mail[message.author.id]) {

        const guild = await client.guilds.fetch("1022192423998345310")
        const channel = await guild.channels.fetch("1022674613332877363")
        const thread = await channel.threads.fetch(client.verify_mod_mail[message.author.id]);
        const ban_embed = new MessageEmbed()
            .setColor("#38d0e0")
            .setTitle(`User response`)
            .setAuthor({ name: message.author.tag + ' ', iconURL: message.author.avatarURL() })
            .setDescription(`${message.content}`)
        thread.send({ embeds: [ban_embed] })
        return message.react("✔")
    }

    if (message.channel.type == "GUILD_PUBLIC_THREAD") {
        const agh = Object.keys(client.verify_mod_mail).find(key => client.verify_mod_mail[key] === message.channel.id)
        if (agh) {
            const ban_embed = new MessageEmbed()
                .setColor("#38d0e0")
                .setTitle(`Staff said:`)
                .setAuthor({ name: client.user.username + ' ', iconURL: client.user.avatarURL() })
                .setDescription(`${message.content}`)
            return message.guild.members.fetch(agh)
                .then((member) => member.send({ embeds: [ban_embed] }).then(() => (message.react("✔"))).catch((err) => message.channel.send("We couldnt send the message to the user")))
                .catch(() => message.reply("Couldnt send message to user"))
        }
    } //


    if (message.content.indexOf(client.config.commandstart) !== 0) return;

    const args = message.content.slice(client.config.commandstart).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command.substring(1));
    if (cmd == undefined) {
        return;
    }

    message.content = message.content.substring(message.content.indexOf(' ') + 1)

    if (message.member.roles.cache.has(cmd.authRole) || !cmd.authRole) {
        cmd.execute(client, message, args);
    } else {
        message.reply("You dont have perms to do that fucker")
    }

}