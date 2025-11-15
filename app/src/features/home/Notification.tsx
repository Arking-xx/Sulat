import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { Link } from 'react-router-dom';

type Messages = {
  text: string;
  isMine: boolean;
  timestamp: string;
  userImage?: string;
  userId?: string;
  userName?: string;
};

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(`${API_URL}`);
export default function Notification() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Messages[]>([]); // for storing messages

  const { user } = useAuth();

  // handle owner messages and history of it
  const handleMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        isMine: true,
        timestamp: new Date().toISOString(),
        userImage: user?.images?.[0]?.url,
        userName: user?.username,
        userId: user?._id,
      };

      setMessages((prev) => [...prev, newMessage]);

      socket.emit('send_message', {
        message,
        userImage: user?.images?.[0]?.url,
        userName: user?.username,
        userId: user?._id,
      });
      setMessage('');
    }
  };

  // for other users messages
  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      const receivedMessage = {
        text: data.message,
        isMine: false,
        timestamp: new Date().toISOString(),
        userImage: data.userImage,
        userName: data.userName,
        userId: data.userId,
      };
      setMessages((prev) => [...prev, receivedMessage]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild className="">
        <button className="cursor-pointer fixed right-10 bottom-14 border rounded-full px-2 py-2 bg-black">
          <ChatBubbleLeftRightIcon className="size-6 text-white stroke-1" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          className="w-80 h-100 bg-white shadow-lg rounded-lg p-2 z-50 mr-2 relative"
        >
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                  {!msg.isMine && (
                    <Link to={`/profile/user/${msg.userId}`}>
                      <img
                        src={msg.userImage}
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2 border border-green-500"
                      />
                    </Link>
                  )}

                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-lg ${msg.isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    <p className="text-xs text-black">{msg.userName}</p>
                    <p className="text-sm break-words">{msg.text}</p>
                  </div>
                  {msg.isMine && (
                    <img
                      src={user?.images?.[0]?.url}
                      alt=""
                      className="size-8 rounded-full ml-2 object-cover"
                    />
                  )}
                </div>
              ))}
            </div>

            <div>
              <div>
                <p className="text-center text-xs pb-1 text-gray-400">
                  The message will disappear when the page is refreshed.
                </p>
              </div>
              <textarea
                value={message}
                name=""
                id=""
                placeholder="type a message"
                className="w-full resize-none overflow-hidden px-2 py-1 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black "
                rows={2}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleMessage();
                  }
                }}
              />

              <button
                onClick={handleMessage}
                className="w-full mt-2 bg-black text-white py-2 rounded-md"
              >
                Send
              </button>
            </div>
          </div>
          <DropdownMenu.Arrow className="fill-white stroke-gray-200 stroke-1" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
