import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

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

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const changes = req.session.user.email !== req.body.email ? true : false;
  const exists = await User.exists({
    $or: [{ email: req.body.email }],
  });

  // 입력한 정보
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  // 위의 코드는 다음과 같다
  // const id = req.session.user.id;
  // const {name, email, username, location} = req.body;

  // 아바타 파일 -> req.file

  // username, email에 change가 있는가?

  if (exists && changes) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "This email is already taken",
    });
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file ? file.path : avatarUrl, // 파일이 존재한다면 file.path, 존재하지 않으면(수정하지 않으면) 기존 avatar url
        name: name,
        email: email,
        usernname: username,
        location: location,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    return res.render("edit-profile");
  }
};

export const remove = (req, res) => res.send("Delete User");
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  // check if account exists
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exist.",
    });
  }
  // check if password is right
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }

  // 세션 정보 저장. 각 유저마다 서로 다른 req.session object를 지님
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    // access api
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // console.log(emailData);
    const emailObj = emailData.find(
      (emailObj) => emailObj.primary === true && emailObj.verified === true
    );

    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });

    if (!user) {
      // create an account
      const user = await User.create({
        email: emailObj.email,
        avatarUrl: userData.avatar_url,
        username: userData.login,
        password: "",
        name: userData.name || "Anonymous",
        location: userData.location || "on Earth",
        socialOnly: true,
      });

      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    } else {
      return res.redirect("/login");
    }
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("user/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    // old password가 올바르지 않음
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errorMessage: "패스워드가 올바르지 않습니다",
    });
  }
  // 새 패스워드 === 패스워드 확인?
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errorMessage: "패스워드가 일치하지 않습니다",
    });
  }

  // 사용자 존재여부 파악
  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save(); // pre save가 작동함 -> 새로운 비밀번호를 hash

  // 세션 업데이트
  req.session.user.password = user.password;

  // 비밀번호 변경 알림

  // 로그아웃
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  // 페이지를 누구나 볼 수 있어야 하기 때문에 session의 id를 가져오지 않는다
  // url의 id를 가져온다

  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  // 이 유저가 업로드한 영상을 검색. 다음과 같이 해도 됨
  //  const videos = await Video.find({ owner: user._id });
  // 위에서는 populate를 이용했다

  return res.render("user/profile", {
    pageTitle: `${user.name}의 Profile`,
    user: user,
  });
};
