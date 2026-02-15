import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api';
import { authApi } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';
const emptyAcademic = () => ({ degree: '', institution: '', completionYear: '' });
const emptyWork = () => ({ company: '', role: '', duration: '', description: '' });

function ProfilePage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isCustomer = roleType === 'customer';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    street: '',
    plotNo: '',
    city: '',
    pincode: '',
    academicInformation: [emptyAcademic()],
    workExperience: [emptyWork()],
  });

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  useEffect(() => {
    let cancelled = false;
    setError('');
    setLoading(true);
    getProfile()
      .then((data) => {
        if (cancelled) return;
        const base = {
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          dob: data.dob ?? '',
          gender: data.gender ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          street: data.street ?? '',
          plotNo: data.plotNo ?? '',
          city: data.city ?? '',
          pincode: data.pincode ?? '',
        };
        if (Array.isArray(data.academicInformation) && data.academicInformation.length > 0) {
          base.academicInformation = data.academicInformation.map((a) => ({
            degree: a.degree ?? '',
            institution: a.institution ?? '',
            completionYear: a.completionYear ?? '',
          }));
        } else {
          base.academicInformation = [emptyAcademic()];
        }
        if (Array.isArray(data.workExperience) && data.workExperience.length > 0) {
          base.workExperience = data.workExperience.map((w) => ({
            company: w.company ?? '',
            role: w.role ?? '',
            duration: w.duration ?? '',
            description: w.description ?? '',
          }));
        } else {
          base.workExperience = [emptyWork()];
        }
        setForm(base);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [handleAuthFailure]);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const updateAcademic = (index, field, value) => {
    setForm((prev) => {
      const arr = [...(prev.academicInformation || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, academicInformation: arr };
    });
    setError('');
    setSuccess('');
  };
  const addAcademic = () => {
    setForm((prev) => ({
      ...prev,
      academicInformation: [...(prev.academicInformation || []), emptyAcademic()],
    }));
  };
  const removeAcademic = (index) => {
    setForm((prev) => {
      const arr = (prev.academicInformation || []).filter((_, i) => i !== index);
      return { ...prev, academicInformation: arr.length ? arr : [emptyAcademic()] };
    });
  };
  const updateWork = (index, field, value) => {
    setForm((prev) => {
      const arr = [...(prev.workExperience || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, workExperience: arr };
    });
    setError('');
    setSuccess('');
  };
  const addWork = () => {
    setForm((prev) => ({
      ...prev,
      workExperience: [...(prev.workExperience || []), emptyWork()],
    }));
  };
  const removeWork = (index) => {
    setForm((prev) => {
      const arr = (prev.workExperience || []).filter((_, i) => i !== index);
      return { ...prev, workExperience: arr.length ? arr : [emptyWork()] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        dob: form.dob || undefined,
        gender: form.gender || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        street: form.street || undefined,
        plotNo: form.plotNo || undefined,
        city: form.city || undefined,
        pincode: form.pincode || undefined,
      };
      if (isCustomer) {
        payload.academicInformation = (form.academicInformation || [])
          .filter((a) => a.degree || a.institution || a.completionYear)
          .map((a) => ({ degree: a.degree, institution: a.institution, completionYear: a.completionYear }));
        payload.workExperience = (form.workExperience || [])
          .filter((w) => w.company || w.role || w.duration || w.description)
          .map((w) => ({ company: w.company, role: w.role, duration: w.duration, description: w.description }));
      }
      const data = await updateProfile(payload);
      if (data && (data.name != null || data.email != null)) {
        authApi.setUser({
          ...authApi.getUser(),
          id: data.id,
          name: data.name,
          email: data.email,
          roleType: data.roleType,
        });
      }
      setSuccess('Profile updated successfully.');
      onAuthChange?.();
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
          <div className="container py-4">
            <nav className="mb-2">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
                <li className="breadcrumb-item text-white">Pages</li>
                <li className="breadcrumb-item text-white active" aria-current="page">Update Profile</li>
              </ol>
            </nav>
            <h1 className="display-6 text-white fw-bold mb-0">Update Profile</h1>
          </div>
        </div>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white">Pages</li>
              <li className="breadcrumb-item text-white active" aria-current="page">Update Profile</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Update Profile</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="auth-card p-4 p-lg-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First name <span className="text-muted small">(optional)</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last name <span className="text-muted small">(optional)</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of birth <span className="text-muted small">(optional)</span></label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.dob}
                      onChange={(e) => updateField('dob', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender <span className="text-muted small">(optional)</span></label>
                    <select
                      className="form-select"
                      value={form.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone <span className="text-muted small">(optional)</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+91-9876543210"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address <span className="text-muted small">(optional)</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="456 New Address St"
                    />
                  </div>
                </div>

                <hr className="my-4" />
                <h6 className="mb-3">Address details <span className="text-muted small">(optional)</span></h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.street}
                      onChange={(e) => updateField('street', e.target.value)}
                      placeholder="Main Road"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Plot no</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.plotNo}
                      onChange={(e) => updateField('plotNo', e.target.value)}
                      placeholder="12"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.pincode}
                      onChange={(e) => updateField('pincode', e.target.value)}
                      placeholder="400001"
                    />
                  </div>
                </div>

                {isCustomer && (
                  <>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Academic information <span className="text-muted small">(optional)</span></h6>
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={addAcademic}>Add</button>
                    </div>
                    {(form.academicInformation || []).map((a, i) => (
                      <div key={i} className="card mb-2">
                        <div className="card-body py-2">
                          <div className="row g-2">
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Degree"
                                value={a.degree}
                                onChange={(e) => updateAcademic(i, 'degree', e.target.value)}
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Institution"
                                value={a.institution}
                                onChange={(e) => updateAcademic(i, 'institution', e.target.value)}
                              />
                            </div>
                            <div className="col-md-3">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Year"
                                value={a.completionYear}
                                onChange={(e) => updateAcademic(i, 'completionYear', e.target.value)}
                              />
                            </div>
                            <div className="col-md-1">
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeAcademic(i)} title="Remove">×</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <hr className="my-4" />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Work experience <span className="text-muted small">(optional)</span></h6>
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={addWork}>Add</button>
                    </div>
                    {(form.workExperience || []).map((w, i) => (
                      <div key={i} className="card mb-2">
                        <div className="card-body py-2">
                          <div className="row g-2 mb-2">
                            <div className="col-md-3">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Company"
                                value={w.company}
                                onChange={(e) => updateWork(i, 'company', e.target.value)}
                              />
                            </div>
                            <div className="col-md-3">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Role"
                                value={w.role}
                                onChange={(e) => updateWork(i, 'role', e.target.value)}
                              />
                            </div>
                            <div className="col-md-3">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Duration"
                                value={w.duration}
                                onChange={(e) => updateWork(i, 'duration', e.target.value)}
                              />
                            </div>
                            <div className="col-md-2">
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeWork(i)} title="Remove">×</button>
                            </div>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Description"
                            value={w.description}
                            onChange={(e) => updateWork(i, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {error && <div className="alert alert-danger py-2 small mt-3">{error}</div>}
                {success && <div className="alert alert-success py-2 small mt-3">{success}</div>}

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Update profile'
                    )}
                  </button>
                  <Link to="/account" className="btn btn-outline-secondary ms-2">Cancel</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
