import React, { FC } from "react";

type ChatInputProps = {
  input: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const ChatInput: FC<ChatInputProps> = ({ input, onChange, onSend, onKeyDown }) => {
  return (
    <div className="flex p-4 bg-white border-t border-gray-300">
      <textarea
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="메시지를 입력하세요."
        className="flex-1 p-2 resize-none border-none outline-none text-sm h-10 rounded-md"
      />
      <button
        onClick={onSend}
        className="ml-3 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
      >
        전송
      </button>
    </div>
  );
};

export default ChatInput;
