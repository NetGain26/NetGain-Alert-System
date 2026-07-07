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

function getBuyStakeTitle(amount) {
  amount = Number(amount);

  if (amount >= 10000) return "🐋🔥 WHALE BUY & STAKE";
  if (amount >= 5000) return "🚀 MAJOR BUY & STAKE";
  if (amount >= 1000) return "💎 STRONG BUY & STAKE";
  return "🚀 NEW BUY & STAKE";
}

function getThankYouMessage(amount) {
  amount = Number(amount);

  if (amount >= 10000) {
    return "🌟 An exceptional commitment to the NetGain DAO ecosystem. Thank you for your outstanding confidence in the project.";
  }

  if (amount >= 5000) {
    return "🚀 A major investment has joined the ecosystem. Thank you for helping strengthen the future of NetGain DAO.";
  }

  if (amount >= 1000) {
    return "💎 Thank you for your strong commitment. Every long-term supporter helps build a stronger DAO.";
  }

  if (amount >= 500) {
    return "🔥 Great decision! Thank you for increasing the strength of the NetGain community.";
  }

  return "🎉 Welcome to NetGain DAO. Every journey begins with a first step.";
}

function statsBlock(stats) {
  if (!stats) return "";

  return `
━━━━━━━━━━━━━━━━━━
📊 <b>NetGain DAO Statistics</b>

${stats.members ? `👥 <b>Members:</b> ${stats.members}\n` : ""}${stats.treasury ? `🏦 <b>Treasury:</b> ${stats.treasury} USDT\n` : ""}${stats.totalStaked ? `🪙 <b>Total Staked:</b> ${stats.totalStaked} NG\n` : ""}`;
}

function buyStakeMessage(data) {
  const amount = Number(data.amount || 0);
  const ngAmount = Number(data.ngAmount || 0);
  const buyPrice =
    data.buyPrice ||
    (amount > 0 && ngAmount > 0 ? (amount / ngAmount).toFixed(6) : null);

  return `${getBuyStakeTitle(amount)}

💰 <b>Investment:</b> ${formatNumber(data.amount)} USDT
${data.ngAmount ? `🪙 <b>NG Purchased & Staked:</b> ${formatNumber(data.ngAmount)} NG\n` : ""}${buyPrice ? `📈 <b>Buy Price:</b> ${buyPrice} USDT / NG\n` : ""}
🏦 <b>Treasury Contribution:</b> ${formatNumber(data.treasury)} USDT
🎁 <b>Marketing Rewards:</b> ${formatNumber(data.marketing)} USDT

👤 <b>Buyer</b>
<code>${shortAddress(data.buyer)}</code>

🤝 <b>Referrer</b>
<code>${shortAddress(data.referrer)}</code>

🔗 <a href="${txLink(data.txHash)}">View Transaction</a>
${statsBlock(data.stats)}
━━━━━━━━━━━━━━━━━━
${getThankYouMessage(data.amount)}

<b>Together we build the treasury.</b>`;
}

function nftMessage(data) {
  return `${data.emoji || "🎟"} <b>NEW ${data.tier} MEMBERSHIP</b>

🎉 <b>Welcome to NetGain DAO!</b>

👤 <b>Member</b>
<code>${shortAddress(data.user)}</code>

🆔 <b>NFT ID:</b> #${data.tokenId}
${data.emoji || "🎟"} <b>Membership:</b> ${data.tier}
⚡ <b>Power:</b> ${data.power}
💰 <b>Price:</b> ${formatNumber(data.price)} USDT

🗳 <b>Voting Power:</b> ${data.power}
🏦 <b>Treasury Power:</b> ${data.power}
📢 <b>Marketing Power:</b> ${data.power}

🤝 <b>Referrer</b>
<code>${shortAddress(data.referrer)}</code>

🔗 <a href="${txLink(data.txHash)}">View Transaction</a>
${statsBlock(data.stats)}
━━━━━━━━━━━━━━━━━━
<b>One membership. One community. One long-term vision.</b>`;
}

module.exports = {
  buyStakeMessage,
  nftMessage,
};