import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-2">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <p className="m-0">&copy; {new Date().getFullYear()} ChatApp. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;