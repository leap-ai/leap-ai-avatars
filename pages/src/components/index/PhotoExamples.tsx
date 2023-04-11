import { Flex, Image } from "@chakra-ui/react";

const PhotoExamples = () => {
  return (
    <Flex
      borderWidth="0.5px"
      borderColor={"white"}
      bg="white"
      borderRadius="lg"
      maxW="850px"
      w="100%"
      p={2}
      justifyContent="center"
      flexDirection={"row"}
      flexWrap={["wrap", "wrap", "nowrap"]}
    >
      {" "}
      <Image
        src={
          "https://uploads-ssl.webflow.com/631e7debd95a0a0b974074e2/64303d1f1db19e6b53c53043_IMG_8601.jpg"
        }
        alt="goodExample"
        rounded="lg"
        w="100%"
        maxH={"200px"}
        objectFit="contain"
      />
      <Image
        src={
          "https://uploads-ssl.webflow.com/631e7debd95a0a0b974074e2/64303d1fd5c80d1b91102d00_IMG_8601%202.jpg"
        }
        alt="badExample"
        rounded="lg"
        w="100%"
        maxH={"200px"}
        objectFit="contain"
      />
    </Flex>
  );
};

export default PhotoExamples;
