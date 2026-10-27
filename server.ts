import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google Gen AI with server-side API key and User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Mock Train database & Schedules
interface StationHalt {
  stationCode: string;
  stationName: string;
  distanceKm: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival: string;
  actualDeparture: string;
  delayMinutes: number;
  platform: string;
  status: 'passed' | 'current' | 'upcoming';
}

interface TrainLiveStatus {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  currentStation: string;
  nextStation: string;
  delayMinutes: number;
  statusText: string;
  speedKmh: number;
  lastUpdated: string;
  totalDistanceKm: number;
  coveredDistanceKm: number;
  halts: StationHalt[];
}

const SAMPLE_TRAINS: Record<string, TrainLiveStatus> = {
  '22436': {
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    source: 'New Delhi (NDLS)',
    destination: 'Varanasi Junction (BSB)',
    currentStation: 'Kanpur Central (CNB)',
    nextStation: 'Prayagraj Junction (PRYJ)',
    delayMinutes: 0,
    statusText: 'Running On Time',
    speedKmh: 128,
    lastUpdated: 'Just now (GPS Synced)',
    totalDistanceKm: 759,
    coveredDistanceKm: 440,
    halts: [
      {
        stationCode: 'NDLS',
        stationName: 'New Delhi',
        distanceKm: 0,
        scheduledArrival: '06:00',
        scheduledDeparture: '06:00',
        actualArrival: '06:00',
        actualDeparture: '06:00',
        delayMinutes: 0,
        platform: '16',
        status: 'passed',
      },
      {
        stationCode: 'CNB',
        stationName: 'Kanpur Central',
        distanceKm: 440,
        scheduledArrival: '10:08',
        scheduledDeparture: '10:10',
        actualArrival: '10:07',
        actualDeparture: '10:10',
        delayMinutes: 0,
        platform: '4',
        status: 'current',
      },
      {
        stationCode: 'PRYJ',
        stationName: 'Prayagraj Junction',
        distanceKm: 635,
        scheduledArrival: '12:08',
        scheduledDeparture: '12:10',
        actualArrival: '12:08',
        actualDeparture: '12:10',
        delayMinutes: 0,
        platform: '6',
        status: 'upcoming',
      },
      {
        stationCode: 'BSB',
        stationName: 'Varanasi Junction',
        distanceKm: 759,
        scheduledArrival: '14:00',
        scheduledDeparture: '14:00',
        actualArrival: '14:00',
        actualDeparture: '14:00',
        delayMinutes: 0,
        platform: '1',
        status: 'upcoming',
      },
    ],
  },
  '12002': {
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi Express',
    source: 'New Delhi (NDLS)',
    destination: 'Rani Kamalapati (RKMP)',
    currentStation: 'Agra Cantt (AGC)',
    nextStation: 'Gwalior Junction (GWL)',
    delayMinutes: 8,
    statusText: 'Delayed by 8 mins',
    speedKmh: 110,
    lastUpdated: '1 min ago (Station Feed)',
    totalDistanceKm: 702,
    coveredDistanceKm: 195,
    halts: [
      {
        stationCode: 'NDLS',
        stationName: 'New Delhi',
        distanceKm: 0,
        scheduledArrival: '06:15',
        scheduledDeparture: '06:15',
        actualArrival: '06:15',
        actualDeparture: '06:15',
        delayMinutes: 0,
        platform: '1',
        status: 'passed',
      },
      {
        stationCode: 'MTJ',
        stationName: 'Mathura Junction',
        distanceKm: 141,
        scheduledArrival: '07:19',
        scheduledDeparture: '07:20',
        actualArrival: '07:23',
        actualDeparture: '07:25',
        delayMinutes: 5,
        platform: '2',
        status: 'passed',
      },
      {
        stationCode: 'AGC',
        stationName: 'Agra Cantt',
        distanceKm: 195,
        scheduledArrival: '07:50',
        scheduledDeparture: '07:55',
        actualArrival: '07:58',
        actualDeparture: '08:03',
        delayMinutes: 8,
        platform: '1',
        status: 'current',
      },
      {
        stationCode: 'GWL',
        stationName: 'Gwalior Junction',
        distanceKm: 313,
        scheduledArrival: '09:23',
        scheduledDeparture: '09:28',
        actualArrival: '09:31',
        actualDeparture: '09:36',
        delayMinutes: 8,
        platform: '1',
        status: 'upcoming',
      },
      {
        stationCode: 'VGLJ',
        stationName: 'VGL Jhansi Junction',
        distanceKm: 410,
        scheduledArrival: '10:45',
        scheduledDeparture: '10:53',
        actualArrival: '10:50',
        actualDeparture: '10:58',
        delayMinutes: 5,
        platform: '2',
        status: 'upcoming',
      },
      {
        stationCode: 'BPL',
        stationName: 'Bhopal Junction',
        distanceKm: 701,
        scheduledArrival: '14:07',
        scheduledDeparture: '14:12',
        actualArrival: '14:10',
        actualDeparture: '14:15',
        delayMinutes: 3,
        platform: '1',
        status: 'upcoming',
      },
      {
        stationCode: 'RKMP',
        stationName: 'Rani Kamalapati',
        distanceKm: 707,
        scheduledArrival: '14:40',
        scheduledDeparture: '14:40',
        actualArrival: '14:42',
        actualDeparture: '14:42',
        delayMinutes: 2,
        platform: '5',
        status: 'upcoming',
      },
    ],
  },
  '12952': {
    trainNumber: '12952',
    trainName: 'Mumbai Central Rajdhani Express',
    source: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    currentStation: 'Kota Junction (KOTA)',
    nextStation: 'Ratlam Junction (RTM)',
    delayMinutes: 0,
    statusText: 'Running On Time',
    speedKmh: 130,
    lastUpdated: 'Just now (GPS Signal)',
    totalDistanceKm: 1384,
    coveredDistanceKm: 466,
    halts: [
      {
        stationCode: 'NDLS',
        stationName: 'New Delhi',
        distanceKm: 0,
        scheduledArrival: '16:55',
        scheduledDeparture: '16:55',
        actualArrival: '16:55',
        actualDeparture: '16:55',
        delayMinutes: 0,
        platform: '3',
        status: 'passed',
      },
      {
        stationCode: 'KOTA',
        stationName: 'Kota Junction',
        distanceKm: 466,
        scheduledArrival: '21:30',
        scheduledDeparture: '21:40',
        actualArrival: '21:30',
        actualDeparture: '21:40',
        delayMinutes: 0,
        platform: '1',
        status: 'current',
      },
      {
        stationCode: 'RTM',
        stationName: 'Ratlam Junction',
        distanceKm: 732,
        scheduledArrival: '00:35',
        scheduledDeparture: '00:38',
        actualArrival: '00:35',
        actualDeparture: '00:38',
        delayMinutes: 0,
        platform: '4',
        status: 'upcoming',
      },
      {
        stationCode: 'BRC',
        stationName: 'Vadodara Junction',
        distanceKm: 993,
        scheduledArrival: '03:45',
        scheduledDeparture: '03:55',
        actualArrival: '03:45',
        actualDeparture: '03:55',
        delayMinutes: 0,
        platform: '2',
        status: 'upcoming',
      },
      {
        stationCode: 'ST',
        stationName: 'Surat',
        distanceKm: 1123,
        scheduledArrival: '05:13',
        scheduledDeparture: '05:18',
        actualArrival: '05:13',
        actualDeparture: '05:18',
        delayMinutes: 0,
        platform: '1',
        status: 'upcoming',
      },
      {
        stationCode: 'MMCT',
        stationName: 'Mumbai Central',
        distanceKm: 1384,
        scheduledArrival: '08:35',
        scheduledDeparture: '08:35',
        actualArrival: '08:35',
        actualDeparture: '08:35',
        delayMinutes: 0,
        platform: '1',
        status: 'upcoming',
      },
    ],
  },
};

// PNR Data Mock Store
const SAMPLE_PNRS: Record<string, any> = {
  '4829104812': {
    pnr: '4829104812',
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    doj: 'Tomorrow',
    boardingStation: 'New Delhi (NDLS)',
    destinationStation: 'Mumbai Central (MMCT)',
    chartStatus: 'Chart Prepared',
    travelClass: '3A',
    quota: 'General (GN)',
    passengers: [
      {
        number: 1,
        bookingStatus: 'RAC 4',
        currentStatus: 'CNF',
        coach: 'B3',
        berth: 27,
        berthType: 'Lower Berth (LB)',
      },
      {
        number: 2,
        bookingStatus: 'RAC 5',
        currentStatus: 'CNF',
        coach: 'B3',
        berth: 28,
        berthType: 'Middle Berth (MB)',
      },
    ],
    confirmationProbability: 100,
    probabilityGrade: 'Confirmed',
  },
  '6192840192': {
    pnr: '6192840192',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    doj: 'Today',
    boardingStation: 'New Delhi (NDLS)',
    destinationStation: 'Varanasi Junction (BSB)',
    chartStatus: 'Chart Prepared',
    travelClass: 'EC',
    quota: 'General (GN)',
    passengers: [
      {
        number: 1,
        bookingStatus: 'CNF / E1 / 14',
        currentStatus: 'CNF',
        coach: 'E1',
        berth: 14,
        berthType: 'Window Seat (WS)',
      },
    ],
    confirmationProbability: 100,
    probabilityGrade: 'Confirmed',
  },
  '8291049281': {
    pnr: '8291049281',
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi Express',
    doj: 'In 2 days',
    boardingStation: 'New Delhi (NDLS)',
    destinationStation: 'Rani Kamalapati (RKMP)',
    chartStatus: 'Chart Not Prepared',
    travelClass: 'CC',
    quota: 'Tatkal (TQ)',
    passengers: [
      {
        number: 1,
        bookingStatus: 'WL 6',
        currentStatus: 'WL 2',
        coach: '--',
        berth: '--',
        berthType: 'Waitlisted',
      },
    ],
    confirmationProbability: 88,
    probabilityGrade: 'High Chance',
  },
};

// Route search trains mock list
const SEARCH_TRAINS_DATA = [
  {
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    from: 'NDLS',
    to: 'BSB',
    departure: '06:00',
    arrival: '14:00',
    duration: '8h 00m',
    days: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    punctuality: '98%',
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 1750, status: 'AVAILABLE 84' },
      { code: 'EC', name: 'Executive Class', fare: 3300, status: 'AVAILABLE 12' },
    ],
  },
  {
    trainNumber: '12302',
    trainName: 'Kolkata Rajdhani (Via Gaya)',
    from: 'NDLS',
    to: 'HWH',
    departure: '16:50',
    arrival: '09:55',
    duration: '17h 05m',
    days: ['Daily'],
    punctuality: '94%',
    classes: [
      { code: '3A', name: '3rd AC Economy/Normal', fare: 2190, status: 'AVAILABLE 34' },
      { code: '2A', name: '2nd AC', fare: 3120, status: 'RAC 6' },
      { code: '1A', name: '1st AC', fare: 5280, status: 'AVAILABLE 4' },
    ],
  },
  {
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi Express',
    from: 'NDLS',
    to: 'RKMP',
    departure: '06:15',
    arrival: '14:40',
    duration: '8h 25m',
    days: ['Daily'],
    punctuality: '96%',
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 1495, status: 'AVAILABLE 142' },
      { code: 'EC', name: 'Executive Class', fare: 2620, status: 'WL 4' },
    ],
  },
  {
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    from: 'NDLS',
    to: 'MMCT',
    departure: '16:55',
    arrival: '08:35',
    duration: '15h 40m',
    days: ['Daily'],
    punctuality: '95%',
    classes: [
      { code: '3A', name: '3rd AC', fare: 2410, status: 'AVAILABLE 18' },
      { code: '2A', name: '2nd AC', fare: 3450, status: 'AVAILABLE 6' },
      { code: '1A', name: '1st AC', fare: 5690, status: 'RAC 2' },
    ],
  },
  {
    trainNumber: '12626',
    trainName: 'Kerala SF Express',
    from: 'NDLS',
    to: 'TVC',
    departure: '20:10',
    arrival: '14:15',
    duration: '42h 05m',
    days: ['Daily'],
    punctuality: '88%',
    classes: [
      { code: 'SL', name: 'Sleeper', fare: 890, status: 'AVAILABLE 48' },
      { code: '3A', name: '3rd AC', fare: 2280, status: 'AVAILABLE 22' },
      { code: '2A', name: '2nd AC', fare: 3340, status: 'WL 12' },
    ],
  },
  {
    trainNumber: '12560',
    trainName: 'Shiv Ganga SF Express',
    from: 'NDLS',
    to: 'BSB',
    departure: '20:05',
    arrival: '06:10',
    duration: '10h 05m',
    days: ['Daily'],
    punctuality: '92%',
    classes: [
      { code: 'SL', name: 'Sleeper', fare: 480, status: 'RAC 14' },
      { code: '3A', name: '3rd AC', fare: 1250, status: 'AVAILABLE 56' },
      { code: '2A', name: '2nd AC', fare: 1780, status: 'AVAILABLE 16' },
      { code: '1A', name: '1st AC', fare: 2990, status: 'AVAILABLE 6' },
    ],
  },
];

// Rail Madad Complaints In-memory
const COMPLAINTS_STORE: any[] = [];

// API: Live Train Status
app.get('/api/trains/live/:trainNumber', (req, res) => {
  const trainNum = req.params.trainNumber.trim();
  if (SAMPLE_TRAINS[trainNum]) {
    return res.json(SAMPLE_TRAINS[trainNum]);
  }

  // Dynamic realistic simulation for any other train number
  const sampleFallback: TrainLiveStatus = {
    trainNumber: trainNum,
    trainName: `Express Special (${trainNum})`,
    source: 'Origin Station',
    destination: 'Destination Terminal',
    currentStation: 'Passing Junction Zone',
    nextStation: 'Next Scheduled Halt',
    delayMinutes: (parseInt(trainNum.slice(-2), 10) || 5) % 15,
    statusText: 'Running with minor delay',
    speedKmh: 94,
    lastUpdated: '1 min ago (Live Telemetry)',
    totalDistanceKm: 650,
    coveredDistanceKm: 320,
    halts: [
      {
        stationCode: 'ORG',
        stationName: 'Origin Terminal',
        distanceKm: 0,
        scheduledArrival: '07:00',
        scheduledDeparture: '07:15',
        actualArrival: '07:00',
        actualDeparture: '07:15',
        delayMinutes: 0,
        platform: '2',
        status: 'passed',
      },
      {
        stationCode: 'JNC',
        stationName: 'Intermediate Junction',
        distanceKm: 320,
        scheduledArrival: '11:30',
        scheduledDeparture: '11:35',
        actualArrival: '11:38',
        actualDeparture: '11:43',
        delayMinutes: 8,
        platform: '3',
        status: 'current',
      },
      {
        stationCode: 'NXT',
        stationName: 'Next City Halt',
        distanceKm: 480,
        scheduledArrival: '14:00',
        scheduledDeparture: '14:05',
        actualArrival: '14:08',
        actualDeparture: '14:13',
        delayMinutes: 8,
        platform: '1',
        status: 'upcoming',
      },
      {
        stationCode: 'DST',
        stationName: 'Final Destination Terminal',
        distanceKm: 650,
        scheduledArrival: '17:30',
        scheduledDeparture: '17:30',
        actualArrival: '17:35',
        actualDeparture: '17:35',
        delayMinutes: 5,
        platform: '4',
        status: 'upcoming',
      },
    ],
  };

  return res.json(sampleFallback);
});

// API: PNR Status Lookup
app.get('/api/pnr/:pnrNumber', (req, res) => {
  const pnr = req.params.pnrNumber.replace(/\D/g, '');
  if (pnr.length !== 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit PNR number' });
  }

  if (SAMPLE_PNRS[pnr]) {
    return res.json(SAMPLE_PNRS[pnr]);
  }

  // Dynamic generation for unknown 10-digit PNR
  const isCnf = parseInt(pnr.slice(-1), 10) % 2 === 0;
  const mockPnr = {
    pnr,
    trainNumber: '12424',
    trainName: 'Dibrugarh Rajdhani Express',
    doj: 'Upcoming Journey',
    boardingStation: 'New Delhi (NDLS)',
    destinationStation: 'Guwahati (GHY)',
    chartStatus: isCnf ? 'Chart Prepared' : 'Chart Not Prepared',
    travelClass: '3A',
    quota: 'General (GN)',
    passengers: [
      {
        number: 1,
        bookingStatus: isCnf ? 'CNF' : 'WL 8',
        currentStatus: isCnf ? 'CNF' : 'WL 3',
        coach: isCnf ? 'B4' : '--',
        berth: isCnf ? 36 : '--',
        berthType: isCnf ? 'Side Lower (SL)' : 'Waitlisted',
      },
    ],
    confirmationProbability: isCnf ? 100 : 79,
    probabilityGrade: isCnf ? 'Confirmed' : 'Good Chance',
  };

  return res.json(mockPnr);
});

// API: Train Search Between Stations
app.get('/api/search', (req, res) => {
  const { from = '', to = '', travelClass } = req.query;
  const fromCode = String(from).toUpperCase();
  const toCode = String(to).toUpperCase();

  let matches = SEARCH_TRAINS_DATA;
  if (fromCode && toCode) {
    matches = SEARCH_TRAINS_DATA.filter(
      (t) =>
        t.from.includes(fromCode) ||
        t.to.includes(toCode) ||
        fromCode.includes(t.from) ||
        toCode.includes(t.to)
    );
  }

  if (matches.length === 0) {
    matches = SEARCH_TRAINS_DATA.slice(0, 4);
  }

  return res.json({ trains: matches });
});

// API: File Rail Madad SOS / Complaint
app.post('/api/rail-madad', (req, res) => {
  const { category, pnr, trainNumber, coach, berth, description, phone } = req.body;
  if (!category || !description) {
    return res.status(400).json({ error: 'Category and description are required' });
  }

  const referenceId = `RM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const record = {
    referenceId,
    category,
    pnr: pnr || 'N/A',
    trainNumber: trainNumber || 'N/A',
    coach: coach || 'N/A',
    berth: berth || 'N/A',
    phone: phone || 'N/A',
    description,
    status: 'Assigned to RPF / Onboard Division',
    createdAt: new Date().toISOString(),
    expectedResolution: '15-25 minutes',
  };

  COMPLAINTS_STORE.unshift(record);
  return res.json({ success: true, complaint: record });
});

// API: AI Travel Assistant with Gemini 3.8 Flash
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are "RailSaarthi AI", the official intelligent railway passenger companion for Indian Railways travelers.
Your mission is to provide accurate, concise, empathetic, and clear guidance on Indian Railways topics.

Key Rules & Knowledge:
1. PNR & RAC/WL Rules:
   - RAC (Reservation Against Cancellation) passengers get guaranteed boarding and sharing sitting berth (usually Side Lower). If someone cancels, RAC upgrades to full CNF.
   - Waitlisted passengers whose ticket remained in WL after chart preparation cannot board reserved coaches (if booked online, it is automatically cancelled and refunded).
2. Tatkal Ticket Rules:
   - Tatkal booking opens at 10:00 AM for AC classes (1A, 2A, 3A, CC, EC, 3E).
   - Tatkal booking opens at 11:00 AM for Non-AC classes (Sleeper, Second Seating).
   - Premium Tatkal has dynamic dynamic pricing; no refund on confirmed Tatkal cancellation.
3. Baggage Allowances:
   - 1AC: 70 kg free (marginal 15 kg)
   - 2AC: 50 kg free (marginal 10 kg)
   - 3AC / Chair Car: 40 kg free (marginal 10 kg)
   - Sleeper: 40 kg free
4. Emergency & Helplines:
   - Single railway helpline: 139 (Rail Madad) for security, medical, inquiries, catering complaints.
5. Tone:
   - Helpful, structured, friendly Indian hospitality tone.
   - Format with concise bullet points, bold key numbers, and actionable tips.
   - Support English, Hindi, Hinglish queries naturally.`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'model' ? 'model' : 'user',
            parts: [{ text: turn.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm here to help with your train journey. Please ask any question about PNR, schedules, coach positions, or rules.";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Unable to process your railway query right now. Please try again.',
      details: error?.message,
    });
  }
});

// Setup Vite in Dev or Serve Static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RailSaarthi server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
