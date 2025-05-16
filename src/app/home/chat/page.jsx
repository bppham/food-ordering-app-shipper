"use client";
import { useSelector } from "react-redux";
import ChatItem from "../../../components/Message/ChatItem";
import React, { useEffect } from "react";
import { useGetAllChatsQuery } from "../../../redux/feature/Chat/chatApi";
import { useGetAllMessagesQuery } from "../../../redux/feature/Message/messageApi";

const page = () => {
  const chatState = useSelector((state) => state.chat);
  const { allChats } = chatState;
  const shipper = localStorage.getItem("user");

  const { refetch: refetchAllChats } = useGetAllChatsQuery();

  useEffect(() => {
    if (shipper) {
      refetchAllChats();
    }
  }, [shipper, refetchAllChats]);

  return (
    <div className="pt-[30px] pb-[100px] ] lg:w-[60%] md:w-[80%] md:mx-auto md:pt-[100px] md:mt-[20px] md:px-0">

      <div className="p-[10px] flex flex-col gap-0 md:gap-[10px]">
        {allChats &&
          allChats.map((chat, index) => <ChatItem chat={chat} key={index} />)}
      </div>
    </div>
  );
};

export default page;
