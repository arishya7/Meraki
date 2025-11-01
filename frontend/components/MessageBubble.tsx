import React from 'react';
import { Message, Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === Sender.BOT;

  return (
    <div className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-mint-green text-white flex items-center justify-center">
            <BotIcon className="w-8 h-8"/>
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl p-0 ${isBot ? 'bg-white text-slate-gray rounded-tl-none shadow-sm' : 'bg-mint-green text-white rounded-br-none'}`}>
        {message.text && <p className="px-4 py-2">{message.text}</p>}
        {message.component}
      </div>
       {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-soft-lavender text-white flex items-center justify-center">
            <UserIcon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;