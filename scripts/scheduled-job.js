require('dotenv').config();

const interval = Number.parseInt(process.env.SCHEDULE_INTERVAL || '3600000', 10);

async function runJob() {
  console.log(`[scheduler] Running scheduled job at ${new Date().toISOString()}`);
  // TODO: add job logic here
}

setInterval(async () => {
  try {
    await runJob();
  } catch (error) {
    console.error('[scheduler] Job failed', error);
  }
}, interval);

runJob().catch((error) => {
  console.error('[scheduler] Initial job failed', error);
  process.exit(1);
});
