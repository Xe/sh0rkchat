import * as Drash from "https://deno.land/x/drash@v2.5.4/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("./test.db");
db.query(`
CREATE TABLE IF NOT EXISTS messages
  ( id      INTEGER PRIMARY KEY
  , sender  TEXT NOT NULL
  , message TEXT NOT NULL
  );
`);

class HomeResource extends Drash.Resource {
    public paths = ["/"];

    public GET(request: Drash.Request, response: Drash.Response): void {
        return response.json({
            hello: "world",
            time: new Date(),
        });
    }
}

const server = new Drash.Server({
    hostname: "0.0.0.0",
    port: 8080,
    protocol: "http",
    resources: [HomeResource],
});

server.run();

console.log(`Server running at ${server.address}.`);
