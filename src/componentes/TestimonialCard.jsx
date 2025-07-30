import React from "react";

export default function TestimonialCard({ image, name, country, comment }) {
    return (
        <div className="flex flex-row items-center p-4 bg-white w-full">
            <img
                src={image}
                alt={name}
                className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div className="flex flex-col justify-center w-full">
                <h3 className="text-lg font-semibold mb-1 text-left flex items-center">
                    {name}
                    <span className="ml-2 text-sm text-gray-500 font-normal">{country}</span>
                </h3>
                <p className="text-gray-600 text-left text-sm">{comment}</p>
            </div>
        </div>
    );
}
