import React, { useState } from "react";

const images = [
    "https://via.placeholder.com/600x300?text=Slide+1",
    "https://via.placeholder.com/600x300?text=Slide+2",
    "https://via.placeholder.com/600x300?text=Slide+3",
];

const Slider = () => {
    const [current, setCurrent] = useState(0);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div style={{ position: "relative", width: "600px", margin: "auto" }}>
            <img
                src={images[current]}
                alt={`Slide ${current + 1}`}
                style={{ width: "100%", borderRadius: "8px" }}
            />
            <button
                onClick={prevSlide}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                    background: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    padding: "8px",
                    cursor: "pointer",
                }}
            >
                &#8592;
            </button>
            <button
                onClick={nextSlide}
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    background: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    padding: "8px",
                    cursor: "pointer",
                }}
            >
                &#8594;
            </button>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        style={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            margin: "0 4px",
                            borderRadius: "50%",
                            background: idx === current ? "#333" : "#ccc",
                            cursor: "pointer",
                        }}
                        onClick={() => setCurrent(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;