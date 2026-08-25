import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
        },
    });

    const xml = await response.text();

    const parser = new XMLParser({ processEntities: false, });

    const data = parser.parse(xml);

    if (!data.rss || !data.rss.channel) {
        throw new Error("Invalid RSS feed: missing channel");
    }

    const channel = data.rss.channel;

    if (
        typeof channel.title !== "string" ||
        typeof channel.link !== "string" ||
        typeof channel.description !== "string"
    ) {
        throw new Error("Invalid RSS feed: missing channel metadata");
    }

    let items: any[] = [];

    if (channel.item) {
        items = Array.isArray(channel.item) ? channel.item : [channel.item];
    }

    const validItems: RSSItem[] = [];

    for (const item of items) {
        if (
            typeof item.title !== "string" ||
            typeof item.link !== "string" ||
            typeof item.description !== "string" ||
            typeof item.pubDate !== "string"
        ) {
            continue;
        }

        validItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        });
    }

    const rss: RSSFeed = {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: validItems,
        },
    };

    return rss;

};