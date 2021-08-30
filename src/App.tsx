import "./App.css";
import AutoComplete from "./components/autocomplete/AutoComplete";
import { MapFuncType } from "./components/autocomplete/AutoComplete";
import { User } from "./api/fetchUsers";
import { Repos } from "./api/fetchRepos";
import fetchUsersAndRepos from "./api/fetchUsersAndRepos";
import ListElement from "./components/list-elements/ListElement";
import { openInNewTab } from "./helpers/opennewtab";

export const mapFunc: MapFuncType<(User | Repos)[]> = (
  index,
  selectedIndex,
  selectedRef,
  item
) => {
  if (item.hasOwnProperty("name")) {
    return (
      <ListElement
        title="repo"
        key={item.id}
        // @ts-expect-error
        name={item.name}
        isActive={index === selectedIndex}
        ref={index === selectedIndex ? selectedRef : null}
      />
    );
  }
  return (
    <ListElement
      title="user"
      key={item.id}
      // @ts-expect-error
      name={item.login}
      isActive={index === selectedIndex}
      ref={index === selectedIndex ? selectedRef : null}
    />
  );
};

export const enterHandler = (
  data: (User | Repos)[] | null,
  curIndex: number | boolean
) => {
  if (typeof curIndex === "number" && data) {
    openInNewTab(data[curIndex].html_url);
  }
};

function App() {
  return (
    <div className="App">
      <AutoComplete
        fetchData={fetchUsersAndRepos}
        minTextLength={3}
        mapFunc={mapFunc}
        enterhandler={enterHandler}
      />
    </div>
  );
}

export default App;
