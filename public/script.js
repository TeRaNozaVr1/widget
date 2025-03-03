document.getElementById("connect-wallet").addEventListener("click", async () => {
    const phantom = window.solana;
    
    if (!phantom || !phantom.isPhantom) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            // Deep link для мобільних пристроїв
            window.location.href = "https://phantom.app/ul/v1/connect?redirect_link=" + encodeURIComponent(window.location.href);
        } else {
            alert("Будь ласка, встановіть Phantom-гаманець!");
        }
        return;
    }

    try {
        // Підключення через розширення
        const response = await phantom.connect({ onlyIfTrusted: false });
        document.getElementById("wallet-address").value = response.publicKey.toString();
        console.log("Гаманець підключено:", response.publicKey.toString());
    } catch (error) {
        console.error("Помилка підключення:", error);
    }
});

