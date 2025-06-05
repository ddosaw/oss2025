import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #7AC142 0%, #43B02A 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const Subtitle = styled.div`
  font-size: 1.2rem;
  color: #E8F5E9;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const ImageSection = styled.section`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;
  width: 100%;
  max-width: 800px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const ChatSection = styled.section`
  min-height: 300px;
  border: none;
  border-radius: 16px;
  padding: 1.5rem;
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const ChatMessages = styled.div`
  height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: white;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #7AC142;
    border-radius: 4px;
  }
`;

const ChatInput = styled.div`
  display: flex;
  gap: 12px;
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #7AC142;
    }
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background: #7AC142;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s ease;
    
    &:hover {
      background: #43B02A;
    }
  }
`;

const Message = styled.div<{ isUser: boolean }>`
  margin: 0.75rem 0;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  max-width: 80%;
  font-size: 1rem;
  line-height: 1.5;
  ${props => props.isUser 
    ? `
      margin-left: auto;
      background: #7AC142;
      color: white;
      box-shadow: 2px 2px 8px rgba(122, 193, 66, 0.2);
    ` 
    : `
      margin-right: auto;
      background: white;
      color: #333;
      border: 1px solid #e9ecef;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.05);
    `
  }
`;

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "당신은 쿱스켓의 점심 메뉴 추천 전문가입니다. 편의점 음식을 중심으로 추천해주세요."
            },
            {
              role: "user",
              content: input
            }
          ]
        })
      });

      const data = await response.json();
      const aiMessage = { text: data.choices[0].message.content, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: '죄송합니다. 잠시 후 다시 시도해주세요.', isUser: false }]);
    }
  };

  return (
    <Container>
      <Header>
        <Title>쿱스켓 점심 메뉴 추천 🌱 🍱</Title>
        <Subtitle>신선하고 건강한 점심 메뉴를 추천받아 보세요! ✨</Subtitle>
      </Header>
      <ImageSection>
        <img src="/coopsket.webp" alt="쿱스켓 로고" />
      </ImageSection>
      <ChatSection>
        <ChatMessages>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              {message.text}
            </Message>
          ))}
        </ChatMessages>
        <ChatInput>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="어떤 메뉴를 추천해드릴까요?"
          />
          <button onClick={handleSend}>전송</button>
        </ChatInput>
      </ChatSection>
    </Container>
  );
}

export default App;
