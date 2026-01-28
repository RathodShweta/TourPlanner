import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Destinations = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [seasonFilter, setSeasonFilter] = useState("All");
    const [budgetFilter, setBudgetFilter] = useState("All");

    const destinations = [
        {
            name: "Goa",
            state: "Goa",
            season: "Winter",
            budgetType: "Medium",
            bestTime: "Oct – Mar",
            rating: 4.6,
            price: "₹18,000",
            desc: "Famous for beaches, nightlife and water sports.",
            images: [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
            ],
            famousPlaces: ["Baga Beach", "Calangute"],
            food: ["Seafood", "Fish Curry"],
            hotels: ["Taj Resort", "Novotel"],
            transport: ["Flight", "Train"]
        },

        {
            name: "Manali",
            state: "Himachal Pradesh",
            season: "Summer",
            budgetType: "Low",
            bestTime: "Mar – Jun",
            rating: 4.5,
            price: "₹15,000",
            desc: "Hill station famous for snow and adventure sports.",
            images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"],
            famousPlaces: ["Solang Valley", "Rohtang Pass"],
            food: ["Siddu", "Thukpa"],
            hotels: ["Snow Valley"],
            transport: ["Bus", "Cab"]
        },

        {
            name: "Shimla",
            state: "Himachal Pradesh",
            season: "Summer",
            budgetType: "Low",
            bestTime: "Mar – Jun",
            rating: 4.4,
            price: "₹12,000",
            desc: "Colonial hill station with scenic beauty.",
            images: ["https://images.unsplash.com/photo-1597079910443-60c43fc4f729?w=800"],
            famousPlaces: ["Mall Road", "Jakhu Temple"],
            food: ["Chana Madra"],
            hotels: ["Hotel Willow Banks"],
            transport: ["Bus", "Train"]
        },

        {
            name: "Darjeeling",
            state: "West Bengal",
            season: "Summer",
            budgetType: "Medium",
            bestTime: "Apr – Jun",
            rating: 4.5,
            price: "₹14,500",
            desc: "Tea gardens and Himalayan views.",
            images: ["https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800"],
            famousPlaces: ["Tiger Hill", "Tea Gardens"],
            food: ["Momos", "Thukpa"],
            hotels: ["Mayfair Hotel"],
            transport: ["Train", "Cab"]
        },

        {
            name: "Andaman",
            state: "Andaman & Nicobar",
            season: "Winter",
            budgetType: "High",
            bestTime: "Nov – Apr",
            rating: 4.7,
            price: "₹35,000",
            desc: "Crystal clear beaches and islands.",
            images: ["https://images.unsplash.com/photo-1589909202802-8f4abbce7482?w=800"],
            famousPlaces: ["Havelock Island"],
            food: ["Seafood"],
            hotels: ["Sea Shell Resort"],
            transport: ["Flight"]
        },

        {
            name: "Udaipur",
            state: "Rajasthan",
            season: "Winter",
            budgetType: "Medium",
            bestTime: "Oct – Mar",
            rating: 4.4,
            price: "₹26,000",
            desc: "City of lakes and palaces.",
            images: ["https://images.unsplash.com/photo-1590424744295-ff08f431668b?w=800"],
            famousPlaces: ["City Palace", "Lake Pichola"],
            food: ["Dal Baati"],
            hotels: ["Taj Lake Palace"],
            transport: ["Train", "Bus"]
        },

        {
            name: "Jaipur",
            state: "Rajasthan",
            season: "Winter",
            budgetType: "Low",
            bestTime: "Oct – Mar",
            rating: 4.3,
            price: "₹10,000",
            desc: "Pink city with forts and palaces.",
            images: ["https://images.unsplash.com/photo-1548013146-72479768bbaa?w=800"],
            famousPlaces: ["Amber Fort", "Hawa Mahal"],
            food: ["Ghewar"],
            hotels: ["ITC Rajputana"],
            transport: ["Train", "Bus"]
        },

        {
            name: "Varanasi",
            state: "Uttar Pradesh",
            season: "Winter",
            budgetType: "Low",
            bestTime: "Oct – Feb",
            rating: 4.2,
            price: "₹9,500",
            desc: "Spiritual capital of India.",
            images: ["https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800"],
            famousPlaces: ["Ganga Ghat", "Kashi Vishwanath"],
            food: ["Kachori Sabzi"],
            hotels: ["BrijRama Palace"],
            transport: ["Train", "Bus"]
        },

        {
            name: "Golden Temple",
            state: "Punjab",
            season: "Winter",
            budgetType: "Low",
            bestTime: "Oct – Mar",
            rating: 4.8,
            price: "₹7,000",
            desc: "Sacred Sikh shrine.",
            images: ["https://images.unsplash.com/photo-1588096344356-9b7660f78553?w=800"],
            famousPlaces: ["Harmandir Sahib"],
            food: ["Langar"],
            hotels: ["Saragarhi Sarai"],
            transport: ["Train"]
        },

        {
            name: "Taj Mahal",
            state: "Uttar Pradesh",
            season: "Winter",
            budgetType: "Low",
            bestTime: "Oct – Mar",
            rating: 4.9,
            price: "₹5,000",
            desc: "One of the seven wonders of the world.",
            images: ["https://images.unsplash.com/photo-1564507592333-c60657451dd7?w=800"],
            famousPlaces: ["Agra Fort"],
            food: ["Petha"],
            hotels: ["ITC Mughal"],
            transport: ["Train"]
        },

        {
            name: "Hampi",
            state: "Karnataka",
            season: "Winter",
            budgetType: "Medium",
            bestTime: "Oct – Feb",
            rating: 4.6,
            price: "₹11,000",
            desc: "Ancient ruins and temples.",
            images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800"],
            famousPlaces: ["Virupaksha Temple"],
            food: ["South Indian Meals"],
            hotels: ["Heritage Resort"],
            transport: ["Bus"]
        },

        {
            name: "Jim Corbett",
            state: "Uttarakhand",
            season: "Winter",
            budgetType: "High",
            bestTime: "Nov – Feb",
            rating: 4.5,
            price: "₹19,000",
            desc: "Wildlife safari and jungle stay.",
            images: ["https://images.unsplash.com/photo-1581852017103-68accd35243e?w=800"],
            famousPlaces: ["National Park"],
            food: ["Local Cuisine"],
            hotels: ["Forest Resort"],
            transport: ["Train", "Cab"]
        },

        {
            name: "Alleppey",
            state: "Kerala",
            season: "Monsoon",
            budgetType: "Medium",
            bestTime: "Jun – Sep",
            rating: 4.4,
            price: "₹21,000",
            desc: "Backwaters and houseboats.",
            images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"],
            famousPlaces: ["Backwaters"],
            food: ["Kerala Sadya"],
            hotels: ["Houseboat"],
            transport: ["Train"]
        },

        {
            name: "Munnar",
            state: "Kerala",
            season: "Summer",
            budgetType: "Medium",
            bestTime: "Mar – Jun",
            rating: 4.6,
            price: "₹17,000",
            desc: "Tea plantations and hills.",
            images: ["https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800"],
            famousPlaces: ["Tea Gardens"],
            food: ["Appam"],
            hotels: ["Tea County"],
            transport: ["Bus"]
        },

        {
            name: "Leh Ladakh",
            state: "Ladakh",
            season: "Summer",
            budgetType: "High",
            bestTime: "Jun – Sep",
            rating: 4.8,
            price: "₹40,000",
            desc: "Adventure & Himalayan desert.",
            images: ["https://images.unsplash.com/photo-1605649486053-24c97a707e7b?w=800"],
            famousPlaces: ["Pangong Lake"],
            food: ["Thukpa"],
            hotels: ["Camp Stay"],
            transport: ["Flight"]
        },

        {
            name: "Rishikesh",
            state: "Uttarakhand",
            season: "Winter",
            budgetType: "Low",
            bestTime: "Oct – Mar",
            rating: 4.5,
            price: "₹8,000",
            desc: "Yoga and river rafting.",
            images: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800"],
            famousPlaces: ["Lakshman Jhula"],
            food: ["Satvik Food"],
            hotels: ["Ashram Stay"],
            transport: ["Train"]
        },

        {
            name: "Ooty",
            state: "Tamil Nadu",
            season: "Summer",
            budgetType: "Low",
            bestTime: "Apr – Jun",
            rating: 4.3,
            price: "₹13,000",
            desc: "Queen of hill stations.",
            images: ["https://images.unsplash.com/photo-1585999328026-6f8a1c0a7b8d?w=800"],
            famousPlaces: ["Botanical Garden"],
            food: ["South Indian"],
            hotels: ["Lake View Hotel"],
            transport: ["Train"]
        }
    ];


    // FILTER LOGIC
    const filteredDestinations = destinations.filter((d) => {
        const seasonMatch = seasonFilter === "All" || d.season === seasonFilter;
        const budgetMatch = budgetFilter === "All" || d.budgetType === budgetFilter;
        return seasonMatch && budgetMatch;
    });

    // BOOK NOW
    const handleBookNow = () => {
        if (!selectedPlace) {
            alert("Select destination first");
            return;
        }

        if (!user) {
            alert("Login first");
            navigate("/login");
        } else {
            navigate("/paymntdetaildesti", {
                state: { place: selectedPlace }
            });
        }
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">🌍 Explore Destinations</h2>

            {/* FILTERS */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <select className="form-select" value={seasonFilter}
                        onChange={(e) => setSeasonFilter(e.target.value)}>
                        <option value="All">🌦️ All Seasons</option>
                        <option value="Summer">Summer</option>
                        <option value="Winter">Winter</option>
                        <option value="Monsoon">Monsoon</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <select className="form-select" value={budgetFilter}
                        onChange={(e) => setBudgetFilter(e.target.value)}>
                        <option value="All">💸 All Budgets</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            <div className="row">
                {/* LIST */}
                <div className="col-md-6">
                    {filteredDestinations.map((place, i) => (
                        <div key={i}
                            className="card mb-3 shadow-sm"
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedPlace(place)}>
                            <div className="card-body">
                                <h5>{place.name}</h5>
                                <p className="text-muted mb-1">{place.state}</p>
                                <small>🌦️ {place.season} | 💸 {place.budgetType}</small><br />
                                <span className="badge bg-warning text-dark mt-2">{place.price}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PREVIEW */}
                <div className="col-md-6">
                    {selectedPlace ? (
                        <div className="card shadow-lg">
                            <img src={selectedPlace.images[0]}
                                className="card-img-top"
                                style={{ height: "260px", objectFit: "cover" }} />

                            <div className="card-body">
                                <h4>{selectedPlace.name}</h4>
                                <p>{selectedPlace.desc}</p>
                                <p>⭐ {selectedPlace.rating} | 💰 {selectedPlace.price}</p>
                                <button className="btn btn-warning w-100"
                                    onClick={handleBookNow}>
                                    Visit Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border p-5 text-center text-muted">
                            Select a destination to preview
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Destinations;