# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :reactTemplate,
  ecto_repos: [ReactTemplate.Repo]

# Configures the endpoint
config :reactTemplate, ReactTemplateWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "TkzM+shXPqasaeEeWfBomHaN2gk6s0fOlQ1Rlsx5VlCUo8HlwYx60zqCbTIbPsN5",
  render_errors: [view: ReactTemplateWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ReactTemplate.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
