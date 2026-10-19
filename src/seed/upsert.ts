/*
 * How the seed writes, and how it resolves names to ids.
 *
 * The old seed cleared every collection before writing -- it called itself "a
 * reset rather than an append". That is safe while the database holds nothing
 * but seed output and destructive the moment Edge has edited anything, which
 * is the week after this ships.
 *
 * So there are three modes, and the safe one is the default:
 *
 *   fill   (default) create what is missing, leave what exists alone.
 *                    Running this twice changes nothing the second time.
 *   force            overwrite existing documents in place, keeping their ids
 *                    so relationships survive. For re-importing after a
 *                    content fix, when you know what you are overwriting.
 *   fresh            delete everything, then create. For a clean rebuild.
 *
 * "fill" means a re-run cannot destroy an editor's work, and the script
 * reports what it skipped so nobody mistakes a no-op for a failure.
 */

export type SeedMode = "fill" | "force" | "fresh";

export type SeedReport = { created: number; updated: number; skipped: number };

export function decideWrite(
  exists: boolean,
  mode: SeedMode,
): "create" | "update" | "skip" {
  if (!exists) return "create";
  if (mode === "fresh") return "create";
  if (mode === "force") return "update";
  return "skip";
}

/**
 * The seed's mode, from the SEED_MODE environment variable.
 *
 * It is an environment variable and not a flag because a flag cannot work
 * here: `payload run` parses its own arguments and hands the script a
 * process.argv of exactly [node, payload/bin.js] -- no script path, no
 * trailing flags. An earlier version read --fill/--force/--fresh from argv,
 * which meant `npm run seed:fresh` and `npm run seed:force` both quietly ran
 * fill and reported it, so the destructive mode nobody wanted by accident was
 * also the mode nobody could actually reach. Do not move this back to argv.
 *
 * An unrecognised value throws rather than defaulting. SEED_MODE=force that
 * silently became fill would leave an editor believing their overwrite ran.
 */
export function seedMode(value: string | undefined): SeedMode {
  if (value === undefined || value === "") return "fill";
  if (value === "fill" || value === "force" || value === "fresh") return value;
  throw new Error(
    `SEED_MODE=${JSON.stringify(value)} is not a mode. Use "fill" (the ` +
      'default, which leaves existing documents alone), "force" (overwrite ' +
      'them) or "fresh" (delete the seeded collections first).',
  );
}

/** Case-, edge-whitespace- and inner-whitespace-insensitive comparison form. */
function normalise(key: string | undefined | null): string {
  return (key ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

/** Levenshtein distance, for suggesting the name the author probably meant. */
function distance(a: string, b: string): number {
  const rows = Array.from({ length: b.length + 1 }, (_, i) => [
    i,
    ...Array(a.length).fill(0),
  ]);
  for (let j = 1; j <= a.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      rows[i][j] =
        b[i - 1] === a[j - 1]
          ? rows[i - 1][j - 1]
          : 1 + Math.min(rows[i - 1][j], rows[i][j - 1], rows[i - 1][j - 1]);
    }
  }
  return rows[b.length][a.length];
}

/**
 * Resolve a human name to the id of the document created for it.
 *
 * Throws rather than returning undefined. A silent miss here produces a
 * project page with no client, a partner card linking nowhere, and no error
 * anywhere -- the kind of fault that reaches the client before anyone notices.
 *
 * Two entries whose keys normalise to the same string are ambiguous, so
 * building the resolver throws instead of letting the later one win silently.
 */
export function makeResolver<T>(
  label: string,
  entries: { key: string; id: T }[],
): (key: string) => T {
  const index = new Map<string, T>();
  for (const entry of entries) {
    const normalised = normalise(entry.key);
    if (normalised === "") {
      throw new Error(
        `Cannot build the ${label} resolver: an entry has an empty name.`,
      );
    }
    // Reject a missing id at construction. The lookup below tests `has`, not
    // the value, so an entry registered with no id would "resolve" and hand
    // back undefined -- a dangling relationship written with nothing thrown,
    // which is the exact fault this resolver exists to prevent. The seed builds
    // entries as `{ key: name, id: created.id }`, so a create that returns no
    // id is how this arrives.
    if (entry.id === undefined || entry.id === null) {
      throw new Error(
        `Cannot build the ${label} resolver: "${entry.key}" was registered with no id. ` +
          `The ${label} was probably not created successfully, so nothing can reference it. ` +
          `Check the ${label} step's output before seeding what depends on it.`,
      );
    }
    if (index.has(normalised)) {
      throw new Error(
        `Cannot build the ${label} resolver: two ${label}s are named "${entry.key}" ` +
          `(names are compared ignoring case and spacing). Make them distinct so ` +
          `references cannot resolve to the wrong one.`,
      );
    }
    index.set(normalised, entry.id);
  }
  const known = entries.map((e) => e.key);

  return (key: string): T => {
    const normalised = normalise(key);
    if (normalised !== "" && index.has(normalised))
      return index.get(normalised) as T;

    const shown = key === undefined || key === null ? String(key) : `"${key}"`;
    const fix =
      `Fix the spelling where the ${label} is referenced, or add the missing ` +
      `${label} to the ${label} directory before seeding.`;

    if (known.length === 0) {
      throw new Error(
        `No ${label} matches ${shown}: no ${label}s were registered at all, ` +
          `so the ${label} step probably did not run before this one. ${fix}`,
      );
    }

    const nearest =
      normalised === ""
        ? undefined
        : known
            .map((name) => ({ name, d: distance(normalised, normalise(name)) }))
            .sort((a, b) => a.d - b.d)[0];

    const hint =
      nearest && nearest.d <= Math.max(3, Math.floor(nearest.name.length / 3))
        ? ` Did you mean "${nearest.name}"?`
        : ` Known ${label}s: ${known.join(", ")}.`;

    throw new Error(`No ${label} matches ${shown}.${hint} ${fix}`);
  };
}
