import { Client, GatewayIntentBits, Events } from "discord.js";

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

