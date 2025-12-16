import React, { useState, useRef, useEffect } from 'react';
import { FaCommentAlt, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import './Chatbot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Olá! Sou o assistente virtual do SUS Digital. Como posso ajudar você hoje?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    
    setTimeout(() => {
      const botResponses = [
        "Entendo. Pode me dar mais detalhes?",
        "Interessante. Vou verificar isso para você.",
        "Para agendamento de consultas, por favor acesse a aba 'Consultas'.",
        "Você pode visualizar seus exames na seção 'Exames'.",
        "Estou aqui para ajudar com dúvidas sobre o sistema."
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const newBotMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot'
      };
      setMessages(prev => [...prev, newBotMessage]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaRobot />
              <span>Assistente SUS</span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit">
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaCommentAlt />}
      </button>
    </div>
  );
};

export default Chatbot;
