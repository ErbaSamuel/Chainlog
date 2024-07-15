import React, { useState } from 'react';
import axios from 'axios';

const ManageOperations = ({ warehouse }: { warehouse: string | null }) => {
    const [amount, setAmount] = useState<number>(0);
    const [participant, setParticipant] = useState<string>('');

    const deposit = async () => {
        if (!warehouse) return;
        await axios.post('http://localhost:3001/deposit', {
            warehousePublicKey: warehouse,
            participantPublicKey: participant,
            amount,
        });
    };

    const withdraw = async () => {
        if (!warehouse) return;
        await axios.post('http://localhost:3001/withdraw', {
            warehousePublicKey: warehouse,
            participantPublicKey: participant,
            amount,
        });
    };

    return (
        <div>
            <h1>Manage Operations</h1>
            {warehouse ? (
                <>
                    <input
                        type="text"
                        placeholder="Participant PublicKey"
                        value={participant}
                        onChange={(e) => setParticipant(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <button onClick={deposit}>Deposit</button>
                    <button onClick={withdraw}>Withdraw</button>
                </>
            ) : (
                <p>Please create a warehouse first.</p>
            )}
        </div>
    );
};

export default ManageOperations;
