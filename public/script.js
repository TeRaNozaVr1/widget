document.getElementById("exchange").addEventListener("click", async () => {
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
        // Підключення гаманця
        const response = await phantom.connect({ onlyIfTrusted: false });
        const userWallet = response.publicKey.toString();
        console.log("Гаманець підключено:", userWallet);

        const amount = parseFloat(document.getElementById("amount").value); // Введена сума
        if (isNaN(amount) || amount < 1) {
            alert("Мінімальна сума обміну — $1");
            return;
        }

        // Формуємо транзакцію на відправку USDT/USDC
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: new web3.PublicKey(userWallet),
                toPubkey: new web3.PublicKey("4ofLfgCmaJYC233vTGv78WFD4AfezzcMiViu26dF3cVU"),
                lamports: amount * 1e6, // Переведення в лампорти
            })
        );

        transaction.feePayer = new web3.PublicKey(userWallet);
        transaction.recentBlockhash = (await new web3.Connection(web3.clusterApiUrl("mainnet-beta"))
            .getRecentBlockhash()).blockhash;

        // Підписуємо та відправляємо транзакцію
        const signedTransaction = await phantom.signTransaction(transaction);
        const txId = await new web3.Connection(web3.clusterApiUrl("mainnet-beta"))
            .sendRawTransaction(signedTransaction.serialize());

        console.log("Транзакція відправлена:", txId);
        alert(`Транзакція успішно відправлена! TxID: ${txId}`);
    } catch (error) {
        console.error("Помилка транзакції:", error);
        alert("Помилка при відправці транзакції!");
    }
});
