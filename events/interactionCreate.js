const Discord = require('discord.js');

module.exports = async(client, interaction) => {
    if (interaction.commandName) {
        if (client.slash_commands.has(interaction.commandName)) {
            const command = await require(`../slash_coms/${interaction.commandName}.js`)
            try {
                return command.execute(client, interaction)
            } catch (error) {
                console.log('\x1b[31m%s\x1b[0m', `We had an error executing ${interaction.commandName}`)
                console.log(error)
                return interaction.reply("Failed to execute command")
            }
        } else {
            console.log('\x1b[31m%s\x1b[0m', `Warning interaction command not found or loaded ${interaction.commandName}`)
            return interaction.reply("Warning something went wrong on the backend")
        }
    }
    if (interaction.customId.startsWith("bver=")) {
        if (!interaction.member._roles.includes("1041094848444383385")) return interaction.reply({ content: `<@${interaction.user.id}> You need the <@&1041094848444383385> role inorder to use these features`, ephemeral: true })
        const owo = interaction.customId.substring(interaction.customId.indexOf('=') + 1);
        console.log(owo)
        const guild_int = client.guilds.cache.get(interaction.guild.id);
        const mention = guild_int.members.cache.get(owo)
        if (mention == undefined) {
            return interaction.reply("This user seems to have left the server")
        }
        console.log(mention)
        const role = guild_int.roles.cache.find(role => role.id === "1022192424333885462");
        if (mention.roles.cache.some(role => role.id === "1022192424333885462")) {
            return interaction.reply({ content: `This user is already verified`, ephemeral: true }) /// change this in production
        }
        await mention.roles.add(role);
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId('TMPSTOP=' + owo)
                .setLabel('Undo verification')
                .setStyle('DANGER'),
            );
        interaction.reply({ content: "<@" + interaction.user.id + ">Succesfully verified member", components: [row] })
        mention.send("You have been accepted !!! Go into <#1022192425621524507> and say hi!")

        const embed = interaction.message.embeds[0]
            .setColor('#10FF00')
            .setDescription(`**STATUS:**<@${interaction.user.id}>**Accepted this user**\n${interaction.message.embeds[0].description}`)
        interaction.message.edit({ embeds: [embed] });
        try {
            // usually deleted channels nevermind now
            delete client.verify_session[mention.id]
            delete client.verify_user_status[mention.id]
        } catch {
            console.log("fuck")
        }
        try {
            const channel = await interaction.guild.channels.fetch("1022192425621524507")
            channel.send(`<:JasticoWelcome:1022444440348016692><@&1022192424333885463> <:JasticoWelcome:1022444440348016692> \n<a:GreenSparkels:1073700188708937829> Lets welcome ${mention.user} into 💫The Fluff House 💫  <a:GreenSparkels:1073700188708937829>\n <a:GreenSparkels:1073700188708937829> Please go <#1022192425239855151> and grab yourself some roles <a:GreenSparkels:1073700188708937829>\n <a:GreenSparkels:1073700188708937829> Once you have some roles please go to <#1030470338250801243> <a:GreenSparkels:1073700188708937829>  \n
            \n<a:GreenSparkels:1073700188708937829> If you have telegram please visit <#1032698110293585992> <a:GreenSparkels:1073700188708937829> `)
        } catch (error) {
            console.log("welcome error accured")
            console.error(error)
        }
    }
    if (interaction.customId.startsWith("bdeny=")) {
        if (!interaction.member._roles.includes("1041094848444383385")) return interaction.reply({ content: `<@${interaction.user.id}> You need the <@&1041094848444383385> role inorder to use these features`, ephemeral: true })
        const modal = new Discord.Modal()
            .setCustomId("denyMnew=" + interaction.customId.substring(interaction.customId.indexOf('=') + 1))
            .setTitle('Deny reason');
        const reason_input_1 = new Discord.TextInputComponent()
            .setCustomId('reason_input_1')
            .setLabel("Why should this user be denied ?")
            .setStyle('PARAGRAPH');
        const reason_input = new Discord.MessageActionRow().addComponents(reason_input_1);
        modal.addComponents(reason_input);
        await interaction.showModal(modal);
    }
    if (interaction.customId.startsWith("denyMnew=")) {
        console.log(interaction.fields.getTextInputValue("reason_input_1"))
        const owo = interaction.customId.substring(interaction.customId.indexOf('=') + 1);
        console.log(owo)
        const guild_int = client.guilds.cache.get(interaction.guild.id);
        const mention = guild_int.members.cache.get(owo)
        if (mention == undefined) {
            return interaction.reply("<@" + interaction.user.id + "> This user seems to have left the server")
        }
        console.log(interaction)
        if (mention.roles.cache.some(role => role.id === client.verify_config.testServer.roles.verified)) {
            const Already_verified = new Discord.MessageEmbed()
                .setColor('#a8324e')
                .setDescription("The user has already been verified")
            return interaction.reply({ embeds: [Already_verified] })
        }
        interaction.reply(`<@${interaction.user.id}>User has been rejected for ${interaction.fields.getTextInputValue('reason_input_1')}`)

        const embed = interaction.message.embeds[0]
            .setColor('#FFB700')
            .setDescription(`**STATUS:**<@${interaction.user.id}>**Denied this user**\n${interaction.message.embeds[0].description}`)
        interaction.message.edit({ embeds: [embed] });

        const Verified_em = new Discord.MessageEmbed()
            .setColor('#a8324e')
            .setTitle(`We are very sorry but your verification ticket has been denied`)
            .setDescription(`Reason:${interaction.fields.getTextInputValue('reason_input_1')}`)
        mention.send({ embeds: [Verified_em] })
            .catch(console.error)

        try {
            // once the user has been denied
            delete client.client.verify_session[mention.id]
        } catch {
            console.log("fuck")
        }
    }
    if (interaction.customId.startsWith("TMPSTOP")) {
        if (!interaction.member._roles.includes("1041094848444383385")) return interaction.reply({ content: `<@${interaction.user.id}> You need the <@&1041094848444383385> role inorder to use these features`, ephemeral: true })
        const owo = interaction.customId.substring(interaction.customId.indexOf('=') + 1);
        console.log(owo)
        const guild_int = client.guilds.cache.get(interaction.guild.id);
        const mention = guild_int.members.cache.get(owo)
        if (mention == undefined) {
            return interaction.reply({ content: "<@" + interaction.user.id + "> This user seems to have left the server", ephemeral: true })
        }

        const role = guild_int.roles.cache.find(role => role.id === client.verify_config.testServer.roles.verified);
        if (mention.roles.cache.some(role => role.id === client.verify_config.testServer.roles.verified)) {
            mention.roles.remove(role)
            try {
                await mention.send("Our staff has detected something unusual. You will be temporarily unverified. We will contact you in a second we are sorry")
            } catch (DiscordAPIError) {
                return interaction.reply("We couldnt dm the user")
            }
            return interaction.reply(`<@${interaction.user.id}> Successfully unverified`)
        }

        interaction.reply({ content: "<@" + interaction.user.id + "> User is already unverified", ephemeral: true })
    }
    if (interaction.customId.startsWith("banCONF=")) {
        if (!interaction.member._roles.includes("1041094848444383385")) return interaction.reply({ content: `<@${interaction.user.id}> You need the <@&1041094848444383385> role inorder to use these features`, ephemeral: true })

        const owo = interaction.customId.substring(interaction.customId.indexOf('=') + 1);

        const modal = new Discord.Modal()
            .setCustomId("banFINAL=" + owo)
            .setTitle('Ban reason');
        const reason_input_1 = new Discord.TextInputComponent()
            .setCustomId('reason_input_1')
            .setLabel("Why should this user be banned ?")
            .setStyle('PARAGRAPH');
        const reason_input = new Discord.MessageActionRow().addComponents(reason_input_1);
        modal.addComponents(reason_input);
        await interaction.showModal(modal);
    }


    if (interaction.customId.startsWith("banFINAL=")) {
        const owo = interaction.customId.substring(interaction.customId.indexOf('=') + 1);
        const guildA = client.guilds.cache.get(interaction.guild.id);
        try {
            try {
                const member = await interaction.guild.members.fetch(owo)
                if (member.bannable) {
                    await member.send(`You will be banned for ${interaction.fields.getTextInputValue("reason_input_1")}`)
                }
            } catch (err) {
                console.log(errs)
            }
            await guildA.members.ban(owo, { days: 7, reason: interaction.fields.getTextInputValue("reason_input_1") })
        } catch (err) {
            console.log(err)
            return interaction.reply("Warning banning failed")
        }
        const embed = interaction.message.embeds[0]
            .setColor('#FF0000')
            .setDescription(`**STATUS:**<@${interaction.user.id}>**banned this user for ${interaction.fields.getTextInputValue('reason_input_1')}**\n${interaction.message.embeds[0].description}`)
        interaction.message.edit({ embeds: [embed] });
        const ban_embed = new Discord.MessageEmbed()
            .setColor("#ff2626")
            .setTitle(`Warning user ${owo} has been banned by ${interaction.user.username} on the verification button`)
            .setDescription(`Reason: ${interaction.fields.getTextInputValue('reason_input_1')}`)
            //channel.send({ embeds: [ban_embed] });

        return interaction.reply("<@" + interaction.user.id + ">Succesfully banned member")
    }
    if (interaction.customId.startsWith("newchat=")) {
        if (!interaction.member._roles.includes("1041094848444383385")) return interaction.reply({ content: `<@${interaction.user.id}> You need the <@&1041094848444383385> role inorder to use these features`, ephemeral: true })
        const owo = interaction.customId.substring(interaction.customId.indexOf('=') + 1);
        const member = await interaction.guild.members.fetch(owo)
            .then(async(member) => {
                try {
                    await member.send("We are sorry but we need to talk to you about your verification ticket. All messages in your Dm with me will be send to staff")
                } catch {
                    return interaction.reply("Warning it seems like we couldnt DM the user check if they are still a guild member and their privacy settings")
                }
                interaction.channel.threads.create({
                        name: `Mod mail ticket for ${member.user.username}-${member.user.id}`,
                        autoArchiveDuration: 60,
                        reason: `${interaction.user.id} requested a new mod mail form in the verification`,
                    })
                    .then((thread) => {
                        const fromusermessage = new Discord.MessageEmbed()
                            .setColor("#5395db")
                            .setTitle(`${interaction.user.username} has requested a new verification mod mail thread for ${member.user.username}!!!`)
                            .setAuthor({ name: member.user.tag + ' ', iconURL: member.user.avatarURL() })
                        const row = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('close=' + member.id)
                                .setLabel('Close thread')
                                .setStyle('SUCCESS'),
                            );
                        thread.send({ embeds: [fromusermessage], components: [row] });
                        client.verify_mod_mail[member.user.id] = thread.id;
                        return interaction.reply(`${interaction.user} Thread has been created <#${thread.id}>`)
                    })
                    .catch((err) => interaction.reply("Warning we couldnt create a thread"))
            })
            .catch((err) => interaction.reply("Warning it seems like this user is no longer a guild member"))

    }
    if (interaction.customId.startsWith("close=")) {
        if (!interaction.member._roles.includes("1041094848444383385")) return interaction.reply({ content: `<@${interaction.user.id}> You need the <@&1041094848444383385> role inorder to use these features`, ephemeral: true })
        const owo = interaction.customId.substring(interaction.customId.indexOf('=') + 1);
        delete client.verify_mod_mail[owo]
        interaction.channel.delete() //ugh
    }

    if (interaction.customId == "verification_model") {
        const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
        const fromusermessage = new MessageEmbed()
            .setColor("#A900FF")
            .setTitle(`We have a new ticket from ${interaction.user.username}`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription("Account creation:\n" + interaction.user.createdAt + "\n <@" + interaction.user.id + "> Typed this")
            .addField("Whats your age ?", interaction.fields.getTextInputValue("age_input"))
            .addField("What is the servers password ? ", interaction.fields.getTextInputValue("discover"))
            .addField("Where did you find our server ?", interaction.fields.getTextInputValue("about_self"))
            .addField("Tell us about yourself and your sona", interaction.fields.getTextInputValue("furry_quest"))
            .addField("Why are you wanting to join this community", interaction.fields.getTextInputValue("comm_quest"))

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('bver=' + interaction.user.id)
                .setLabel('Approve')
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId('bdeny=' + interaction.user.id)
                .setLabel('Deny')
                .setStyle('DANGER'),
                new MessageButton()
                .setCustomId('banCONF=' + interaction.user.id)
                .setLabel('BAN')
                .setStyle('DANGER'),
                new MessageButton()
                .setCustomId('newchat=' + interaction.user.id)
                .setLabel('Talk to user')
                .setStyle('PRIMARY'),
            );
        const channel = client.channels.cache.find(channel => channel.id === "1022674613332877363")
        channel.send({ embeds: [fromusermessage], components: [row], content: "<@&1041094848444383385>" });
        return interaction.reply({ content: `<@${interaction.user.id}> We got it! Thanks for submitting you're gonna be verified shortly`, ephemeral: true })
    }
    if (interaction.customId == "verificator") {
        const modal = new Discord.Modal()
            .setCustomId("verification_model")
            .setTitle('Verification')
        const age_input = new Discord.TextInputComponent()
            .setCustomId('age_input')
            .setRequired(true)
            .setLabel("Whats your age ?")
            .setStyle('PARAGRAPH')
            .setPlaceholder('You may give us a range if youre uncomfortable')
            .setMinLength(1)
            .setMaxLength(100)
        const discover = new Discord.TextInputComponent()
            .setCustomId('discover')
            .setRequired(true)
            .setLabel("What is the servers password? ")
            .setPlaceholder('Look in the rules section its gonnas be in []')
            .setMaxLength(20)
            .setStyle('PARAGRAPH');
        const about_self = new Discord.TextInputComponent()
            .setCustomId('about_self')
            .setRequired(true)
            .setLabel("Where did you find our server? ")
            .setMinLength(5)
            .setMaxLength(100)
            .setPlaceholder('Be specific! Give us the Tag or domain')
            .setStyle('PARAGRAPH');
        const furry_quest = new Discord.TextInputComponent()
            .setCustomId('furry_quest')
            .setRequired(true)
            .setMaxLength(300)
            .setLabel("Give us a description of yourself and fursona")
            .setMinLength(20)
            .setPlaceholder('Be creative')
            .setStyle('PARAGRAPH');

            const comm_quest = new Discord.TextInputComponent()
            .setCustomId('comm_quest')
            .setRequired(true)
            .setMaxLength(50)
            .setLabel("Why are you wanting to join this community")
            .setMinLength(10)
            .setPlaceholder('Be creative')
            .setStyle('PARAGRAPH');

            modal.addComponents(new Discord.MessageActionRow().addComponents(age_input), new Discord.MessageActionRow().addComponents(discover), new Discord.MessageActionRow().addComponents(about_self), new Discord.MessageActionRow().addComponents(furry_quest), new Discord.MessageActionRow().addComponents(comm_quest));
        await interaction.showModal(modal);
        console.log('\x1b[36m%s\x1b[0m', `[${interaction.customId}] Model shown attempting to verify: ${interaction.user.id}`)
    }
}