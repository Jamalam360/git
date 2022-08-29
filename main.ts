import { serve } from "https://deno.land/std@0.151.0/http/mod.ts";
import { config } from "https://deno.land/std@0.151.0/dotenv/mod.ts";

interface CacheEntry {
	time: number;
	url: string;
}

let githubUsers: string[] = [];

if (import.meta.main) {
	githubUsers = Deno.env.get("GITHUB_USERS")!.split(",").map((user) =>
		user.trim()
	);
} else {
	githubUsers = "Jamalam360,JamCoreModding".split(",").map((user) =>
		user.trim()
	);
}

const cache: Map<string, CacheEntry> = new Map();

if (import.meta.main) {
	await config({
		export: true,
	});

	await serve(
		async (req) => {
			let path = new URL(req.url).pathname;

			if (path.startsWith("/")) {
				path = path.substring(1);
			}

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

			const url = await getGitHubUrl(path);

			if (!url) {
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
}

export async function getGitHubUrl(path: string): Promise<string | undefined> {
	for (const user of githubUsers) {
		let url = `https://github.com/${user}/${path}`;

		while (url.endsWith("/")) {
			url = url.substring(0, url.length - 1);
		}

		if (url.endsWith("/latest")) {
			url = url.substring(0, url.length - "/latest".length) +
				"/releases/latest";
		}

		if (await exists(url)) {
			cache.set(path, { time: Date.now(), url });

			return url;
		}
	}
}

async function exists(url: string): Promise<boolean> {
	const req = await fetch(url);
	await req.body?.cancel();
	return req.status != 404;
}
