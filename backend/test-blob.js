import "dotenv/config";
import { put } from "@vercel/blob";

async function run() {
  const data = { test: true, timestamp: Date.now() };
  try {
    const blob = await put('cache-teste.json', JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
    });
    console.log("Blob URL:", blob.url);
  } catch(e) {
    console.error(e);
  }
}
run();
