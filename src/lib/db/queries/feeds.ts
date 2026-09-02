import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schemas/schema";

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