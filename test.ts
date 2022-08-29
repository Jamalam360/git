import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { getGitHubUrl } from "./main.ts";

Deno.test({
	name: "Profile",
	async fn() {
		const url = await getGitHubUrl("");
		assertEquals(url, "https://github.com/Jamalam360");
	},
});

Deno.test({
	name: "Profile with trailing slash",
	async fn() {
		const url = await getGitHubUrl("/");
		assertEquals(url, "https://github.com/Jamalam360");
	},
});

Deno.test({
	name: "Repo",
	async fn() {
		const url = await getGitHubUrl("UtilityBelt");
		assertEquals(url, "https://github.com/JamCoreModding/UtilityBelt");
	},
});

Deno.test({
	name: "Repo with trailing slash",
	async fn() {
		const url = await getGitHubUrl("UtilityBelt/");
		assertEquals(url, "https://github.com/JamCoreModding/UtilityBelt");
	},
});

Deno.test({
	name: "Repo (latest)",
	async fn() {
		const url = await getGitHubUrl("UtilityBelt/latest");
		assertEquals(
			url,
			"https://github.com/JamCoreModding/UtilityBelt/releases/latest",
		);
	},
});

Deno.test({
	name: "Repo (latest) with trailing slash",
	async fn() {
		const url = await getGitHubUrl("UtilityBelt/latest/");
		assertEquals(
			url,
			"https://github.com/JamCoreModding/UtilityBelt/releases/latest",
		);
	},
});

Deno.test({
	name: "Invalid repo",
	async fn() {
		const url = await getGitHubUrl("InvalidRepo");
		assertEquals(url, undefined);
	},
});
