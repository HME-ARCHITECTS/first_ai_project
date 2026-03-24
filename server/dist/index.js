"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT ?? 3001;
app_1.app.listen(PORT, () => {
    console.log(`[server] Vision AI API running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map