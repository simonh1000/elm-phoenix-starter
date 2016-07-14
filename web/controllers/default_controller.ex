defmodule Meepg.DefaultController do
  use Meepg.Web, :controller

  def show(conn, _params) do
    json conn, %{data: "Hello, World!"}
  end
end
