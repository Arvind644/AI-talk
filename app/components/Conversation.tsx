'use client';

import { useState, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { Message, ConversationState } from '@/types';

export default function Conversation() {
  const [state, setState] = useState<ConversationState>({
    messages: [],
    isLoading: false,
    isPlaying: false,
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const cleanMessage = (content: string) => {
    // Remove any "AI Girlfriend:" or "AI Boyfriend:" prefixes
    let cleaned = content.replace(/^(AI (Girlfriend|Boyfriend):)\s*/i, '');
    
    // Split by potential mid-message speaker prefixes and take only the first part
    cleaned = cleaned.split(/AI (Girlfriend|Boyfriend):/i)[0].trim();
    
    return cleaned;
  };

  const generateResponse = async (speaker: 'girlfriend' | 'boyfriend') => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Get chat completion
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.messages }),
      });
      
      const chatData = await chatResponse.json();
      
      if (!chatResponse.ok) throw new Error(chatData.error);

      const cleanContent = cleanMessage(chatData.content);

      const newMessage: Message = {
        role: 'assistant',
        content: cleanContent,
        speaker,
      };

      // Get speech synthesis
      const speechResponse = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: cleanContent,
          speaker,
        }),
      });

      const speechData = await speechResponse.json();
      
      if (!speechResponse.ok) throw new Error(speechData.error);

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        isLoading: false,
      }));

      if (audioRef.current) {
        audioRef.current.src = speechData.audioUrl;
        audioRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleConversation = () => {
    if (state.isPlaying) {
      audioRef.current?.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      generateResponse(state.messages.length % 2 === 0 ? 'girlfriend' : 'boyfriend');
    }
  };

  const handleAudioEnd = () => {
    setState(prev => ({ ...prev, isPlaying: false }));
    // Start next response after a short delay
    setTimeout(() => {
      generateResponse(state.messages.length % 2 === 0 ? 'girlfriend' : 'boyfriend');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 space-y-4">
        {state.messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.speaker === 'girlfriend'
                ? 'bg-pink-100 ml-auto'
                : 'bg-blue-100 mr-auto'
            } max-w-[80%]`}
          >
            <p className="text-sm font-semibold mb-1">
              {message.speaker === 'girlfriend' ? 'Girlfriend' : 'Boyfriend'}
            </p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <button
        onClick={toggleConversation}
        disabled={state.isLoading}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 disabled:opacity-50 flex items-center space-x-2"
      >
        {state.isLoading ? (
          <span>Generating...</span>
        ) : (
          <>
            {state.isPlaying ? <FaPause /> : <FaPlay />}
            <span>{state.isPlaying ? 'Pause' : 'Start/Continue'}</span>
          </>
        )}
      </button>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        className="hidden"
      />
    </div>
  );
} 