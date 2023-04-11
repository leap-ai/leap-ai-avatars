import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { NextSeo } from "next-seo";
import { AiOutlineCloudUpload as UploadIcon } from "react-icons/ai";

import { HiOutlineKey as KeyIcon } from "react-icons/hi";

import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";

import prompts from "@/helpers/prompts";
import GithubButton from "./src/components/index/GithubButton";
import HomeHeader from "./src/components/index/HomeHeader";
import PhotoExamples from "./src/components/index/PhotoExamples";

interface ImageBatch {
  images: string[];
  style: string;
}

const Home = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading...");
  const [loadingSubmessage, setLoadingSubmessage] = useState<string>("");

  const [uploadImages, setUploadImages] = useState<ImageType[]>([]);
  const [imageBatch, setImageBatch] = useState<ImageBatch[]>([]);

  const toast = useToast();

  // this method generates the avatars
  const generate = useCallback(
    async (modelId: string, prompt: string) => {
      // hit generate endpoint once training finishes
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          modelId,
          prompt,
        }),
      });
      const data = await response.json();
      if (data.error) {
        window.alert("Error: " + data.error + " " + data.message);
        setLoading(false);
        return;
      }

      return data.avatars;
    },
    [apiKey]
  );

  // this method gets the training status of the model
  const getStatus = useCallback(
    async (modelId: string, versionId: string) => {
      const response = await fetch("/api/getStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          modelId,
          versionId,
        }),
      });
      const status = await response.json();

      if (status.error) {
        window.alert("Error: " + status.error + " " + status.message);
        setLoading(false);
        return;
      }
      return status.trainingStatus;
    },
    [apiKey]
  );

  // this method checks if the model is already trained and ready to generate
  const checkTrainingDone = useCallback(
    async (modelId: string, versionId: string) => {
      // now we poll the model status every 10 sec until it's finished
      setLoading(true);
      let status = "";
      while (status !== "finished") {
        if (modelId) {
          // if no version ID, getStatus will use the latest version
          try {
            status = await getStatus(modelId, versionId);
          } catch (error) {
            console.log(error);
            toast({
              title: "Error",
              status: "error",
            });
          }
          setLoadingMessage(`Training Status: ${status}`);
          setLoadingSubmessage(
            `Training takes around 10 minutes. Check back later!`
          );
          await new Promise((resolve) => setTimeout(resolve, 10000)); // wait for 10 seconds
        } else {
          setLoading(false);
          return;
        }
      }

      if (status === "finished") {
        // once training is done, we will generate the images
        for (const prompt of prompts) {
          setLoadingMessage(`Generating ${prompt.label} Avatars...`);
          setLoadingSubmessage(`Takes around 30 seconds. Check back later!`);

          const avatars = await generate(modelId, prompt.prompt);

          // add the generated images to the image batch
          setImageBatch((prevImages) => [
            ...prevImages,
            { style: prompt.label, images: avatars },
          ]);
        }
      }
      setLoading(false);
    },
    [generate, getStatus, toast]
  );

  // this is method that hits nextjs endpoint to create model, upload samples, and queue training
  const finetune = useCallback(async () => {
    if (uploadImages.length === 0) {
      toast({
        title: "Error",
        description: "Add a photo first!",
        status: "error",
      });
      return;
    }

    if (uploadImages.length > 10) {
      toast({
        title: "Error",
        description: "10 photos maximum!",
        status: "error",
      });
      return;
    }

    // send images to train the model
    setLoading(true);
    setLoadingMessage("Finetuning model...");
    setLoadingSubmessage("Takes around 10 minutes");
    const formData = new FormData();
    for (const image of uploadImages) {
      const file = image.file;
      if (file) {
        formData.append("files", file);
      }
    }
    formData.append("body", JSON.stringify({ apiKey }));

    const response = await fetch("/api/finetune", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    // this should be the model id, version id, and trainingStatus == "queued"
    const responseData = await response.json();
    if (responseData.error) {
      toast({
        title: "Error",
        description: responseData.error + " " + responseData.message,
        status: "error",
      });
    }
    checkTrainingDone(responseData.modelId, responseData.versionId);
  }, [uploadImages, apiKey, checkTrainingDone, toast]);

  return (
    <>
      <NextSeo
        title="Leap AI Avatars"
        description="Leap AI Avatars is a web app that uses the Leap AI API to generate AI Avatars. It's built with Next.js, Chakra UI, and Leap AI."
      />
      <VStack
        minH="100vh"
        w="100vw"
        spacing={4}
        bg="#101219"
        px={4}
        paddingBottom={"100px"}
        fontFamily="monospace"
        color={"white"}
      >
        <HomeHeader />

        {imageBatch.length === 0 && !loading && (
          <>
            <VStack gap={6}>
              <Heading
                fontSize={"xl"}
                fontFamily="monospace"
                textAlign={"left"}
              >
                1) Upload 3-10 photos of yourself
              </Heading>

              <VStack gap={1}>
                <ImageUploading
                  multiple
                  value={[]}
                  onChange={(images: ImageListType) => {
                    if (images.length === 0) {
                      return;
                    }
                    setUploadImages(images);
                  }}
                  dataURLKey="dataURL"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    <Flex
                      borderRadius="lg"
                      p={8}
                      maxW="850px"
                      border={
                        uploadImages.length === 0 ? "1px dashed #fff" : "none"
                      }
                      w="100%"
                      justifyContent="center"
                      {...dragProps}
                    >
                      <Flex
                        flexWrap={"wrap"}
                        alignItems="center"
                        gridGap={"16px"}
                        justify={"center"}
                      >
                        {uploadImages.map((image, index) => (
                          <Box
                            key={index}
                            className="image-item"
                            h={100}
                            position="relative"
                            maxW={["100px", "100px", "200px"]}
                          >
                            <Image
                              src={image.dataURL}
                              alt=""
                              objectFit="contain"
                              borderRadius={"12px"}
                              h={"100px"}
                              border={"2px solid #fff"}
                            />
                            <IconButton
                              aria-label="Remove Image"
                              rounded={"full"}
                              onClick={() =>
                                // remove image from uploadImages
                                setUploadImages((prevUploadImages) =>
                                  prevUploadImages.filter((_, i) => i !== index)
                                )
                              }
                              zIndex={2}
                              icon={
                                <Image
                                  alt="delete"
                                  width="22px"
                                  src="https://uploads-ssl.webflow.com/630da1fccd22fa1b93dcfa57/6386363c9925b334bd6881fb_remove.svg"
                                />
                              }
                              color={"#4685f6"}
                              bg={"white"}
                              border={"1px solid #1c1c1c"}
                              h={25}
                              w={25}
                              minW={25}
                              pos={"absolute"}
                              top={-2}
                              right={-2}
                            />
                          </Box>
                        ))}
                      </Flex>

                      {uploadImages.length === 0 && (
                        <Flex
                          flexDirection={"column"}
                          justify={"center"}
                          alignItems={"center"}
                          wrap={"wrap"}
                          cursor={"pointer"}
                          onClick={onImageUpload}
                        >
                          <UploadIcon size={40} />

                          <Text
                            fontSize={"1.5em"}
                            mt="10px"
                            textAlign={"center"}
                          >
                            Click or Drop Images
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  )}
                </ImageUploading>
                <PhotoExamples />
              </VStack>

              <Heading
                fontSize={"xl"}
                fontFamily="monospace"
                textAlign={"left"}
              >
                2) Add your API Key from{" "}
                <Link
                  target="_blank"
                  href="https://tryleap.ai"
                  textDecoration={"underline"}
                >
                  Leap AI
                </Link>{" "}
              </Heading>
              <InputGroup size="md" w={{ base: "full", md: "30rem" }}>
                <Input
                  py={4}
                  focusBorderColor="red.100"
                  borderColor={"red.200"}
                  variant="outline"
                  onChange={(e) => setApiKey(e.target.value)}
                  value={apiKey}
                  placeholder="Add your API KEY here"
                />
                <InputRightElement width="3rem">
                  <IconButton
                    onClick={() => {
                      window.open("https://tryleap.ai", "_blank");
                    }}
                    aria-label="key"
                    icon={<KeyIcon />}
                  />
                </InputRightElement>
              </InputGroup>

              <Heading
                fontSize={"xl"}
                fontFamily="monospace"
                textAlign={"left"}
              >
                3) (Optional) add your model ID from{" "}
                <Link
                  target="_blank"
                  href="https://tryleap.ai"
                  textDecoration={"underline"}
                >
                  Leap AI
                </Link>{" "}
              </Heading>
              <Input
                w={{ base: "full", md: "30rem" }}
                py={4}
                color="gray.100"
                focusBorderColor="gray.100"
                variant="outline"
                onChange={(e) => setModelId(e.target.value)}
                value={modelId}
                placeholder="Optional model ID to use existing model"
              />
            </VStack>
          </>
        )}

        {imageBatch.map((batch, index) => (
          <Box key={index}>
            <Text
              fontSize={"1.5em"}
              textAlign={"left"}
              fontWeight={"bold"}
              mb={4}
            >
              {batch.style} Avatars
            </Text>
            <Flex
              w={{ base: "full", md: "50rem" }}
              gridGap={"16px"}
              h="auto"
              flexDir={"row"}
              mb={4}
            >
              {batch.images.map((image) => (
                <Box key={image} className="image-item" position="relative">
                  <Image
                    src={image}
                    alt=""
                    objectFit="contain"
                    borderRadius={"12px"}
                  />
                </Box>
              ))}
            </Flex>
          </Box>
        ))}

        {loading && (
          <>
            <Text fontSize={"1.5em"} textAlign={"center"} fontWeight={"bold"}>
              {loadingMessage}
            </Text>
            <Text mt={0} fontSize="md" fontWeight="bold">
              {loadingSubmessage}
            </Text>
          </>
        )}
        <Button
          w={{ base: "full", md: "30rem" }}
          _hover={loading ? {} : { opacity: 0.8 }}
          _active={loading ? {} : { transform: "scale(0.98)", opacity: 0.7 }}
          transitionDuration="200ms"
          bg="#46ad37"
          color="white"
          p={2}
          rounded="lg"
          fontSize="lg"
          onClick={() => {
            if (modelId) {
              checkTrainingDone(modelId, "");
            } else {
              finetune();
            }
          }}
          isLoading={loading}
        >
          Get AI Avatars
        </Button>
        <GithubButton />

        <Box
          pos={"fixed"}
          bottom={0}
          w={"100%"}
          bg={"#fff"}
          color={"#1c1c1c"}
          zIndex={999}
          p={2}
        >
          <Box textAlign="center" fontSize="xl">
            <Text fontSize="xs" fontWeight="bold">
              Built with{" "}
              <Link
                target="_blank"
                href="https://tryleap.ai"
                textDecoration={"underline"}
              >
                Leap API
              </Link>{" "}
              by{" "}
              <Link target="_blank" href="https://twitter.com/thealexshaq">
                alex
              </Link>
              . Create your own AI Avatars app{" "}
              <Link
                target="_blank"
                href="https://github.com/alexschachne/leap-ai-avatars"
                textDecoration={"underline"}
              >
                here
              </Link>{" "}
              🚀
            </Text>
          </Box>
        </Box>
      </VStack>
    </>
  );
};

export default Home;
