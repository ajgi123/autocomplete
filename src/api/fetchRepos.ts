import { User } from "./fetchUsers";

export interface Repos {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: User;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  open_issues_count: number;
  master_branch: string;
  default_branch: string;
  score: number;
  archive_url: string;
}

const fetchRepos = async (
  query: string,
  config?: RequestInit
): Promise<Repos[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&per_page=30`,
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

export default fetchRepos;
