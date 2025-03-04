const fetch = require("node-fetch");
const connection = new web3.Connection("https://mainnet.helius-rpc.com/?api-key=62d6c036-5371-452d-b852-3d6f6823e08f","confirmed");
const web3 = require("@solana/web3.js");
require("dotenv").config();

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Метод не дозволений" };
    }

    try {
        const { wallet, amount, currency } = JSON.parse(event.body);
        if (!wallet || !amount || amount < 1) {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: "Невірні дані" }) };
        }

        console.log(`Отримано ${amount} ${currency} від ${wallet}`);

        // Відправка SPL-токенів
        const txSignature = await sendTokens(wallet, amount);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, transaction: txSignature })
        };
    } catch (error) {
        console.error("Помилка сервера:", error);
        return { statusCode: 500, body: JSON.stringify({ success: false, message: "Помилка сервера" }) };
    }
};

// Функція для відправки SPL-токенів користувачеві
async function sendTokens(toAddress, amount) {
    const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), "confirmed");
    const wallet = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY)));

    // Тут треба реалізувати відправку SPL-токенів замість SOL
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new web3.PublicKey(toAddress),
            lamports: amount * 1e6, // Переводимо в лампорти
        })
    );

    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [wallet]);
    console.log("Відправлено токени:", signature);

    return signature;
}
