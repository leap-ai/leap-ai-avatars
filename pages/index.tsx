/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Link,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

import { NextSeo } from "next-seo";
import { AiOutlineCloudUpload as UploadIcon } from "react-icons/ai";

import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";

import GithubButton from "./src/components/index/GithubButton";
import HomeHeader from "./src/components/index/HomeHeader";
import PhotoExamples from "./src/components/index/PhotoExamples";

const Home = () => {
  const [prompt, setPrompt] = useState<string>("");

  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [images, setImages] = useState<string[]>([
    "https://super-static-assets.s3.amazonaws.com/876b5062-5238-432a-9142-e63034f73722/images/fa692dfd-7dd3-4947-8d73-eb1aaeedc8d9/IMG_8601.jpg",
  ]);

  const [uploadImages, setUploadImages] = useState<ImageType[]>([]);

  const toast = useToast();

  // @abe this is method that hits nextjs endpoint to create model, upload samples, and queue training
  const finetune = async () => {
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

    // @abe here is where we would send images to train the model
    setLoading(true);
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

    const responseData = await response.json();
    setLoading(false);
  };

  const generate = async () => {
    setLoading(true);
    // hit generate endpoint once training finishes
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const image = await response.json();
    console.log(image);
    if (image.error) {
      window.alert("Error: " + image.error + " " + image.message);
      setLoading(false);
      return;
    }
    // set images array, to switch the default image
    const uris = image.images.map((image: { uri: string }) => image.uri);
    setImages(uris);
    setLoading(false);
  };

  return (
    <>
      <NextSeo
        title="Leap AI Avatars"
        description="Leap AI Avatars is a web app that uses the Leap AI API to generate images of Mario. It's built with Next.js, Chakra UI, and Leap AI."
      />
      <VStack
        minH="100vh"
        w="100vw"
        spacing={4}
        bg="#005fad"
        px={4}
        paddingBottom={"100px"}
        fontFamily="monospace"
      >
        <HomeHeader />
        <PhotoExamples />

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
              maxW="500px"
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

                  <Text fontSize={"1.5em"} mt="10px" textAlign={"center"}>
                    Click or Drop Images
                  </Text>
                </Flex>
              )}
            </Flex>
          )}
        </ImageUploading>

        <Input
          w={{ base: "full", md: "30rem" }}
          py={4}
          color="gray.100"
          focusBorderColor="gray.100"
          variant="outline"
          onChange={(e) => setApiKey(e.target.value)}
          value={apiKey}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              finetune();
            }
          }}
          placeholder="Add your API KEY here"
        />
        <Text fontSize={"sm"}>
          Add your API Key from{" "}
          <Link
            target="_blank"
            href="https://tryleap.ai"
            textDecoration={"underline"}
          >
            Leap AI
          </Link>
        </Text>

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
          key={prompt}
          onClick={() => finetune()}
          isLoading={loading}
        >
          Get AI Avatars
        </Button>
        {/* {images.length > 0 && (
          <Box w={{ base: "full", md: "30rem" }} h="auto">
            {images.map((image) => (
              <Image
                key={image}
                src={image}
                alt="img"
                rounded="lg"
                w="full"
                h={{ base: "3/4", md: "20rem" }}
                objectFit="contain"
                transitionDuration="200ms"
                opacity={loading ? 0.3 : 1}
              />
            ))}
          </Box>
        )} */}
        <Box
          pos={"fixed"}
          bottom={0}
          w={"100%"}
          bg={"#fff"}
          color={"#1c1c1c"}
          zIndex={999}
          p={2}
        >
          <GithubButton />
          <Box textAlign="center" fontSize="xl">
            <Text fontSize="xs" fontWeight="bold" mb={2}>
              Takes around 10 minutes to get AI Avatars
            </Text>
            <Text fontSize="xs" fontWeight="bold">
              Built by{" "}
              <Link target="_blank" href="https://twitter.com/thealexshaq">
                alex
              </Link>{" "}
              with{" "}
              <Link target="_blank" href="https://tryleap.ai">
                Leap API ❤️
              </Link>
            </Text>
          </Box>
        </Box>
      </VStack>
    </>
  );
};

export default Home;
