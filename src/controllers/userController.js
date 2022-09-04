import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  console.log(req.body);
  const { email, username, password, password2, name, location } = req.body;
  const pageTitle = "Join";
  const exists = await User.exists({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (exists) {
    return res.status(400).render("Join", {
      pageTitle: pageTitle,
      errorMessage: "This username / username is already taken",
    });
  }

  if (password !== password2) {
    return res.render.status(400).render("Join", {
      pageTitle,
      errorMessage: "Passwords do not match",
    });
  }

  await User.create({
    email,
    username,
    password,
    name,
    location,
  });
  return res.redirect("/login");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  // check if account exists
  const exists = await User.exists({ username: username });
  if (!exists) {
    return res
      .status(400)
      .render("login", {
        pageTitle: "Login",
        errorMessage: "An account with this username does not exist.",
      });
  }
  // check if password is right

  res.end();
};

export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("See User");
