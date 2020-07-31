import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Dashboard: React.FC = () => {

    const history = useHistory();

    const handleReturn = useCallback(() => {
        localStorage.removeItem('@GoBarber:token');
        localStorage.removeItem('@GoBarber:user');

        history.push('/');
    }, [ history ]);

    return (
        <>
            <h1>Dashboard</h1>
            <button onClick={handleReturn}>
                <FiArrowLeft size={24}/>
            </button>
        </>    
    );
}

export default Dashboard;