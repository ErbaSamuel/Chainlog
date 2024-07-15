import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import CreateWarehouse from './CreateWarehouse';
import ManageOperations from './ManageOperations';
import AddParticipants from './AddParticipants';

const App = () => {
    const [warehouse, setWarehouse] = useState<string | null>(null);

    useEffect(() => {
        // Carica il magazzino se esiste già
        const fetchWarehouse = async () => {
            try {
                const response = await axios.get('http://localhost:3001/warehouse');
                setWarehouse(response.data.publicKey);
            } catch (error) {
                console.error('No warehouse found.');
            }
        };

        fetchWarehouse();
    }, []);

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/manage-operations">Manage Operations</Link>
                        </li>
                        <li>
                            <Link to="/add-participants">Add Participants</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<CreateWarehouse warehouse={warehouse} setWarehouse={setWarehouse} />} />
                    <Route path="/manage-operations" element={<ManageOperations warehouse={warehouse} />} />
                    <Route path="/add-participants" element={<AddParticipants warehouse={warehouse} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
