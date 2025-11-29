// server/index.js
console.log("👋 index.js is running");

import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
});
