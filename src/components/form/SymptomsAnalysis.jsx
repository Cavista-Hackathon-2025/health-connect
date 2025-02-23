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
  // // Initialize file upload handler with configuration
  // const fileUpload = useFileUpload({
  //   maxFiles: 10,
  //   maxFileSize: 5 * 1024 * 1024, // 5MB
  //   accept: {
  //     "image/*": [".png", ".jpg", ".jpeg"],
  //     "application/pdf": [".pdf"],
  //   },
  //   validate: (file) => {
  //     const errors = [];
  //     if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
  //       errors.push({
  //         code: "file-invalid-type",
  //         message: "File type must be PNG, JPEG, or PDF",
  //       });
  //     }
  //     return errors;
  //   },
  // });


  const formik = useFormik({
    initialValues: {
      age: "",
      gender: gender || "",
      phone: "",
      symptoms: "",
      current_medication: "",
      medical_history: "",
      allergies: "",
      test_result_text: ""
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/healthconnect/patient-diagnosis/", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          }, body: JSON.stringify({
            age: values.age,
            gender: "Male",
            phone: values.phone,
            symptoms: values.symptoms,
            current_medication: values.current_medication,
            medical_history: values.medical_history,
            allergies: values.allergies,
            test_result_text: values.test_result_text
          }),
        });

        const data = [{
          age: values.age,
          gender: "Male",
          phone: values.phone,
          symptoms: values.symptoms,
          current_medication: values.current_medication,
          medical_history: values.medical_history,
          allergies: values.allergies,
          test_result_text: values.test_result_text
        }]

        console.log(data)


        window.location.href = "/patient/dashboard";


        toaster.create({
          title: "Assessment Submitted",
          description: "Your symptoms have been submitted for AI analysis.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

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
                      value={formik.values.age}
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
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Phone Number"
                  />
                  <Field.ErrorText>{formik.errors.phone}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Current Symptoms</Field.Label>
                  <Textarea
                    variant="solid"
                    bg="#f4feff"
                    name="symptoms"
                    value={formik.values.symptoms}
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
                    name="current_medication"
                    value={formik.values.current_medication}
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
                    value={formik.values.allergies}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="List any allergies you have..."
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Medical History</Field.Label>
                  <Textarea
                    variant="solid"
                    bg="#f4feff"
                    name="medical_history"
                    value={formik.values.medical_history}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="List any allergies you have..."
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Test Result Text</Field.Label>
                  <Textarea
                    variant="solid"
                    bg="#f4feff"
                    name="test_result_text"
                    value={formik.values.test_result_text}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="List any allergies you have..."
                  />
                </Field.Root>



                {/* <Field.Root disabled>
                  <Field.Label>Upload Test Results</Field.Label>
                  <FileUploadRootProvider>
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
                    </Stack>
                  </FileUploadRootProvider>
                </Field.Root> */}
              </VStack>

              <Button
                w="100%"
                variant="solid"
                bg="#007299"
                color="white"
                size="sm"
                type="submit"
                loading={formik.isSubmitting}
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Submit
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </VStack>
  );
};

export default SymptomsAnalysis;
