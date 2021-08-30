export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  received_events_url: string;
  type: string;
  score: number;
  following_url: string;
  gists_url: string;
  starred_url: string;
  events_url: string;
  site_admin: boolean;
}

const fetchUsers = async (
  query: string,
  config?: RequestInit
): Promise<User[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${query}&per_page=30`,
      config
    );

    if (!response.ok) {
      return Promise.reject(response.status);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default fetchUsers;
