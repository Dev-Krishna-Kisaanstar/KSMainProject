import React, { useState } from 'react';

const services = [
    {
        service1: 'Order Place',
        service2: 'Order Placed',
        service3: '',
    },
    {
        service1: 'Agronomy Call',
        service2: 'Agronomy Related Query',
        service3: 'Want to talk with senior agronomist',
    },
    {
        service1: 'Inquiry Call',
        service2: 'Product Inquiry Call',
        service3: 'Company related info shared',
    },
    {
        service1: 'Order Related Inquiry',
        service2: 'Order tracking related call',
        service3: 'Order related complaint',
    },
    {
        service1: 'Profile Verification',
        service2: 'Profile Created',
        service3: 'Farmer B related inquiry',
    },
    {
        service1: 'Random Call',
        service2: '',
        service3: '',
    },
];

function AdvisorMemberTagging() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedServices, setSelectedServices] = useState({
        service1: '',
        service2: '',
        service3: '',
    });

    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        setSelectedServices((prev) => ({ ...prev, [name]: value }));
    };

    const handleBeforeUnload = (e) => {
        // Prevent default behavior
        e.preventDefault(); 
        e.returnValue = ''; // Older browsers may require this to show a confirmation dialog
        setShowDropdown(true);
        return true; // Show confirmation dialog
    };

    // Add the event listener when the component mounts
    React.useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <div>
            <h1>Advisor Member Tagging</h1>
            {showDropdown && (
                <div className="dropdown-overflow">
                    <h2>Select Services</h2>
                    <label>
                        Service 1:
                        <select name="service1" value={selectedServices.service1} onChange={handleDropdownChange}>
                            <option value="">Select...</option>
                            {services.map((service, index) => (
                                <option key={index} value={service.service1}>
                                    {service.service1}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Service 2:
                        <select name="service2" value={selectedServices.service2} onChange={handleDropdownChange}>
                            <option value="">Select...</option>
                            {services.map((service, index) => (
                                <option key={index} value={service.service2}>
                                    {service.service2}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Service 3:
                        <select name="service3" value={selectedServices.service3} onChange={handleDropdownChange}>
                            <option value="">Select...</option>
                            {services.map((service, index) => (
                                <option key={index} value={service.service3}>
                                    {service.service3}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button onClick={() => setShowDropdown(false)}>Confirm</button>
                </div>
            )}
        </div>
    );
}

export default AdvisorMemberTagging;