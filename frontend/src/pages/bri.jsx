import React, { useEffect, useRef, useState } from 'react';
import '../components/styles/bri.css';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: "Hello! Let's get started with getting your pantry stocked up.",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessage = async (textToSend) => {
        const text = textToSend || input;
        if (!text.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: text.trim(),
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setMessages((previousMessages) => [
                ...previousMessages,
                { id: Date.now() + 1, sender: 'bot', text: data.reply },
            ]);
        } catch (error) {
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: 'Sorry, there was an error processing your request.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const quickPrompts = [
        'I like to cook Italian food',
        'Give me recipes for 500 calorie meals',
        'Give me meals that take less than 30 mins',
    ];

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
                    Bri's Cart
                </button>
            )}

            {isOpen && (
                <div className="chatwindow">
                    <div className="chat-header">
                        <span>Bri's Cart</span>
                        <button
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        />
                    </div>

                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`chat-bubble-wrapper ${message.sender}`}
                            >
                                <div className="chat-bubble">{message.text}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-quick-prompts">
                        {quickPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                className="chat-chip"
                                onClick={() => sendMessage(prompt)}
                                disabled={isLoading}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Ask about the food you love"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={() => sendMessage()}
                            disabled={isLoading || !input.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
