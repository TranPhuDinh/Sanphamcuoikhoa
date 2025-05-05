const products = {
    "SP123456": { name: "Laptop Dell XPS 15", warranty: "2025-06-30" },
    "SP987654": { name: "iPhone 16 Pro Max", warranty: "2024-12-31" },
    "SP654321": { name: "Smart TV Samsung 55'", warranty: "2026-08-15" }
};

function checkWarranty() {
    let serial = document.getElementById("serialNumber").value.toUpperCase();
    let resultDiv = document.getElementById("result");
    let loadingDiv = document.getElementById("loading");

    resultDiv.innerHTML = "";
    loadingDiv.style.display = "block"; // Hiện hiệu ứng loading

    setTimeout(() => {
        loadingDiv.style.display = "none"; // Ẩn hiệu ứng loading

        if (products[serial]) {
            let product = products[serial];
            let today = new Date();
            let expiryDate = new Date(product.warranty);

            if (today <= expiryDate) {
                resultDiv.innerHTML = `✅ <strong>${product.name}</strong><br>Trạng thái: <span style="color:green;">Còn bảo hành</span> (Đến ${product.warranty})`;
            } else {
                resultDiv.innerHTML = `❌ <strong>${product.name}</strong><br>Trạng thái: <span style="color:red;">Hết bảo hành</span> (Hết hạn ${product.warranty})`;
            }

            saveToHistory(serial);
        } else {
            resultDiv.innerHTML = `<span style="color:red;">⚠ Mã sản phẩm không hợp lệ!</span>`;
        }
    }, 1500);
}

// Lưu lịch sử tìm kiếm
function saveToHistory(serial) {
    let historyList = document.getElementById("historyList");
    let historyData = JSON.parse(localStorage.getItem("history")) || [];

    if (!historyData.includes(serial)) {
        historyData.push(serial);
        localStorage.setItem("history", JSON.stringify(historyData));
        updateHistoryList();
    }
}

// Hiển thị lịch sử tìm kiếm
function updateHistoryList() {
    let historyList = document.getElementById("historyList");
    let historyData = JSON.parse(localStorage.getItem("history")) || [];

    historyList.innerHTML = "";
    historyData.forEach(serial => {
        let li = document.createElement("li");
        li.textContent = serial;
        li.onclick = () => {
            document.getElementById("serialNumber").value = serial;
            checkWarranty();
        };
        historyList.appendChild(li);
    });

    // Cập nhật danh sách gợi ý
    let dataList = document.getElementById("history");
    dataList.innerHTML = "";
    historyData.forEach(serial => {
        let option = document.createElement("option");
        option.value = serial;
        dataList.appendChild(option);
    });
}

// Tải lịch sử khi trang mở
document.addEventListener("DOMContentLoaded", updateHistoryList);