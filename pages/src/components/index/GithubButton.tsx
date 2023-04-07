import { HStack, Text } from "@chakra-ui/react";
import { AiFillGithub } from "react-icons/ai";

const GithubButton = () => {
  return (
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
      bottom={3}
      right={4}
      onClick={() =>
        window.open(
          "https://replit.com/@leap-ai/AI-Avatars-App-Javascript-Harry-Potter-Professional"
        )
      }
    >
      <AiFillGithub color="black" />
      <Text fontWeight={"bold"} color={"#1c1c1c"}>
        Fork the code on GitHub
      </Text>
    </HStack>
  );
};

export default GithubButton;
