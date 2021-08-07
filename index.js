require("dotenv").config();
const { Client } = require("discord.js");
const { keep_alive } = require("./keep_alive");
const fetch = require("node-fetch");
const client = new Client();

//Düzenlenecek tek kısım diğer kodlara ellemeyiniz.\\
client.login("TOKEN ALANI");
const prefix = ".";
//Düzenlenecek tek kısım diğer kodlara ellemeyiniz.\\

client.on("ready", () => console.log("Bot Aktif"));//Bot aktif olunca, konsola yazılcak mesaj. Tırnak içindeki yazıyı değiştirebilirsiniz.
client.on("warn", console.warn);
client.on("error", console.error);

client.on("message", async message => {
    if (message.author.bot || !message.guild) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") return message.channel.send(`Pong! \`${client.ws.ping}ms\``);

    if (cmd === "izle") {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("**Hata, lütfen `.izle <sesli_kanal_id>` şeklinde kullanınız.**");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("**Hata, 'Davet Oluştur' yetkisi bulunamadı.**");

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913",
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send("**Hata, YouTube başlatılamadı.**");
                message.channel.send(`**YouTube \`${channel.name}\` adlı kanalda başlatılıyor. İzlemek için lütfen <https://discord.gg/${invite.code}> tıklayınız.**`);
            })
            .catch(e => {
                message.channel.send("**Hata, YouTube başlatılamadı.**");
            })
    }
});
