'use client';

import Image from 'next/image';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  };
  theme?: 'light' | 'dark';
}

// Function to convert **bold** to <strong>bold</strong> and handle newlines
const formatMessage = (text: string) => {
  if (!text) return '';
  
  // Replace **bold** with <strong>bold</strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace *italic* with <em>italic</em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Split by newlines and wrap each line in <p> tags
  const lines = formatted.split('\n');
  
  // Handle empty lines and wrap non-empty lines
  const htmlLines = lines.map((line, index) => {
    if (line.trim() === '') {
      return '<br />';
    }
    return `<p>${line}</p>`;
  });
  
  return htmlLines.join('');
};

export default function ChatMessage({ message, theme = 'light' }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const formattedContent = formatMessage(message.content);
  
  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="ai-logo">
          {theme === 'light' ? (
            <div className="chatbot-logo-light">
              <Image 
                src="/images/chatbot/chatbotop-both.svg" 
                alt="Opsora AI" 
                width={24} 
                height={24} 
              />
            </div>
          ) : (
            <div className="chatbot-logo-dark">
              <Image 
                src="/images/chatbot/chatbotop-dark.svg" 
                alt="Opsora AI" 
                width={24} 
                height={24} 
              />
            </div>
          )}
        </div>
      )}
      <div className="message-bubble">
        <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
      </div>
    </div>
  );
}