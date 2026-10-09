import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users, feedFollows } from "../schemas/schema";

export async function createFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({
        name: name,
        url: url,
        userId: userId
    }).returning();

    return result;
}

export async function getFeeds() {
    return await db.select({
        feed: feeds,
        user: users,
    }).from(feeds).innerJoin(users, eq(feeds.userId, users.id));
}

export async function getFeedByURL(url: string) {
    const [feed] = await db
        .select()
        .from(feeds)
        .where(eq(feeds.url, url));

    return feed;
}

export async function createFeedFollow(
    userId: string,
    feedId: string,
) {
    const [newFeedFollow] = await db.insert(feedFollows)
        .values({
            userId,
            feedId,
        }).returning();

    const [result] = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedName: feeds.name,
        }).from(feedFollows)
        .innerJoin(
            feeds,
            eq(feedFollows.feedId, feeds.id),
        )
        .innerJoin(
            users,
            eq(feedFollows.userId, users.id),
        )
        .where(eq(feedFollows.id, newFeedFollow.id));

    if (!result) {
        throw new Error("Could not retrieve the new feed follow");
    }

    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    return await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(
            feeds,
            eq(feedFollows.feedId, feeds.id),
        )
        .innerJoin(
            users,
            eq(feedFollows.userId, users.id),
        )
        .where(eq(feedFollows.userId, userId));
}