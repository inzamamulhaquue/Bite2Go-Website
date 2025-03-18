import React from 'react';
import BackButton from '../components/backButton';

const Info = ({user}) => (
    <div className="profile-info">
         {/* <BackButton defaultPath="/profile" /> */}
    <h2>Profile Information</h2>
    {user ? (
        <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </>
    ) : (
        <p>Loading profile information...</p>
    )}
    
    <BackButton defaultPath="/profile" />
</div>
);

export default Info;