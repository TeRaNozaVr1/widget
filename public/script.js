document.getElementById("connect-wallet").addEventListener("click", async () => {
    if (!window.solana || !window.solana.isPhantom) {
        alert("Встановіть Phantom-гаманець!");
        return;
    }

    const wallet = window.solana;
    try {
        const response = await wallet.connect();
        document.getElementById("wallet-address").value = response.publicKey.toString();
        console.log("Гаманець підключено:", response.publicKey.toString());
    } catch (error) {
        console.error("Помилка підключення:", error);
    }
});
