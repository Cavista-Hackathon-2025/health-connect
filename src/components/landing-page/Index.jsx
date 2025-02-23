import React from "react";
import { VStack, Heading, Text, Flex, Button, Card } from "@chakra-ui/react";
import TopNav from "../layout/TopNav";
import { Link } from "react-router-dom";

function Index() {
  const features = [
    {
      title: "AI Symptom Checkers",
      description: "Get instant health insights powered by advanced AI",
    },
    {
      title: "Doctor Matching",
      description: "Find the right specialist for your needs for consultation",
    },
    {
      title: "Smart Reminders",
      description:
        "Never miss your medications again. Get notifications on your next medication",
    },
  ];
  return (
    <VStack
      w="100%"
      h="100vh"
      justify="flex-start"
      align="flex-start"
      gap="100px"
    >
      <TopNav />
      <VStack w="100%" align="flex-start" gap="100px" px="100px">
        <VStack w="60%" align="flex-start" gap="30px">
          <Heading fontSize="34px" fontWeight="700" lineHeight="34px">
            AI Powered Healthcare Made Simple
          </Heading>
          <Text>
            Connect with doctors, track your health and get personalized medical
            recommendations - all in one place.
          </Text>
          <Flex gap="20px">
            <Link to="/patient/signup">
              <Button
                variant="solid"
                w="150px"
                h="50px"
                bg="#007299"
                rounded="20px"
                color="white"
              >
                For Patients
              </Button>
            </Link>

            <Link to="/doctor/signup">
            <Button
              variant="outline"
              w="150px"
              h="50px"
              bg="white"
              rounded="20px"
              color="#007299"
            >
              For Doctors
            </Button>
            </Link>
            
          </Flex>
        </VStack>
        <Flex w="100%" justify="space-between" align="flex-start">
          {features.map((feature, index) => (
            <Card.Root key={index} width="320px">
              <Card.Body gap="2">
                <Card.Title mt="2">{feature.title}</Card.Title>
                <Card.Description>{feature.description}</Card.Description>
              </Card.Body>
            </Card.Root>
          ))}
        </Flex>
      </VStack>
    </VStack>
  );
}

export default Index;
