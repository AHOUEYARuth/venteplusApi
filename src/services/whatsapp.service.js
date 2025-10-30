import axios from "axios"
export async function sendMessage(phoneNumber, text) {
  const encodedMessage = encodeURIComponent(text);
  const number = phoneNumber.toString().replace("+","")
  const url = `https://wachap.app/api/send?number=${number}&type=text&message=${encodedMessage}&instance_id=6903876D50DB5&access_token=6903873d04570`;
  const res = await axios.get(url);
  console.log("response whatsapp")
  console.log(res)
  return res;
}

