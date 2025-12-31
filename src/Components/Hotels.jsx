import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Hotels = () => {
  const { t } = useTranslation();

  const hotelData = [
    {
      id: "h1",
      name: "The Snow Peaks Resort",
      location: "Manali, Himachal Pradesh",
      price: "₹5,500 / night",
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Manali&output=embed"
    },
    {
      id: "h2",
      name: "Heritage Colonial Stay",
      location: "Shimla, Himachal Pradesh",
      price: "₹4,800 / night",
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Shimla&output=embed"
    },
    {
      id: "h3",
      name: "Oceanic Party Hub",
      location: "Calangute, Goa",
      price: "₹6,000 / night",
      images: [
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Calangute+Goa&output=embed"
    },
    {
      id: "h4",
      name: "Tea Valley Retreat",
      location: "Darjeeling, West Bengal",
      price: "₹4,200 / night",
      images: [
        "https://images.unsplash.com/photo-1542978709-19c95dc3bc9b?w=800",
        "https://images.unsplash.com/photo-1562158070-622a7a4b17c4?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Darjeeling&output=embed"
    },
    {
      id: "h5",
      name: "Blue Ocean Resort",
      location: "Havelock Island, Andaman",
      price: "₹9,000 / night",
      images: [
        "https://images.unsplash.com/photo-1589909202802-8f4abbce7482?w=800",
        "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Havelock+Island&output=embed"
    },
    {
      id: "h6",
      name: "Ganga View Palace",
      location: "Varanasi, Uttar Pradesh",
      price: "₹3,800 / night",
      images: [
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Varanasi&output=embed"
    },
    {
      id: "h7",
      name: "Heritage Amritsar Inn",
      location: "Amritsar, Punjab",
      price: "₹3,200 / night",
      images: [
        "https://images.unsplash.com/photo-1588096344356-9b7660f78553?w=800",
        "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Golden+Temple+Amritsar&output=embed"
    },
    {
      id: "h8",
      name: "Taj View Residency",
      location: "Agra, Uttar Pradesh",
      price: "₹4,500 / night",
      images: [
        "https://images.unsplash.com/photo-1564507592333-c60657451dd7?w=800",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Taj+Mahal&output=embed"
    },
    {
      id: "h9",
      name: "Stone Heritage Stay",
      location: "Hampi, Karnataka",
      price: "₹3,500 / night",
      images: [
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800",
        "https://images.unsplash.com/photo-1623074072959-728f3c1e82ad?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Hampi&output=embed"
    },
    {
      id: "h10",
      name: "Jungle Safari Lodge",
      location: "Jim Corbett, Uttarakhand",
      price: "₹6,800 / night",
      images: [
        "https://images.unsplash.com/photo-1581852017103-68accd35243e?w=800",
        "https://images.unsplash.com/photo-1601758064226-0c3f45be8d8d?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Jim+Corbett+National+Park&output=embed"
    },
    {
      id: "h11",
      name: "The Royal Palace Hotel",
      location: "Udaipur, Rajasthan",
      price: "₹8,500 / night",
      images: [
        "https://images.unsplash.com/photo-1590424744295-ff08f431668b?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Udaipur&output=embed"
    },
    {
      id: "h12",
      name: "Backwater Houseboat Stay",
      location: "Alleppey, Kerala",
      price: "₹10,000 / night",
      images: [
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800"
      ],
      mapSrc: "https://www.google.com/maps?q=Alleppey&output=embed"
    }
  ];
 return (
    <div className="container py-5" style={{ paddingBottom: "10%" }}>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">{t("premiumHotels")}</h2>
        <Link to="/" className="btn btn-outline-dark">
          ← {t("home")}
        </Link>
      </div>

      {/* HOTEL CARDS */}
      <div className="row g-4">
        {hotelData.map((hotel) => (
          <div className="col-12 col-sm-6 col-lg-4" key={hotel.id}>
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">

              {/* IMAGE CAROUSEL */}
              <div
                id={`carousel-${hotel.id}`}
                className="carousel slide carousel-fade"
                data-bs-ride="carousel"
                data-bs-interval="3000"
              >
                <div className="carousel-inner">
                  {hotel.images.map((img, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <img
                        src={img}
                        alt={hotel.name}
                        className="d-block w-100"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target={`#carousel-${hotel.id}`}
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target={`#carousel-${hotel.id}`}
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>

              {/* CARD BODY */}
              <div className="card-body d-flex flex-column justify-content-between">

                {/* DETAILS */}
                <div>
                  <h5 className="fw-bold">{hotel.name}</h5>
                  <p className="text-muted small mb-1">
                    📍 {hotel.location}
                  </p>
                  <p className="fw-bold text-primary">{hotel.price}</p>
                </div>

                {/* MAP */}
                <div
                  style={{
                    height: "120px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "12px"
                  }}
                >
                  <iframe
                    src={hotel.mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title={hotel.id}
                  ></iframe>
                </div>

                {/* BOOK BUTTON */}
                <button
                  className="btn btn-dark w-100 fw-bold"
                  style={{ padding: "12px", borderRadius: "12px" }}
                  onClick={() => alert(t("loginFirst"))}
                >
                  {t("bookStay")}
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Hotels;