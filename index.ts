import * as Glue from "@hapi/glue";
import * as Manifest from "./manifest";

(async function (): Promise<void> {
  try {
    interface Options {
      relativeTo: string;
    }

    const options: Options = {
      relativeTo: __dirname,
    };

    const server = await Glue.compose(Manifest, options);

    await server.start();
    server.log(["server"], `server running at: ${server.info.uri}`);
  } catch (err) {
    // Unhandled rejections
    process.exit(1);
  }
})();
