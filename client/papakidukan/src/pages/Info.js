import React from 'react';

const Info = ({user}) => (
    <div className="profile-info">
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
</div>
);

export default Info;