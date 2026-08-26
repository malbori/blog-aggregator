import { fetchFeed } from "../lib/rss";

export async function handlerAgg(
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const feed = await fetchFeed(
        "https://www.wagslane.dev/index.xml",
    );

    console.log(JSON.stringify(feed, null, 1));
}

export async function handlerFeeds(name: string, url: string) {
    
}