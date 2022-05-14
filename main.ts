import * as Drash from "https://deno.land/x/drash@v2.5.4/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB(Deno.env.get("DATABASE_PATH"));
db.query(`
CREATE TABLE IF NOT EXISTS messages
  ( id      INTEGER NOT NULL PRIMARY KEY
  , sender  TEXT NOT NULL
  , message TEXT NOT NULL
  );
`);

class HomeResource extends Drash.Resource {
    public paths = ["/"];

    public POST(request: Drash.Request, response: Drash.Response): void {
        const message = request.bodyParam<string>("message");
        const name = request.bodyParam<string>("name");
        console.log(`message: ${message}, name: ${name}`)

        if (!message || !name) {
            throw new Drash.Errors.HttpError(400, "need both name and message");
        }

        db.query("INSERT INTO messages(sender, message) VALUES (?1, ?2)", [name, message]);
    }

    public GET(request: Drash.Request, response: Drash.Response): void {
        let reply: any[] = [];

        for (const [name, message] of db.query("SELECT sender, message FROM messages")) {
            reply.push({name, message});
        }

        response.json(reply);
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
