import dotenv from 'dotenv';
dotenv.config();

const databaseId = process.env.DATABASE_ID;
const secret = process.env.NOTION_SECRET;

async function addPhrase() {
    console.log("Adding 'Frase 1' with timestamp to Notion...");

    const body = {
        parent: { database_id: databaseId },
        properties: {
            "Frase ": { // Note the space at the end as discovered
                title: [
                    {
                        text: {
                            content: "Frase 1"
                        }
                    }
                ]
            },
            "fecha": {
                date: {
                    start: new Date().toISOString()
                }
            }
        }
    };

    try {
        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secret}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Success! Item added.");
            console.log("New Page ID:", data.id);
            console.log("URL:", data.url);
        } else {
            console.error("Error adding item:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("Request failed:", e);
    }
}

addPhrase();
