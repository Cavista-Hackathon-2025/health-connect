import {
  VStack,
  Heading,
  Text,
  Flex,
  Button,
  Card,
  Image,
  Avatar,
  HStack,
  Box,
  Badge,
  Icon,
  Input,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { InputGroup } from "../ui/input-group";
import { IoChatboxOutline, IoSend } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const Patient = () => {
  const token = localStorage.getItem('token')
  console.log(`user token ${token}`)
  const cards = [
    {
      title: "Start New Assessment",
      description: "Get AI-powered advice",
      cta: "New Assessment",
      url: "/patient/check-symptoms",
    },
    {
      title: "Medicine Reminders",
      description: "Keep Track of your medication",
      cta: "Add Medicine",
      url: "/patient/reminder",
    },
  ];

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const sendMessage = async () => {``
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });
      setMessages([
        ...newMessages,
        { text: response.data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        { text: "Sorry, I couldn't process your request.", sender: "bot" },
      ]);
    }
  };

  return (
    <VStack w="100%" h="100%" align="flex-start" gap="100px" px="100px">
      <Flex w="100%" justify="space-between" align="center" pt="50px">
        <Heading fontSize="34px" color="#007299">
          HealthConnect
        </Heading>
        <Flex justify="flex-end" align="center" gap="20px">
          <VStack w="100%" align="flex-end" gap="0">
            <Heading fontSize="20px">Welcome, Segun</Heading>
            <Text fontSize="14px">
              Your next appointment with Dr. Billy is in 2 days
            </Text>
          </VStack>
          <Avatar.Root>
            <Avatar.Fallback name="Segun Adebayo" />
            <Avatar.Image src="https://bit.ly/sage-adebayo" />
          </Avatar.Root>
        </Flex>
      </Flex>
      <VStack w="100%" align="flex-start" gap="50px">
        <Flex w="100%" justify="space-between" align="flex-start">
          {cards.map((card, index) => (
            <Card.Root
              key={index}
              flexDirection="row"
              overflow="hidden"
              maxW="50%"
            >
              <Image
                objectFit="cover"
                maxW="280px"
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
              />
              <Box>
                <Card.Body>
                  <Card.Title mb="2">{card.title}</Card.Title>
                  <Card.Description>{card.description}</Card.Description>
                  <HStack mt="4">
                    <Badge>Hot</Badge>
                    <Badge>Caffeine</Badge>
                  </HStack>
                </Card.Body>
                <Card.Footer>
                  <Button>{card.cta}</Button>
                </Card.Footer>
              </Box>
            </Card.Root>
          ))}
        </Flex>
      </VStack>
      <Button
        position="fixed"
        right="20px"
        bottom="20px"
        bg="#007299"
        color="white"
        rounded="20px"
        onClick={toggleChat}
      >
        {" "}
        <Icon color="#56e0e0">
          <IoChatboxOutline />
        </Icon>{" "}
        Chat with AI
      </Button>
      {chatOpen && (
        <VStack
          w="350px"
          h="500px"
          position="fixed"
          bottom="70px"
          right="20px"
          justify="space-between"
          align="flex-start"
          bg="white"
          shadow="sm"
          rounded="12px"
          p="20px"
        >
          <Flex
            w="100%"
            justify="space-between"
            align="flex-start"
            borderBottomWidth="1px"
            borderColor="gray.200"
          >
            <Box w="100%" py="10px">
              <Flex justify="flex-start" align="flex-start" gap="10px">
                <Avatar.Root>
                  <Avatar.Fallback
                    name="
                  Alisha AI Assistant"
                  />
                  <Avatar.Image
                    bg="white"
                    src="https://freesvg.org/img/1538298822.png"
                  />
                </Avatar.Root>
                <VStack align="flex-start" gap="0px">
                  <Text fontSize="14px">Alisha Health Assistant</Text>
                  <Text fontSize="12px" color="green">
                    Online
                  </Text>
                </VStack>
              </Flex>
            </Box>
            <Button onClick={toggleChat}>
              <Icon>
                <IoMdClose />
              </Icon>
            </Button>
          </Flex>
          <VStack
            flex="1"
            align="flex-start"
            overflowY="auto"
            gap="10px"
            p="10px"
          >
            {messages.map((msg, index) => (
              <Stack
                w="100%"
                flexDirection={msg.sender === "user" ? "row-reverse" : "row"}
                justify={msg.sender === "user" ? "flex-end" : "flex-start"}
                align="flex-start"
                gap="10px"
              >
                <Avatar.Root size="xs">
                  <Avatar.Fallback name="Segun Adebayo" />
                  <Avatar.Image
                    src={
                      msg.sender === "user"
                        ? "https://bit.ly/sage-adebayo"
                        : "https://freesvg.org/img/1538298822.png"
                    }
                    bg="white"
                  />
                </Avatar.Root>
                <Box
                  maxW="100%"
                  py="10px"
                  px="10px"
                  rounded="8px"
                  bg={msg.sender === "user" ? "#007299" : "gray.100"}
                  alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
                  key={index}
                >
                  <Text color={msg.sender === "user" ? "white" : "black"} fontSize="14px">
                    {msg.text}
                  </Text>
                </Box>
              </Stack>
            ))}
          </VStack>

          <HStack gap="10" width="full">
            <InputGroup
              flex="1"
              endElement={
                <Button w="20px" h="20px" onClick={sendMessage}>
                  <Icon>
                    <IoSend />
                  </Icon>
                </Button>
              }
            >
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
              />
            </InputGroup>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

export default Patient;
