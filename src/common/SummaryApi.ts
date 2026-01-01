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

  all_users: {
    url: "/api/admin/all-users",
    method: "get",
  },

  delete_user: {
    url: "/api/admin/user", 
    method: "delete",
  },

  update_user: {
    url: "/api/admin/user", 
    method: "put",
  },
};

export default SummaryApi;
