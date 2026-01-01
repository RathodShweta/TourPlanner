import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
    const { state } = useLocation();
    const place = state?.place;

    const [step, setStep] = useState("scanner");
    // scanner → loading → success

    useEffect(() => {
        if (step === "scanner") {
            const timer = setTimeout(() => {
                setStep("loading");
            }, 6000); // 6 sec scanner
            return () => clearTimeout(timer);
        }

        if (step === "loading") {
            const timer = setTimeout(() => {
                setStep("success");
                handlePrint();
            }, 3000); // loading spinner
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handlePrint = () => {
        setTimeout(() => {
            window.print();
        }, 500);
    };

    if (!place) {
        return <h3 className="text-center mt-5">No booking data found</h3>;
    }

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div
                className="card shadow-lg p-4 text-center"
                style={{ width: "400px", borderRadius: "16px" }}
            >
                <h3 className="fw-bold mb-3">Payment</h3>

                {/* DETAILS */}
                <div className="border rounded p-3 mb-3">
                    <p className="mb-1"><strong>Destination:</strong> {place.name}</p>
                    <p className="mb-0"><strong>Price:</strong> {place.price}</p>
                </div>

                {/* STEP 1: SCANNER */}
                {step === "scanner" && (
                    <>
                        <p className="fw-bold text-center">Scan to Pay</p>

                        <div className="d-flex justify-content-center my-3">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=TourPlannerPayment"
                                alt="QR Code"
                                style={{ width: "140px", height: "140px" }}
                            />
                        </div>

                        <p className="text-muted text-center">Waiting for payment...</p>
                    </>

                )}

                {/* STEP 2: LOADING */}
                {step === "loading" && (
                    <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ minHeight: "220px" }}
                    >
                        <div className="spinner-border text-warning mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>

                        <p className="fw-bold text-warning text-center">
                            Processing payment...
                        </p>
                    </div>
                )}


                {/* STEP 3: SUCCESS */}
                {step === "success" && (
                    <div className="alert alert-success fw-bold mt-3">
                        ✅ Payment Successful!
                        <br />
                        Receipt is downloading...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
