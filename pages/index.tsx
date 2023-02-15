/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

import {
  Box,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { AiFillGithub } from "react-icons/ai";

const Home = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [image, setImage] = useState<string>(
    "http://localhost:3002/default.png"
  );

  const prompts = [
    "Harry in the forest",
    "Werewolfs sitting with Harry",
    "A portrait of Harry",
    "Harry with red hair",
    "Harry in Toronto, in the middle of a snowstorm",
    "A room with blue walls and a red carpet, with harry sitting on a black chair",
  ];

  const generate = async () => {
    setLoading(true);

    // in case they put a raw name in the prompt, replace it with @harry
    if (prompt.toLowerCase().includes("harry")) {
      setPrompt(prompt.toLowerCase().replace("harry", "@harry"));
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

    // set it, to switch the default image
    setImage(image.images[0].uri);
    setLoading(false);
  };

  return (
    <>
      <VStack h="100vh" spacing={4} bg="#6D051E">
        <VStack spacing={1}>
          <Heading pt={32} color="gray.200">
            Generate Potter.
          </Heading>
          <Text color="gray.300">
            Enter a prompt like "@harry as a cat" to generate an image.
          </Text>
        </VStack>

        <HStack
          border="1px"
          borderColor="gray.200"
          color="white"
          p={4}
          py={2}
          rounded="md"
          _hover={{ bg: "#3f0311" }}
          cursor="pointer"
          transitionDuration="200ms"
          pos="absolute"
          bottom={4}
          right={4}
        >
          <AiFillGithub color="white" />
          <Text>Train Your Own Character</Text>
        </HStack>

        <Input
          w="30rem"
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
          placeholder="Enter your image generation prompt here"
        />

        <Box w="30rem" h="30rem" pos="relative">
          {loading && (
            <Spinner
              pos="absolute"
              top="50%"
              left="50%"
              zIndex={99}
              color="white"
            />
          )}
          <Image
            src={image}
            alt="Harry Potter"
            rounded="lg"
            w="full"
            h="20rem"
            objectFit="cover"
            transitionDuration="200ms"
            opacity={loading ? 0.3 : 1}
          />
        </Box>

        <Wrap w="30rem" h="full">
          {prompts.map((prompt) => (
            <WrapItem key={prompt}>
              <HStack
                w="fit"
                _hover={{ opacity: 0.8 }}
                _active={{ transform: "scale(0.98)", opacity: 0.7 }}
                transitionDuration="200ms"
                bg="#C99D25"
                color="white"
                p={2}
                rounded="lg"
                fontSize="xs"
                key={prompt}
                cursor="pointer"
                onClick={() => setPrompt(prompt)}
              >
                <Text>{prompt}</Text>
              </HStack>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </>
  );
};

export default Home;
