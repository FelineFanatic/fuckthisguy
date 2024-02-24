const Discord = require('discord.js');

module.exports = async(client, member) => {
    if (!member.user.createdAt >= 5 * 24 * 60 * 60 * 1000) {
        try {
            await member.send("Your account needs to be at least 5 days old to be able to join this server! Please re join once your account is at least 5 days old")
        } catch {

        } finally {
            const embed_fail = new Discord.MessageEmbed()
                .setColor("#b02541")
                .setTitle(`${member.user.username}#${member.user.discriminator} has been automatically kicked due to their account age`)
                .setDescription(`**ID:**${member.user.id}\n**Account age:**${member.user.createdAt}\n \n**Determined account was too young**\n`)
                .setAuthor({ name: member.user.tag + ' ', iconURL: member.user.avatarURL() })
                .setTimestamp()
                .setImage(member.user.avatarURL())
            member.guild.channels.fetch("1022192426565242923")
                .then((channel) => channel.send({ embeds: [embed_fail] }))

            member.kick("Account age is below 2 days")
        }
    } else {
        const welcome_embed = new Discord.MessageEmbed()
            .setColor("#38d0e0")
            .setTitle(`New server member!`)
            .setAuthor({ name: member.user.tag + ' ', iconURL: member.user.avatarURL() })
            .setDescription(`<a:GreenSparkels:1073700188708937829> ${member.user} Has joined 💫 The Fluff House V2💫 <a:GreenSparkels:1073700188708937829> \n
        <a:GreenSparkels:1073700188708937829> Make sure you read the <#1022192425239855146> and read through them carefully <a:GreenSparkels:1073700188708937829>`)
            .setImage("https://cdn.discordapp.com/attachments/1029457053334376618/1073699092716331058/JasticoWelcome.png")
        member.guild.channels.fetch("1022192425621524508")
            .then((channel) => channel.send({ embeds: [welcome_embed], content: `<@${member.user.id}>` }))
    }
}