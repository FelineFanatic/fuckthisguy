const Discord = require('discord.js');

module.exports = async(client, member) => {
    const welcome_embed = new Discord.MessageEmbed()
        .setColor("#38d0e0")
        .setTitle(`Goodbye`)
        .setAuthor({ name: member.user.tag + ' ', iconURL: member.user.avatarURL() })
        .setDescription(`<a:GreenSparkels:1073700188708937829> ${member.user} Has left the 💫 The Fluff House V2💫 <a:GreenSparkels:1073700188708937829> \n`)
    member.guild.channels.fetch("1022192425621524508")
        .then((channel) => channel.send({ embeds: [welcome_embed], content: `<@${member.user.id}>` }))
}