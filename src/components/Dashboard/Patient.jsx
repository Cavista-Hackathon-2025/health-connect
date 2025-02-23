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
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { InputGroup } from "../ui/input-group";
import { IoChatboxOutline, IoSend } from "react-icons/io5";
import { IoMdClose, IoMdHeart } from "react-icons/io";
import axios from "axios";
import { TiPlus } from "react-icons/ti";
import { TbDeviceIpadShare } from "react-icons/tb";
import { Link } from "react-router-dom"

const API_BASE_URL = 'http://127.0.0.1:8000/healthconnect';

const Patient = () => {
  const [tips, setTips] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState({
    tips: false,
    specialists: false,
    analysis: false
  });
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const cards = [
    {
      title: "Start New Assessment",
      description: "Get AI-powered advice",
      cta: "New Assessment",
      url: "/patient",
    },
    {
      title: "Medicine Reminders",
      description: "Keep Track of your medication",
      cta: "Add Medicine",
      url: "/patient/reminder",
    }
  ];

  const fetchTips = async () => {
    setLoading(prev => ({ ...prev, tips: true }));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_BASE_URL}/patient-ai-generated-result/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch tips');

      const data = await response.json();
      setTips(data);
    } catch (err) {
      setError('Failed to load health tips');
      console.error('Error fetching tips:', err);
    } finally {
      setLoading(prev => ({ ...prev, tips: false }));
    }
  };

  const fetchSpecialists = async () => {
    setLoading(prev => ({ ...prev, specialists: true }));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_BASE_URL}/doctor-recommendation/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch specialists');

      const data = await response.json();
      setSpecialists(data);
    } catch (err) {
      console.error('Error fetching specialists:', err);
    } finally {
      setLoading(prev => ({ ...prev, specialists: false }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      if (mounted) {
        await Promise.all([
          fetchTips(),
          fetchSpecialists()
        ]);
      }
    };

    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [shouldRefetch]); // Only re-run if shouldRefetch changes

  const generateAnalysis = async () => {
    setLoading(prev => ({ ...prev, analysis: true }));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_BASE_URL}/generate-diagnosis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to generate analysis');

      // Trigger a refetch of tips after successful analysis
      setShouldRefetch(prev => !prev);
    } catch (err) {
      setError('Failed to generate analysis');
      console.error('Error generating analysis:', err);
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages([...newMessages, { text: data.reply, sender: 'bot' }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages([...newMessages, { text: 'Sorry, I couldn\'t process your request.', sender: 'bot' }]);
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
                  <Link to={card.url}><Button>{card.cta}</Button></Link>
                </Card.Footer>
              </Box>
            </Card.Root>
          ))}
        </Flex>
        <VStack display={tips.length === 0 ? "flex" : "none"} w="100%" h="50px" align="center">
          <Button onClick={generateAnalysis} loading={loading.analysis} loadingText="Analysing..." disabled={loading.analysis}>Analyse My Symptoms Result</Button>
        </VStack>
        <Flex w="100%" justify="space-between" gap="50px">
          <VStack display={tips.length === 0 ? "none" : "flex"} align="flex-start" gap="20px">
            <Heading>Tips</Heading>
            <SimpleGrid columns={2} gap="40px">
              {tips.daily_health_tip !== "" && tips.map((tip, index) => (
                <Card.Root key={index} size="md">
                  <Card.Header>
                    <Heading size="md"> Daily Health Tip</Heading>
                  </Card.Header>
                  <Card.Body color="fg.muted">
                    {tip.daily_health_tip}
                  </Card.Body>
                </Card.Root>
              ))}
              {tips.Immune_boosting_tip !== "" && tips.map((tip, index) => (
                <Card.Root key={index} size="md">
                  <Card.Header>
                    <Heading size="md"> Immune Boosting Tip</Heading>
                  </Card.Header>
                  <Card.Body color="fg.muted">
                    {tip.Immune_boosting_tip}
                  </Card.Body>
                </Card.Root>
              ))}
              {tips.food_and_nutrution !== "" && tips.map((tip, index) => (
                <Card.Root key={index} size="md">
                  <Card.Header>
                    <Heading size="md"> Food and Nutrution</Heading>
                  </Card.Header>
                  <Card.Body color="fg.muted">
                    {tip.food_and_nutrution}
                  </Card.Body>
                </Card.Root>
              ))}
              {tips.healthy_lifestyle_habit !== "" && tips.map((tip, index) => (
                <Card.Root key={index} size="md">
                  <Card.Header>
                    <Heading size="md"> Healthy Lifestyle Habit</Heading>
                  </Card.Header>
                  <Card.Body color="fg.muted">
                    {tip.healthy_lifestyle_habit}
                  </Card.Body>
                </Card.Root>
              ))}
              {tips.hydration_Tip !== "" && tips.map((tip, index) => (
                <Card.Root key={index} size="md">
                  <Card.Header>
                    <Heading size="md"> Hydration Tip</Heading>
                  </Card.Header>
                  <Card.Body color="fg.muted">
                    {tip.hydration_Tip}
                  </Card.Body>
                </Card.Root>
              ))}
              {tips.mental_health_tip !== "" && tips.map((tip, index) => (
                <Card.Root key={index} size="md">
                  <Card.Header>
                    <Heading size="md"> Mental Health Tip</Heading>
                  </Card.Header>
                  <Card.Body color="fg.muted">
                    {tip.mental_health_tip}
                  </Card.Body>
                </Card.Root>
              ))}
              {tips.sleep_tip !== "" && tips.map((tip, index) => (
                <Card.Root key={index} size="md">
                  <Card.Header>
                    <Heading size="md"> Sleep Tip</Heading>
                  </Card.Header>
                  <Card.Body color="fg.muted">
                    {tip.sleep_tip}
                  </Card.Body>
                </Card.Root>
              ))}
              {tips.stress_management_tip !== "" && tips.map((tip, index) => (
                <Card.Root key={index} size="md">
                  <Card.Header>
                    <Heading size="md"> Stress Management Tip</Heading>
                  </Card.Header>
                  <Card.Body color="fg.muted">
                    {tip.stress_management_tip}
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </VStack>
          <VStack align="flex-start" gap="20px">
            <Heading>Specialist Recommendation</Heading>
            <VStack align="flex-start">
              {specialists.map((user, index) => (
                <Card.Root key={index} maxW="320px" borderWidth="1px" borderRadius="lg" shadow="sm" bg="white">
                  <Card.Header>
                    <Flex justify="space-between" align="center">
                      {/* <Avatar name={user.full_name} src={user.profile_picture} size="lg" /> */}
                      <Stack spacing={0} ml={4}>
                        <Heading size="md">{user.full_name}</Heading>
                        <Text fontSize="sm" color="gray.500">
                          {user.specialization}
                        </Text>
                      </Stack>
                    </Flex>
                  </Card.Header>

                  <Card.Body>
                    <Flex direction="column" align="flex-start" gap={2}>
                      <Text fontSize="md" color="gray.700">
                        <strong>Experience:</strong> {user.years_of_experience} years
                      </Text>
                      <Text fontSize="md" color="gray.700">
                        <strong>Consultation Fee:</strong> ${user.consultation_fee}
                      </Text>

                    </Flex>
                  </Card.Body>

                  <Card.Footer>
                    <Flex justify="space-between" align="center" w="100%">
                      <Button
                        rightIcon={<IoMdHeart />}
                        colorScheme="teal"
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Contacting Dr. ${user.full_name}`)}
                      >
                        Book Appointment
                      </Button>
                      <Badge colorScheme="green" borderRadius="full" px={3} py={1} fontSize="sm">
                        {user.gender}
                      </Badge>
                    </Flex>
                  </Card.Footer>
                </Card.Root>
              ))}
            </VStack>
          </VStack>
        </Flex>
      </VStack>
      <Button
        position="fixed"
        right="20px"
        bottom="20px"
        bg="#007299"
        color="white"
        rounded="20px"
        onClick={() => setChatOpen(!chatOpen)}
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
                  <Avatar.Fallback name="Alisha AI Assistant" />
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
            <Button onClick={() => setChatOpen(!chatOpen)}>
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
                key={index}
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
                >
                  <Text
                    color={msg.sender === "user" ? "white" : "black"}
                    fontSize="14px"
                  >
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
