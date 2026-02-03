/* Script to fetch GitHub Sponsors data and output as JSON */

import fetch from "node-fetch";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

async function fetchSponsors(token) {
	const query = `
    query {
      viewer {
        sponsorshipsAsMaintainer(first: 100, includePrivate: false, activeOnly: true) {
          nodes {
            sponsorEntity {
              ... on User {
                login
                name
                avatarUrl
              }
              ... on Organization {
                login
                name
                avatarUrl
              }
            }
            tier {
              name
              monthlyPriceInDollars
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

	const response = await fetch(GITHUB_GRAPHQL_API, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"User-Agent": "GitHub-Sponsors-Fetcher",
		},
		body: JSON.stringify({ query }),
	});

	if (!response.ok) {
		throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();

	if (data.errors) {
		throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
	}

	return data;
}

function transformSponsorData(rawData) {
	const sponsorships = rawData.data.viewer.sponsorshipsAsMaintainer.nodes;

	return sponsorships.map((sponsorship) => {
		const sponsor = sponsorship.sponsorEntity;
		const tier = sponsorship.tier;

		return {
			username: sponsor.login,
			name: sponsor.name || sponsor.login,
			profilePicUrl: sponsor.avatarUrl,
			tier: {
				name: tier.name,
				monthlyPriceInDollars: tier.monthlyPriceInDollars,
			},
		};
	});
}

async function main() {
	const token = process.env.GH_TOKEN;

	if (!token) {
		console.error("Error: GH_TOKEN environment variable is not set");
		console.error("Usage: GH_TOKEN=your_token_here npm run fetch-sponsors");
		process.exit(1);
	}

	try {
		console.error("Fetching GitHub Sponsors data...");
		const rawData = await fetchSponsors(token);
		const sponsors = transformSponsorData(rawData);

		// Output JSON to stdout
		console.log(JSON.stringify(sponsors, null, 2));

		console.error(`\nSuccessfully fetched ${sponsors.length} sponsors`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
}

main();
