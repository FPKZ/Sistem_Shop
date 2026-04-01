import { Buffer } from "buffer";

/**
 * Converte um stream legível em um Buffer.
 * @param {ReadableStream} stream
 * @returns {Promise<Buffer>}
 */
export async function toBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
