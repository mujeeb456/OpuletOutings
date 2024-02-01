const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    console.log(res);

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const signup = async (name, email, password, passwordConfirm) => {
  try {
    if (password !== passwordConfirm) {
      showAlert("error", "Passwords do not match");
      return;
    }
    showAlert("success", "Signing up...");
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    console.log(res.data);

    if (res.data.status === "success") {
      showAlert("success", "singed up successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 0);
    }
  } catch (err) {
    showAlert("success", "singed up successfullly");
    window.setTimeout(() => {
      location.assign("/");
    }, 0);
  }
};

const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOut = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

if (loginForm)
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (signupForm)
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    signup(name, email, password, passwordConfirm);
  });

const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    if ((res.data.status = "success")) location.reload(true);
  } catch (err) {
    showAlert("error", "ERROR");
  }
};

if (logOut) logOut.addEventListener("click", logout);

// type is either 'password' or 'data'
const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateSettings(form, "data");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
const final = async (tour, user, email, price) => {
  try {
    const paid = await axios({
      method: "POST",
      url: "/api/v1/bookings/final-booking",
      data: {
        tour,
        user,
        email,
        price,
      },
    });

    if (paid.data.status === "success") {
      showAlert("success", "Booked successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 0);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // const email = session.data.session.customer_email;
    const tour = session.data.session.client_reference_id;
    const price = session.data.session.amount_total;
    const email = session.data.session.customer_email;
    const successUrl = session.data.session.success_url;
    const url = new URL(successUrl);
    const user = url.searchParams.get("user");
    // console.log(tour, user, price);
    final(tour, user, email, price);
  } catch (err) {
    console.log(err);
    showAlert("error", "Can't Book Right Now");
  }
};

if (bookBtn)
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "processing....";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
