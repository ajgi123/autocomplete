import fetchRepos, { Repos } from "./fetchRepos";
import fetchUsers, { User } from "./fetchUsers";
import {
  sortObjectArray,
  mergeObjectArrays,
} from "../helpers/ObjectArraysOper";
import { PromiseWithCancel } from "./interfaces";

const fetchUsersAndRepos = (
  query: string
): PromiseWithCancel<(User | Repos)[]> => {
  const controller = new AbortController();
  const signal = controller.signal;
  const promise = new Promise(async (resolve, reject) => {
    try {
      const [repos, users] = await Promise.all([
        fetchRepos(query, { signal }),
        fetchUsers(query, { signal }),
      ]);

      const sortedRepos = sortObjectArray(repos, "name");
      const sortedUsers = sortObjectArray(users, "login");
      resolve(mergeObjectArrays(sortedRepos, "name", sortedUsers, "login"));
    } catch (err) {
      return reject(err);
    }
  });
  (promise as PromiseWithCancel<(User | Repos)[]>).cancel = () =>
    controller.abort();
  return promise as PromiseWithCancel<(User | Repos)[]>;
};

export default fetchUsersAndRepos;
