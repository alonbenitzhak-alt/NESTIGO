"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Message } from "@/lib/types";

interface ChatWindowProps {
  conversationId: string;
  onClose?: () => void;
  otherName: string;
}

export default function ChatWindow({ conversationId, onClose, otherName }: ChatWindowProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
      setLoading(false);

      // Mark unread messages as read
      if (user) {
        await supabase
          .from("messages")
          .update({ read: true })
          .eq("conversation_id", conversationId)
          .neq("sender_id", user.id)
          .eq("read", false);
      }
    };
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          // Mark as read if we're the recipient
          if (user && newMsg.sender_id !== user.id) {
            supabase.from("messages").update({ read: true }).eq("id", newMsg.id).then();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const content = newMessage.trim();
    setNewMessage("");

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
            {otherName.charAt(0)}
          </div>
          <span className="font-semibold text-gray-900 text-sm">{otherName}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
          <div className="text-center text-gray-400 py-8">{t("properties.loading")}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">{t("chat.noMessages")}</div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMine
                      ? "bg-primary-600 text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-primary-200" : "text-gray-400"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t("chat.placeholder")}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-primary-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
