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
  Textarea,
  Image,
  Text,
  FileUploadRootProvider,
  FileUploadHiddenInput,
  Stack,
  Code,
  createListCollection,
} from "@chakra-ui/react";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "../ui/file-upload";
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

const SymptomsAnalysis = () => {
  const [gender, setGender] = useState("");

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
      age: "",
      gender: gender || "",
      phoneNumber: "",
      symptoms: "",
      medications: "",
      allergies: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.age) {
        errors.age = "Age is required";
      } else if (isNaN(values.age) || values.age < 0 || values.age > 120) {
        errors.age = "Please enter a valid age between 0 and 120";
      }

      if (!values.gender) {
        errors.gender = "Gender is required";
      }

      if (!values.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
      } else if (!/^\+?[\d\s-]{10,}$/.test(values.phoneNumber)) {
        errors.phoneNumber = "Please enter a valid phone number";
      }

      if (!values.symptoms) {
        errors.symptoms = "Please describe your symptoms";
      } else if (values.symptoms.length < 10) {
        errors.symptoms = "Please provide more detail about your symptoms";
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Handle file uploads first if there are any files
        let fileUrls = [];
        if (fileUpload.acceptedFiles.length > 0) {
          fileUrls = await handleFileUpload(fileUpload.acceptedFiles);
        }

        // Create the final data object to be sent to the database
        const symptomsData = {
          ...values,
          testResults: fileUrls,
          uploadTimestamp: new Date().toISOString(),
          status: "pending", // Initial status for the symptoms analysis
        };

        // Submit to your database
        const response = await axios.post(
          "/api/symptoms-analysis",
          symptomsData
        );

        toaster.create({
          title: "Assessment Submitted",
          description: "Your symptoms have been submitted for AI analysis.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Clear the file upload state after successful submission
        fileUpload.reset();
      } catch (error) {
        toaster.create({
          title: "Submission Failed",
          description:
            error.message || "There was an error submitting your assessment.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setSubmitting(false);
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
                <Heading>Symptoms Checker</Heading>
                <Text>
                  Please fill out your symptoms to get AI-powered advice
                </Text>
              </VStack>

              <VStack w="100%" align="flex-start" gap="20px">
                <Flex
                  w="100%"
                  justify="space-between"
                  align="flex-start"
                  gap="20px"
                >
                  <Field.Root invalid={formik.touched.age & formik.errors.age}>
                    <Field.Label>Age</Field.Label>
                    <Input
                      variant="solid"
                      bg="#f4feff"
                      type="number"
                      name="age"
                      value={formik.age}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter Age"
                    />
                    <Field.ErrorText>{formik.errors.age}</Field.ErrorText>
                  </Field.Root>

                  <SelectRoot
                    variant="solid"
                    collection={genderOptions}
                    width="320px"
                    value={gender}
                    name="gender"
                    onValueChange={(e) => setGender(e.value)}
                    onBlur={formik.handleBlur}
                  >
                    <SelectLabel>Select Gender</SelectLabel>
                    <SelectTrigger bg="#f4feff">
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
                </Flex>

                <Field.Root>
                  <Field.Label>Phone Number</Field.Label>
                  <Input
                    variant="solid"
                    bg="#f4feff"
                    type="tel"
                    name="phoneNumber"
                    value={formik.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Phone Number"
                  />
                  <Field.ErrorText>{formik.errors.phoneNumber}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Current Symptoms</Field.Label>
                  <Textarea
                    variant="solid"
                    bg="#f4feff"
                    name="symptoms"
                    value={formik.symptoms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Describe your symptoms in details..."
                  />
                  <Field.ErrorText>{formik.errors.symptoms}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Current Medications</Field.Label>
                  <Textarea
                    variant="solid"
                    bg="#f4feff"
                    name="medications"
                    value={formik.medications}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="List any medications you're currently taking..."
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Allergies</Field.Label>
                  <Textarea
                    variant="solid"
                    bg="#f4feff"
                    name="allergies"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="List any allergies you have..."
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Upload Test Results</Field.Label>
                  <FileUploadRootProvider value={fileUpload}>
                    <Stack align="flex-start" width="100%">
                      <FileUploadHiddenInput />
                      <FileUploadRoot
                        bg="#f4feff"
                        maxW="xl"
                        alignItems="stretch"
                      >
                        <FileUploadDropzone
                          label="Drag and drop here to upload"
                          description=".png, .jpg, .pdf up to 5MB"
                        />
                        <FileUploadList />
                      </FileUploadRoot>

                      {fileUpload.rejectedFiles.length > 0 && (
                        <Code colorPalette="red">
                          Rejected files:{" "}
                          {fileUpload.rejectedFiles
                            .map((e) => e.file.name)
                            .join(", ")}
                        </Code>
                      )}
                    </Stack>
                  </FileUploadRootProvider>
                </Field.Root>
              </VStack>

              <Button
                w="100%"
                variant="solid"
                bg="#007299"
                color="white"
                size="sm"
                type="submit"
                isLoading={formik.isSubmitting}
                isDisabled={!formik.isValid || formik.isSubmitting}
              >
                Get AI Assessment
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </VStack>
  );
};

export default SymptomsAnalysis;
