const { ethers } = require("ethers");
const {
  wsProvider,
  bot,
  CHAT_ID,
  NFT_CONTRACT,
} = require("../config");

const abi = [
  "event MembershipPurchased(address indexed user, uint256 indexed tokenId, uint8 tier, address referrer)",
];

function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function txLink(hash) {
  return `https://bscscan.com/tx/${hash}`;
}

function getTierInfo(tier) {
  const t = Number(tier);

  if (t === 1) return { name: "Bronze", emoji: "🥉", price: 100, power: "1×" };
  if (t === 2) return { name: "Silver", emoji: "🥈", price: 500, power: "2×" };
  if (t === 3) return { name: "Gold", emoji: "🥇", price: 1500, power: "3×" };

  return { name: "Unknown", emoji: "🎟", price: 0, power: "-" };
}

function startNFTListener() {
  if (!NFT_CONTRACT) {
    console.log("⚠️ NFT_CONTRACT missing. NFT listener skipped.");
    return;
  }

  const contract = new ethers.Contract(NFT_CONTRACT, abi, wsProvider);

  console.log("👂 Listening for NFT Membership purchases...");

  contract.on(
    "MembershipPurchased",
    async (user, tokenId, tier, referrer, event) => {
      try {
        const info = getTierInfo(tier);

        const hasReferrer =
          referrer &&
          referrer.toLowerCase() !== "0x0000000000000000000000000000000000000000";

        const message = `🎟️ <b>NEW MEMBERSHIP NFT</b>

${info.emoji} <b>Tier:</b> ${info.name}
⚡ <b>Power:</b> ${info.power}
💵 <b>Price:</b> ${info.price} USDT
🆔 <b>NFT ID:</b> #${tokenId}

👤 <b>Member:</b> <code>${shortAddress(user)}</code>
${hasReferrer ? `🤝 <b>Referrer:</b> <code>${shortAddress(referrer)}</code>\n` : ""}
🔗 <a href="${txLink(event.log.transactionHash)}">View Transaction</a>

━━━━━━━━━━━━━━
<b>Welcome to the NetGain DAO community.</b>`;

        await bot.sendMessage(CHAT_ID, message, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });

        console.log(`✅ NFT Membership alert sent: ${event.log.transactionHash}`);
      } catch (err) {
        console.error("❌ NFT alert error:", err.message);
      }
    }
  );
}

module.exports = { startNFTListener };