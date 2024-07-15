import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let warehouse: Keypair | null = null; // Variabile per mantenere il riferimento al magazzino

// API per creare un nuovo magazzino (una sola volta)
app.post('/create-warehouse', async (req, res) => {
    if (!warehouse) {
        warehouse = Keypair.generate();
        try {
            const airdropSignature = await connection.requestAirdrop(
                warehouse.publicKey,
                LAMPORTS_PER_SOL,
            );
            await connection.confirmTransaction(airdropSignature);
            res.json({ publicKey: warehouse.publicKey.toBase58() });
        } catch (error: any) { // Aggiunta di tipizzazione esplicita
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(400).json({ message: 'Warehouse already exists' });
    }
});
// API per ottenere lo stato del magazzino
app.get('/warehouse', (req, res) => {
    if (warehouse) {
        res.json({ publicKey: warehouse.publicKey.toBase58() });
    } else {
        res.status(404).json({ message: 'Warehouse not found' });
    }
});

// API per aggiungere partecipanti
app.post('/add-participant', async (req, res) => {
    const { participantType } = req.body;
    if (!warehouse) {
        return res.status(400).json({ message: 'Warehouse does not exist' });
    }
    const participant = Keypair.generate();
    try {
        await addParticipants(warehouse, participant, participantType);
        res.json({ publicKey: participant.publicKey.toBase58() });
    } catch (error: any) { // Aggiunta di tipizzazione esplicita
        res.status(500).json({ error: error.message });
    }
});

// API per depositare un item nel magazzino
app.post('/deposit', async (req, res) => {
    const { participantPublicKey, amount } = req.body;
    if (!warehouse) {
        return res.status(400).json({ message: 'Warehouse does not exist' });
    }
    const participant = Keypair.fromSecretKey(new Uint8Array(participantPublicKey));
    try {
        await depositItem(warehouse, participant, amount);
        res.json({ message: 'Item deposited successfully' });
    } catch (error: any) { // Aggiunta di tipizzazione esplicita
        res.status(500).json({ error: error.message });
    }
});

// API per ritirare un item dal magazzino
app.post('/withdraw', async (req, res) => {
    const { participantPublicKey, amount } = req.body;
    if (!warehouse) {
        return res.status(400).json({ message: 'Warehouse does not exist' });
    }
    const participant = Keypair.fromSecretKey(new Uint8Array(participantPublicKey));
    try {
        await withdrawItem(warehouse, participant, amount);
        res.json({ message: 'Item withdrawn successfully' });
    } catch (error: any) { // Aggiunta di tipizzazione esplicita
        res.status(500).json({ error: error.message });
    }
});


// Funzione per aggiungere partecipanti (fornitori, clienti)
const addParticipants = async (warehouse: Keypair, participant: Keypair, participantType: string) => {
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

    console.log(`Participant added (${participantType}):`, participant.publicKey.toBase58());
};

// Funzione per depositare un item nel magazzino
const depositItem = async (warehouse: Keypair, participant: Keypair, amount: number) => {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: participant.publicKey,
            toPubkey: warehouse.publicKey,
            lamports: amount,
        })
    );

    // Firma e invia la transazione
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [participant]
    );

    console.log(`Deposited ${amount / LAMPORTS_PER_SOL} SOL to warehouse:`, warehouse.publicKey.toBase58());
};

// Funzione per ritirare un item dal magazzino
const withdrawItem = async (warehouse: Keypair, participant: Keypair, amount: number) => {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: warehouse.publicKey,
            toPubkey: participant.publicKey,
            lamports: amount,
        })
    );

    // Firma e invia la transazione
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [warehouse]
    );

    console.log(`Withdrew ${amount / LAMPORTS_PER_SOL} SOL from warehouse:`, warehouse.publicKey.toBase58());
};

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
