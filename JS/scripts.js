const formLoadedAt = Date.now();

function nav() {
  var x = document.getElementById("links");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

async function sendMessage(ev) {
  ev.preventDefault();

  const senderName = document.getElementById("name").value;
  const senderContact = document.getElementById("contact").value;
  const senderMessage = document.getElementById("subject").value;
  const honeypotValue = document.getElementById("website")?.value || "";
  const userAgent = navigator.userAgent;

  let visitorIP = "Unknown / Local";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const ipResponse = await fetch("https://api.ipify.org?format=json", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const ipData = await ipResponse.json();
    if (ipData && ipData.ip) {
      visitorIP = ipData.ip;
    }
  } catch (error) {
    // IP lookup failed or timed out; keep default value
  }

  const payload = {
    name: `${senderName}`.trim() || "Anonymous",
    contact: `${senderContact}`.trim() || "None",
    message: senderMessage,
    ip: visitorIP,
    userAgent: userAgent || "Unknown",
    honeypot: honeypotValue,
    timeSpentMs: Date.now() - formLoadedAt,
  };

  const webhookUrl = "https://mute-snowflake-eaa0.jakeblum0.workers.dev";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("I have received your message!");
      ev.target.reset();
    } else {
      const errText = (await response.text()).trim();
      alert(errText || `Could not send message (Error ${response.status}).`);
    }
  } catch (err) {
    alert("Network error while sending message.");
  }
}
