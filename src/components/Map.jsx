import React from 'react';

const Map = () => (
    <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Find Us</h3>
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086058299999!2d144.9631579153167!3d-37.81627977975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzIyLjYiUyAxNDTCsDU3JzQ3LjQiRQ!5e0!3m2!1sen!2sus!4v1621234567890"
            style={{
                width: '100%',
                height: '150px',
                border: 0,
                borderRadius: '5px',
            }}
            allowFullScreen=""
            loading="lazy"
            title="German Tuition Location"
        ></iframe>
    </div>
);

export default Map;