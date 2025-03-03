document.getElementById("connect-wallet").addEventListener("click", async () => {
    const phantom = window.solana;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!phantom || !phantom.isPhantom) {
        if (isMobile) {
            // Використовуємо deep link для відкриття Phantom
            window.location.href = "https://phantom.app/ul/v1/connect?redirect_link=" + encodeURIComponent(window.location.href);
        } else {
            alert("Будь ласка, встановіть Phantom-гаманець!");
        }
        return;
    }

    try {
        // Викликаємо підключення з підтвердженням користувача
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

