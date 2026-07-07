const { bot, rpcProvider, CHAT_ID, CHAIN_ID } = require("./config");
const { startBuyStakeListener } = require("./listeners/buyStakeListener");
const { startNFTListener } = require("./listeners/nftListener");
async function start() {
  console.log("🚀 Starting NetGain Alert Bot V2...");

  try {
    const network = await rpcProvider.getNetwork();

    console.log("✅ Connected to blockchain");
    console.log(`🌐 Chain ID: ${network.chainId}`);

    if (Number(network.chainId) !== CHAIN_ID) {
      throw new Error(`Wrong network. Expected ${CHAIN_ID}, got ${network.chainId}`);
    }

    console.log("✅ Telegram connected");

    startBuyStakeListener();
    startNFTListener();

    console.log("🎉 Bot is now listening for events.");
  } catch (err) {
    console.error("❌ Startup Error");
    console.error(err);
    process.exit(1);
  }
}

start();