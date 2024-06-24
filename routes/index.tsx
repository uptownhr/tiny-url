import { RedirectRepository } from "../repository.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

const repo = new RedirectRepository();

export interface CreateRedirect {
  name: string;
  url: string;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();

    const data: CreateRedirect = {
      name: form.get("name")?.toString() || "",
      url: form.get("url")?.toString() || "",
    };

    try {
      console.log("data", data);
      const testUrl = new URL(data.url);
      console.log("testUrl", testUrl);
    } catch (e) {
      console.log("error", e);
      return new Response("Invalid URL", { status: 400 });
    }

    await repo.create(data);

    // Redirect user to thank you page.
    const headers = new Headers();
    headers.set("location", `/?created=${ctx.url.origin}/${data.name}`);

    return new Response(null, {
      headers,
      status: 303, // See Other
    });
  },
};

export default function Home(props: PageProps) {
  const created = props.url.searchParams.get("created");

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome, create a URL</h1>
        <form method="POST">
          <input type="text" name="name" placeholder="Name" className="my-2" />
          {" "}
          <br />
          <input type="text" name="url" placeholder="Url" className="my-2" />
          {" "}
          <br />
          <button type="submit" className="my-2">Create</button>
        </form>
      </div>

      <div class="bg-white ">
        {created && (
          <div>
            <b>Created:</b>
            <a target="_blank" href={created}>{created}</a>
          </div>
        )}
      </div>
    </div>
  );
}
