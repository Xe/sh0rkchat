import * as Drash from "https://deno.land/x/drash@v2.5.4/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { html } from "https://deno.land/x/html_template@0.2.1/mod.ts";

const db = new DB(Deno.env.get("DATABASE_PATH"));
db.query(`
CREATE TABLE IF NOT EXISTS messages
  ( id      INTEGER NOT NULL PRIMARY KEY
  , sender  TEXT NOT NULL
  , message TEXT NOT NULL
  );
`);

class Files extends Drash.Resource {
  paths = ["/static/.*"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const path = new URL(request.url).pathname;
    return response.file(`.${path}`); // response.file("./favicon.ico")
  }
}

class Chat extends Drash.Resource {
    public paths = ["/api/chat"];

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

class Index extends Drash.Resource {
    public paths = ["/"];

    public GET(request: Drash.Request, response: Drash.Response): void {
        return html`
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
        <link rel="stylesheet" href="/static/xess.css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body id="top">
        <main>
            <h1>Page title</h1>

            <p>Hello! this is an example page using <a href="https://github.com/Xe/Xess">Xess</a></p>
            
            <blockquote>When in doubt, create another framework</blockquote>
            
            <ul><li>Unknown</li></ul>
            
            <p>Select this text to see what happens!</p>

            <footer>
                <p>CSS available under the MIT license.</p>
            </footer>
        </main>
    </body>
</html>
`
    }
}

const server = new Drash.Server({
    hostname: "0.0.0.0",
    port: 8080,
    protocol: "http",
    resources: [Chat, Files, Index],
});

server.run();

console.log(`Server running at ${server.address}.`);
