import React from 'react';
import axios from 'axios';

const CreateWarehouse = ({ warehouse, setWarehouse }: { warehouse: string | null, setWarehouse: (pk: string) => void }) => {
    const createWarehouse = async () => {
        const response = await axios.post('http://localhost:3001/create-warehouse');
        setWarehouse(response.data.publicKey);
    };

    return (
        <div>
            <h1>Create Warehouse</h1>
            {warehouse ? (
                <p>Warehouse already exists: {warehouse}</p>
            ) : (
                <button onClick={createWarehouse}>Create Warehouse</button>
            )}
        </div>
    );
};

export default CreateWarehouse;
