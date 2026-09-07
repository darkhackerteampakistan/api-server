const requestList = document.getElementById("request-list");
const total = document.getElementById("total");

async function loadRequests() {
    try {
        const res = await fetch("/api/requests");
        const data = await res.json();

        requestList.innerHTML = "";
        total.textContent = data.length;

        if (data.length === 0) {
            requestList.innerHTML = "<div class='empty'>No Requests Found</div>";
            return;
        }

        data.reverse().forEach((item) => {
            requestList.innerHTML += `
                <div class="card">
                    <h3>${item.name}</h3>
                    <p><b>Message:</b> ${item.message}</p>
                    <p><b>IP:</b> ${item.ip}</p>
                    <p><b>Method:</b> ${item.method}</p>
                    <p><b>Time:</b> ${item.time}</p>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
        requestList.innerHTML =
            "<div class='error'>Failed to load requests.</div>";
    }
}

loadRequests();
setInterval(loadRequests, 5000);
