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

    const response = await repo.create(data);

    // Redirect user to thank you page.
    const headers = new Headers();
    headers.set("location", `/?created=${ctx.url.origin}/${response.name}`);

    return new Response(null, {
      headers,
      status: 303, // See Other
    });
  },
};

export default function Home(props: PageProps) {
  const created = props.url.searchParams.get("created");

  return (
    <div>
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#86efac]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm items-center flex flex-col">
          <img
            className="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a memorable, human-readable link
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tiny Url Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  /*placeholder="my tech talk"*/
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Redirect Link
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="url"
                  name="url"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Link
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white text-center p-10">
        {created && (
          <div>
            <h2 class="text-xl">Created</h2>
            <code class="mt-4 p-4 block bg-[lightgrey]">
              <a target="_blank" href={created}>{created}</a>
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
