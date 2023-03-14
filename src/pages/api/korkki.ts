import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import { WpPost } from "@shl/wptypes";

export interface Article {
  title: string;
  post: string;
  link: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Article>
) {
  if (!req.query.url) throw new Error("No url");

  if (!(req.query.url as string).startsWith("https://shl.fi/"))
    throw new Error("No href");

  const resp = await fetch(req.query.url as string);
  const html = await resp.text();

  const $ = cheerio.load(html);

  const link = $(`link[type='application/json']`).attr();
  const href = link?.href;

  if (!href) throw new Error("No href");
  const id = href.split("posts/").pop();

  const apiResp = await fetch(`https://shl.fi/wp-json/wp/v2/posts/${id}`);
  const json = (await apiResp.json()) as WpPost;

  res.status(200).json({
    post: json.content.rendered,
    link: json.link,
    title: json.title.rendered,
  });
}
