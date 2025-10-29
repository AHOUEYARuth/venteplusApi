export async function sendMessage(phone, text) {
  console.log(`[WhatsApp] to=${phone} text=${text}`);
  return Promise.resolve();
}

