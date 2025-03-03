document.getElementById("connect-wallet").addEventListener("click", async () => {
    const phantom = window.solana;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (!phantom || !phantom.isPhantom) {
        if (isMobile) {
            // Відкриваємо Phantom через deep link та повертаємось на сайт після підключення
            const redirectUrl = encodeURIComponent(window.location.href + "?wallet=connected");
            window.location.href = `https://phantom.app/ul/v1/connect?redirect_link=${redirectUrl}`;
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

// Якщо користувач повернувся після підключення у Phantom (мобільний deep link)
window.addEventListener("load", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("wallet") === "connected") {
        const phantom = window.solana;
        if (phantom && phantom.isPhantom) {
            try {
                const response = await phantom.connect({ onlyIfTrusted: true });
                if (response.publicKey) {
                    document.getElementById("wallet-address").value = response.publicKey.toString();
                    console.log("Гаманець підключено (авто після повернення):", response.publicKey.toString());
                }
            } catch (error) {
                console.error("Помилка автопідключення:", error);
            }
        }
    }
});


