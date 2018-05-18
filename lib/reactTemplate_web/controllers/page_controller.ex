defmodule ReactTemplateWeb.PageController do
  use ReactTemplateWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
