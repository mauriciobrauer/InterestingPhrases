import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

const notion = new Client({
    auth: process.env.NOTION_SECRET,
})

const databaseId = process.env.DATABASE_ID;

async function getDatabaseColumns() {
    try {
        console.log("Notion Databases methods:", Object.keys(notion.databases || {}));
        // Query database implementation
        console.log("Querying database items...");
        const response = await notion.databases.query({ database_id: databaseId, page_size: 1 });

        if (response.results.length > 0) {
            const item = response.results[0];
            console.log("\nFound an item! deducing columns from item properties:");
            if (item.properties) {
                Object.keys(item.properties).forEach(key => {
                    console.log(`- Name: "${key}", Type: ${item.properties[key].type}`);
                });
            }
        } else {
            console.log("Database is empty or no read access to contents.");
            // Si está vacía, no podemos deducir columnas por items, pero imprimimos lo que tenemos.
            console.log(JSON.stringify(response, null, 2));
        }

    } catch (error) {
        console.error("Error retrieving database:", error.body || error.message);
    }
}

getDatabaseColumns();
