// Zapai Business Solution website functionality
document.addEventListener("DOMContentLoaded", function () {

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("active");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("active");
      });
    });
  }

  // Automatic copyright year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Customer enquiry form
  const form = document.getElementById("enquiryForm");
  const formMessage = document.getElementById("formMessage");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const data = new FormData(form);
      if (data.get("website")) { return; }
      const customer = {
        name: (data.get("name") || "").trim(),
        phone: (data.get("phone") || "").trim(),
        car_interest: data.get("car_interest") || "",
        message: (data.get("message") || "").trim()
      };
      if (!customer.name || !customer.phone || !customer.message) {
        formMessage.textContent = "Please complete all required fields.";
        return;
      }
      const config = window.ZAPAI_CONFIG;
      const waMsg = `Hello ZAPAI Investment.\n\nName: ${customer.name}\nPhone: ${customer.phone}\nCar Interest: ${customer.car_interest || "None"}\n\nEnquiry:\n${customer.message}`;
      if (!config || !config.SUPABASE_URL || !config.SUPABASE_KEY) {
        formMessage.textContent = "Opening WhatsApp...";
        window.open(`https://wa.me/67576673887?text=${encodeURIComponent(waMsg)}`,'_blank','noopener,noreferrer');
        return;
      }
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      try {
        const response = await fetch(config.SUPABASE_URL + "/rest/v1/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": config.SUPABASE_KEY, "Authorization": "Bearer " + config.SUPABASE_KEY, "Prefer": "return=minimal" },
          body: JSON.stringify(customer)
        });
        if (!response.ok) { throw new Error("Enquiry could not be sent."); }
        formMessage.textContent = "Thank you! Your enquiry has been received. We will contact you.";
        form.reset();
        window.open(`https://wa.me/67576673887?text=${encodeURIComponent(waMsg)}`,'_blank','noopener,noreferrer');
      } catch (error) {
        formMessage.textContent = "Saved locally - Opening WhatsApp instead...";
        window.open(`https://wa.me/67576673887?text=${encodeURIComponent(waMsg)}`,'_blank','noopener,noreferrer');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send Enquiry";
      }
    });
  }
});