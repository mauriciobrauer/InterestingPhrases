import dotenv from 'dotenv';
dotenv.config();

const databaseId = process.env.DATABASE_ID;
const secret = process.env.NOTION_SECRET;

async function fetchNotion() {
    console.log("Fetching Notion DB columns via raw fetch...");

    try {
        // Primero intentamos retrieve database de nuevo, a ver si properties aparece con raw fetch
        const dbRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secret}`,
                'Notion-Version': '2022-06-28',
            }
        });

        const dbData = await dbRes.json();

        if (dbData.properties) {
            console.log("\nFound columns (properties) via Retrieve DB:");
            Object.keys(dbData.properties).forEach(key => {
                console.log(`- "${key}" (${dbData.properties[key].type})`);
            });
            return;
        } else {
            console.log("Retrieve DB did not return properties. Response snippet:", JSON.stringify(dbData).slice(0, 200));
        }

        // Si falla, intentamos query
        console.log("\nTrying Query DB to find item properties...");
        const queryRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secret}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page_size: 1 })
        });

        const queryData = await queryRes.json();
        if (queryData.results && queryData.results.length > 0) {
            const item = queryData.results[0];
            if (item.properties) {
                console.log("\nFound columns (properties) via Query DB Item:");
                Object.keys(item.properties).forEach(key => {
                    console.log(`- "${key}" (${item.properties[key].type})`);
                });
            }
        } else {
            console.log("Query DB returned no results or error:", JSON.stringify(queryData).slice(0, 200));
        }

    } catch (e) {
        console.error("Fetch error:", e);
    }
}

fetchNotion();
