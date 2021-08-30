import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  getByTestId,
} from "@testing-library/react";
import AutoComplete from "./AutoComplete";
import { mapFunc, enterHandler } from "../../App";
import fetchUsersAndRepos from "../../api/fetchUsersAndRepos";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("https://api.github.com/search/users", (req, res, ctx) => {
    const query = req.url.searchParams;
    const q = query.get("q");
    const per_page = query.get("per_page");
    if (q === "abc") {
      return res(
        ctx.status(200),
        ctx.json({
          items: [
            { login: "nana", id: 123 },
            { login: "be", id: 324 },
            { login: "ke", id: 789 },
          ],
        })
      );
    }
    if (q === "err") {
      return res(
        ctx.status(500),
        ctx.json({ error: "You must add request handler." })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        items: [],
      })
    );
  }),
  rest.get(`https://api.github.com/search/repositories`, (req, res, ctx) => {
    const query = req.url.searchParams;
    const q = query.get("q");
    const per_page = query.get("per_page");
    if (q === "abc") {
      return res(
        ctx.status(200),
        ctx.json({
          items: [
            { name: "cana", id: 523 },
            { name: "he", id: 384 },
            { name: "kke", id: 689 },
          ],
        })
      );
    }
    if (q === "err") {
      return res(
        ctx.status(500),
        ctx.json({ error: "You must add request handler." })
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        items: [],
      })
    );
  }),
  rest.get("*", (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: "You must add request handler." })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("Testing AutoDComplete", () => {
  describe("dropdown", () => {
    test("Dropdown initially closed", async () => {
      render(
        <AutoComplete
          minTextLength={3}
          fetchData={fetchUsersAndRepos}
          mapFunc={mapFunc}
          enterhandler={enterHandler}
        />
      );
      const dropdown = screen.queryByTestId("autocomplete__dropdown");

      expect(dropdown).toBeNull();
    });

    test("Dropdown closed until req matches", async () => {
      render(
        <AutoComplete
          minTextLength={3}
          fetchData={fetchUsersAndRepos}
          mapFunc={mapFunc}
          enterhandler={enterHandler}
        />
      );
      const input = screen.getByRole("textbox");
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "ab" } });
      await waitFor(() => {
        expect(screen.queryByTestId("autocomplete__dropdown")).toBeNull();
      });
    });

    test("Testing dropdown open", async () => {
      render(
        <AutoComplete
          minTextLength={3}
          fetchData={fetchUsersAndRepos}
          mapFunc={mapFunc}
          enterhandler={enterHandler}
        />
      );
      const input = screen.getByRole("textbox");
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "abc" } });
      await waitFor(() => {
        expect(
          screen.getByTestId("autocomplete__dropdown")
        ).toBeInTheDocument();
      });
    });

    test("Testing dropdown closing", async () => {
      render(
        <AutoComplete
          minTextLength={3}
          fetchData={fetchUsersAndRepos}
          mapFunc={mapFunc}
          enterhandler={enterHandler}
        />
      );
      const input = screen.getByRole("textbox");
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "abc" } });
      fireEvent.blur(input);
      await waitFor(() => {
        expect(screen.queryByTestId("autocomplete__dropdown")).toBeNull();
      });
    });
  });

  describe("loading spinner", () => {
    test("test if loading spinner shows up", async () => {
      render(
        <AutoComplete
          minTextLength={3}
          fetchData={fetchUsersAndRepos}
          mapFunc={mapFunc}
          enterhandler={enterHandler}
        />
      );
      const input = screen.getByRole("textbox");
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "abc" } });

      await waitFor(() => {
        expect(screen.getByTestId("autocomplete__loading")).toBeInTheDocument();
      });
    });
  });

  describe("list items", () => {
    test("test if listitems shows up", async () => {
      render(
        <AutoComplete
          minTextLength={3}
          fetchData={fetchUsersAndRepos}
          mapFunc={mapFunc}
          enterhandler={enterHandler}
        />
      );
      const input = screen.getByRole("textbox");
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "abc" } });

      await waitFor(() => {
        expect(screen.getAllByRole("listitem")).toHaveLength(6);
      });
    });
  });

  test("listitmes don show up", async () => {
    render(
      <AutoComplete
        minTextLength={3}
        fetchData={fetchUsersAndRepos}
        mapFunc={mapFunc}
        enterhandler={enterHandler}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "aaa" } });

    await waitFor(() => {
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
  });

  test("paragraph shows up", async () => {
    render(
      <AutoComplete
        minTextLength={3}
        fetchData={fetchUsersAndRepos}
        mapFunc={mapFunc}
        enterhandler={enterHandler}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "aaa" } });

    await waitFor(() => {
      expect(screen.getByText("No results")).toBeInTheDocument();
    });
  });

  test("error shows up", async () => {
    render(
      <AutoComplete
        minTextLength={3}
        fetchData={fetchUsersAndRepos}
        mapFunc={mapFunc}
        enterhandler={enterHandler}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "err" } });

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
