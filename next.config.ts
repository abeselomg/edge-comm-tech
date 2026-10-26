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
    localPatterns: [
      { pathname: "/api/media/file/**" },
      { pathname: "/edge-logo.png" },
      { pathname: "/solutions/art/**" },
    ],
  },
  /*
   * Search-engine switch, for every response including files and API replies
   * that carry no <head>. The same rule as src/lib/seo/site.ts (only the exact
   * string "true" is indexable); it is repeated here because the config is
   * loaded before the app's modules are. src/lib/seo/headers.test.ts keeps the
   * two in step.
   *
   * Not indexable (the default): every path is noindex. Indexable: the private
   * surfaces stay noindex always -- the admin, the API, the draft preview and the
   * form endpoints -- except /api/media/file/, the uploaded pictures the public
   * pages use, which search engines may index with the page.
   * Read when the app is built, so changing it means a redeploy.
   */
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    if (process.env.SITE_INDEXABLE !== "true") {
      return [{ source: "/:path*", headers: noindex }];
    }
    return [
      { source: "/admin/:path*", headers: noindex },
      { source: "/api/:path((?!media/file/).*)", headers: noindex },
      { source: "/preview/:path*", headers: noindex },
      { source: "/forms/:path*", headers: noindex },
    ];
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
