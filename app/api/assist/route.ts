import { NextRequest, NextResponse } from 'next/server';

// Mock responses for common questions
const mockResponses: Record<string, string> = {
  'default': 'I can help you with using the Sicily Planner, finding places to visit, navigating the map, and creating itineraries. What would you like to know?',
  
  'planner': `To use the day planner:
1. Select a city from the dropdown (e.g., Palermo, Syracuse, Taormina)
2. Choose your travel date
3. The map will appear showing your destination and nearby areas
4. Browse spots in the sidebar and add them to your planner
5. Download your itinerary as a PDF when ready!`,

  'map': `Map tips:
• Use Ctrl+Scroll to zoom in/out (normal scroll moves the page)
• Click the "Reset" button to return to the Sicily overview
• Switch between Satellite and Dark map styles
• Click on golden area markers to select that destination
• POIs (points of interest) appear when you zoom in close enough`,

  'places': `Finding places:
• Start by selecting a city - this shows nearby attractions automatically
• Zoom in on the map (zoom level 11+) to see specific POIs
• Browse the "Nearby Spots" sidebar for curated recommendations
• Each spot shows walking/driving distance from your base city
• Click spots to add them to your day planner`,

  'itinerary': `Creating an itinerary:
• Your day planner has morning, midday, and afternoon slots
• Add places from the sidebar by clicking them
• Each slot shows travel time and distance
• Rearrange by thinking about logical flow (we're working on drag-and-drop!)
• Download as PDF to take with you - it's stored only on your device`,

  'privacy': `Privacy & data:
• We don't collect emails or track your browsing
• Your itineraries are never stored on our servers
• PDF downloads are local to your device
• This chat doesn't train any AI models
• Your journey is yours alone`,

  'help': `I can assist with:
• How to use the day planner
• Finding specific types of places (cafés, beaches, historical sites)
• Map navigation and controls
• Understanding travel distances and times
• Itinerary suggestions for different trip styles
• Privacy and data practices

Just ask me a question!`
};

function findBestResponse(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('planner') || lower.includes('plan') || lower.includes('how to use')) {
    return mockResponses.planner;
  }
  if (lower.includes('map') || lower.includes('zoom') || lower.includes('navigate')) {
    return mockResponses.map;
  }
  if (lower.includes('place') || lower.includes('find') || lower.includes('where') || lower.includes('poi')) {
    return mockResponses.places;
  }
  if (lower.includes('itinerary') || lower.includes('trip') || lower.includes('day')) {
    return mockResponses.itinerary;
  }
  if (lower.includes('privacy') || lower.includes('data') || lower.includes('store') || lower.includes('track')) {
    return mockResponses.privacy;
  }
  if (lower.includes('help') || lower.includes('what can')) {
    return mockResponses.help;
  }
  
  // Default helpful response
  return mockResponses.default;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    // Safety check - restrict scope
    const restricted = message.toLowerCase();
    if (restricted.includes('personal') || restricted.includes('email') || 
        restricted.includes('password') || restricted.includes('credit')) {
      return NextResponse.json({
        response: "I only help with Sicily Planner features, itinerary tips, and finding places. I can't assist with personal data or account matters."
      });
    }

    // Get mock response (in production, this would call an LLM API)
    const response = findBestResponse(message);
    
    return NextResponse.json({ response });
    
  } catch (error) {
    console.error('Assist API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
