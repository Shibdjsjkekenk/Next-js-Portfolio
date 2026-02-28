import Banner from "@/models/Banner";
import { connectDB } from "@/lib/db";

export async function buildIdentityText() {
  await connectDB();

  const banner = await Banner.findOne({ isActive: true });

  if (!banner) return "No identity data found.";

  let text = "";

  // Raw banner data AI ko denge
  text += `Title: ${banner.title}\n`;
  text += `Intro: ${banner.paragraph}\n`;

  if (banner.italicTitle) {
    text += `Tagline: ${banner.italicTitle}\n`;
  }

  return text;
}