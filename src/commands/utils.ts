import { fetchFeed } from "../lib/rss";
import { feeds, users } from "../lib/db/schemas/schema";

export async function handlerAgg(
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const feed = await fetchFeed(
        "https://www.wagslane.dev/index.xml",
    );

    console.log(JSON.stringify(feed, null, 1));
}

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export function printFeed(feed: Feed, user: User): void {
    console.log("Feed:");
    console.log(`  ID: ${feed.id}`);
    console.log(`  Name: ${feed.name}`);
    console.log(`  URL: ${feed.url}`);
    console.log(`  User: ${user.name}`);
}