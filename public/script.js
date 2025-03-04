document.getElementById("exchange").addEventListener("click", async () => {
    const phantom = window.solana;
    if (!phantom || !phantom.isPhantom) {
        alert("Будь ласка, встановіть Phantom-гаманець!");
        return;
    }

    try {
        // Підключення гаманця
        const response = await phantom.connect();
        const userWallet = response.publicKey.toString();
        console.log("Гаманець підключено:", userWallet);

        const amount = parseFloat(document.getElementById("amount").value);
        if (isNaN(amount) || amount < 1) {
            alert("Мінімальна сума обміну — $1");
            return;
        }

        const currency = document.getElementById("currency").value;

        // Відправка даних на сервер
        const res = await fetch("/.netlify/functions/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                wallet: userWallet,
                amount: amount,
                currency: currency
            })
        });

        const data = await res.json();
        if (data.success) {
            alert(`Обмін успішний! TxID: ${data.transaction}`);
            console.log("Транзакція:", data.transaction);
        } else {
            alert("Помилка під час обміну: " + data.message);
        }
    } catch (error) {
        console.error("Помилка транзакції:", error);
        alert("Помилка при відправці транзакції!");
    }
});


