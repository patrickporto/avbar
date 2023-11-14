import { MODULE_NAME } from "./constants.js";
import "./avbar.css"

Hooks.on('init', async () => {
    console.log(`${MODULE_NAME} | Initializing ${MODULE_NAME}`);
});
