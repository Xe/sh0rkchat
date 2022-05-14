import * as Drash from "https://deno.land/x/drash@v2.5.4/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("./test.db");

class HomeResource extends Drash.Resource {
    public paths = ["/"];

    public GET(request: Drash.Request, response: Drash.Response): void {
        return response.json({
            hello: "world",
            time: new Date(),
        });
    }
}

class FilesResource extends Drash.Resource {
    public paths = ["/static/.*"];

    public GET(request: Drash.Request, response: Drash.Response) {
        const path = new URL(request.url).pathname;
        return response.file(`.${path}`);
    }
}

const server = new Drash.Server({
    hostname: "0.0.0.0",
    port: 8080,
    protocol: "http",
    resources: [HomeResource, FilesResource],
});

server.run();

console.log(`Server running at ${server.address}.`);
