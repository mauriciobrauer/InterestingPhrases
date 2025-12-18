import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variables for production
const NOTION_SECRET = process.env.NOTION_SECRET;
const DATABASE_ID = process.env.DATABASE_ID;
const NOTION_VERSION = '2022-06-28';

const app = express();
const port = process.env.PORT || 3001;


// Configure CORS with Private Network Access support
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
}));

// Add Private Network Access headers for Chrome
app.use((req, res, next) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(204).end();
    }

    // Add headers for all requests
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    next();
});

app.use(express.json());

// --- Helper to format Notion Page to our App interface ---
const formatPage = (page) => {
    return {
        id: page.id,
        text: page.properties['Frase ']?.title[0]?.plain_text || '',
        date: page.properties['fecha']?.date?.start || page.created_time,
    };
};

// GET Phrases
app.get('/api/phrases', async (req, res) => {
    try {
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
        res.json(phrases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// POST New Phrase
app.post('/api/phrases', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
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
        res.json(formatPage(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH Edit Phrase
app.patch('/api/phrases/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
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
        res.json(formatPage(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE Phrase (Archive)
app.delete('/api/phrases/:id', async (req, res) => {
    const { id } = req.params;
    try {
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
        res.json({ id: data.id, archived: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
