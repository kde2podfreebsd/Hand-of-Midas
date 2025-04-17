import { Options } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";

export enum Protocols {
  ETH = "ETH",
  SUI = "SUI",
}

export const API1_URL = "http://0.0.0.0:8000";
export const API2_URL = "http://localhost:8080";

export const reactMarkdownOptions: Readonly<Options> = {
  rehypePlugins: [rehypeRaw],
  remarkPlugins: [remarkGfm, remarkParse],
};
