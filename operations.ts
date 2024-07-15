import { Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Deposita un oggetto nel magazzino
export const depositItem = async (warehouse: Keypair, supplier: Keypair, amount: number) => {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: supplier.publicKey,
            toPubkey: warehouse.publicKey,
            lamports: amount,
        })
    );

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [supplier]
    );

    console.log(`Deposited ${amount / LAMPORTS_PER_SOL} SOL to warehouse:`, warehouse.publicKey.toBase58());
};

// Ritira un oggetto dal magazzino
export const withdrawItem = async (warehouse: Keypair, customer: Keypair, amount: number) => {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: warehouse.publicKey,
            toPubkey: customer.publicKey,
            lamports: amount,
        })
    );

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [warehouse]
    );

    console.log(`Withdrew ${amount / LAMPORTS_PER_SOL} SOL from warehouse:`, warehouse.publicKey.toBase58());
};
