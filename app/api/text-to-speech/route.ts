import { NextResponse } from 'next/server';
import { Voice, VoiceSettings } from 'elevenlabs-node';

export async function POST(req: Request) {
  try {
    const { text, speaker } = await req.json();
    
    const voiceId = speaker === 'girlfriend' 
      ? process.env.GIRLFRIEND_VOICE_ID 
      : process.env.BOYFRIEND_VOICE_ID;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
} 