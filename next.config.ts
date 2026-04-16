import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "foresight360";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // When deployed to GitHub Pages at https://<user>.github.io/<repo>/
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
};

export default nextConfig;
