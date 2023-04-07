import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import multer from "multer";
import FormData from "form-data";

import axios from "axios";

import { Leap } from "@leap-ai/sdk";
import { LeapModelSchema } from "@leap-ai/sdk/dist/types/schemas/Model";

interface QueueTrainingJobResponse {
  id: string;
  status: "queued" | "processing" | "finished" | "failed";
}

const apiRoute = nc<NextApiRequest, NextApiResponse>({
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 1024 * 1024 * 10, // 10MB
    files: 20,
    fieldNameSize: 200,
  },
});

apiRoute.post(upload.array("files"), async (req, res) => {
  if (req.files === undefined) {
    return res.status(400).json({
      error: "Missing or invalid file",
    });
  }

  // parse the `body` parameter for apiKey
  const { apiKey } = JSON.parse(req.body.apiKey);
  // check for api key
  const api_key = process.env.API_KEY as string;
  const useableKey = apiKey ? apiKey : api_key;
  console.log(useableKey, "useableKey");

  // instantiate sdk
  const leap = new Leap(useableKey);

  // create new model
  console.log("Creating New Model...");
  const { data: model, error: modelError } = (await leap.fineTune.createModel({
    title: "AI Avatars Sample",
    subjectKeyword: "@me",
  })) as { data: any; error?: any };

  console.log("New Model Created: ", model);
  const modelId = model?.id;
  const subjectKeyword = model?.subjectKeyword;

  // now upload the images to fine tune this model using api
  const url = `https://api.tryleap.ai/api/v1/images/models/${modelId}/samples`;
  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${useableKey}`,
  };

  // the way multer handles file uploads, it only supports arrays of files
  // we only upload one at a time so we fetch them here
  const files = Array(req.files);
  console.log(files, "files");

  try {
    if (req.method === "POST") {
      const formData = new FormData();

      // here we convert the Multer buffer to a plain old javascript Buffer so that the Leap API can pick it up
      for (const file in files) {
        const f = (file as any)[0];
        console.log(f, "f");

        formData.append("files", Buffer.from(f.buffer), f.originalname);
      }

      const uploadSamplesResponse = await axios.post(url, formData, {
        headers,
      });
      console.log(uploadSamplesResponse.data, "uploadSamplesResponse");

      // next queue training job
      const { data: newVersion, error: newVersionError } =
        (await leap.fineTune.queueTrainingJob({
          modelId: modelId,
          // webhookUrl: "https://webhook.site/"
        })) as { data: any; error?: any };

      // check if hit paid API limit or missing samples
      if (newVersionError) {
        console.log("Error: ", newVersionError.message);
        return res.status(400).json({
          error: newVersionError.message,
        });
      }
      const versionId = newVersion?.id;
      const trainingStatus = newVersion?.status;

      console.log("New Training Version: ", newVersion);
      console.log("Training Status: ", trainingStatus);

      return res.status(200).json({
        trainingStatus: trainingStatus,
        modelId: modelId,
        versionId: versionId,
      });
    } else {
      return res.status(404).send("This method only supports POST requests.");
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute;
