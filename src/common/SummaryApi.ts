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

  create_banner: {
    url: "/api/banner/create",
    method: "post",
  },

  get_all_banners: {
    url: "/api/banner/get-all",
    method: "get",
  },

  get_banner_by_id: (id: string) => ({
    url: `/api/banner/get/${id}`,
    method: "get",
  }),

  update_banner: (id: string) => ({
    url: `/api/banner/update/${id}`,
    method: "put",
  }),

  delete_banner: (id: string) => ({
    url: `/api/banner/delete/${id}`,
    method: "delete",
  }),

  update_banner_status: (id: string) => ({
    url: `/api/banner/update-status/${id}`,
    method: "patch",
  }),

  // About us
  create_about: {
    url: "/api/about/create",
    method: "post",
  },

  get_all_about: {
    url: "/api/about/get-all",
    method: "get",
  },

  get_about_by_id: (id: string) => ({
    url: `/api/about/get/${id}`,
    method: "get",
  }),

  update_about: (id: string) => ({
    url: `/api/about/update/${id}`,
    method: "put",
  }),

  update_about_status: (id: string) => ({
    url: `/api/about/update-status/${id}`,
    method: "patch",
  }),

  delete_about: (id: string) => ({
    url: `/api/about/delete/${id}`,
    method: "delete",
  }),
};

export default SummaryApi;
