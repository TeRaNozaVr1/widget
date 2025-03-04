document.addEventListener("DOMContentLoaded", () => {
    const statusMessage = document.getElementById("status-message");
    const connectButton = document.getElementById("connect-wallet");
    const exchangeButton = document.getElementById("exchange");
    const amountInput = document.getElementById("amount");
    const walletAddressInput = document.getElementById("wallet-address");
    const currencySelect = document.getElementById("currency");

    let userWallet = null;

    // Функція для виведення статусу
    function showStatus(message, type = "info") {
        statusMessage.textContent = message;
        statusMessage.style.color = type === "error" ? "red" : "green";
    }

    // Підключення гаманця Phantom
    connectButton.addEventListener("click", async () => {
        const phantom = window.solana;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (!phantom || !phantom.isPhantom) {
            if (isMobile) {
                window.location.href = "https://phantom.app/ul/v1/connect?app_url=" + encodeURIComponent(window.location.href);
            } else {
                alert("Будь ласка, встановіть Phantom-гаманець!");
            }
            return;
        }

        try {
            const response = await phantom.connect({ onlyIfTrusted: false });

            if (response.publicKey) {
                userWallet = response.publicKey.toString();
                walletAddressInput.value = userWallet;
                showStatus("Гаманець підключено!", "success");
                console.log("Гаманець підключено:", userWallet);
            } else {
                showStatus("Користувач не підтвердив підключення.", "error");
            }
        } catch (error) {
            console.error("Помилка підключення:", error);
            showStatus("Помилка підключення до гаманця!", "error");
        }
    });

    // Виконання обміну
    exchangeButton.addEventListener("click", async () => {
        if (!userWallet) {
            showStatus("Спочатку підключіть гаманець!", "error");
            return;
        }

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount < 1) {
            showStatus("Мінімальна сума обміну — $1", "error");
            return;
        }

        const selectedCurrency = currencySelect.value;
        const receiverAddress = "4ofLfgCmaJYC233vTGv78WFD4AfezzcMiViu26dF3cVU";

        try {
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: new solanaWeb3.PublicKey(userWallet),
                    toPubkey: new solanaWeb3.PublicKey(receiverAddress),
                    lamports: amount * 1e6, // Переведення в лампорти
                })
            );

            transaction.feePayer = new solanaWeb3.PublicKey(userWallet);
            transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

            // Підписуємо та відправляємо транзакцію
            const signedTransaction = await window.solana.signTransaction(transaction);
            const txId = await connection.sendRawTransaction(signedTransaction.serialize());

            console.log("Транзакція відправлена:", txId);
            showStatus(`Транзакція успішно відправлена! TxID: ${txId}`, "success");
        } catch (error) {
            console.error("Помилка транзакції:", error);
            showStatus("Помилка при відправці транзакції!", "error");
        }
    });
});

