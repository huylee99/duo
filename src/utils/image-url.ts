import { env } from "~/env.mjs";

const genImageUrl = (key: string) => {
  if (key.startsWith("https://")) {
    return key;
  }

  return `${env.NEXT_PUBLIC_CLOUD_ORIGIN}/${key}`;
};

export { genImageUrl };
