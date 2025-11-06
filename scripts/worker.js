require('dotenv').config();

async function main() {
  console.log(`[worker] Booting queue worker at ${new Date().toISOString()}`);
  // TODO: connect to your queue/broker and start processing jobs.
  setInterval(() => {
    console.log(`[worker] heartbeat ${new Date().toISOString()}`);
  }, Number.parseInt(process.env.WORKER_HEARTBEAT_INTERVAL || '60000', 10));
}

main().catch((error) => {
  console.error('[worker] Fatal error', error);
  process.exit(1);
});
