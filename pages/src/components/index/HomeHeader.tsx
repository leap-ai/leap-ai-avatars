import {
  Heading,
  Link,
  ListItem,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

const HomeHeader = () => {
  const steps = [
    {
      text: <>Upload 3+ face photos (10max)</>,
    },
    {
      text: <>Get your AI Avatars 🥳</>,
    },
  ];

  return (
    <VStack spacing={1}>
      <Heading
        pt={{
          base: 20,
          md: 20,
        }}
        color="gray.200"
        fontFamily="mariofont"
      >
        Leap AI Avatars
      </Heading>
      <UnorderedList
        color="gray.300"
        fontSize="lg"
        w={{ base: "full", md: "lg" }}
        textAlign="left"
        fontFamily="monospace"
        listStyleType="none"
        maxW={350}
      >
        {steps.map((step, index) => (
          <ListItem key={index}>
            {index + 1}. {step.text}
          </ListItem>
        ))}
      </UnorderedList>
    </VStack>
  );
};

export default HomeHeader;
