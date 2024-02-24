module.exports = {
    name: "here",
    description: "Creates a new embed",
    usage: '>embed_create "titel" "Description"',
    trigger: "here",
    category: "Stuff",
    async execute(client, msg, args) {
        const allowed = ["943264113801441280", "838557507290529822"]
        if (!allowed.includes(msg.author.id)) return
        const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('verificator')
                .setLabel('Verify here!')
                .setStyle('SUCCESS'),
            );
        const Verfication_embed = new MessageEmbed()
            .setColor("#fcba03")
            .setTitle("Verify here")
            .setDescription("Welcome to the Fluff House! \n\nA cozy and friendly furry discord server where you can connect with furries from all over the world. \nJoin us to express yourself, share your art, gaming experiences, and make new friends. \nLet's surround ourselves with fluffiness and fun!\n\n*Please ensure you have dms from server members on and accepted the membership screening*")
            .setImage("https://cdn.discordapp.com/attachments/1029457053334376618/1097633454369296524/Untitled_design-Max-Quality_2.jpg")
        msg.channel.send({ embeds: [Verfication_embed], components: [row] })
    }
}