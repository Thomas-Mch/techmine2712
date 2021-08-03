const { info, memory } = require("console");
const { EWOULDBLOCK } = require("constants");
const Discord = require("discord.js");
const { disconnect } = require("process");
const ytdl = require("ytdl-core");

const Client = new Discord.Client;

const prefix = "*";

var list = [];


Client.on("ready", () => {
    console.log("Bot Opérationnel");
    const statuses = [
        "status 1",
        "status 2",
        "status 3"
    ]
    let i = 0
    setInterval(() => {
        Client.user.setActivity("Développer TechMine 🤖", {type: "PLAYING"})
    })
});


//Member
Client.on("guildMemberAdd", member => {
    console.log("Un nouveau membre est arrivé");
    member.guild.channels.cache.find(channel => channel.id === "872087257757155400").send("Welcome " + member.displayName + " to the TechMine Serv  ! 🚀\nWe are now**" + member.guild.memberCount + "** on the server !");
    member.roles.add("").then(mbr => {
        console.log("role attribué à " + mbr.displayName);
    }).catch(() => {
        console.log("Le role n'a pas pu être attribué !");

    });
});


Client.on("guildMemberRemove", menber => {
    console.log("Un membre est partie");
    member.guild.channels.cache.find(channel => channel.id === "872087414234042379").send("**" + member.displayName + "** has left us 🛰️!\nWe are now **" + member.guild.memberCount + "** on the server !");
});

Client.on("message", async message =>  {

        //*rules
            if(message.content == prefix + "rules"){
                message.author.createDM().then(channel => {
                    channel.send("**The rules are : \n**-  Write in a correct way, no SMS language if possible.\n-  No insult or warning and deletion of the message.\n-  3 warning mute 30 min, 5 warning mute 1 hour, 10 warning ban.\n-  No racist, homophobic or sexist comments.\n-  no NSFW content outside the chanel made for this.\n-  Please write the bot commands (music, and other) in the chanel made for that.\n");
                });
            }
        
      
        //*clear
        //if(message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Il me faut la permision pour supprimer les messages")
        //if(args[0]) return message.channel.send("Il faut spécifier le nombre de message à supprimer")

        //message.channel.bulkDelete(args[0]).then(() => {
            //message.channel.send("**" + args[0] + "** messages supprimer")
            //.then(msg => msg.delete(6000))
        //})

    //*list
    if(message.content === prefix + "list"){
        let msg = "** FILE D'ATTENTE !**\n";
        for(var i = 0;i < list.length;i++){
            let name;
            await ytdl.getInfo(list[i], (err, info) => {
                if(err){
                    console.log("erreur de lien : " + err);
                    list.splice(i, 1);
                }
                else {
                    name = info.title;
                }
            });
            msg += "> " + i + " - " + name + "\n";
        }
        message.channel.send(msg);
    }
    //*play
    if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            message.member.voice.channel.join().then(connection => {
                let args = message.content.split(" ");
                
                let dispatcher = connection.play(ytdl(args[1], { quality: "highestaudio"}));

                dispatcher.on("finish", () => {
                    dispatcher.destroy();
                    connection.disconnect();
                });

                dispatcher.on("error", err => {
                    console.log("erreur de dispatcher : " + err);
                })
            }).catch(err => {
                message.reply("erreur lors de la connecion : " + err);
            });
        }
        else {
            message.reply("You are not connected by voice.");
        }
    }
    
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;

    //*ban
    if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Member not mentioned or not mentioned correctly.");
            }
            else {
                if(mention.bannable){
                    mention.ban();
                    message.channel.send("**" + mention.displayName + "** has been successfully banned.");
                }
                else {
                    message.reply("Cannot ban this member");
                }
            }
        }
        //*kick
        if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "kic")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Member not mentioned or not mentioned correctly.");
            }
            else{
                if(mention.kickable){
                    mention.kick();
                    message.channel.send("**" + mention.displayName + "** was successfully kicked.");
                }
                else {
                    message.reply("Could not kick this member.");
                }
            }
        }

        //*mute
        if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Member not mentioned or not mentioned correctly.");
            }
        else {
            mention.roles.add("849618354578784296");
            message.reply(mention.displayName + " has been successfully transferred");
            }
        }            
    }

    else if(message.content.startsWith(prefix + "unmute")){
        let mention = message.mentions.members.first();

        if(mention == undefined){
            message.reply("Member not mentioned or not mentioned correctly.");
        }
        else {
            mention.roles.remove("849618354578784296");
            message.reply(mention.displayName + " has been successfully unmute.");

        }
    }
}
}


    //*invite
    if(message.content == prefix + "invite"){
        message.reply("Here is the invitation to share link :\nhttps://discord.gg/dg7P6zAtM7");
    }

    //*help
    if(message.content == prefix + "help"){
        message.channel.send("**Voici les commandes.\n**Le prefix est *\n-  play + **lien youtube** pour mettre de la musique.\n-  stat pour voire votre identifient (Sa ne sert pas a grand chose)\n-  invite pour pouvoir avoir un lien d'invitation plus facilement.\n-  invitebot pour pouvoire inviter le bot sur votre server.\n-  helpadmin pour avoir toutes les commande d'admin (si vous n'etes pas admin vous de pourais pas faire la commande).");
    }

    //*helpadmin
    if(message.member.hasPermission("ADMINISTRATOR")){
    if(message.content == prefix + "helpadmin"){
        message.channel.send("**Voici les commandes admin.\n**Le prefix est *\n-  clear + un nombre de message a supprimer.\n-  ban + joueur a ban.\n-  kick + joueur a kick\n-  mute + joueur a mute (il y a pas de tempmute pour le moment.\n");
    }
}

    //*ping
    if(message.content == prefix + "ping"){
        message.reply("pong");
    }

    if(message.content == prefix + "stat"){
            message.channel.send("**" + message.author.username + "** which identifies : __" + message.author.id + "__ posted a message");
    }
});

function playMusic(connection){
    let dispatcher = connection.play(ytdl(list[0], { quality : "highestaudio"}));

    dispatcher.on("finish", () => {
        list.shift();
        dispatcher.destroy();

        if(list.length > 0){
            playMusic(connection);
        }
        else {
            connection.disconnect();
        }
    });

    dispatcher.on("error", err => {
        console.log("erreur de dispatcher : " + err);
        dispatcher.destroy();
        connection.disconnect();
    

});
}


Client.login("ODcxNTcyNDQwMDYzNTU3NzA0.YQdRFg.EeywMCa3-gReSPtjkMjblzvysuI");
