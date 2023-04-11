import { Heading, VStack } from "@chakra-ui/react";
import Link from "next/link";

const HomeHeader = () => {
  return (
    <VStack spacing={1} mb={2}>
      <Heading
        pt={{
          base: 20,
          md: 20,
        }}
        mb={3}
        color="gray.200"
        fontFamily="monospace"
      >
        🔥{" "}
        <Link target="_blank" href="https://tryleap.ai">
          Leap AI
        </Link>{" "}
        Avatars 🔥
      </Heading>
      <Heading fontFamily="monospace" fontSize={"2xl"}>
        Get your Avatars in 3 easy steps
      </Heading>
    </VStack>
  );
};

export default HomeHeader;
