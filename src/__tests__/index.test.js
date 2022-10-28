import readJsYaml from "../../index.js";
  
  describe("Loading YAML", () => {
    describe("readJsYaml", () => {
      test("should return locale bookmarks as JSON", async () => {
        expect(
          await readJsYaml("./src/__tests__/__stubs__/bookmarks.yaml")
        ).toMatchSnapshot();
      });
    });
  });
  