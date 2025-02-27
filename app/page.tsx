import Conversation from './components/Conversation';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
          AI Couple Chat
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Listen to an AI couple having a natural conversation with each other
        </p>
        <Conversation />
      </div>
    </main>
  );
}
