import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Destinations.css";

// Import Destination Images
import goa1 from "../assets/destinations/goa_1.jpg";
import goa2 from "../assets/destinations/goa_2.jpg";
import goa3 from "../assets/destinations/goa_3.jpg";
import manali from "../assets/destinations/manali.jpg";
import shimla from "../assets/destinations/shimla.jpg";
import darjeeling from "../assets/destinations/darjeeling.jpg";
import andaman from "../assets/destinations/andaman.jpg";
import udaipur from "../assets/destinations/udaipur.jpg";
import jaipur from "../assets/destinations/jaipur.jpg";
import varanasi from "../assets/destinations/varanasi.jpg";
import goldenTemple from "../assets/destinations/golden_temple.jpg";
import tajMahal from "../assets/destinations/taj_mahal.jpg";
import hampi from "../assets/destinations/hampi.jpg";
import jimCorbett from "../assets/destinations/jim_corbett.jpg";
import alleppey from "../assets/destinations/alleppey.jpg";
import munnar from "../assets/destinations/munnar.jpg";
import lehLadakh from "../assets/destinations/leh_ladakh.jpg";
import rishikesh from "../assets/destinations/rishikesh.jpg";
import ooty from "../assets/destinations/ooty.jpg";

const Destinations = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [seasonFilter, setSeasonFilter] = useState("All");
    const [budgetFilter, setBudgetFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const previewRef = useRef(null);

    const fallbackDestinations = [
        {
            name: t("goaTitle"), state: "Goa", season: "Winter", bestSeason: "Nov to Feb", duration: "4-5 Days", budgetType: "Medium", rating: 4.6, price: "₹18,000", category: "Beach",
            desc: t("goaDesc"), images: [goa1, goa2, goa3],
            famousPlaces: ["Baga Beach", "Old Goa", "Dudhsagar Falls"], food: ["Fish Curry", "Bebinca"],
            hotels: ["Taj Resort", "Novotel"], transport: ["Flight", "Bike"]
        },
        {
            name: t("manaliTitle"), state: "Himachal Pradesh", season: "Summer", bestSeason: "Mar to June", duration: "5-6 Days", budgetType: "Low", rating: 4.5, price: "₹15,000", category: "Adventure",
            desc: t("manaliDesc"), images: [manali],
            famousPlaces: ["Hadimba Temple", "Solang Valley"], food: ["Siddu", "Kullu Trout"],
            hotels: ["Snow Valley"], transport: ["Bus", "Cab"]
        },
        {
            name: t("shimlaTitle"), state: "Himachal Pradesh", season: "Summer", bestSeason: "Mar to June", duration: "3-4 Days", budgetType: "Low", rating: 4.4, price: "₹12,000", category: "Honeymoon",
            desc: t("shimlaDesc"), images: [shimla],
            famousPlaces: ["The Ridge", "Jakhoo Hill"], food: ["Madra", "Babru"],
            hotels: ["Hotel Willow Banks"], transport: ["Toy Train", "Bus"]
        },
        {
            name: t("darjeelingTitle"), state: "West Bengal", season: "Summer", bestSeason: "Apr to June", duration: "4-5 Days", budgetType: "Medium", rating: 4.5, price: "₹14,500", category: "Nature",
            desc: t("darjeelingDesc"), images: [darjeeling],
            famousPlaces: ["Tiger Hill", "Batasia Loop"], food: ["Momos", "Momos"],
            hotels: ["Mayfair Hotel"], transport: ["Train", "Cab"]
        },
        {
            name: t("andamanTitle"), state: "Andaman & Nicobar", season: "Winter", bestSeason: "Oct to May", duration: "6-7 Days", budgetType: "High", rating: 4.7, price: "₹35,000", category: "Honeymoon",
            desc: t("andamanDesc"), images: [andaman],
            famousPlaces: ["Radhanagar Beach", "Cellular Jail"], food: ["Lobster", "Fish Curry"],
            hotels: ["Sea Shell Resort"], transport: ["Flight", "Ferry"]
        },
        {
            name: t("udaipurTitle"), state: "Rajasthan", season: "Winter", bestSeason: "Oct to Mar", duration: "3-4 Days", budgetType: "Medium", rating: 4.4, price: "₹26,000", category: "Heritage",
            desc: t("udaipurDesc"), images: [udaipur],
            famousPlaces: ["City Palace", "Jag Mandir"], food: ["Dal Bati Churma"],
            hotels: ["Taj Lake Palace"], transport: ["Train", "Cab"]
        },
        {
            name: "Jaipur", state: "Rajasthan", season: "Winter", bestSeason: "Oct to Mar", duration: "3-4 Days", budgetType: "Low", rating: 4.3, price: "₹10,000", category: "Heritage",
            desc: "The Pink City, known for its majestic forts and magnificent palaces.", images: [jaipur],
            famousPlaces: ["Amber Fort", "Nahargarh Fort"], food: ["Piyaz Kachori"],
            hotels: ["ITC Rajputana"], transport: ["Train", "Bus"]
        },
        {
            name: t("varanasiTitle"), state: "Uttar Pradesh", season: "Winter", bestSeason: "Nov to Feb", duration: "2-3 Days", budgetType: "Low", rating: 4.2, price: "₹9,500", category: "Spiritual",
            desc: t("varanasiDesc"), images: [varanasi],
            famousPlaces: ["Dashashwamedh Ghat", "Sarnath"], food: ["Lassi", "Banarasi Paan"],
            hotels: ["BrijRama Palace"], transport: ["Train", "Bus"]
        },
        {
            name: t("goldenTempleTitle"), state: "Punjab", season: "Winter", bestSeason: "Oct to Mar", duration: "2 Days", budgetType: "Low", rating: 4.8, price: "₹7,000", category: "Spiritual",
            desc: t("goldenTempleDesc"), images: [goldenTemple],
            famousPlaces: ["Harmandir Sahib", "Jallianwala Bagh"], food: ["Amritsari Kulcha"],
            hotels: ["Saragarhi Sarai"], transport: ["Train", "Bus"]
        },
        {
            name: t("tajMahalTitle"), state: "Uttar Pradesh", season: "Winter", bestSeason: "Oct to Mar", duration: "1-2 Days", budgetType: "Low", rating: 4.9, price: "₹5,000", category: "Heritage",
            desc: t("tajMahalDesc"), images: [tajMahal],
            famousPlaces: ["Agra Fort", "Mehtab Bagh"], food: ["Petha", "Bedai"],
            hotels: ["ITC Mughal"], transport: ["Train", "Expressway"]
        },
        {
            name: t("hampiTitle"), state: "Karnataka", season: "Winter", bestSeason: "Oct to Feb", duration: "3-4 Days", budgetType: "Medium", rating: 4.6, price: "₹11,000", category: "Heritage",
            desc: t("hampiDesc"), images: [hampi],
            famousPlaces: ["Vittala Temple", "Lotus Mahal"], food: ["Badnekayi Ennegayi"],
            hotels: ["Heritage Resort"], transport: ["Bus", "Train"]
        },
        {
            name: t("jimCorbettTitle"), state: "Uttarakhand", season: "Winter", bestSeason: "Nov to June", duration: "2-3 Days", budgetType: "High", rating: 4.5, price: "₹19,000", category: "Wildlife",
            desc: t("jimCorbettDesc"), images: [jimCorbett],
            famousPlaces: ["Dhikala Zone", "Garjiya Devi"], food: ["Kumaoni Cuisine"],
            hotels: ["Forest Resort"], transport: ["Train", "Cab"]
        },
        {
            name: t("alleppeyTitle"), state: "Kerala", season: "Monsoon", bestSeason: "Aug to Mar", duration: "2-3 Days", budgetType: "Medium", rating: 4.4, price: "₹21,000", category: "Nature",
            desc: t("alleppeyDesc"), images: [alleppey],
            famousPlaces: ["Alappuzha Beach", "Pathiramanal"], food: ["Karimeen Pollichathu"],
            hotels: ["Houseboat"], transport: ["Train", "Bus"]
        },
        {
            name: "Munnar", state: "Kerala", season: "Summer", bestSeason: "Sept to Mar", duration: "3-4 Days", budgetType: "Medium", rating: 4.6, price: "₹17,000", category: "Nature",
            desc: "A town in the Western Ghats mountain range known for its tea plantations.", images: [munnar],
            famousPlaces: ["Eravikulam Park", "Mattupetty Dam"], food: ["Idiyappam"],
            hotels: ["Tea County"], transport: ["Bus", "Cab"]
        },
        {
            name: t("lehLadakhTitle"), state: "Ladakh", season: "Summer", bestSeason: "May to Sept", duration: "7-8 Days", budgetType: "High", rating: 4.8, price: "₹40,000", category: "Adventure",
            desc: "Breathtaking landscapes, high mountain passes and ancient monasteries.", images: [lehLadakh],
            famousPlaces: ["Nubra Valley", "Shanti Stupa"], food: ["Skyu", "Chutagi"],
            hotels: ["Camp Stay"], transport: ["Flight", "Bike"]
        },
        {
            name: "Rishikesh", state: "Uttarakhand", season: "Winter", bestSeason: "Sept to May", duration: "2-3 Days", budgetType: "Low", rating: 4.5, price: "₹8,000", category: "Adventure",
            desc: "Known as the Yoga Capital of the World and a base for outdoor adventures.", images: [rishikesh],
            famousPlaces: ["Triveni Ghat", "Parmarth Niketan"], food: ["Satvik Thali"],
            hotels: ["Ashram Stay"], transport: ["Train", "Bus"]
        },
        {
            name: "Ooty", state: "Tamil Nadu", season: "Summer", bestSeason: "Mar to June", duration: "3-4 Days", budgetType: "Low", rating: 4.3, price: "₹13,000", category: "Nature",
            desc: "The Queen of Hills, famous for its toy train and tea estates.", images: [ooty],
            famousPlaces: ["Doddabetta Peak", "Pine Forests"], food: ["Varkey", "Ooty Chocolate"],
            hotels: ["Lake View Hotel"], transport: ["Toy Train", "Bus"]
        }
    ];

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/destinations");
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setDestinations([...fallbackDestinations, ...data.data]);
                } else {
                    setDestinations(fallbackDestinations);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setDestinations(fallbackDestinations);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    const handleSelectPlace = (place) => {
        setSelectedPlace(place);
        setTimeout(() => {
            if (previewRef.current && window.innerWidth < 992) {
                previewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    const filteredDestinations = destinations.filter((d) => {
        const seasonMatch = seasonFilter === "All" || d.season === seasonFilter;
        const budgetMatch = budgetFilter === "All" || d.budgetType === budgetFilter;
        const categoryMatch = categoryFilter === "All" || d.category === categoryFilter;
        return seasonMatch && budgetMatch && categoryMatch;
    });

    const handleBookNow = () => {
        if (!selectedPlace) return alert("Select destination first");
        if (!user) {
            alert(t("loginFirstDest"));
            navigate("/login");
        } else {
            navigate("/paymntdetaildesti", { state: { place: selectedPlace } });
        }
    };

    return (
        <div className="destinations-page page-fade-in">
            <header className="page-header">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div className="text-start">
                            <h1>{t("destHeaderTitle")}<span>{t("destHeaderSpan")}</span></h1>
                            <p className="mb-0 text-white-50">{t("destHeaderDesc")}</p>
                        </div>
                        {user?.isAdmin && (
                            <button className="btn btn-primary btn-sm rounded-pill px-3 py-1 shadow-sm border-0 fw-bold" style={{ fontSize: '0.75rem' }} onClick={() => navigate("/admin/add-destination")}>
                                <i className="fas fa-plus me-1" style={{ fontSize: '0.7rem' }}></i> Add Destination
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="container">
                <div className="filter-bar">
                    <div className="filter-group">
                        <label><i className="fas fa-mountain-sun"></i> {t("filterExperience")}</label>
                        <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                            <option value="All">{t("allExperiences")}</option>
                            <option value="Honeymoon">💕 {t("catHoneymoon")}</option>
                            <option value="Nature">🌲 {t("catHills")}</option>
                            <option value="Adventure">🧗 {t("catWildlife")}</option>
                            <option value="Spiritual">🕉️ {t("catReligious")}</option>
                            <option value="Heritage">🏰 {t("catHistory")}</option>
                            <option value="Beach">🏖️ {t("catBeaches")}</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label><i className="fas fa-cloud-sun"></i> {t("filterSeason")}</label>
                        <select className="form-select" value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}>
                            <option value="All">{t("allSeasons")}</option>
                            <option value="Summer">Summer Vibes</option>
                            <option value="Winter">Winter Wonderland</option>
                            <option value="Monsoon">Monsoon Magic</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label><i className="fas fa-wallet"></i> {t("filterBudget")}</label>
                        <select className="form-select" value={budgetFilter} onChange={(e) => setBudgetFilter(e.target.value)}>
                            <option value="All">{t("allBudgets")}</option>
                            <option value="Low">Economy Friendly</option>
                            <option value="Medium">Standard Comfort</option>
                            <option value="High">Premium Luxury</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row mt-5">
                        <div className="col-lg-7">
                            <div className="destinations-grid">
                                {filteredDestinations.length > 0 ? filteredDestinations.map((place, i) => (
                                    <div key={i} className={`place-card ${selectedPlace?.name === place.name ? 'active' : ''}`} onClick={() => handleSelectPlace(place)}>
                                        <div className="place-img">
                                            <img src={place.images[0]} alt={place.name} loading="lazy" />
                                        </div>
                                        <div className="place-brief">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h3>{place.name}</h3>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span>{place.state}</span>
                                                        <span className="badge bg-light text-dark border-0 py-1 px-2" style={{ fontSize: '0.65rem', fontWeight: '700' }}>{place.category}</span>
                                                    </div>
                                                </div>
                                                <div className="rating-tag">
                                                    <i className="fas fa-star"></i> {place.rating || 4.5}
                                                </div>
                                            </div>
                                            <div className="place-meta">
                                                <span className="price-tag">{place.price}</span>
                                                <button className="btn btn-sm btn-outline-primary rounded-pill">{t("viewDetails")}</button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-5">
                                        <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                        <h4>No destinations found</h4>
                                        <p className="text-muted">Try adjusting your filters to find more places.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-5" ref={previewRef}>
                            {selectedPlace ? (
                                <div className="sticky-preview">
                                    <div className="glass-card">
                                        <div className="preview-img-container">
                                            <img src={selectedPlace.images[0]} alt={selectedPlace.name} loading="lazy" />
                                            <span className="badge-featured">{selectedPlace.category}</span>
                                        </div>
                                        <div className="preview-body">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <h2>{selectedPlace.name}</h2>
                                                <div className="rating-pill">
                                                    <i className="fas fa-star me-1"></i> {selectedPlace.rating || 4.5}
                                                </div>
                                            </div>
                                            <p className="state-subtitle"><i className="fas fa-location-dot"></i> {selectedPlace.state}</p>
                                            <p className="desc-text">{selectedPlace.desc}</p>

                                            <div className="quick-info-grid">
                                                <div className="info-item">
                                                    <i className="fas fa-heart" style={{ color: '#f43f5e' }}></i>
                                                    <div>
                                                        <span>Category</span>
                                                        <p>{selectedPlace.category}</p>
                                                    </div>
                                                </div>
                                                <div className="info-item">
                                                    <i className="fas fa-calendar-alt" style={{ color: '#10b981' }}></i>
                                                    <div>
                                                        <span>{t("bestTime")}</span>
                                                        <p>{selectedPlace.bestSeason}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="detail-sections">
                                                {selectedPlace.famousPlaces && (
                                                    <div className="detail-row">
                                                        <span className="row-label"><i className="fas fa-map-pin" style={{ color: '#f43f5e' }}></i> {t("famousSpots")}</span>
                                                        <div className="tags-flex">
                                                            {selectedPlace.famousPlaces.map((p, idx) => <span key={idx} className="tag">{p}</span>)}
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedPlace.food && (
                                                    <div className="detail-row">
                                                        <span className="row-label"><i className="fas fa-utensils" style={{ color: '#f59e0b' }}></i> {t("iconicFoods")}</span>
                                                        <div className="tags-flex">
                                                            {selectedPlace.food.map((f, idx) => <span key={idx} className="tag">{f}</span>)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <button className="btn-book-now-compact" onClick={handleBookNow}>
                                                {t("bookNow")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="select-placeholder">
                                    <i className="fas fa-map-marked-alt"></i>
                                    <h3>{t("selectADestination")}</h3>
                                    <p>{t("selectADestinationDesc")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Destinations;