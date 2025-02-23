import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  VStack,
  Flex,
  Heading,
  Button,
  Box,
  Field,
  Input,
  Image,
  Text,
  createListCollection,
} from "@chakra-ui/react";

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import Hero from "../../assets/patient.svg";
import { useFileUpload } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";

const DoctorRegistration = () => {
  const [gender, setGender] = useState("");
  const [loading, setIsLoading] = useState("");
  const token = localStorage.getItem("token");

  const genderOptions = createListCollection({
    items: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Prefer not to say", value: "Prefer not to say" },
    ],
  });
  // Initialize file upload handler with configuration
  const fileUpload = useFileUpload({
    maxFiles: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    validate: (file) => {
      const errors = [];
      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        errors.push({
          code: "file-invalid-type",
          message: "File type must be PNG, JPEG, or PDF",
        });
      }
      return errors;
    },
  });

  const handleFileUpload = async (files) => {
    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // You could add a progress state here if needed
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      return response.data.fileUrls;
    } catch (error) {
      throw new Error("File upload failed: " + error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      gender: gender || "",
      phone: "",
      specialization: "",
      years_of_experience: "",
      consultation_fee: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setIsLoading(true);

        // Replace with your API endpoint
        const response = await fetch(
          "http://127.0.0.1:8000/healthconnect/healthconnect/doctor-details/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              full_name: values.firstName,
              phone: values.phone,
              gender: "Male",
              specialization: values.specialization,
              years_of_experience: values.years_of_experience,
              consultation_fee: values.consultation_fee,
              short_Bio: "Therapist",
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
        window.location.href = '/patient/dashboard';
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
    <VStack w="100%" h="100%" align="flex-start" gap="50px" px="100px">
      <Heading fontSize="34px" color="#007299" pt="50px">
        HealthConnect
      </Heading>

      <Flex w="100%" justify="space-between" align="flex-start" gap="50px">
        <Box w="50%" position="sticky" top="50px">
          <Image src={Hero} w="100%" h="80vh" rounded="12px" />
        </Box>

        <Box w="50%%" h="100%" px="30px" rounded="12px">
          <form onSubmit={formik.handleSubmit}>
            <VStack w="100%" align="flex-start" gap="50px">
              <VStack align="flex-start" gap="10px">
                <Heading>Specialist Registration</Heading>
                <Text>Complete your profile to join our medical platform</Text>
              </VStack>

              <VStack w="100%" align="flex-start" gap="20px">
                <Flex
                  w="100%"
                  justify="space-between"
                  align="flex-start"
                  gap="20px"
                >
                  <Field.Root
                    invalid={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  >
                    <Field.Label>First Name</Field.Label>
                    <Input
                      variant="solid"
                      bg="gray.100"
                      type="text"
                      name="firstName"
                      value={formik.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="First Name"
                    />
                    <Field.ErrorText>{formik.errors.firstName}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root
                    invalid={formik.touched.lastName && formik.errors.lastName}
                  >
                    <Field.Label>Last Name</Field.Label>
                    <Input
                      variant="solid"
                      bg="gray.100"
                      type="text"
                      name="lastName"
                      value={formik.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Last Name"
                    />
                    <Field.ErrorText>{formik.errors.lastName}</Field.ErrorText>
                  </Field.Root>
                </Flex>

                <Field.Root
                  required
                  invalid={formik.touched.gender && formik.errors.gender}
                >
                  <SelectRoot
                    variant="solid"
                    collection={genderOptions}
                    value={formik.gender || gender}
                    name="gender"
                    onValueChange={(e) => setGender(e.value)}
                    onBlur={formik.handleBlur}
                  >
                    <SelectLabel>Select Gender</SelectLabel>
                    <SelectTrigger bg="gray.100">
                      <SelectValueText placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent bg="white">
                      {genderOptions.items.map((option) => (
                        <SelectItem item={option} key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <Field.ErrorText>{formik.errors.gender}</Field.ErrorText>
                </Field.Root>
                <Field.Root
                  required
                  invalid={formik.touched.phone && formik.errors.phone}
                >
                  <Field.Label>Phone Number</Field.Label>
                  <Input
                    variant="solid"
                    bg="gray.100"
                    type="tel"
                    name="phone"
                    value={formik.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Phone Number"
                  />
                  <Field.ErrorText>{formik.errors.phone}</Field.ErrorText>
                </Field.Root>

                <Field.Root
                  required
                  invalid={
                    formik.touched.specialization &&
                    formik.errors.specialization
                  }
                >
                  <Field.Label>Specialization</Field.Label>
                  <Input
                    variant="solid"
                    bg="gray.100"
                    type="text"
                    name="specialization"
                    value={formik.specialization}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Specilization"
                  />
                  <Field.ErrorText>
                    {formik.errors.specialization}
                  </Field.ErrorText>
                </Field.Root>

                <Flex
                  w="100%"
                  justify="space-between"
                  align="flex-start"
                  gap="20px"
                >
                  <Field.Root
                    required
                    invalid={
                      formik.touched.years_of_experience &
                      formik.errors.years_of_experience
                    }
                  >
                    <Field.Label>Years of Experience</Field.Label>
                    <Input
                      variant="solid"
                      bg="gray.100"
                      type="number"
                      name="years_of_experience"
                      value={formik.years_of_experience}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Years of Experience"
                    />
                    <Field.ErrorText>
                      {formik.errors.years_of_experience}
                    </Field.ErrorText>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>consultation Fee</Field.Label>
                    <Input
                      w="100%"
                      variant="solid"
                      type="number"
                      bg="gray.100"
                      name="consultation.fee"
                      value={formik.consultation_fee}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Field.Root>
                </Flex>
              </VStack>

              <Button
                w="100%"
                variant="solid"
                bg="#007299"
                color="white"
                size="sm"
                type="submit"
                loading={formik.isSubmitting}
                dsabled={!formik.isValid || formik.isSubmitting}
              >
                Register
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </VStack>
  );
};

export default DoctorRegistration;
