import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ExploreCourses.css";

function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [applyMsg, setApplyMsg] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || !user._id) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/enrollments/notEnrolled/${user._id}`)
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("❌ Failed to load courses:", err);
        setCourses([]);
      });
  }, [user._id]);

  const handleView = (course) => {
    setSelectedCourse(course);
    setFinalPrice(course.price);
    setCoupon("");
    setApplyMsg("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const handleCouponApply = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/coupons/apply", {
        courseId: selectedCourse._id,
        code: coupon,
        userId: user._id,
      });

      if (res.data.discountedPrice !== undefined) {
        setFinalPrice(res.data.discountedPrice);
      }
      setApplyMsg(res.data.message || "Coupon applied!");
    } catch (err) {
      setApplyMsg(err.response?.data?.message || "Invalid coupon");
    }
  };

  const handleEnroll = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/payments/create-order", {
        amount: finalPrice,
        studentId: user._id,
        courseId: selectedCourse._id,
      });

      const options = {
        key: "rzp_test_dGFALpaB5MZyZr",
        amount: res.data.amount,
        currency: "INR",
        name: "LMS Payment",
        description: selectedCourse.title,
        order_id: res.data.id,
        handler: async function (response) {
          await axios.post("http://localhost:5000/api/enrollments/enroll", {
            userId: user._id,
            courseId: selectedCourse._id,
            amountPaid: finalPrice,
          });

          await axios.post("http://localhost:5000/api/payments/save", {
            studentId: user._id,
            courseId: selectedCourse._id,
            amount: finalPrice,
            coupon,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            receipt: res.data.receipt,
            status: "paid",
          });

          alert("✅ Enrolled successfully!");
          closeModal();
          navigate("/student/my-courses");
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("❌ Payment failed");
    }
  };

  return React.createElement(
    "div",
    { className: "explore-container" },
    React.createElement("h2", { className: "explore-title" }, "📚 Explore Courses"),
    React.createElement(
      "div",
      { className: "course-grid" },
      courses.map((course) =>
        React.createElement(
          "div",
          { className: "course-card", key: course._id },
          React.createElement("span", { className: "badge" }, "🔥 New"),
          React.createElement(
            "div",
            { className: "img-wrap" },
            course.thumbnail
              ? React.createElement("img", {
                  src: `http://localhost:5000/uploads/thumbnails/${course.thumbnail}`,
                  alt: course.title,
                  className: "course-img",
                })
              : React.createElement("div", { className: "course-img no-img" }, "No Image")
          ),
          React.createElement(
            "div",
            { className: "info" },
            React.createElement("h5", { className: "title" }, course.title),
            React.createElement("p", { className: "meta" }, React.createElement("strong", null, "Instructor:"), " ", course.instructor || "N/A"),
            React.createElement("p", { className: "meta" }, React.createElement("strong", null, "Level:"), " ", course.difficulty || "Beginner"),
            React.createElement("p", { className: "meta" }, React.createElement("strong", null, "Price:"), ` ₹${course.price}`),
            React.createElement(
              "button",
              {
                className: "enroll",
                onClick: () => handleView(course),
              },
              "View & Enroll"
            )
          )
        )
      )
    ),
    showModal &&
      selectedCourse &&
      React.createElement(
        "div",
        { className: "modal-backdrop" },
        React.createElement(
          "div",
          { className: "modal-card" },
          React.createElement("span", {
            className: "close-btn",
            onClick: closeModal,
            children: "×",
          }),
          React.createElement(
            "div",
            { className: "modal-left" },
            React.createElement("h3", { className: "title" }, selectedCourse.title),
            React.createElement("p", null, selectedCourse.description),
            React.createElement(
              "div",
              { className: "coupon-box" },
              React.createElement("input", {
                type: "text",
                placeholder: "Enter Coupon",
                value: coupon,
                onChange: (e) => setCoupon(e.target.value),
                className: "coupon-input",
              }),
              React.createElement(
                "button",
                {
                  className: "btn-apply",
                  onClick: handleCouponApply,
                },
                "Apply"
              )
            ),
            applyMsg && React.createElement("p", { className: "apply-msg" }, applyMsg),
            React.createElement(
              "button",
              {
                className: "btn-enroll",
                onClick: handleEnroll,
              },
              `Enroll & Pay ₹${finalPrice}`
            )
          ),
          React.createElement(
            "div",
            { className: "modal-right" },
            React.createElement("img", {
              src: `http://localhost:5000/uploads/thumbnails/${selectedCourse.thumbnail}`,
              alt: "preview",
              className: "modal-img",
            })
          )
        )
      )
  );
}

export default ExploreCourses;
