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
import Hero from "../../../assets/patient.svg";
import { IoIosArrowForward } from "react-icons/io";
import { useFormik } from "formik";
import { toaster } from "../../ui/toaster";
import { PasswordInput } from "../../ui/password-input";
import { BsWindowSidebar } from "react-icons/bs";
import {Link} from "react-router-dom"

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const validate = (values) => {
    const errors = {};

    // First Name validation
    if (!values.first_name) {
      errors.first_name = "First name is required";
    } else if (values.first_name.length < 2) {
      errors.first_name = "Name must be at least 2 characters";
    }

    // Last Name validation
    if (!values.last_name) {
      errors.last_name = "Last name is required";
    } else if (values.last_name.length < 2) {
      errors.last_name = "Name must be at least 2 characters";
    }

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
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // Replace with your API endpoint
        const response = await fetch(
          "https://3e30-102-221-239-130.ngrok-free.app/healthconnect/create-account/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              password: values.password,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Signup failed");
        }

        const data = await response.json();

        toaster.create({
          title: "Account created successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Handle successful signup
        window.location.href = "/patient/login";
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
            <Heading fontSize="24px">Create Account</Heading>
            <Text>
              Already have an account?{" "}
              <Link to="/patient/login">
                <Text as="span" color="#007299" cursor="pointer">
                  Login
                </Text>
              </Link>
            </Text>
          </VStack>
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <VStack w="100%" align="flex-start">
              <VStack w="100%" align="flex-start" gap="20px">
                <Flex
                  w="100%"
                  justify="space-between"
                  align="flex-start"
                  gap="20px"
                >
                  <Field.Root
                    required
                    invalid={
                      formik.touched.first_name && formik.errors.first_name
                    }
                  >
                    <Field.Label>First Name</Field.Label>
                    <Input
                      variant="solid"
                      bg="#f4feff"
                      type="text"
                      placeholder="First Name"
                      name="first_name"
                      value={formik.first_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <Field.ErrorText>
                      {formik.errors.first_name}
                    </Field.ErrorText>
                  </Field.Root>
                  <Field.Root
                    required
                    invalid={
                      formik.touched.last_name && formik.errors.last_name
                    }
                  >
                    <Field.Label>Last Name</Field.Label>
                    <Input
                      variant="solid"
                      bg="#f4feff"
                      type="text"
                      placeholder="Last Name"
                      name="last_name"
                      value={formik.last_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <Field.ErrorText>{formik.errors.last_name}</Field.ErrorText>
                  </Field.Root>
                </Flex>

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
                    w="160px"
                    size="sm"
                    color="white"
                    type="submit"
                    loading={formik.isSubmitting}
                    disabled={formik.isSubmitting}
                  >
                    Create Account
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

export default Signup;
