import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS must be registered before any route so preflight requests succeed.
// API is read-only data + chat; open origin is intentional for Looker Studio/dashboards.
app.use('/api', cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));

const MAX_MESSAGE_LENGTH = 1000;

// Each chat request may call Gemini with the server's key, so cap the request rate per IP.
const chatLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a minute and try again.' },
});

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// Analytical Fallback Engine for instant Q&A when Gemini API key is missing or offline
function generateAnalyticalFallback(query: string): string {
  const q = query.toLowerCase();

  const cudKeywords = ['create', 'insert', 'add tract', 'update', 'edit', 'delete', 'remove', 'modify', 'drop', 'alter', 'overwrite'];
  if (cudKeywords.some((kw) => q.includes(kw))) {
    return 'Safe Read-Only Notice: I am a read-only assistant designed to help analyze Central Florida food data. I cannot create, edit, or delete database records. However, I can answer questions and calculate statistics for the 490 census tracts.';
  }

  // Question: Which county has the most food deserts?
  if (q.includes('most food desert') || (q.includes('county') && q.includes('most') && q.includes('desert'))) {
    return `Orange County has the most classic food deserts:

- Orange County: 49 classic food desert tracts (328,400 residents)
- Osceola County: 13 classic food desert tracts (92,300 residents)
- Seminole County: 4 classic food desert tracts (18,200 residents)
- Lake County: 2 classic food desert tracts (4,722 residents)

Orange County accounts for 72% of all classic food deserts in Central Florida.`;
  }

  // Question: Which county has the most food gaps / highest gap count?
  if (q.includes('most gap') || q.includes('highest gap') || (q.includes('county') && q.includes('most') && q.includes('gap'))) {
    return `Orange County has the most food access gap tracts overall:

- Orange County: 90 gap tracts (577,381 residents)
- Osceola County: 28 gap tracts (196,282 residents)
- Lake County: 17 gap tracts (94,565 residents)
- Seminole County: 14 gap tracts (80,404 residents)

Total across Central Florida: 149 food gap tracts (948,632 residents).`;
  }

  // Question: How many families lack both grocery stores and cars? / Vehicle gap
  if (q.includes('lack') || q.includes('vehicle') || q.includes('car') || q.includes('transit')) {
    return `Vehicle-Compounded Gap Statistics:

- Total affected residents: 697,700 people live in vehicle-compounded gap neighborhoods across Central Florida.
- Primary tracts: 76 census tracts (108 total including secondary gaps).
- Breakdown by county:
  - Orange County: 36 primary tracts (374,500 residents)
  - Osceola County: 15 primary tracts (152,100 residents)
  - Lake County: 15 primary tracts (88,700 residents)
  - Seminole County: 10 primary tracts (82,400 residents)`;
  }

  // Question: How many stores accept SNAP food benefits?
  if (q.includes('how many store') || q.includes('snap store') || q.includes('retailer') || q.includes('snap retailer') || q.includes('food stamp store') || (q.includes('how many') && q.includes('snap'))) {
    return `Authorized SNAP Food Retailers:

- Total SNAP stores in database: 1,697 authorized food retailers across Central Florida.
- Orange County: 1,042 stores
- Osceola County: 247 stores
- Seminole County: 219 stores
- Lake County: 189 stores`;
  }

  // Question: How many churches / faith pantries?
  if (q.includes('church') || q.includes('pantry') || q.includes('faith')) {
    return `Church Community Delivery Sites:

- Total geocoded churches in database: 40 church pantries.
- These sites serve as high-priority delivery locations for mobile food market stops in verified food gap areas.`;
  }

  // Question: How many schools / school meal sites?
  if (q.includes('school') || q.includes('student') || q.includes('meal site')) {
    return `School Meal Pickup Sites:

- Total public school meal sites in database: 35 school delivery locations.
- These sites serve as key distribution hubs for meal box deliveries and mobile market visits.`;
  }

  // Question: What is a blind spot?
  if (q.includes('blind') || q.includes('unknown') || q.includes('uncertain')) {
    return `Possible Blind Spots Definition and Summary:

- Definition: Census tracts showing moderate indicators of food hardship across multiple metrics, requiring community field verification.
- Total blind spot tracts: 58 census tracts (~332,800 residents).
- Breakdown by county:
  - Orange County: 26 tracts (144,300 residents)
  - Seminole County: 16 tracts (96,900 residents)
  - Osceola County: 8 tracts (48,900 residents)
  - Lake County: 8 tracts (42,700 residents)`;
  }

  // Question: What is a classic food desert?
  if (q.includes('classic') || q.includes('desert')) {
    return `Classic Food Desert Definition and Summary:

- Definition: High poverty rate (17.1% or higher) where residents live more than 1 mile from a grocery store in cities or 10 miles in rural areas.
- Total classic food deserts: 68 census tracts (443,622 residents).
- Orange County: 49 tracts
- Osceola County: 13 tracts
- Seminole County: 4 tracts
- Lake County: 2 tracts`;
  }

  // Question: SNAP gap definition / count
  if (q.includes('snap gap') || q.includes('enrollment gap')) {
    return `SNAP Enrollment Gap Definition and Summary:

- Definition: High poverty neighborhoods where families qualify for SNAP food benefits, but participation rates remain low.
- Total primary SNAP gap tracts: 5 census tracts (63,000 residents), all located in Orange County (12 total including secondary gaps).`;
  }

  // County specific questions
  if (q.includes('orange')) {
    return `Orange County Food Access Profile:

- Total census tracts analyzed: 267 tracts
- Food gap tracts: 90 tracts (577,381 residents)
- Classic food deserts: 49 tracts (328,400 residents)
- Vehicle-compounded gaps: 36 primary tracts (374,500 residents)
- SNAP enrollment gaps: 5 primary tracts (51,200 residents)
- Possible blind spots: 26 tracts (144,300 residents)
- Authorized SNAP retailers: 1,042 stores`;
  }

  if (q.includes('osceola')) {
    return `Osceola County Food Access Profile:

- Total census tracts analyzed: 59 tracts
- Food gap tracts: 28 tracts (196,282 residents)
- Classic food deserts: 13 tracts (92,300 residents)
- Vehicle-compounded gaps: 15 primary tracts (152,100 residents)
- Possible blind spots: 8 tracts (48,900 residents)
- Authorized SNAP retailers: 247 stores`;
  }

  if (q.includes('seminole')) {
    return `Seminole County Food Access Profile:

- Total census tracts analyzed: 89 tracts
- Food gap tracts: 14 tracts (80,404 residents)
- Classic food deserts: 4 tracts (18,200 residents)
- Vehicle-compounded gaps: 10 primary tracts (82,400 residents)
- Possible blind spots: 16 tracts (96,900 residents)
- Authorized SNAP retailers: 219 stores`;
  }

  if (q.includes('lake')) {
    return `Lake County Food Access Profile:

- Total census tracts analyzed: 75 tracts
- Food gap tracts: 17 tracts (94,565 residents)
- Classic food deserts: 2 tracts (4,722 residents)
- Vehicle-compounded gaps: 15 primary tracts (88,700 residents)
- Possible blind spots: 8 tracts (42,700 residents)
- Authorized SNAP retailers: 189 stores`;
  }

  return `Central Florida Food Access Overview:

- Total census tracts evaluated: 490 tracts across 4 counties
- Total regional population: 2,429,919 residents
- Total food gap tracts: 149 tracts (948,632 residents)
- Classic food deserts: 68 tracts (443,622 residents)
- Vehicle-compounded gaps: 76 primary tracts (697,700 residents)
- SNAP enrollment gaps: 5 primary tracts (63,000 residents)
- Possible blind spots: 58 tracts (332,800 residents)
- No gap identified: 281 tracts (1,481,287 residents)
- Community sites: 1,697 SNAP stores, 40 church pantries, 35 school meal sites`;
}

// Read-only Chat Endpoint
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` });
    }

    // Check for CUD intent in prompt
    const cudKeywords = ['create', 'insert', 'add tract', 'update', 'edit', 'delete', 'remove', 'modify', 'drop', 'alter', 'overwrite'];
    if (cudKeywords.some((kw) => message.toLowerCase().includes(kw))) {
      return res.json({
        reply:
          'Notice: I am Tracky, your Central Florida Food Access Assistant. I can answer questions and calculate statistics for the 490 census tracts, 1,697 SNAP stores, 40 churches, and 35 school meal sites, but I cannot modify database records.',
      });
    }

    // Dynamic API key lookup on every request
    // Server-only variables: never read VITE_* names here, those are bundled into the client.
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are Tracky, the Central Florida Food Access Assistant.
Your primary role is to answer questions strictly related to the official Central Florida Food Access Gaps dataset covering 490 census tracts across Orange, Osceola, Seminole, and Lake counties.

CRITICAL FORMATTING RULES (STRICT COMPLIANCE REQUIRED):
1. ABSOLUTELY NO EMOJIS: Do NOT include any emojis anywhere in your response under any circumstances.
2. ABSOLUTELY NO DOUBLE ASTERISKS: Do NOT use ** anywhere in your response. Do NOT use ** for bold text. Output pure plain text.
3. CONSTRAIN RESULTS SPECIFIC TO THE ANSWER: Answer only what the user specifically asks for. Do not include unrequested general overviews, background intro text, or extra topics unless directly asked.
4. EASY TO READ: Use clean plain text with simple hyphens (-) for bullet points and clean line breaks.

KEY REGIONAL DATA:
- Total Census Tracts: 490 (Orange: 267, Osceola: 59, Lake: 75, Seminole: 89)
- Total Population: 2,429,919 residents
- Tracts with Food Access Gap: 149 tracts (948,632 affected residents)
- Classic Food Deserts: 68 tracts (443,622 residents) - High poverty and low store access
- Vehicle-Compounded Gaps: 76 tracts primary / 108 total (697,700 residents) - Low access and low car ownership
- SNAP Enrollment Gaps: 5 tracts primary / 12 total (63,000 residents) - High poverty but low SNAP signups
- Possible Blind Spots: 58 tracts (332,800 residents) - Moderate hardship signals
- Insufficient Data: 2 tracts
- No Gap Identified: 281 tracts (1.48M residents)
- Community Infrastructure: 1,697 SNAP stores, 40 Church pantries, 35 School meal sites

RULES:
1. READ-ONLY SCOPE: You can query and analyze data. If asked to edit or delete data, state simply in plain text that you answer questions and calculate statistics.
2. ACCURACY: Always use exact canonical numbers from the dataset.
3. CONSTRAINED & PLAIN: Keep answers clean, plain text, easy to read, and constrained directly to the user query.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: message,
          config: {
            systemInstruction,
          },
        });

        const replyText = response.text || generateAnalyticalFallback(message);
        return res.json({ reply: replyText });
      } catch (geminiError: unknown) {
        console.warn('Gemini API call failed, falling back to Analytical Engine:', errorMessage(geminiError));
        return res.json({ reply: generateAnalyticalFallback(message) });
      }
    }

    // Fallback if no API key is set
    return res.json({ reply: generateAnalyticalFallback(message) });
  } catch (error: unknown) {
    console.error('Chat Endpoint Error:', error);
    return res.status(500).json({ error: 'Something went wrong while processing your request.' });
  }
});

/** Minimal shape needed for county filtering; other fields pass through untouched. */
interface CountyRecord {
  county: string;
  [key: string]: unknown;
}

// Helper: Load JSON datasets from disk or memory
function loadDatasetFile<T = unknown>(filename: string): T | null {
  const filePath = path.join(__dirname, 'public', 'data', filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  }
  return null;
}

// REST API Database Endpoint: Census Tracts (For Looker Studio, External APIs, Dashboards)
app.get('/api/db/tracts', (req, res) => {
  try {
    const tractsData = loadDatasetFile<CountyRecord[]>('central_florida_food_gaps.json');
    if (!tractsData) {
      return res.status(404).json({ error: 'Census tracts database records not found.' });
    }
    const county = req.query.county as string;
    let result = tractsData;
    if (county && county !== 'All') {
      result = tractsData.filter((t) => t.county.toLowerCase() === county.toLowerCase());
    }
    res.json({
      totalCount: result.length,
      databaseId: 'ai-studio-tracktwise-7db24125-8a82-40c9-b324-b7ed52892215',
      collection: 'census_tracts',
      data: result,
    });
  } catch (err: unknown) {
    console.error('API error:', errorMessage(err));
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// REST API Database Endpoint: Authorized SNAP Retailers
app.get('/api/db/snap-retailers', (req, res) => {
  try {
    const retailersData = loadDatasetFile<CountyRecord[]>('central_florida_snap_retailers.json');
    if (!retailersData) {
      return res.status(404).json({ error: 'SNAP retailers database records not found.' });
    }
    const county = req.query.county as string;
    let result = retailersData;
    if (county && county !== 'All') {
      result = retailersData.filter((r) => r.county.toLowerCase() === county.toLowerCase());
    }
    res.json({
      totalCount: result.length,
      databaseId: 'ai-studio-tracktwise-7db24125-8a82-40c9-b324-b7ed52892215',
      collection: 'snap_retailers',
      data: result,
    });
  } catch (err: unknown) {
    console.error('API error:', errorMessage(err));
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// REST API Database Endpoint: Church Community Sites
app.get('/api/db/churches', (req, res) => {
  try {
    const churchesData = loadDatasetFile<unknown[]>('central_florida_churches.json');
    res.json({
      totalCount: churchesData?.length || 0,
      databaseId: 'ai-studio-tracktwise-7db24125-8a82-40c9-b324-b7ed52892215',
      collection: 'churches',
      data: churchesData || [],
    });
  } catch (err: unknown) {
    console.error('API error:', errorMessage(err));
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// REST API Database Endpoint: Public School Meal Sites
app.get('/api/db/schools', (req, res) => {
  try {
    const schoolsData = loadDatasetFile<unknown[]>('central_florida_schools.json');
    res.json({
      totalCount: schoolsData?.length || 0,
      databaseId: 'ai-studio-tracktwise-7db24125-8a82-40c9-b324-b7ed52892215',
      collection: 'schools',
      data: schoolsData || [],
    });
  } catch (err: unknown) {
    console.error('API error:', errorMessage(err));
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// REST API Database Endpoint: Regional Summary Metrics
app.get('/api/db/summary', (req, res) => {
  try {
    const summaryData = loadDatasetFile<Record<string, unknown>>('summary_metrics.json');
    res.json({
      databaseId: 'ai-studio-tracktwise-7db24125-8a82-40c9-b324-b7ed52892215',
      collection: 'summary_metrics',
      data: summaryData || {},
    });
  } catch (err: unknown) {
    console.error('API error:', errorMessage(err));
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = Number(process.env.PORT) || 3000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  app.listen(PORT, () => {
    console.log(`Production server running on port ${PORT}`);
  });
} else {
  // Vite Dev Server middleware
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dev server running at http://0.0.0.0:${PORT}`);
  });
}
