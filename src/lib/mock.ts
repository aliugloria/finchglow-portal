const FAIL_RATE = Number(process.env.NEXT_PUBLIC_MOCK_FAIL_RATE ?? 0);

/**
 * Stands in for the network: adds latency and, if NEXT_PUBLIC_MOCK_FAIL_RATE
 * is set (e.g. 0.3 in .env.local), fails at random so error states can be seen.
 */
export async function simulateNetwork(ms = 500): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  if (Math.random() < FAIL_RATE) throw new Error('Network error');
}
