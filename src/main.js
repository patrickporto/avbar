import { MODULE_NAME, TEMPLATE_PATH } from "./constants.js";
import "./avbar.css"

Hooks.on('ready', async () => {
    console.log(`${MODULE_NAME} | Initializing ${MODULE_NAME}`);
    const avbar = $('<div id="avbar"></div>')
    avbar.html(await renderTemplate(`${TEMPLATE_PATH}/avbar.html`, {}));
    $('#ui-bottom').append(avbar)
});
