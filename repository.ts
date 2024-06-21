import { Injectable } from '@nestjs/common';

const kv = await Deno.openKv();

type RedirectUrl = string;

@Injectable()
export class RedirectRepository {
  kvKey = 'redirects';

  constructor() {  }

  async create(url: string, name: string) {
    console.log([this.kvKey, name, Date.now()], url);
    const id = [this.kvKey, name, Date.now()];
    const created = await kv.set(id, url);

    console.log('created', created);

    const res = await kv.get<RedirectUrl>([...id]);

    if (res.value === null) {
      throw new Error('Failed to create redirect');
    }

    return {
      url: res.value,
      created: new Date(res.key[2]),
    };
  }

  async list(name?: string) {
    const search = [this.kvKey];

    if (name) {
      search.push(name);
    }

    const entries = kv.list<RedirectUrl>({ prefix: search });
    const result = [];

    for await (const entry of entries) {
      result.push({
        url: entry.value,
        created: new Date(entry.key[2]),
      });
    }

    return result;
  }
}
