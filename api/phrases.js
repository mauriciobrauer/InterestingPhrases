// Vercel Serverless Function for Phrases API
const NOTION_SECRET = process.env.NOTION_SECRET;
const DATABASE_ID = process.env.DATABASE_ID;
const NOTION_VERSION = '2022-06-28';

// Helper to format Notion Page to our App interface
const formatPage = (page) => {
    return {
        id: page.id,
        text: page.properties['Frase ']?.title[0]?.plain_text || '',
        date: page.properties['fecha']?.date?.start || page.created_time,
    };
};

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Private-Network': 'true',
};

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).setHeader('Access-Control-Allow-Origin', '*')
            .setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
            .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            .setHeader('Access-Control-Allow-Private-Network', 'true')
            .end();
    }

    // Set CORS headers for all responses
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    try {
        // GET - Fetch all phrases
        if (req.method === 'GET') {
            const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_SECRET}`,
                    'Notion-Version': NOTION_VERSION,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sorts: [
                        {
                            property: 'fecha',
                            direction: 'descending',
                        },
                    ],
                })
            });

            const data = await response.json();
            const phrases = data.results.map(formatPage);
            return res.status(200).json(phrases);
        }

        // POST - Create new phrase
        if (req.method === 'POST') {
            const { text } = req.body;
            if (!text) return res.status(400).json({ error: 'Text is required' });

            const response = await fetch('https://api.notion.com/v1/pages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_SECRET}`,
                    'Notion-Version': NOTION_VERSION,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parent: { database_id: DATABASE_ID },
                    properties: {
                        'Frase ': {
                            title: [
                                {
                                    text: {
                                        content: text,
                                    },
                                },
                            ],
                        },
                        'fecha': {
                            date: {
                                start: new Date().toISOString(),
                            },
                        },
                    },
                })
            });

            const data = await response.json();
            return res.status(200).json(formatPage(data));
        }

        // PATCH - Update phrase
        if (req.method === 'PATCH') {
            const { id, text } = req.body;
            if (!id || !text) return res.status(400).json({ error: 'ID and text are required' });

            const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${NOTION_SECRET}`,
                    'Notion-Version': NOTION_VERSION,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    properties: {
                        'Frase ': {
                            title: [
                                {
                                    text: {
                                        content: text,
                                    },
                                },
                            ],
                        },
                    },
                })
            });

            const data = await response.json();
            return res.status(200).json(formatPage(data));
        }

        // DELETE - Archive phrase
        if (req.method === 'DELETE') {
            const { id } = req.body;
            if (!id) return res.status(400).json({ error: 'ID is required' });

            const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${NOTION_SECRET}`,
                    'Notion-Version': NOTION_VERSION,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    archived: true,
                })
            });

            const data = await response.json();
            return res.status(200).json({ id: data.id, archived: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
