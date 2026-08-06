A [React](https://react.dev/) SPA built with [Vite](https://vite.dev/) and
[React Router](https://reactrouter.com/), talking to the ASP.NET Core API in
[`../api`](../api).

## Getting Started

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `PORT` to use a
different port.

Requests to `/api/*` are proxied to the API on `http://localhost:5200` with the
`/api` prefix stripped — see `server.proxy` in [vite.config.ts](vite.config.ts).
Start the API separately for the app to load data.

## Layout

- `index.html` — page shell (title, description, `#root`)
- `main.tsx` — entry point; mounts React and defines the routes
- `app/layout.tsx` — root layout (store provider, navbar, `<Outlet />`)
- `app/page.tsx`, `app/login/page.tsx` — the two routes
- `app/components/` — UI components
- `lib/` — Redux Toolkit store, slices, and hooks
- `network/` — API client functions

The `@/*` import alias resolves to this directory.

## Build

```bash
npm run build
```

Typechecks, then emits static files to `dist/`. Because this is a single-page
app, whatever serves `dist/` must fall back to `index.html` for unknown paths,
or deep links like `/login` will 404.
