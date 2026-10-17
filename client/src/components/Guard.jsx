import { Navigate } from 'react-router-dom';
import { getAuth } from '../api.js';

const Guard = ({ role, children }) => getAuth(role) ? children : <Navigate to="/login" />;
export default Guard;
