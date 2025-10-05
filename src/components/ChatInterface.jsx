import { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ recommendedPlants }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue, context: recommendedPlants }),
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const data = await response.json();
      const modelMessage = { role: 'model', text: data.reply };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = { role: 'model', text: "Sorry, I'm having trouble connecting. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-[Pressura] font-normal h-full w-96 bg-white p-4 rounded-lg border border-[#41653D] flex flex-col" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-xl mb-4 border-b pb-2">Carbon Footprint Chat</h2>
      <div ref={chatBodyRef} className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-sm text-gray-500">Assistant is typing...</div>}
      </div>
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          placeholder="Ask about your garden's impact..."
          className="p-2 border rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading} className="bg-blue-500 text-white px-4 rounded-r-lg disabled:bg-blue-300">Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;