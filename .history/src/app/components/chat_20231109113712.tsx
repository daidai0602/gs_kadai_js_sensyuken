"use client";

import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { FaBeer, FaPaperPlane } from 'react-icons/fa';
import { db } from '../firebase';
import { Input } from 'postcss';
import { useAppContext } from '@/context/AppContext';
import OpenAI from 'openai';
import LoadingIcons from "react-loading-icons";
import Image from 'next/image';
import pic from "/public/yuto.jpg";
import pic2 from "/public/yuto2.jpg";

type Message = {
  text: string;
  sender: string;
  createdAt: Timestamp;
};

const chat = () => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const{selectedRoom} = useAppContext();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<Message[]>([]);

  const scrollDiv = useRef<HTMLDivElement>(null)

  //各ルームのメッセージを取得
  useEffect(() => {
    if(selectedRoom){
      const fetchMessages = async () => {
        const roomDocRef = doc(db, "rooms", selectedRoom);
        const messageCollectionRef = collection(roomDocRef, "messages");

        const q = query(messageCollectionRef, orderBy("createdAt"));

        const unsubscribe = onSnapshot( q, (snapshot) => {
          const newMessages =snapshot.docs.map((doc) => doc.data() as Message );
          setMessages(newMessages);
          console.log(messages);
        });

        return() => {
          unsubscribe();
        };
      };
      fetchMessages();
    }
  }, [selectedRoom]);

  useEffect(() =>{
    if (scrollDiv.current){
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      })
    }
  },[messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: "user",
      createdAt: serverTimestamp(),
    };

    //メッセージをFirestoreに保存
    const roomDocRef = doc(db, "rooms", selectedRoom!);
    const messageCollectionRef = collection(roomDocRef, "messages");
    await addDoc(messageCollectionRef, messageData);

    setInputMessage("");
    setIsLoading(true);
 
    //OpenAIからの返信
    const gpt3Response = await openai.chat.completions.create({
      messages: [{role:"user", content: inputMessage},{role: "system", content:"2歳のゆうと君の父親として20字以内で楽しく会話してください"}],
      model: "gpt-3.5-turbo",
    });

    setIsLoading(false);

    const botResponse = gpt3Response.choices[0].message.content;
    await addDoc(messageCollectionRef, {
      text: botResponse,
      sender: "bot",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-3xl text-white font-semibold mb-4">パパの部屋</h1>
      <div className="flex">
        <div >
            <Image src={pic2} width={410} height={470}  />
            {/* <Image src={pic2} alt="sakura" width={110} height={70}  /> */}
        </div>
        <div className="flex-grow overflow-y-auto mb-4" ref={scrollDiv}>
          {messages.map((message, index) => (

            <div key={index}
            className={message.sender === "user" ? "text-right": "text-left"}
            >
              <div className={message.sender === "user"
                ?"bg-blue-500 inline-block rounded px-4 py-2 mb-2"
                :"bg-green-500 inline-block rounded px-4 py-2 mb-2"
              }
              >
                <p className="text-white">{message.text}</p>
              </div>
            </div>
            ))}
            {/* {isLoading && <LoadingIcons.TailSpin/>} */}
        </div>

      </div>

      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder='Send a Message'
          className="border-2 rounded w-full pr-10 focus:outline-none p-2"
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          // onKeyDown={{e} => {
          //   if (e.key === "Enter"){
          //   }
          // }}
        />
        <button className="absolute inset-y-0 right-4 flex items-center"
        onClick={() => sendMessage()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default chat;