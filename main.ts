import { serve } from "https://deno.land/std@0.151.0/http/mod.ts";
import { config } from "https://deno.land/std@0.151.0/dotenv/mod.ts";

await config({
    export: true,
});

const githubUsers = Deno.env.get("GITHUB_USERS")!.split(",").map((user) =>
    user.trim()
);
const cache: Map<string, { time: number; url: string }> = new Map();

await serve(
    async (req) => {
        let path = new URL(req.url).pathname;

        if (path.startsWith("/")) {
            path = path.substring(1);
        }

        let url = "";

        if (cache.has(path)) {
            const { time, url } = cache.get(path)!;

            // Check if the cache is still valid (1 hour)
            if (time > Date.now() - 3600000) {
                return new Response("", {
                    status: 302,
                    headers: {
                        Location: url,
                    },
                });
            } else {
                cache.delete(path);
            }
        }

        for (const user of githubUsers) {
            let fetchUrl = `https://github.com/${user}/${path == "" ? "" : `/${path}`}`
            
            if (fetchUrl.includes("/latest")) {
                fetchUrl = fetchUrl.replace("/latest", "/releases/latest");
            }

            const req = await fetch(
                fetchUrl,
            );

            if (req.status == 404) continue;

            url = fetchUrl;
            cache.set(path, { time: Date.now(), url });
            break;
        }

        if (url == "") {
            return new Response("", {
                status: 404,
            });
        } else {
            return new Response("", {
                status: 302,
                headers: {
                    Location: url,
                },
            });
        }
    },
    {
        port: parseInt(Deno.env.get("PORT") ?? "8000"),
    },
);
