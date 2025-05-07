import React, { useState, useEffect } from 'react';
import { Spin, Typography, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, HomeOutlined, LockOutlined } from '@ant-design/icons';
import userService from '../../api/userService';
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo.jsx";
import RecipientInfo from "../../components/RecipientInfo/RecipientInfo.jsx";
import ChangePassword from "../../components/ChangePassword/ChangePassword.jsx";

const { Title } = Typography;

const UserProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    // Fetch current user profile
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await userService.getCurrentUserProfile();
                if (response.code === '200') {
                    setProfile(response.data);
                } else {
                    throw new Error('Failed to fetch profile');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch profile');
                message.error(err.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const tabs = [
        { key: 'profile', label: 'Profile Information', icon: <UserOutlined /> },
        { key: 'address', label: 'Address & Recipients', icon: <HomeOutlined /> },
        { key: 'password', label: 'Change Password', icon: <LockOutlined /> }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileInfo profile={profile} />;
            case 'address':
                return <RecipientInfo profile={profile} />;
            case 'password':
                return <ChangePassword />;
            default:
                return <ProfileInfo profile={profile} />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <Title level={2} className="text-white mb-0">My Profile</Title>
                    <p className="text-black-100 mt-2">Manage your account information and preferences</p>
                </div>

                {loading && !profile ? (
                    <div className="flex justify-center items-center p-12">
                        <Spin size="large" />
                    </div>
                ) : error && !profile ? (
                    <div className="bg-red-50 text-red-700 p-6 text-center">
                        <p className="font-medium">{error}</p>
                        <Button
                            type="primary"
                            danger
                            className="mt-4"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </div>
                ) : profile ? (
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar Navigation */}
                        <div className="md:w-1/4 bg-gray-50 p-0">
                            <nav className="sticky top-0">
                                <ul className="divide-y divide-gray-200">
                                    {tabs.map(tab => (
                                        <li key={tab.key}>
                                            <button
                                                className={`w-full flex items-center px-6 py-4 hover:bg-gray-100 transition-colors ${
                                                    activeTab === tab.key
                                                        ? 'border-l-4 border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                                        : 'text-gray-600'
                                                }`}
                                                onClick={() => setActiveTab(tab.key)}
                                            >
                                                <span className="mr-3">{tab.icon}</span>
                                                {tab.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="md:w-3/4 p-6">
                            <div className="bg-white rounded-lg">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                ) : null}

            </div>
        </div>
    );
};

export default UserProfile;