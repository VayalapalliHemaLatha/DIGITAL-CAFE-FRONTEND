import React, { useEffect, useState, useCallback } from 'react';
import { getUsers } from './api';
import AdminSidebar from './components/AdminSidebar';
import './styles/AdminDashboard.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        roleType: 'CUSTOMER',
        status: 'ACTIVE',
        avatar: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            roleType: 'CUSTOMER',
            status: 'ACTIVE',
            avatar: ''
        });
    };

    const handleAddUser = () => {
        resetForm();
        setShowModal(true);
        setError(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Create new user with mock data
            const newUser = {
                id: Date.now(),
                ...formData,
                avatar: formData.avatar || `https://picsum.photos/seed/user${Date.now()}/50/50.jpg`
            };

            // Simulate API call
            setTimeout(() => {
                setUsers(prev => [newUser, ...prev]);
                setShowModal(false);
                resetForm();
                setSaving(false);
            }, 1000);
        } catch (err) {
            setError('Failed to create user. Please try again.');
            setSaving(false);
        }
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Directly use mock data to avoid network errors
            const mockUsers = [
                { id: 1, name: 'John Smith', email: 'john@example.com', roleType: 'CUSTOMER', phone: '+1234567890', address: '123 Main St, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/user1/50/50.jpg' },
                { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', roleType: 'CUSTOMER', phone: '+1234567891', address: '456 Oak Ave, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/user2/50/50.jpg' },
                { id: 3, name: 'Mike Wilson', email: 'mike@example.com', roleType: 'CAFE_OWNER', phone: '+1234567892', address: '789 Pine Rd, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/user3/50/50.jpg' },
                { id: 4, name: 'Emily Davis', email: 'emily@example.com', roleType: 'CHEF', phone: '+1234567893', address: '321 Elm St, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/user4/50/50.jpg' },
                { id: 5, name: 'Robert Brown', email: 'robert@example.com', roleType: 'WAITER', phone: '+1234567894', address: '654 Maple Dr, City', status: 'INACTIVE', avatar: 'https://picsum.photos/seed/user5/50/50.jpg' },
            ];
            
            // Simulate loading delay for refresh effect
            setTimeout(() => {
                setUsers(mockUsers);
                setLoading(false);
                setError(null);
            }, 800);
            
        } catch (err) {
            console.error('Users fetch error:', err);
            setError('Failed to load users.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const getRoleBadgeColor = (role) => {
        switch(role?.toUpperCase()) {
            case 'ADMIN': return 'bg-danger';
            case 'CAFE_OWNER': return 'bg-warning';
            case 'CHEF': return 'bg-success';
            case 'WAITER': return 'bg-info';
            case 'CUSTOMER': return 'bg-primary';
            default: return 'bg-secondary';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch(status?.toUpperCase()) {
            case 'ACTIVE': return 'bg-success';
            case 'INACTIVE': return 'bg-secondary';
            case 'SUSPENDED': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button type="button" className="admin-header-icon" aria-label="Menu">
                            <i className="fas fa-bars"></i>
                        </button>
                        <h1 className="admin-header-title">User Management</h1>
                    </div>
                    <div className="admin-header-right">
                        <button type="button" className="admin-header-icon" aria-label="Notifications">
                            <i className="fas fa-bell"></i>
                        </button>
                        <button type="button" className="admin-header-icon" aria-label="Settings">
                            <i className="fas fa-cog"></i>
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleAddUser}>
                            <i className="fas fa-user-plus me-2"></i> Add User
                        </button>
                        <button type="button" className="admin-refresh-btn" onClick={fetchUsers} disabled={loading}>
                            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                            Refresh
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    <div className="admin-page-header">
                        <h2 className="admin-page-title">All Users</h2>
                        <p className="admin-page-subtitle">Manage and monitor all registered users in the system</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="admin-chart-card">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Contact Information</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img 
                                                                src={user.avatar || `https://picsum.photos/seed/user${user.id}/50/50.jpg`} 
                                                                alt={user.name}
                                                                className="rounded-circle me-3"
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                            />
                                                            <div>
                                                                <div className="fw-bold">{user.name}</div>
                                                                <div className="text-muted small">ID: #{user.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="d-flex align-items-center mb-1">
                                                                <i className="fas fa-envelope text-muted me-2 small"></i>
                                                                <span className="small">{user.email}</span>
                                                            </div>
                                                            <div className="d-flex align-items-center mb-1">
                                                                <i className="fas fa-phone text-muted me-2 small"></i>
                                                                <span className="small">{user.phone || 'Not provided'}</span>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                <i className="fas fa-map-marker-alt text-muted me-2 small"></i>
                                                                <span className="small">{user.address || 'Not provided'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getRoleBadgeColor(user.roleType)}`}>
                                                            {user.roleType?.replace('_', ' ') || 'UNKNOWN'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeColor(user.status)}`}>
                                                            {user.status || 'UNKNOWN'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button className="btn btn-sm btn-outline-primary" title="Edit">
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-warning" title="Suspend">
                                                                <i className="fas fa-pause"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger" title="Delete">
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5">
                                                    <div className="text-muted">
                                                        <i className="fas fa-users fa-3x mb-3 d-block"></i>
                                                        No users found.
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New User</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="text-center mb-4">
                                                <div className="position-relative d-inline-block">
                                                    <img 
                                                        src={formData.avatar || 'https://picsum.photos/seed/defaultuser/150/150.jpg'}
                                                        alt="User Avatar"
                                                        className="rounded-circle"
                                                        style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #6B46C1' }}
                                                    />
                                                    <label 
                                                        htmlFor="avatar-upload" 
                                                        className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2"
                                                        style={{ cursor: 'pointer', transform: 'translate(20%, 20%)' }}
                                                    >
                                                        <i className="fas fa-camera"></i>
                                                    </label>
                                                    <input
                                                        id="avatar-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="d-none"
                                                    />
                                                </div>
                                                <p className="text-muted small mt-2">Click camera icon to upload photo</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="John Smith"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email Address *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+1234567890"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Address</label>
                                                <textarea
                                                    className="form-control"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    placeholder="123 Main St, City, State"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label className="form-label">Role *</label>
                                                <select
                                                    className="form-select"
                                                    name="roleType"
                                                    value={formData.roleType}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="CUSTOMER">Customer</option>
                                                    <option value="WAITER">Waiter</option>
                                                    <option value="CHEF">Chef</option>
                                                    <option value="CAFE_OWNER">Cafe Owner</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label className="form-label">Status *</label>
                                                <select
                                                    className="form-select"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="ACTIVE">Active</option>
                                                    <option value="INACTIVE">Inactive</option>
                                                    <option value="SUSPENDED">Suspended</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger py-2">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {error}
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating User...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Create User
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
