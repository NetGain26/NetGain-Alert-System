const { ethers } = require("ethers");
const {
  wsProvider,
  rpcProvider,
  bot,
  CHAT_ID,
  BUY_STAKE_CONTRACT,
  STAKING_CONTRACT,
  MIN_ALERT_USDT,
} = require("../config");

const { buyStakeMessage } = require("../telegram/messages");

const marketingAbi = [
  "event BuyStakeMarketingProcessed(address indexed buyer, address indexed referrer, uint256 amount, uint256 distributed, uint256 treasuryAmount)",
];

const stakingAbi = [
  "event BuyAndStaked(uint256 indexed tokenId, address indexed user, uint256 usdtAmount, uint256 ngAmount)",
  "function treasuryValueUSD() view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function getTokenIdsLength() view returns (uint256)",
];

const pendingEvents = new Map();

function formatUnits(value) {
  return Number(ethers.formatUnits(value || 0n, 18));
}

function savePending(txHash, type, data) {
  const existing = pendingEvents.get(txHash) || {};
  pendingEvents.set(txHash, {
    ...existing,
    [type]: data,
    createdAt: Date.now(),
  });
}

async function trySendBuyStakeAlert(txHash) {
  const item = pendingEvents.get(txHash);
  if (!item?.marketing || !item?.staking) return;

  const marketing = item.marketing;
  const staking = item.staking;

  const amountNumber = formatUnits(marketing.amount);

  if (amountNumber < Number(MIN_ALERT_USDT || 0)) {
    pendingEvents.delete(txHash);
    return;
  }

  const stakingRead = new ethers.Contract(STAKING_CONTRACT, stakingAbi, rpcProvider);

  const [treasuryValue, totalStaked, members] = await Promise.all([
    stakingRead.treasuryValueUSD().catch(() => 0n),
    stakingRead.totalStaked().catch(() => 0n),
    stakingRead.getTokenIdsLength().catch(() => 0n),
  ]);

  const message = buyStakeMessage({
    buyer: marketing.buyer,
    referrer: marketing.referrer,
    amount: formatUnits(marketing.amount),
    marketing: formatUnits(marketing.distributed),
    treasury: formatUnits(marketing.treasuryAmount),
    ngAmount: formatUnits(staking.ngAmount),
    members: Number(members),
    treasuryValue: formatUnits(treasuryValue),
    totalStaked: formatUnits(totalStaked),
    txHash,
  });

  await bot.sendMessage(CHAT_ID, message, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  console.log(`✅ Buy & Stake alert sent: ${txHash}`);

  pendingEvents.delete(txHash);
}

function startBuyStakeListener() {
  if (!BUY_STAKE_CONTRACT || !STAKING_CONTRACT) {
    console.log("⚠️ BUY_STAKE_CONTRACT or STAKING_CONTRACT missing. Listener skipped.");
    return;
  }

  const marketingContract = new ethers.Contract(
    BUY_STAKE_CONTRACT,
    marketingAbi,
    wsProvider
  );

  const stakingContract = new ethers.Contract(
    STAKING_CONTRACT,
    stakingAbi,
    wsProvider
  );

  console.log("👂 Listening for Buy & Stake events...");

  marketingContract.on(
    "BuyStakeMarketingProcessed",
    async (buyer, referrer, amount, distributed, treasuryAmount, event) => {
      try {
        const txHash = event.log.transactionHash;

        savePending(txHash, "marketing", {
          buyer,
          referrer,
          amount,
          distributed,
          treasuryAmount,
        });

        await trySendBuyStakeAlert(txHash);
      } catch (err) {
        console.error("❌ Marketing event error:", err.message);
      }
    }
  );

  stakingContract.on(
    "BuyAndStaked",
    async (tokenId, user, usdtAmount, ngAmount, event) => {
      try {
        const txHash = event.log.transactionHash;

        savePending(txHash, "staking", {
          tokenId,
          user,
          usdtAmount,
          ngAmount,
        });

        await trySendBuyStakeAlert(txHash);
      } catch (err) {
        console.error("❌ BuyAndStaked event error:", err.message);
      }
    }
  );
}

module.exports = { startBuyStakeListener };