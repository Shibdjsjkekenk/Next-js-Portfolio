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

  update_user_role: {
    url: "/api/admin/update-user",
    method: "put",
  },

  delete_user: {
    url: "/api/admin/delete-user",
    method: "delete",
  },

};

export default SummaryApi;
