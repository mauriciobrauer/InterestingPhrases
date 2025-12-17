import dotenv from 'dotenv';
dotenv.config();

const databaseId = process.env.DATABASE_ID;
const secret = process.env.NOTION_SECRET;

const phrases = [
    "The greatest sources of suffering are the lies we tell ourselves",
    "Don't see obstacles as threats but as challenges",
    "One of the hardest things about traumatized people is to confront their shame about how they behaved during the traumatic episode",
    "I think this man is suffering from memories",
    "The goal is not a life Full of excitement is life full of peace.",
    "El mayor miedo es que una empresa triunfe sin ti"
];

async function addPhrases() {
    console.log(`Adding ${phrases.length} phrases to Notion...\n`);

    for (let i = 0; i < phrases.length; i++) {
        const text = phrases[i];
        console.log(`[${i + 1}/${phrases.length}] Adding: "${text.substring(0, 50)}..."`);

        try {
            const response = await fetch('https://api.notion.com/v1/pages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${secret}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parent: { database_id: databaseId },
                    properties: {
                        'Frase ': {
                            title: [
                                {
                                    text: {
                                        content: text
                                    }
                                }
                            ]
                        },
                        'fecha': {
                            date: {
                                start: new Date().toISOString()
                            }
                        }
                    }
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`✓ Success!\n`);
            } else {
                console.error(`✗ Error:`, data);
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));

        } catch (e) {
            console.error(`✗ Request failed:`, e);
        }
    }

    console.log('\n✨ All phrases added!');
}

addPhrases();
