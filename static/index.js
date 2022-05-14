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

const postMessage = async (msg) => {
    console.log(msg);

    const location = window.location.origin;
    const settings = {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(msg),
    };

    const fetchResponse = await fetch(`${location}/api/chat`, settings);
    refreshChat();
};

r(async () => {
    g("chatForm").addEventListener("submit", (e) => {
        e.preventDefault();

        postMessage({
            name: g("name").value,
            message: g("message").value,
        });

        return false;
    });

    await refreshChat();

    setInterval(refreshChat, 5000);
});
