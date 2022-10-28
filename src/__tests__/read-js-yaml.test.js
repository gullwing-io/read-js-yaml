import readJsYaml, {
  shouldFetchFromLocal,
  fetchLocaleYAML,
  fetchRemoteYMAL,
  returnResponseOn2xx,
  returnResponseAsObject,
} from "../read-js-yaml.js";

describe("Loading YAML", () => {
  describe("readJsYaml", () => {
    test("should return locale bookmarks as JSON", async () => {
      expect(
        await readJsYaml("./src/__tests__/__stubs__/bookmarks.yaml")
      ).toMatchSnapshot();
    });
    test("should return remote bookmarks as JSON", async () => {
      expect(
        await readJsYaml(
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        )
      ).toMatchSnapshot();
    });
    test("should return locale bookmarks as YAML", async () => {
      expect(
        await readJsYaml("./src/__tests__/__stubs__/bookmarks.yaml", true)
      ).toMatchSnapshot();
    });
    test("should return remote bookmarks as YAML", async () => {
      expect(
        await readJsYaml(
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml",
          true
        )
      ).toMatchSnapshot();
    });
  });
  describe("shouldFetchFromLocal", () => {
    test("should return true if path is local filesystem", () => {
      expect(
        shouldFetchFromLocal("./src/__tests__/__stubs__/bookmarks.yaml")
      ).toBeTruthy();
    });
    test("should return false if path is remote http", () => {
      expect(
        shouldFetchFromLocal(
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        )
      ).toBeFalsy();
    });
  });
  describe("fetchLocaleYAML", () => {
    test("should return throw for file that can't be read", () => {
      try {
        fetchLocaleYAML("./src/__tests__/__stubs__/missing-file.yaml");
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual(
          "ENOENT: no such file or directory, open './src/__tests__/__stubs__/missing-file.yaml'"
        );
      }
    });
    test("should return JSON from local YMAL", () => {
      expect(
        fetchLocaleYAML("./src/__tests__/__stubs__/bookmarks.yaml")
      ).toMatchSnapshot();
    });
  });
  describe("fetchRemoteYMAL", () => {
    test("should return throw for file that can't be fetched", async () => {
      try {
        await fetchRemoteYMAL(
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/missing-file.yaml"
        );
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual("Response code 404 (Not Found)");
      }
    });
    test("should return JSON from http request", async () => {
      expect(
        await fetchRemoteYMAL(
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        )
      ).toMatchSnapshot();
    });
  });
  describe("returnResponseOn2xx", () => {
    test("should throw with statusCode 100", () => {
      try {
        returnResponseOn2xx(
          "hello: world",
          100,
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        );
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual(
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml returned 100"
        );
      }
    });
    test("should throw with statusCode 300", () => {
      try {
        returnResponseOn2xx(
          "hello: world",
          300,
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        );
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual(
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml returned 300"
        );
      }
    });
    test("should return object with string of JSON", () => {
      try {
        const response = returnResponseOn2xx(
          "hello: world",
          200,
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        );
        expect(response).toEqual({
          body: "hello: world",
          path: "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml",
        });
      } catch (error) {
        expect(true).toBe(false);
      }
    });
  });
  describe("returnResponseAsObject", () => {
    test("should return throw with invalid response error", () => {
      try {
        returnResponseAsObject(
          undefined,
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        );
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual(
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml could not be parsed as JSON"
        );
      }
    });
    test("should return object with string of JSON", () => {
      try {
        const response = returnResponseAsObject(
          "{'hello':'world'}",
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        );
        expect(response).toEqual({ hello: "world" });
      } catch (error) {
        expect(true).toBe(false);
      }
    });
    test("should return object with object", () => {
      try {
        const response = returnResponseAsObject(
          { hello: "world" },
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        );
        expect(response).toEqual({ hello: "world" });
      } catch (error) {
        expect(true).toBe(false);
      }
    });
    test("should return object with YAML", () => {
      try {
        const response = returnResponseAsObject(
          "hello: world",
          "https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml"
        );
        expect(response).toEqual({ hello: "world" });
      } catch (error) {
        expect(true).toBe(false);
      }
    });
  });
});
