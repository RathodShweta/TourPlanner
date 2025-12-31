import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Destinations = () => {
    const { t } = useTranslation();
    const [selectedPlace, setSelectedPlace] = useState(null);

    const handleSelect = (name, desc, price, images) => {
        setSelectedPlace({ name, desc, price, images });
    };
    const [loaded, setLoaded] = useState(false);

    const handleBookingClick = () => {
        alert(t("loginFirstDest"));
    };
    return (
        <div className="container py-5" style={{ minHeight: "100vh" }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="fw-bold m-0" style={{ color: "#181E4B" }}>
                    {t("exploreDestinations")}
                </h2>
                <Link to="/" className="btn btn-outline-dark">
                    ← {t("home")}
                </Link>
            </div>

            <div className="row">
                {/* LEFT COLUMN */}
                <div className="col-lg-7 mb-4">
                    <div className="accordion accordion-flush shadow-sm border rounded-3 overflow-hidden">

                        {/* 1. Hill Stations */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#hills">
                                    ⛰️ {t("catHills")}
                                </button>
                            </h2>
                            <div id="hills" className="accordion-collapse collapse" data-bs-parent="#travelAccordion">
                                <div className="accordion-body p-0">
                                    <div className="list-group list-group-flush">
                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Manali", t("manaliDesc"), "₹15,000", [
                                            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
                                            "https://images.unsplash.com/photo-1596760405809-54897287958f?w=600",
                                            "https://images.unsplash.com/photo-1605649440416-43f673322f79?w=600"
                                        ]
                                        )
                                        }
                                        >
                                            {t("manaliTitle")}</button>

                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Shimla", t("shimlaDesc"), "₹12,000", [
                                            "https://images.unsplash.com/photo-1597079910443-60c43fc4f729?w=600",
                                            "https://images.unsplash.com/photo-1616423641320-3058863f8373?w=600",
                                            "https://images.unsplash.com/photo-1563297122-be302213bb0b?w=600"
                                        ])}>{t("shimlaTitle")}</button>

                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Darjeeling", t("darjeelingDesc"), "₹14,500", [
                                            "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=600",
                                            "https://images.unsplash.com/photo-1611689225620-3e70248bc0f0?w=600",
                                            "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=600"
                                        ])}>{t("darjeelingTitle")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Beach Destinations */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#beaches">
                                    🏖️ {t("catBeaches")}
                                </button>
                            </h2>
                            <div id="beaches" className="accordion-collapse collapse" data-bs-parent="#travelAccordion">
                                <div className="accordion-body p-0">
                                    <div className="list-group list-group-flush">
                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Goa", t("goaDesc"), "₹18,000", [
                                            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
                                            "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=600",
                                            "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600"
                                        ])}>{t("goaTitle")}</button>

                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Andaman", t("andamanDesc"), "₹35,000", [
                                            "https://images.unsplash.com/photo-1589909202802-8f4abbce7482?w=600",
                                            "https://images.unsplash.com/photo-1537162998323-3d3675e0e87c?w=600",
                                            "https://images.unsplash.com/photo-1573059224108-765064560d2b?w=600"
                                        ])}>{t("andamanTitle")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Religious Places */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#religious">
                                    🛕 {t("catReligious")}
                                </button>
                            </h2>
                            <div id="religious" className="accordion-collapse collapse" data-bs-parent="#travelAccordion">
                                <div className="accordion-body p-0">
                                    <div className="list-group list-group-flush">
                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Varanasi", t("varanasiDesc"), "₹9,500", [
                                            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600",
                                            "https://images.unsplash.com/photo-1590051515171-879857d4a77d?w=600",
                                            "https://images.unsplash.com/photo-1618214224097-4041b18d2273?w=600"
                                        ])}>{t("varanasiTitle")}</button>

                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Golden Temple", t("goldenTempleDesc"), "₹7,000", [
                                            "https://images.unsplash.com/photo-1588096344356-9b7660f78553?w=600",
                                            "https://images.unsplash.com/photo-1605342416049-74d6c4669f65?w=600",
                                            "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600"
                                        ])}>{t("goldenTempleTitle")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Historical Places */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#history">
                                    🏰 {t("catHistory")}
                                </button>
                            </h2>
                            <div id="history" className="accordion-collapse collapse" data-bs-parent="#travelAccordion">
                                <div className="accordion-body p-0">
                                    <div className="list-group list-group-flush">
                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Taj Mahal", t("tajMahalDesc"), "₹5,000", [
                                            "https://images.unsplash.com/photo-1564507592333-c60657451dd7?w=600",
                                            "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=600",
                                            "https://images.unsplash.com/photo-1524492459426-030cc889ce32?w=600"
                                        ])}>{t("tajMahalTitle")}</button>

                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Hampi", t("hampiDesc"), "₹11,000", [
                                            "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600",
                                            "https://images.unsplash.com/photo-1590490359854-dfba19688d70?w=600",
                                            "https://images.unsplash.com/photo-1621501174360-6a9c4033b00e?w=600"
                                        ])}>{t("hampiTitle")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Wildlife & Adventure */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#wildlife">
                                    🐅 {t("catWildlife")}
                                </button>
                            </h2>
                            <div id="wildlife" className="accordion-collapse collapse" data-bs-parent="#travelAccordion">
                                <div className="accordion-body p-0">
                                    <div className="list-group list-group-flush">
                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Jim Corbett", t("jimCorbettDesc"), "₹19,000", [
                                            "https://images.unsplash.com/photo-1581852017103-68accd35243e?w=600",
                                            "https://images.unsplash.com/photo-1582236528731-0da6324d2757?w=600",
                                            "https://images.unsplash.com/photo-1591461993202-e20092c474d2?w=600"
                                        ])}>{t("jimCorbettTitle")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6. Honeymoon Places */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#honeymoon">
                                    💕 {t("catHoneymoon")}
                                </button>
                            </h2>
                            <div id="honeymoon" className="accordion-collapse collapse" data-bs-parent="#travelAccordion">
                                <div className="accordion-body p-0">
                                    <div className="list-group list-group-flush">
                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Udaipur", t("udaipurDesc"), "₹26,000", [
                                            "https://images.unsplash.com/photo-1590424744295-ff08f431668b?w=600",
                                            "https://images.unsplash.com/photo-1601931163309-906560411352?w=600",
                                            "https://images.unsplash.com/photo-1593466144596-8abd396956cc?w=600"
                                        ])}>{t("udaipurTitle")}</button>

                                        <button className="list-group-item list-group-item-action border-0" onClick={() => handleSelect("Alleppey", t("alleppeyDesc"), "₹21,000", [
                                            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
                                            "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=600",
                                            "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=600"
                                        ])}>{t("alleppeyTitle")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT COLUMN: The Detail Card */}
                <div className="col-lg-5">
                    {selectedPlace ? (
                        <div className="card border-0 shadow-lg sticky-top destination-card" style={{ top: "20px", borderRadius: "20px", overflow: "hidden" }}>

                            {/* Bootstrap Carousel for Selected Place (Auto-scroll enabled) */}
                            <div id="placeCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {(selectedPlace.images || []).map((img, index) => (
                                        <div
                                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                                            key={index}
                                            data-bs-interval="3000"
                                        >
                                            <img
                                                src={img}
                                                loading="lazy"
                                                decoding="async"
                                                className="d-block w-100"
                                                alt={selectedPlace.name}
                                                style={{ height: "300px", objectFit: "cover" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {/* Manual Controls */}
                                <button className="carousel-control-prev" type="button" data-bs-target="#placeCarousel" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#placeCarousel" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                </button>
                            </div>

                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="fw-bold m-0" style={{ color: "#181E4B" }}>{selectedPlace.name}</h3>
                                    <span className="badge rounded-pill bg-light text-dark p-2 px-3 shadow-sm border" style={{ fontSize: "1.1rem" }}>{selectedPlace.price}</span>
                                </div>
                                <p className="text-secondary mb-4" style={{ lineHeight: "1.6" }}>{selectedPlace.desc}</p>
                                <button className="btn btn-warning w-100 fw-bold py-3 text-white"
                                    style={{ borderRadius: "10px", backgroundColor: "#F1A501", border: "none" }}
                                    onClick={handleBookingClick}
                                >
                                    {t("bookNow")}
                                </button>
                                <button className="btn btn-link w-100 mt-2 text-decoration-none text-muted" onClick={() => setSelectedPlace(null)}>{t("closeDetails")}</button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center border rounded-4 bg-light p-5 text-center" style={{ borderStyle: "dashed", minHeight: "400px" }}>
                            <p className="text-muted">{t("selectHint")}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Destinations;  