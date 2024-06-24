import { defineRoute } from "$fresh/server.ts";
import { RedirectRepository } from "../repository.ts";
import { format } from "date-fns";

const repo = new RedirectRepository();

export class RedirectModel {
  url: string;
  created: Date;
}

export default defineRoute(async (req, ctx) => {
  const list: RedirectModel[] = await repo.list(ctx.params.name);

  if (list.length === 1) {
    return Response.redirect(list[0].url, 307);
  } else if (list.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return (
    <ul>
      {list.map((item) => (
        <li>
          <a href={item.url}>
            {format(item.created, "yyyy-M-d")} - {item.url}
          </a>
        </li>
      ))}
    </ul>
  );
});
