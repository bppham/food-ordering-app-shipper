"use client";
import {
  useGetAllMessagesQuery,
  useSendMessageMutation,
} from "../../../../redux/feature/Message/messageApi";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useSocket } from "../../../../context/SocketContext";
import Link from "next/link";
import Dropzone from "react-dropzone";
import { uploadImage } from "../../../../api/upload";
import MessageItem from "../../../../components/message/MessageItem";

const page = () => {
  const { id: chatId } = useParams();
  const { socket } = useSocket();

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [shipperId, setShipperId] = useState();

  useEffect(() => {
    const init = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        setShipperId(user.id);
      } else {
        console.error("❌ Không tìm thấy thông tin user trong localStorage!");
      }
    };
    init();
  }, []);

  const [sendMessage, { isSuccess: sendMessageSuccess }] =
    useSendMessageMutation();
  const { data, error, isLoading, refetch } = useGetAllMessagesQuery(chatId);

  useEffect(() => {
    if (chatId) {
      refetch();
      console.log("chat Id: ", chatId);
    }
  }, [chatId, refetch]);

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("joinChat", chatId);

    return () => {
      socket.emit("leaveChat", chatId);
    };
  }, [socket, chatId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("messageReceived", (newMessage) => {
      refetch();
    });

    socket.on("messageDeleted", () => {
      refetch();
    });

    return () => {
      socket.off("messageReceived");
      socket.off("messageDeleted");
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const data = { content: message };
      await sendMessage({ id: chatId, data }).unwrap();
      socket.emit("sendMessage", { id: chatId, data });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //   const handleSendImage = async () => {
  //     if (image) {
  //       const formData = new FormData();
  //       for (let i = 0; i < image?.length; i++) {
  //         formData.append("file", image[i]);
  //       }
  //       const result = await uploadImages(formData).unwrap();
  //       let data = { content: "", image: result[0] };
  //       await sendMessage({ id: chatId, data }).unwrap();
  //       socket.emit("sendMessage", { id: chatId, data });
  //       setMessage("");
  //       setImage(null);
  //     }
  //   };

  //   useEffect(() => {
  //     if (image) {
  //       handleSendImage();
  //     }
  //   }, [image]);

  //   const [uploadImages] = useUploadImagesMutation();

  const messagesEndRef = useRef(null);
  useEffect(() => {
    // Cuộn xuống cuối khi danh sách tin nhắn thay đổi
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  useEffect(() => {
    if (data) {
      if (data?.chat?.store) {
        setAvatar(data?.chat?.store?.avatar?.url);
        setName(data?.chat?.store?.name);
      } else {
        if (data.chat.users[0]._id === shipperId) {
          setAvatar(data.chat.users[1].avatar.url);
        } else {
          setAvatar(data.chat.users[0].avatar.url);
        }

        if (data.chat.users[0]._id === shipperId) {
          setName(data.chat.users[1].name);
        } else {
          setName(data.chat.users[0].name);
        }
      }
    }
  }, [data]);

  return (
    <div className="pt-[85px] pb-[90px] md:pb-[0px] px-[20px] h-full bg-[#fff] md:bg-[#f9f9f9]">
      <div className="hidden md:block"></div>

      <div className="bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden">
        <div className="fixed top-0 right-0 left-0 z-10 flex items-center gap-[20px] bg-[#fff] h-[85px] px-[20px] md:static">
          <Link href="/message">
            <Image
              src="/assets/arrow_left_long.png"
              alt=""
              width={25}
              height={25}
            />
          </Link>
          <div className="flex items-center gap-[10px] py-[20px]">
            <div className="relative flex flex-col gap-[4px] w-[50px] pt-[50px]">
              <Image
                src={avatar || ""}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-[#4A4B4D] text-[18px] font-bold line-clamp-1">
                {name || ""}
              </span>
              <span className="text-[#a4a5a8]">
                {moment
                  .utc(data?.chat?.latestMessage?.createdAt)
                  .local()
                  .fromNow()}
              </span>
            </div>
          </div>
        </div>

        <div className="md:overflow-y-auto md:h-[calc(100vh-260px)] md:p-[20px] bg-[#fff]">
          {data?.messages?.map((msg, index) => (
            <MessageItem key={index} msg={msg} chatId={chatId} />
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-[20px] p-[20px] bg-[#fff] md:static"
          style={{ borderTop: "1px solid #e0e0e0a3" }}
        >
          <div className="flex flex-1 items-center bg-[#e8e9e9] text-[#636464] px-[20px] py-[10px] rounded-[8px] gap-[8px]">
            <input
              type="text"
              name=""
              id=""
              placeholder="Nhập tin nhắn..."
              className="bg-[#e8e9e9] text-[18px] w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <Image
            src="/assets/send.png"
            alt=""
            width={30}
            height={30}
            className="object-contain cursor-pointer"
            onClick={handleSendMessage}
          />
          <Dropzone
            maxFiles={1}
            accept={{ "image/*": [] }}
            onDrop={(acceptedFiles) =>
              setImage(
                acceptedFiles.map((file) =>
                  Object.assign(file, {
                    preview: URL.createObjectURL(file),
                  })
                )
              )
            }
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Image
                    src="/assets/camera.png"
                    alt=""
                    width={30}
                    height={30}
                    className="object-contain cursor-pointer"
                  />
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </div>
    </div>
  );
};

export default page;
