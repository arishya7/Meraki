import React from 'react';
import { Message, Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';
import { Theme } from '../themes';

interface MessageBubbleProps {
  message: Message;
  theme: Theme;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, theme }) => {
  const isBot = message.sender === Sender.BOT;

  // FIX: The 'theme' object was not defined. It is now passed as a prop and used to dynamically style the user's message bubble, including a special case for light-colored themes.
  // For secondary colors that are very light (like white), we need a border to make the bubble visible.
  const userBubbleStyle = theme.colors.secondary.toUpperCase() === '#FFFFFF' 
    ? { backgroundColor: theme.colors.secondary, color: theme.colors.text, border: `1px solid ${theme.colors.textMuted}` }
    : { backgroundColor: theme.colors.secondary, color: 'white' };


  return (
    <div className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
            <BotIcon className="w-8 h-8"/>
        </div>
      )}
      <div 
        style={!isBot ? userBubbleStyle : undefined}
        className={`max-w-[80%] rounded-2xl p-0 ${isBot ? 'bg-white text-text-main rounded-tl-none shadow-sm' : 'rounded-br-none'}`}
      >
        {message.text && <p className="px-4 py-2">{message.text}</p>}
        {message.component}
      </div>
       {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center">
            <UserIcon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
