import { NextApiRequest, NextApiResponse } from "next";
import { Leap } from "@leap-ai/sdk";

const MODEL_ID = "enter-your-model-id-here";
const IMAGE_WIDTH = 600;
const IMAGE_HEIGHT = 400;

const generate = async (req: NextApiRequest, res: NextApiResponse) => {
  const prompt = req.body.prompt as string;
  const apiKey = process.env.LEAP_API_KEY as string;

  if (!prompt || prompt.length === 0 || !apiKey) {
    res.status(400).json({ error: "Invalid request. Check key and prompt." });
    return;
  }

  const leap = new Leap(apiKey);

  const { data, error } = await leap.generate.generateImage({
    modelId: MODEL_ID,
    prompt,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    numberOfImages: 1,
  });

  if (error) {
    res.status(500).json(error);
    return;
  }

  res.status(200).json(data);
};

export default generate;
