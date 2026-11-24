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

  const senderFirstName = document.getElementById("fname").value;
  const senderLastName = document.getElementById("lname").value;
  const senderMessage = document.getElementById("subject").value;
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
    console.warn(
      "IP fetch blocked or failed locally (this is normal for local testing):",
      error,
    );
  }

  const webhookBody = {
    embeds: [
      {
        title: "Contact Form Submitted",
        fields: [
          {
            name: "Sender",
            value: `${senderFirstName} ${senderLastName}`.trim() || "Anonymous",
          },
          { name: "Message", value: senderMessage || "No message provided" },
          { name: "IP Address", value: visitorIP },
          { name: "User Agent", value: userAgent || "Unknown" },
        ],
      },
    ],
  };

  const webhookUrl = "https://mute-snowflake-eaa0.jakeblum0.workers.dev/";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookBody),
    });

    if (response.ok) {
      alert("I have received your message!");
    } else {
      const errText = await response.text();
      console.error("Discord rejected webhook:", errText);
      alert("There was an error sending to Discord! Check console.");
    }
  } catch (err) {
    console.error("Network error posting to Discord:", err);
    alert("Network error while sending message.");
  }
}
