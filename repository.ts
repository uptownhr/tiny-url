import { RedirectModel } from "./routes/[name].tsx";
import { CreateRedirect } from "./routes/index.tsx";
import slugify from "slugify";
import KvKey = Deno.KvKey;

const kv = await Deno.openKv();

type RedirectUrl = string;
interface ParsedId {
  kvKey: string;
  created: number;
  name: string;
}

export class RedirectRepository {
  kvKey = "redirects";

  constructor() {}

  async create({ name, url }: CreateRedirect) {
    console.log([this.kvKey, name, Date.now()], url.toLowerCase());
    const id = this.createId(this.kvKey, name);

    const created = await kv.set(id, url);

    console.log("created", { id, created });

    const res = await kv.get<RedirectUrl>([...id]);

    if (res.value === null) {
      throw new Error("Failed to create redirect");
    }

    const parsed = this.parseId(res.key);

    return {
      url: res.value,
      name: parsed.name,
      created: new Date(parsed.created),
    };
  }

  async list(name?: string): Promise<RedirectModel[]> {
    const search = [this.kvKey.toLowerCase()];

    if (name) {
      search.push(name.toLowerCase());
    }

    console.log(search);

    const entries = kv.list<RedirectUrl>({ prefix: search });

    const result: RedirectModel[] = [];

    for await (const entry of entries) {
      const parsed = this.parseId(entry.key);
      result.unshift({
        url: entry.value,
        created: new Date(parsed.created),
      });
    }

    return result;
  }

  private createId(kvKey: string, name: string): [string, string, number] {
    const slug = slugify(name, {lower: true});

    return [kvKey.toLowerCase(), slug, Date.now()];
  }

  private parseId(id: KvKey): ParsedId {
    return {
      kvKey: id[0] as string,
      name: id[1] as string,
      created: id[2] as number,
    };
  }
}
