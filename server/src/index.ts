import { env } from "./config/env.js";
import { createApp } from "./app.js";

createApp().listen(env.port, () => {
  console.log(`Barbini Admin API listening on port ${env.port}`);
});
