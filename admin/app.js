const requestList = document.getElementById("request-list");
const total = document.getElementById("total");

async function loadRequests() {
  try {
    const res = await fetch("/api/requests");
    const data = await res.json();

    requestList.innerHTML = "";
    total.textContent = data.length;

    if (data.length === 0) {
      requestList.innerHTML = `
        <div class="empty">
          No Requests Found
        </div>
      `;
      return;
    }

    data.reverse().forEach((item, index) => {
      requestList.innerHTML += `
        <div class="card">
          <h3>#${index + 1}</h3>

          <p><b>Name:</b> ${item.name || "Unknown"}</p>

          <p><b>Message:</b><br>${item.message}</p>

          <p><b>Time:</b> ${item.time}</p>

          <hr>
        </div>
      `;
    });

  } catch (err) {
    requestList.innerHTML = `
      <div class="error">
        Failed to load requests.
      </div>
    `;
    console.error(err);
  }
}

loadRequests();

// Auto Refresh every 5 seconds
setInterval(loadRequests, 5000);
