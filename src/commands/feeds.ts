import { readConfig } from "../config";
import { getUser } from "../lib/db/queries/users";
import { createFeed, getFeeds, getFeedByURL, createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feeds";
import { printFeed } from "./utils";

export async function handlerAddFeed(
    cmdName: string,
    ...args: string[]
): Promise<void> {
    if (args.length < 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const feedName = args[0];
    const feedURL = args[1];

    const config = readConfig();

    const user = await getUser(config.currentUserName);

    if (!user) {
        throw new Error("Current user not found");
    }

    const feed = await createFeed(
        feedName,
        feedURL,
        user.id,
    );

    const follow = await createFeedFollow(user.id, feed.id);

    console.log(`Feed: ${follow.feedName}`);
    console.log(`User: ${follow.userName}`);

    printFeed(feed, user);
}

export async function handlerFeeds(
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const results = await getFeeds();

    for (const result of results) {
        console.log(`Feed: ${result.feed.name}`);
        console.log(`  URL: ${result.feed.url}`);
        console.log(`  User: ${result.user.name}`);
    }
}

export async function handlerFollow(
    cmdName: string,
    ...args: string[]
): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const url = args[0];

    const config = readConfig();
    const user = await getUser(config.currentUserName);

    if (!user) {
        throw new Error("Current user not found");
    }

    const feed = await getFeedByURL(url);

    if (!feed) {
        throw new Error(`Feed not found: ${url}`);
    }

    const follow = await createFeedFollow(user.id, feed.id);

    console.log(`Feed: ${follow.feedName}`);
    console.log(`User: ${follow.userName}`);
}

export async function handlerFollowing(
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const config = readConfig();

    const user = await getUser(config.currentUserName);

    if (!user) {
        throw new Error("Current user not found");
    }

    const follows = await getFeedFollowsForUser(user.id);

    for (const follow of follows) {
        console.log(follow.feedName);
    }
}