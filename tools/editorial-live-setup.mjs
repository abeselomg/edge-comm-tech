/*
 * Server-side half of the editorial probe: creates (and later removes) the two
 * throwaway users tools/check-editorial-live.mjs signs in as. Runs on the
 * server through the local API; nothing public is added.
 *
 *   EDITORIAL_SETUP_MODE=dry-run  (default) say what would happen; change nothing
 *   EDITORIAL_SETUP_MODE=create   create admin-probe@example.invalid (admin) and
 *                                 editor-probe@example.invalid (editor) with random
 *                                 passwords, written (mode 0600) to EDITORIAL_SETUP_OUT
 *                                 (default /root/editorial-probe.env); never printed
 *   EDITORIAL_SETUP_MODE=delete   remove both users and the file; print what is left
 *
 * `payload run` strips arguments, so the mode is an environment variable. From
 * the app directory with the server's environment loaded:
 *   EDITORIAL_SETUP_MODE=create NODE_ENV=production npx payload run tools/editorial-live-setup.mjs
 */
import { chmod, rm, writeFile } from "node:fs/promises";
import { getPayload } from "payload";
import config from "../src/payload.config";
import { runSetup } from "./editorial-live-setup-lib.mjs";
import { unsafeEnvironment } from "./forms-live-shared.mjs";

// Before getPayload: outside production Payload would start its interactive dev schema push.
const unsafe = unsafeEnvironment(process.env);
if (unsafe) {
  console.error(unsafe);
  process.exit(2);
}

let code = 0;
try {
  const payload = await getPayload({ config });
  await runSetup({
    payload,
    env: process.env,
    writeFile,
    chmod,
    rm: (path) => rm(path, { force: true }),
    log: (line) => console.log(line),
  });
} catch (error) {
  console.error(error.message);
  code = 1;
}
process.exit(code);
