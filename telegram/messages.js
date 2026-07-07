function shortAddress(address) {
  if (!address) return "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function txLink(hash) {
  return `https://bscscan.com/tx/${hash}`;
}

function formatNumber(value, decimals = 2) {
  const n = Number(value || 0);
  return n.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
}

function getInvestmentTitle(amount) {
  amount = Number(amount);

  if (amount >= 50000) return "🌊 LEVIATHAN INVESTMENT";
  if (amount >= 25000) return "👑 MEGA WHALE INVESTMENT";
  if (amount >= 10000) return "🐋 WHALE INVESTMENT";
  if (amount >= 5000) return "🦈 SHARK INVESTMENT";
  if (amount >= 1000) return "🐬 DOLPHIN INVESTMENT";

  return "🚀 NEW INVESTMENT";
}

function buyStakeMessage(data) {
  return `━━━━━━━━━━━━━━━━━━
🚀 <b>NETGAIN DAO ALERT</b>
🟢 <b>LIVE ON BNB SMART CHAIN</b>
━━━━━━━━━━━━━━━━━━

${getInvestmentTitle(data.amount)}

💰 <b>Buy & Stake</b>
${formatNumber(data.amount)} USDT

🪙 <b>NG Purchased</b>
${formatNumber(data.ngAmount)} NG

━━━━━━━━━━━━━━━━━━

🏦 <b>Treasury</b>
${formatNumber(data.treasury)} USDT

🎁 <b>Marketing</b>
${formatNumber(data.marketing)} USDT

━━━━━━━━━━━━━━━━━━

👤 <b>Buyer</b>
<code>${shortAddress(data.buyer)}</code>

🤝 <b>Referrer</b>
<code>${data.referrer ? shortAddress(data.referrer) : "Default Sponsor"}</code>

━━━━━━━━━━━━━━━━━━

📊 <b>NetGain DAO</b>

👥 <b>Members</b>
${formatNumber(data.members, 0)}

🏦 <b>Treasury Value</b>
${formatNumber(data.treasuryValue)} USDT

🪙 <b>Total NG Staked</b>
${formatNumber(data.totalStaked)} NG

━━━━━━━━━━━━━━━━━━

🔗 <a href="${txLink(data.txHash)}">View Transaction</a>

━━━━━━━━━━━━━━━━━━

💬 <b>Join the Community</b>
https://t.me/NetGainDAOCommunity`;
}

function nftMessage(data) {
  return `${data.emoji || "🎟"} <b>NEW ${data.tier} MEMBERSHIP</b>

👤 <b>Member</b>
<code>${shortAddress(data.user)}</code>

🆔 <b>NFT ID:</b> #${data.tokenId}
⚡ <b>Power:</b> ${data.power}
💰 <b>Price:</b> ${formatNumber(data.price)} USDT

🤝 <b>Referrer</b>
<code>${shortAddress(data.referrer)}</code>

🔗 <a href="${txLink(data.txHash)}">View Transaction</a>

━━━━━━━━━━━━━━━━━━
💬 <b>Join the Community</b>
https://t.me/NetGainDAOCommunity`;
}

module.exports = {
  buyStakeMessage,
  nftMessage,
};