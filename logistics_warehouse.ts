import {
    Connection,
    Keypair,
    clusterApiUrl,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import { depositItem, withdrawItem } from './operations';

// Inizializza connessione alla Devnet
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Crea un nuovo account per il magazzino
const createWarehouse = async (): Promise<Keypair> => {
    const warehouse = Keypair.generate();

    // Airdrop SOL nel nuovo account per le commissioni di transazione
    const airdropSignature = await connection.requestAirdrop(
        warehouse.publicKey,
        LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);

    console.log('Warehouse created:', warehouse.publicKey.toBase58());
    return warehouse;
};

// Aggiungi fornitori e clienti
const addParticipants = async (warehouse: Keypair, participant: Keypair): Promise<Keypair> => {
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: warehouse.publicKey,
            newAccountPubkey: participant.publicKey,
            lamports: LAMPORTS_PER_SOL / 10,
            space: 0,
            programId: SystemProgram.programId,
        }),
    );

    // Firma e invia la transazione
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [warehouse, participant]
    );

    console.log('Participant added:', participant.publicKey.toBase58());
    return participant;
};

const main = async () => {
    // Crea il magazzino
    const warehouse = await createWarehouse();

    // Crea un fornitore
    const supplier = Keypair.generate();
    await addParticipants(warehouse, supplier);

    // Crea un cliente
    const customer = Keypair.generate();
    await addParticipants(warehouse, customer);

    console.log('Supplier:', supplier.publicKey.toBase58());
    console.log('Customer:', customer.publicKey.toBase58());

    // Deposita SOL nel magazzino
    await depositItem(warehouse, supplier, LAMPORTS_PER_SOL / 2);

    // Ritira SOL dal magazzino
    await withdrawItem(warehouse, customer, LAMPORTS_PER_SOL / 4);
};

main().catch((err) => {
    console.error(err);
});
