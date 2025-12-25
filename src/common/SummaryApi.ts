const SummaryApi = {
  signUP: {
    url: "/api/auth/signup",
    method: "post",
  },

  signIn: {
    url: "/api/auth/login",
    method: "post",
  },

  current_user: {
    url: "/api/auth/me",
    method: "get",
  },
};

export default SummaryApi;
