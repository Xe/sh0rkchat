import { g, r, h, x, t } from "./xeact.js";
import { ul, li } from "./xeact-html.js";

const refreshChat = async () => {
    const resp = await fetch("/api/chat");
    const messages = await resp.json();

    x(g("chatRoot"));

    console.log(messages);

    g("chatRoot").appendChild(
        ul(
            { style: "list-style:none;padding:0;margin:0" },
            messages.map(m => li(`<${m.name}> ${m.message}`))
        )
    );
};

r(async () => {
    g("chatForm").addEventListener("submit", (e) => {
        e.preventDefault();

        return false;
    });

    await refreshChat();
});
