import {
  onCloseForStartingScript,
  onErrorForStartingScript,
  prepareScript,
  spawnChildProcess,
  stderrOnDataForStartingScript,
  stdoutOnDataForStartingScript,
} from "../utils/utils.js";

export const serverController = async (req, res, next) => {
  console.log("webhook started!");
  try {
    const repositoryName = req.body.repository.full_name;
    const sha = req.body.after;

    await prepareScript(req);

    await spawnChildProcess({
      sha,
      stdoutOnData: (data) => stdoutOnDataForStartingScript(data),
      stderrOnData: (data) => stderrOnDataForStartingScript(data),
      onClose: (code) =>
        onCloseForStartingScript({ code, req, sha, repositoryName }),
      onError: (err) =>
        onErrorForStartingScript({ err, req, sha, repositoryName }),
    });
  } catch (error) {
    next(error);
  }
};
