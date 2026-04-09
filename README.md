# Nishant Kumar Portfolio Arcade

An interactive portfolio website that combines a personal developer brand, featured projects, browser games, and a support page in one GitHub Pages experience.

## Why This Project Exists

Most portfolio sites stop at a project list. This one is designed to feel more memorable and more useful: visitors can understand the builder, browse real work, and interact with original browser games in the same experience.

## Key Features

- Premium landing page with a strong creator-focused introduction
- Project showcase for Nishant Kumar's web, AI, and automation work
- Dedicated browser-game arcade with multiple playable mini games
- Separate donation/support page with a themed interaction flow
- Responsive layout with custom visual styling and animated presentation
- GitHub Pages-friendly static architecture with no build step required

## Live Demo

- Portfolio home: [https://neeshant01.github.io/](https://neeshant01.github.io/)
- Games hub: [https://neeshant01.github.io/games.html](https://neeshant01.github.io/games.html)
- Support page: [https://neeshant01.github.io/donate.html](https://neeshant01.github.io/donate.html)

## Tech Stack

- HTML5
- CSS3
- JavaScript
- GitHub Pages
- Google Fonts

## Project Structure

```text
.
|-- index.html
|-- games.html
|-- donate.html
|-- styles.css
|-- script.js
|-- games/
|   |-- hub.js
|   |-- arcade.css
|   |-- arcade-core.js
|   |-- bug-catcher-run.html
|   |-- bug-catcher-run.js
|   |-- codequiz-blitz.html
|   |-- codequiz-blitz.js
|   |-- desi-detective.html
|   |-- desi-detective.js
|   |-- memory-stack-tech.html
|   |-- memory-stack-tech.js
|   |-- pathfinder-arena.html
|   |-- pathfinder-arena.js
|   |-- patna-1-space-shooter.html
|   |-- patna-1-space-shooter.js
|   |-- roast-arena.html
|   |-- roast-arena.js
|   |-- signal-heist.html
|   |-- signal-heist.js
|   |-- tower-slice-precision.html
|   |-- tower-slice-precision.js
|   |-- type-racer-code-lab.html
|   |-- type-racer-code-lab.js
|-- vendor/
|-- profile-photo.jpg
|-- main-photo.jpg
|-- donation-photo.png
|-- favicon.svg
`-- favicon-photo.png
```

## Local Setup

1. Clone the repository.
2. Open the project folder.
3. Run a simple static server.

```bash
python -m http.server 8080
```

4. Visit `http://localhost:8080`.

You can also open `index.html` directly, but a local server is better for consistent browser behavior.

## Usage

- Start on `index.html` for the main portfolio story
- Open `games.html` to browse the mini-arcade
- Use `donate.html` for the support experience
- Explore the project links that connect visitors back to core GitHub repositories

## Deployment

This repository is optimized for GitHub Pages.

1. Push changes to the default branch.
2. Enable GitHub Pages from the repository settings.
3. Use the root folder as the publishing source.

## Accessibility and Performance Notes

- The site includes a skip link and semantic page structure
- Static architecture keeps load complexity low
- Large image assets should be compressed further as visuals evolve
- New games should preserve keyboard friendliness and mobile responsiveness

## Demo and Screenshot Plan

Suggested screenshot filenames:

- `docs/images/portfolio-home-hero.png`
- `docs/images/portfolio-projects-section.png`
- `docs/images/arcade-games-grid.png`
- `docs/images/donate-page-flow.png`

Suggested alt-text pattern:

- `Screenshot of the Nishant Kumar Portfolio Arcade hero section`
- `Screenshot of the games hub showing playable browser game cards`

Suggested social preview idea:

- A split cover showing the portfolio hero on one side and the arcade grid on the other, with the title `Nishant Kumar Portfolio Arcade`

## Roadmap

- Add stronger per-project case study sections
- Improve game discovery with filters and short descriptions
- Add optimized screenshots and social preview assets
- Improve accessibility testing across desktop and mobile

## Contributing

Contributions are welcome if they improve clarity, accessibility, performance, or maintainability without breaking the visual identity of the project.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

The source code in this repository is available under the [MIT License](LICENSE).

Personal photos, branding assets, and demo media are handled separately in [NOTICE.md](NOTICE.md).

## Author

Built by Nishant Kumar
