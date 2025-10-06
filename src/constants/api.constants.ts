import { isDev } from "../helpers/env.helpers";

export const BASE_API_URL = isDev()
  ? "http://localhost:3000"
  : "https://miru-bun-server.fly.dev";
