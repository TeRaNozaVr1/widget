document.getElementById("connect-wallet").addEventListener("click", async () => {
    const phantom = window.solana;

    if (!phantom || !phantom.isPhantom) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            // Відкриває Phantom через deep link на мобільному
            window.location.href = "https://phantom.app/ul/v1/connect";
        } else {
            alert("Будь ласка, встановіть Phantom-гаманець!");
        }
        return;
    }

    try {
        const response = await phantom.connect();
        document.getElementById("wallet-address").value = response.publicKey.toString();
        console.log("Гаманець підключено:", response.publicKey.toString());
    } catch (error) {
        console.error("Помилка підключення:", error);
    }
});

