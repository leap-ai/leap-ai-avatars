import { Leap } from "@leap-ai/sdk";
import { NextApiRequest, NextApiResponse } from "next";

const generate = async (req: NextApiRequest, res: NextApiResponse) => {
  // parse the `body` parameter for apiKey, modelId, and versionId
  const { apiKey, modelId, prompt } = req.body;

  // check for api key
  const api_key = process.env.API_KEY as string;
  const useableKey = apiKey ? apiKey : api_key;

  if (!useableKey) {
    res.status(400).json({ error: "Invalid request. Check API Key" });
    return;
  }

  // instantiate sdk
  const leap = new Leap(useableKey);

  // Now that we have a fine-tuned version of a model, we can generate images using it.
  // Make sure subjectKeyword, ie. '@me' is in prompts and loop through prompts to generate images
  let avatars = <string[]>[];

  const { data: image, error: imageError } = await leap.generate.generateImage({
    prompt: prompt,
    modelId: modelId,
    numberOfImages: 4,
    steps: 50,
    upscaleBy: "x2",
    restoreFaces: true,
  });

  if (imageError) {
    res.status(500).json(imageError);
    return;
  }

  if (image) {
    image.images.forEach((image) => {
      avatars.push(image.uri);
    });
  }

  res.status(200).json({ avatars: avatars });
};

export default generate;
