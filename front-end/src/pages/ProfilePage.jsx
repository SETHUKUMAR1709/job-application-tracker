import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MessageDisplay from '../components/MessageDisplay';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [birthday, setBirthday] = useState('');
    const [hometown, setHometown] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [twitter, setTwitter] = useState('');
    const [website, setWebsite] = useState('');

    const API_BASE_URL = 'http://localhost:5000/api';

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const getInitial = (username) => {
        return username ? username.charAt(0).toUpperCase() : '?';
    };

    const fetchProfile = async () => {
        if (!user || !user.id || !token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/profile/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            const data = await response.json();
            setProfile(data);
            setBio(data.bio || '');
            setSkills(data.skills ? data.skills.join(', ') : '');
            setExperience(data.experience ? data.experience.join('\n') : ''); // Use newline for textarea
            setEducation(data.education ? data.education.join('\n') : ''); // Use newline for textarea
            setBirthday(data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '');
            setHometown(data.hometown || '');
            setLinkedin(data.socialMedia?.linkedin || '');
            setGithub(data.socialMedia?.github || '');
            setTwitter(data.socialMedia?.twitter || '');
            setWebsite(data.socialMedia?.website || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
            showMessage(error.message || 'Error fetching profile.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user, token]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!user || !user.id || !token) {
            showMessage("Not authenticated.", "error");
            return;
        }

        setLoading(true);
        try {
            const updatedData = {
                bio,
                skills: skills.split(',').map(s => s.trim()).filter(s => s),
                experience: experience.split('\n').map(s => s.trim()).filter(s => s), // Split by newline
                education: education.split('\n').map(s => s.trim()).filter(s => s), // Split by newline
                birthday,
                hometown,
                socialMedia: { linkedin, github, twitter, website }
            };

            const response = await fetch(`${API_BASE_URL}/profile/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const result = await response.json();
            setProfile(result.user);
            showMessage('Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage(error.message || 'Error updating profile.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="profile-loading">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="profile-error">Profile not found or access denied.</div>;
    }

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <MessageDisplay message={message} type={messageType} />

                {!isEditing ? (
                    <div className="profile-details-view">
                        <div className="profile-header-section">
                            <div className="profile-avatar">
                                {getInitial(profile.username)}
                            </div>
                            <h2 className="profile-username">{profile.username}</h2>
                        </div>

                        <div className="profile-info-section">
                            <div className="info-group">
                                <strong>Bio:</strong>
                                <p>{profile.bio || 'N/A'}</p>
                            </div>
                            <div className="info-group">
                                <strong>Skills:</strong>
                                <p>{profile.skills?.length > 0 ? profile.skills.join(', ') : 'N/A'}</p>
                            </div>
                            <div className="info-group">
                                <strong>Experience:</strong>
                                <ul className="list-unstyled">
                                    {profile.experience?.length > 0 ? profile.experience.map((exp, i) => <li key={i}>{exp}</li>) : <li>N/A</li>}
                                </ul>
                            </div>
                            <div className="info-group">
                                <strong>Education:</strong>
                                <ul className="list-unstyled">
                                    {profile.education?.length > 0 ? profile.education.map((edu, i) => <li key={i}>{edu}</li>) : <li>N/A</li>}
                                </ul>
                            </div>
                            <div className="info-group">
                                <strong>Birthday:</strong>
                                <p>{profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="info-group">
                                <strong>Hometown:</strong>
                                <p>{profile.hometown || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="profile-social-media">
                            <h3>Social Media</h3>
                            <ul className="list-unstyled">
                                <li><strong>LinkedIn:</strong> {profile.socialMedia?.linkedin ? <a href={profile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">{profile.socialMedia.linkedin}</a> : 'N/A'}</li>
                                <li><strong>GitHub:</strong> {profile.socialMedia?.github ? <a href={profile.socialMedia.github} target="_blank" rel="noopener noreferrer">{profile.socialMedia.github}</a> : 'N/A'}</li>
                                <li><strong>Twitter:</strong> {profile.socialMedia?.twitter ? <a href={profile.socialMedia.twitter} target="_blank" rel="noopener noreferrer">{profile.socialMedia.twitter}</a> : 'N/A'}</li>
                                <li><strong>Website:</strong> {profile.socialMedia?.website ? <a href={profile.socialMedia.website} target="_blank" rel="noopener noreferrer">{profile.socialMedia.website}</a> : 'N/A'}</li>
                            </ul>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="edit-profile-button">Edit Profile</button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                        <h2 className="profile-title">Edit Profile</h2>
                        <div className="form-group">
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows="3"></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="skills">Skills (comma-separated)</label>
                            <input type="text" id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="experience">Experience (one per line)</label>
                            <textarea id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} rows="4"></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="education">Education (one per line)</label>
                            <textarea id="education" value={education} onChange={(e) => setEducation(e.target.value)} rows="4"></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthday">Birthday</label>
                            <input type="date" id="birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hometown">Hometown</label>
                            <input type="text" id="hometown" value={hometown} onChange={(e) => setHometown(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="linkedin">LinkedIn URL</label>
                            <input type="url" id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="github">GitHub URL</label>
                            <input type="url" id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/yourprofile" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="twitter">Twitter URL</label>
                            <input type="url" id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/yourprofile" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="website">Personal Website URL</label>
                            <input type="url" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-profile-button">Save Profile</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-edit-button">Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
