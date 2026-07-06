const { ethers } = require("ethers");
const {
  wsProvider,
  bot,
  CHAT_ID,
  BUY_STAKE_CONTRACT,
  MIN_ALERT_USDT,
} = require("../config");

const { buyStakeMessage } = require("../telegram/messages");

const abi = [
  "event BuyStakeMarketingProcessed(address indexed buyer, address indexed referrer, uint256 amount, uint256 distributed, uint256 treasuryAmount)",
];

function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUSDT(value) {
  return Number(ethers.formatUnits(value, 18)).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function txLink(hash) {
  return `https://bscscan.com/tx/${hash}`;
}

function startBuyStakeListener() {
  if (!BUY_STAKE_CONTRACT) {
    console.log("⚠️ BUY_STAKE_CONTRACT missing. Buy & Stake listener skipped.");
    return;
  }

  const contract = new ethers.Contract(BUY_STAKE_CONTRACT, abi, wsProvider);

  console.log("👂 Listening for Buy & Stake events...");

  contract.on(
    "BuyStakeMarketingProcessed",
    async (buyer, referrer, amount, distributed, treasuryAmount, event) => {
      try {
        const amountNumber = Number(ethers.formatUnits(amount, 18));

        if (amountNumber < MIN_ALERT_USDT) return;

        const message = buyStakeMessage({
  buyer,
  referrer,
  amount: formatUSDT(amount),
  marketing: formatUSDT(distributed),
  treasury: formatUSDT(treasuryAmount),
  txHash: event.log.transactionHash,
});

        await bot.sendMessage(CHAT_ID, message, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });

        console.log(`✅ Buy & Stake alert sent: ${event.log.transactionHash}`);
      } catch (err) {
        console.error("❌ Buy & Stake alert error:", err.message);
      }
    }
  );
}

module.exports = { startBuyStakeListener };