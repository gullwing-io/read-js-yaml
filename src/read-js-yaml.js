import got from "got";
import yaml from "js-yaml";
import { readFileSync } from "fs";

const readJsYaml = async (path, asYAML = false) => {
  let type;
  let body;
  if (shouldFetchFromLocal(path)) {
    type = "local";
    if (!asYAML) {
      body = returnResponseAsObject(fetchLocaleYAML(path));
    } else {
      body = fetchLocaleYAML(path);
    }
  } else {
    type = "remote";
    if (!asYAML) {
      const response = await fetchRemoteYMAL(path);
      body = returnResponseAsObject(response.body, response.path);
    } else {
      const reponse = await fetchRemoteYMAL(path);
      body = reponse.body;
    }
  }
  return {
    type,
    body,
  };
};

const shouldFetchFromLocal = (path) => {
  try {
    new URL(path);
    return false;
  } catch (e) {
    return true;
  }
};

const fetchLocaleYAML = (path) => {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    throw error;
  }
};

const fetchRemoteYMAL = async (path) => {
  try {
    const { body, statusCode } = await got(path);
    return returnResponseOn2xx(body, statusCode, path);
  } catch (error) {
    throw error;
  }
};

const returnResponseOn2xx = (body, statusCode, path) => {
  if (statusCode >= 200 && statusCode < 300) {
    return { body, path };
  } else {
    throw new Error(`${path} returned ${statusCode}`);
  }
};

const returnResponseAsObject = (body, path) => {
  if (typeof body === "object") {
    return body;
  } else {
    const json = yaml.load(body);
    // this is bit gross but its what the lib returns
    if (json === "undefined") {
      try {
        return JSON.parse(response);
      } catch (error) {
        throw new Error(`${path} could not be parsed as JSON`);
      }
    } else {
      return json;
    }
  }
};

export default readJsYaml;
export {
  shouldFetchFromLocal,
  fetchLocaleYAML,
  fetchRemoteYMAL,
  returnResponseOn2xx,
  returnResponseAsObject,
};
