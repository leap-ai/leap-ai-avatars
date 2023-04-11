import { Leap } from "@leap-ai/sdk";
import { NextApiRequest, NextApiResponse } from "next";

const getStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  // parse the `body` parameter for apiKey, modelId, and versionId
  const { apiKey, modelId } = req.body;
  let { versionId } = req.body;

  // check for api key
  const api_key = process.env.API_KEY as string;
  const useableKey = apiKey ? apiKey : api_key;

  if (!useableKey) {
    res.status(400).json({ error: "Invalid request. Check API Key" });
    return;
  }

  // instantiate sdk
  const leap = new Leap(useableKey);

  // check for existing versionId, if not, get first version created
  if (!versionId) {
    const { data: listModelVersions, error: listModelVersionsError } =
      (await leap.fineTune.listModelVersions({
        modelId: modelId,
      })) as { data: any; error?: any };

    if (listModelVersions) {
      const existingVersion = listModelVersions[0];
      versionId = existingVersion ? existingVersion.id : null;
    }
  }

  // check model training status by continuously polling getModelVersion
  const { data: checkStatus, error: checkStatusError } =
    (await leap.fineTune.getModelVersion({
      modelId: modelId,
      versionId: versionId,
    })) as { data: any; error?: any };

  if (checkStatusError) {
    res.status(500).json({ error: checkStatusError });
    return;
  }

  const trainingStatus = checkStatus.status;
  res.status(200).json({ trainingStatus: trainingStatus });
};

export default getStatus;
