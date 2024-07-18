import { Client, GatewayIntentBits, Events } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { join } from "node:path";

function isRindo(message: string) {
    const text = message.split(" ");

    let isLaughing = false;

    for (const word of text) {
        console.log(word);
        let k_count = 0;
        for (const letter of word) {
            if (letter !== 'k' && letter !== 'K') continue;
            if (k_count === 3) break; 
            k_count += 1;
        }

        if (k_count === 3) {isLaughing = true; break;}
    }

    return isLaughing; 
}

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]});


client.once(Events.ClientReady, (readyClient) => {
    console.log(`logged in as ${readyClient.user.tag}`)
    
    const guild = client.guilds.cache.get("1255391282881232980");
    if (!guild) return;
    const channel = guild.channels.cache.get("1255391283392811080");
    if (!channel) return;

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();
    const audio = createAudioResource(join(__dirname, "audio.mp3"), {inlineVolume: true});
    audio.volume?.setVolume(0.9);

    player.play(audio);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
        console.log("começou a tocar");
    });
    player.on(AudioPlayerStatus.AutoPaused, () => {
        console.log("pausou sozinho");
    });
    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
    });
    
});

client.on(Events.MessageCreate, async (message) => {
    if (!isRindo(message.content) || message.author.bot ) return;
    message.reply({
        files: [
            {attachment: "shelby.png"}
        ]
    });
})


client.login(process.env.TOKEN);

