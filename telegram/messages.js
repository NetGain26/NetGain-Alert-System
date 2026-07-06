function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function txLink(hash) {
  return `https://bscscan.com/tx/${hash}`;
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

  return "🎉 Welcome to NetGain DAO. Every journey begins with a first step, and we're excited to have you with us.";
}

function buyStakeMessage(data) {

  return `🚀 <b>NEW BUY & STAKE</b>

💰 <b>Amount:</b> ${data.amount} USDT
🎁 <b>Marketing Rewards:</b> ${data.marketing} USDT
🏦 <b>Treasury Contribution:</b> ${data.treasury} USDT

👤 <b>Buyer</b>
<code>${shortAddress(data.buyer)}</code>

🤝 <b>Referrer</b>
<code>${shortAddress(data.referrer)}</code>

🔗 <a href="${txLink(data.txHash)}">View Transaction</a>

━━━━━━━━━━━━━━━━━━
${getThankYouMessage(data.amount)}`;
}

function nftMessage(data) {

  return `🎟 <b>NEW MEMBERSHIP NFT</b>

${data.emoji} <b>Membership:</b> ${data.tier}
⚡ <b>Power:</b> ${data.power}
💰 <b>Price:</b> ${data.price} USDT

🆔 <b>NFT ID:</b> #${data.tokenId}

👤 <b>Member</b>
<code>${shortAddress(data.user)}</code>

🤝 <b>Referrer</b>
<code>${shortAddress(data.referrer)}</code>

🔗 <a href="${txLink(data.txHash)}">View Transaction</a>

━━━━━━━━━━━━━━━━━━
🎉 Welcome to the NetGain DAO community.`;
}

module.exports = {
  buyStakeMessage,
  nftMessage,
};