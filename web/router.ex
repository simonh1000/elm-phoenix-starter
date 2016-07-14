defmodule Meepg.Router do
  use Meepg.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  # Other scopes may use custom stacks.
  scope "/api", Meepg do
    pipe_through :api
    get "default", DefaultController, :show
  end

  scope "/", Meepg do
    pipe_through :browser # Use the default browser stack

    get "/*any", PageController, :index
  end

end
