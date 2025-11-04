import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let premiumKeys = {};

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  // Generar key (solo admin)
  if (message.content.startsWith("!genkey") && message.member.permissions.has("Administrator")) {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();
    premiumKeys[key] = false;
    message.reply(`🎫 Generated premium key: \`${key}\``);
  }

  // Redimir key
  if (message.content.startsWith("!redeem")) {
    const key = message.content.split(" ")[1];
    if (!key) return message.reply("❌ Please provide a key.");

    if (premiumKeys[key] === false) {
      premiumKeys[key] = true;
      const role = message.guild.roles.cache.find(r => r.name === "Premium");
      if (role) await message.member.roles.add(role);
      message.reply("🎉 You now have Premium access!");
    } else {
      message.reply("❌ Invalid or already used key.");
    }
  }
});

client.login(process.env.TOKEN);
