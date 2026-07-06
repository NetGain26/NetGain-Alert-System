require("dotenv").config();

const { ethers } = require("ethers");
const TelegramBotModule = require("node-telegram-bot-api");
const TelegramBot = TelegramBotModule.default || TelegramBotModule;

const required = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "RPC_URL",
  "WSS_RPC_URL",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const rpcProvider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wsProvider = new ethers.WebSocketProvider(process.env.WSS_RPC_URL);

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false,
});

module.exports = {
  bot,
  rpcProvider,
  wsProvider,
  CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  BUY_STAKE_CONTRACT: process.env.BUY_STAKE_CONTRACT,
  NFT_CONTRACT: process.env.NFT_CONTRACT,
  GOVERNANCE_CONTRACT: process.env.GOVERNANCE_CONTRACT,
  TREASURY_PROFIT_CONTRACT: process.env.TREASURY_PROFIT_CONTRACT,
  MIN_ALERT_USDT: Number(process.env.MIN_ALERT_USDT || "100"),
  CHAIN_ID: Number(process.env.CHAIN_ID || "56"),
};