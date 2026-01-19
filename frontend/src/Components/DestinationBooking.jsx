import React, { useEffect, useState } from "react";

const STORAGE_KEY = "DestinationBooking";

const DestinationBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setBookings(data.reverse());
  }, []);

  // ✅ FINAL SAFE FILTER
  const filteredBookings = bookings.filter((b) => {
    if (filter === "success" && b.status !== "success") return false;
    if (filter === "failed" && b.status !== "failed") return false;

    if (selectedDate) {
      if (!b.travelDate) return false;
      if (b.travelDate.trim() !== selectedDate.trim()) return false;
    }

    return true;
  });

  return (
    <div className="container py-3">

      {/* HEADER + FILTERS */}
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <h4 className="fw-bold m-0">📄 Payment History</h4>

        <div className="d-flex gap-2">
          <input
            type="date"
            className="form-control form-control-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            className="form-select form-select-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      {filteredBookings.length === 0 ? (
        <p className="text-center text-muted mt-4">
          No payment history found
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Destination</th>
                <th>User</th>
                <th>Travel Date</th>
                <th>Days</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Booked On</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b, index) => (
                <tr key={b.id}>
                  <td>{index + 1}</td>
                  <td>{b.place?.name}</td>
                  <td>
                    {b.user?.name}
                    <br />
                    <small className="text-muted">
                      {b.user?.email}
                    </small>
                  </td>
                  <td>{b.travelDate || "N/A"}</td>
                  <td>{b.days}</td>
                  <td>₹{b.totalAmount}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "success"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{b.id}</td>
                  <td>{b.dateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default DestinationBooking;
