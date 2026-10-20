import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: dirname,
  images: {
    remotePatterns: [],
    /*
     * An allowlist, so naming one path excludes every other. Uploaded media
     * come from Payload's file route; the wordmark is the one asset that ships
     * with the app rather than through the CMS, and the header and footer both
     * render it through next/image, so it needs its own entry. Without it the
     * page throws "Invalid src prop" rather than falling back to the raw file.
     */
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/edge-logo.png" }],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
  turbopack: {
    root: dirname,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
