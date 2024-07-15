import React from 'react';
import axios from 'axios';

const AddParticipants = ({ warehouse }: { warehouse: string | null }) => {
    const addParticipant = async (participantType: string) => {
        if (!warehouse) return;
        const response = await axios.post('http://localhost:3001/add-participant', {
            participantType,
        });
        alert(`Added ${participantType}: ${response.data.publicKey}`);
    };

    return (
        <div>
            <h1>Add Participants</h1>
            {warehouse ? (
                <>
                    <button onClick={() => addParticipant('supplier')}>Add Supplier</button>
                    <button onClick={() => addParticipant('customer')}>Add Customer</button>
                </>
            ) : (
                <p>Please create a warehouse first.</p>
            )}
        </div>
    );
};

export default AddParticipants;
