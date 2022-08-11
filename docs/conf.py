import subprocess

project = "AlleyCAT"
copyright = "Sammi de Guzman"
author = copyright

release = (
  subprocess.check_output(["git", "describe", "--tags"], encoding="utf-8")
  .strip()
  .replace("v", "")
)
version = release

extensions = [
  "myst_parser",
]

templates_path = ["_templates"]
source_suffix = [".rst", ".md"]
exclude_patterns = []

pygments_style = "manni"
pygments_dark_style = "monokai"


html_theme = "furo"
html_static_path = ["_static"]
html_title = f"{project} v{version} documentation"
html_favicon = "_static/favicon.ico"
html_css_files = [
  "custom.css",
]

html_theme_options = {
  "navigation_with_keys": True,
  "light_css_variables": {
    "color-brand-primary": "#0091ff",
    "color-brand-content": "#0091ff",
    "color-sidebar-background": "#0091ff",
    "color-sidebar-brand-text": "white",
    "color-sidebar-brand-text--hover": "white",
    "color-sidebar-caption-text": "white",
    "color-sidebar-link-text": "white",
    "color-sidebar-link-text--top-level": "white",
    "color-sidebar-item-background--hover": "#7ac6ff",
    "color-sidebar-item-expander-background--hover": "#7ac6ff",
    "color-inline-code-background": "transparent",
    "font-stack": "BasierSquare, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
    "font-stack--monospace": "BasierSquareMono, SFMono-Regular, Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace",
  },
  "light_logo": "logo.svg",
  "dark_logo": "logo.svg",
}
