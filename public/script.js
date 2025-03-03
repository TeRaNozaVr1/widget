document.getElementById("connect-wallet").addEventListener("click", async () => {
    const phantom = window.solana;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!phantom || !phantom.isPhantom) {
        if (isMobile) {
            // Відкриваємо додаток Phantom через deep link
            window.location.href = "https://phantom.app/ul/v1/connect";
        } else {
            alert("Будь ласка, встановіть Phantom-гаманець!");
        }
        return;
    }

    try {
        // Завжди запитуємо дозвіл перед підключенням
        const response = await phantom.connect({ onlyIfTrusted: false });

        if (response.publicKey) {
            document.getElementById("wallet-address").value = response.publicKey.toString();
            console.log("Гаманець підключено:", response.publicKey.toString());
        } else {
            console.warn("Користувач не підтвердив підключення.");
        }
    } catch (error) {
        console.error("Помилка підключення:", error);
    }
});



