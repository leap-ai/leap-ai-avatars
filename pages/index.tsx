/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useToast,
  Link,
} from "@chakra-ui/react";

import { AiFillGithub } from "react-icons/ai";
import { NextSeo } from "next-seo";

import prompts from "helpers/prompts";

const Home = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [images, setImages] = useState<string[]>([
    "https://mario.wiki.gallery/images/3/3e/MPSS_Mario.png",
  ]);

  // set default prompt
  useEffect(() => {
    setPrompt(
      prompts.find((p) => p.label === "Psychadelic Mario")?.prompt || ""
    );
  }, []);

  const toast = useToast();

  const generate = async () => {
    setLoading(true);

    if (prompt.length === 0) {
      toast({
        title: "Error",
        description: "Enter a prompt first!",
        status: "error",
      });
      setLoading(false);
      return;
    }

    // hit leap in our nextjs api route
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
        title="Generate Mario"
        description="Generate Mario is a web app that uses the Leap AI API to generate images of Mario. It's built with Next.js, Chakra UI, and Leap AI."
      />
      <VStack
        minH="100vh"
        w="100vw"
        spacing={4}
        bg="#005fad"
        px={4}
        paddingBottom={4}
      >
        <VStack spacing={1}>
          <Heading
            pt={{
              base: 12,
              md: 32,
            }}
            color="gray.200"
            fontFamily="mariofont"
          >
            Generate Mario.
          </Heading>
          <Text
            color="gray.300"
            fontSize="lg"
            w={{ base: "full", md: "lg" }}
            textAlign="center"
            fontFamily="monospace"
          >
            Enter a prompt like "@leapmario as a cat" to generate an image.
          </Text>
        </VStack>

        <Input
          w={{ base: "full", md: "30rem" }}
          py={4}
          color="gray.100"
          focusBorderColor="gray.100"
          variant="outline"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              generate();
            }
          }}
          fontFamily="monospace"
          placeholder="Enter your image generation prompt here"
        />

        <Button
          w={{ base: "full", md: "30rem" }}
          _hover={loading ? {} : { opacity: 0.8 }}
          _active={loading ? {} : { transform: "scale(0.98)", opacity: 0.7 }}
          transitionDuration="200ms"
          bg="#46ad37"
          color="white"
          p={2}
          fontFamily="monospace"
          rounded="lg"
          fontSize="lg"
          key={prompt}
          onClick={() => generate()}
          isLoading={loading}
        >
          Generate
        </Button>

        <Box w={{ base: "full", md: "30rem" }} h="auto">
          {images.map((image) => (
            <Image
              key={image}
              src={image}
              alt="Mario"
              rounded="lg"
              w="full"
              h={{ base: "3/4", md: "20rem" }}
              objectFit="contain"
              transitionDuration="200ms"
              opacity={loading ? 0.3 : 1}
            />
          ))}
        </Box>

        <Wrap w={{ base: "full", md: "30rem" }} pb={20} justify="center">
          {prompts.map((prompt) => (
            <WrapItem key={prompt.label}>
              <HStack
                w="fit"
                _hover={{ opacity: 0.8 }}
                _active={{ transform: "scale(0.98)", opacity: 0.7 }}
                transitionDuration="200ms"
                fontWeight={"bold"}
                color="white"
                p={2}
                border={"1px solid #fff"}
                rounded="lg"
                fontSize="xs"
                key={prompt.label}
                cursor="pointer"
                onClick={() => setPrompt(prompt.prompt)}
              >
                <Text>{prompt.label}</Text>
              </HStack>
            </WrapItem>
          ))}
        </Wrap>
        <HStack
          bg="white"
          p={4}
          py={2}
          rounded="md"
          _hover={{ opacity: 0.8 }}
          _active={{ transform: "scale(0.99)", opacity: 0.7 }}
          cursor="pointer"
          transitionDuration="200ms"
          pos="absolute"
          bottom={4}
          right={4}
          onClick={() =>
            window.open(
              "https://replit.com/@leap-ai/AI-Avatars-App-Javascript-Harry-Potter-Professional"
            )
          }
        >
          <AiFillGithub color="black" />
          <Text fontWeight={"bold"} color={"#1c1c1c"}>
            Train Your Own Character
          </Text>
        </HStack>
        <Box textAlign="center" pos="absolute" bottom={4} fontSize="xl">
          <Text fontSize="xs" fontWeight="bold" mb={4}>
            Takes around 30 seconds
          </Text>
          <Text fontSize="xs" fontWeight="bold">
            Built by{" "}
            <Link target="_blank" href="https://twitter.com/thealexshaq">
              alex
            </Link>{" "}
            and{" "}
            <Link target="_blank" href="https://twitter.com/aleemrehmtulla">
              aleem
            </Link>{" "}
            with{" "}
            <Link target="_blank" href="https://tryleap.ai">
              Leap API ❤️
            </Link>
          </Text>
        </Box>
      </VStack>
    </>
  );
};

export default Home;
