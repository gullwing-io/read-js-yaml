# read-js-yaml

> A wrapper around `js-yaml` to read local or remote YAML and optionally return JSON

## Installation

```
npm install read-js-yaml
```

## Usage

```Javascript
import readJsYaml from 'read-js-yaml';

// read from local directory returns JSON
const json = await readJsYaml("./src/__tests__/__stubs__/bookmarks.yaml")
// read from local directory returns YAML
const yaml = await readJsYaml("https://raw.githubusercontent.com/thearegee/bookworms/main/demo/config/bookmarks.yaml", true)
```

There is one default function you can use from `read-js-yaml`.

### readJsYaml(path, asYaml)

`readJsYaml` works as an asynconous function that takes two parameters:

* `path` - **Required** can be the path to a local `YAML` or remote `YAML` file
* `asYaml` - _optional_ boolean value defaults to false, if set to true returns `YAML` as a string else the requested `YAML` is returned as `JSON`

**NOTE:** If something goes wrong like the file can't be found or returns a non 2xx the function will throw and error.



