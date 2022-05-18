import * as Drash from "https://deno.land/x/drash@v2.5.4/mod.ts";
import { DexterService } from "https://deno.land/x/drash@v2.5.4/src/services/dexter/dexter.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const dexter = new DexterService({
    enabled: true,
    method: true,
    url: true,
    response_time: true,
});

export { Drash, DB, dexter };
