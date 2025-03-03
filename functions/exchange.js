const fetch = require("node-fetch");
const web3 = require("@solana/web3.js");
require("dotenv").config();

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Метод не дозволений" };
    }

    try {
        const data = JSON.parse(event.body);

        // Отримуємо адресу гаманця відправника
        const senderAddress = data[0]?.accountData?.owner;
        const amount = parseFloat(data[0]?.accountData?.lamports) / 1e6;

        console.log("Отримано USDT/USDC:", amount, "від:", senderAddress);

        // Перевіряємо, чи надійшли кошти на наш гаманець
        if (amount >= 1) {
            const transaction = await sendTokens(senderAddress, amount);
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, transaction }),
            };
        } else {
            return { statusCode: 400, body: "Сума замала" };
        }
    } catch (error) {
        console.error("Помилка:", error);
        return { statusCode: 500, body: "Помилка сервера" };
    }
};

// Функція для відправки токенів назад користувачу
async function sendTokens(toAddress, amount) {
    const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), "confirmed");
    const wallet = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY)));
    
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new web3.PublicKey(toAddress),
            lamports: amount * 1e6,
        })
    );

    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [wallet]);
    console.log("Відправлено токени:", signature);

    return signature;
}
