import React, { useState } from "react";
import {
  VStack,
  Flex,
  Heading,
  Button,
  Field,
  Input,
  Image,
  Text,
  Icon,
} from "@chakra-ui/react";
import Hero from "../../../assets/patient2.jpg";
import { IoIosArrowForward } from "react-icons/io";
import { useFormik } from "formik";
import { toaster } from "../../ui/toaster";
import { PasswordInput } from "../../ui/password-input";
import { BsWindowSidebar } from "react-icons/bs";
import { Link } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const validate = (values) => {
    const errors = {};

    // Email validation
    if (!values.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    // Password validation
    if (!values.password) {
      errors.password = "Password is required";
    } else {
      if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      if (!/\d/.test(values.password)) {
        errors.password = "Password must contain at least one number";
      }
      if (!/[a-z]/.test(values.password)) {
        errors.password = "Password must contain at least one lowercase letter";
      }
      if (!/[A-Z]/.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter";
      }
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // Replace with your API endpoint
        const response = await fetch(
          "https://3e30-102-221-239-130.ngrok-free.app/healthconnect/login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          }
        );
        if (response.ok) {
          const { token } = await response.json();
          const setToken = localStorage.setItem("token", token);

          console;
        }
        if (!response.ok) {
          throw new Error("Signup failed");
        }

        toaster.create({
          title: "Account created successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Handle successful signup (e.g., redirect to login)
        // window.location.href = '/patient/dashboard';
      } catch (error) {
        toaster.create({
          title: "Error creating account",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <VStack
      w="100%"
      h="100%"
      align="flex-start"
      gap="50px"
      px="100px"
      pt="50px"
    >
      <Heading fontSize="34px" color="#007299">
        HealthConnect
      </Heading>
      <Flex w="100%" justify="space-between" align="center" gap="50px">
        <Image
          src={Hero}
          w="50%"
          h="70vh"
          rounded="12px"
          alt="Healthcare illustration"
        />
        <VStack w="100%" align="flex-start" gap="50px">
          <VStack w="100%" align="flex-start" gap="20px">
            <Heading fontSize="24px">Login</Heading>
            <Text>
              Don't have an account?{" "}
              <Link to="/patient/signup">
                <Text as="span" color="#007299" cursor="pointer">
                  Sign Up
                </Text>
              </Link>
            </Text>
          </VStack>
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <VStack w="100%" align="flex-start">
              <VStack w="100%" align="flex-start" gap="20px">
                <Field.Root
                  required
                  invalid={formik.touched.email && formik.errors.email}
                >
                  <Field.Label>Email Address</Field.Label>
                  <Input
                    variant="solid"
                    bg="#f4feff"
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formik.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Field.ErrorText>{formik.errors.email}</Field.ErrorText>
                </Field.Root>

                <Field.Root
                  required
                  invalid={formik.touched.password && formik.errors.password}
                >
                  <Field.Label>Password</Field.Label>
                  <PasswordInput
                    variant="solid"
                    bg="#f4feff"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formik.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    visible={visible}
                    onVisibleChange={setVisible}
                  />
                  <Field.ErrorText>{formik.errors.password}</Field.ErrorText>
                </Field.Root>

                <Flex w="100%" justify="flex-end">
                  <Button
                    variant="solid"
                    bg="#007299"
                    w="120px"
                    size="sm"
                    color="white"
                    type="submit"
                    loading={formik.isSubmitting}
                    disabled={formik.isSubmitting}
                  >
                    Login
                    <Icon as={IoIosArrowForward} ml={2} />
                  </Button>
                </Flex>
              </VStack>
            </VStack>
          </form>
        </VStack>
      </Flex>
    </VStack>
  );
};

export default Login;
