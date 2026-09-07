const requestList = document.getElementById("request-list");
const total = document.getElementById("total");

async function loadRequests() {
    requestList.innerHTML = "Loading...";

    try {
        const res = await fetch("/api/requests");

        console.log("Status:", res.status);

        const data = await res.json();

        console.log("Data:", data);

        total.textContent = data.length;
        requestList.innerHTML = "";

        data.forEach(item => {
            requestList.innerHTML += `
                <div class="card">
                    <h3>${item.name}</h3>
                    <p>${item.message}</p>
                </div>
            `;
        });

    } catch (e) {
        console.error(e);
        requestList.innerHTML = "<h2 style='color:red'>"+e.message+"</h2>";
    }
}

loadRequests();
