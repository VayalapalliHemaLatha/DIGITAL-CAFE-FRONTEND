import React, { useEffect, useState, useCallback } from 'react';
import { getUsers } from './api';

const UserList = ({ isLoggedIn }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        if (!isLoggedIn) {
            setError('Please log in to view users.');
            setUsers([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired or invalid. Please log in again.');
                setUsers([]);
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to load users.');
            }
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <>
            {error && (
                <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <span>{error}</span>
                </div>
            )}
            {loading && (
                <p className="text-muted text-center py-3">
                    <i className="fas fa-spinner fa-spin me-2"></i> Loading...
                </p>
            )}

            <div className="table-responsive">
                <table className="table table-restoran table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone ?? '—'}</td>
                                    <td>{user.address ?? '—'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-4">
                                    {loading ? '...' : 'No users found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-4">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={fetchUsers}
                    disabled={loading || !isLoggedIn}
                >
                    <i className="fas fa-sync-alt me-2"></i> Refresh
                </button>
            </div>
        </>
    );
};

export default UserList;
