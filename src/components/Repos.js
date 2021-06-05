import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
	const { repos } = React.useContext(GithubContext);

	// Data Extraction & Assignment
	const languages = repos.reduce((total, item) => {
		const { language, stargazers_count } = item;
		if (!language) return total;

		if (!total[language]) {
			total[language] = { label: language, value: 1, stars: stargazers_count };
		} else {
			total[language] = {
				...total[language],
				value: total[language].value + 1,
				stars: total[language].stars + stargazers_count
			};
		}
		return total;
	}, {});
	// .reduce((total, item) => {}, {}) | Second Arg {} will set total = an object where you can set properties dynamically
	// total starts as an object {}, returns that object each time with return total
	// Dynamically set properties onto object with total[property]
	// Set each property equal to an object with sub-properties
	// When an existing property is encountered, gather existing sub-properties within the object and then change desired properties
	// Set values of sub properties on each run through, each time returning total with updated properties (total + 1)

	// Most Used Languages Chart
	const mostUsedLanguages = Object.values(languages)
		// Object syntax allows access to methods on all JS Objects to be used on the object languages {}
		// .values Method converts object to an array, changing the total[language] keys into array indexes
		// Create new variable and set = array version of the languages object
		.sort((a, b) => {
			return b.value - a.value;
		})
		// Function in .sort() is used to determine the order of elements
		// Using b - a will sort array in descending order (highest to lowest), as opposed to the standard a - b (ascending order)
		// * Technically the values are still sorted in ascending order but the returns for the values are reversed so that the highest values return the smallest values, effectively sorting in descending order
		.slice(0, 5);
	// Slices only the first 5 items returned in the array created from .sort()

	// Most Popular Languages Chart
	const mostPopularLanguages = Object.values(languages)
		.sort((a, b) => {
			return b.stars - a.stars;
		})
		.map((item) => {
			return { ...item, value: item.stars };
		})
		.slice(0, 5);

	// Stars & Forks Charts
	let { stars, forks } = repos.reduce(
		(total, item) => {
			const { stargazers_count, name, forks } = item;
			// Function will technically overwrite data with same amount of stargazers_count / forks, returning the last one it finds with same amount. This will be rare for larger repos with many stars but common for the repos not sliced with very few stars/forks
			total.stars[stargazers_count] = { label: name, value: stargazers_count };
			total.forks[forks] = { label: name, value: forks };
			return total;
		},
		{ stars: {}, forks: {} }
	);
	// Destructure properties {stars, forks} immediately in order to set total (accumulator) to start at and to return an object with stars and forks as keys/sub-properties
	// Stars and Forks are destructured from the total returned
	// Use the number of stargazers as the key for each Object
	// Assign the label and value dynamically as .stars sub-property on each returned total object based on stargazer count for easier sorting

	stars = Object.values(stars)
		.slice(-5)
		// Slice off the last 5 items in the array since they will be the largest (returned data is ordered least to greatest)
		.reverse();
	//Reverse the array of 5 items to sort it from greatest to least
	forks = Object.values(forks).slice(-5).reverse();

	// const genericChartData = [
	// 	{
	// 		label: 'HTML',
	// 		value: '13'
	// 	},
	// 	{
	// 		label: 'CSS',
	// 		value: '23'
	// 	},
	// 	{
	// 		label: 'JavaScript',
	// 		value: '80'
	// 	}
	// ];

	return (
		<section className="section">
			<Wrapper className="section-center">
				<Pie3D data={mostUsedLanguages} />
				<Column3D data={stars} />
				<Doughnut2D data={mostPopularLanguages} />
				<Bar3D data={forks} />
				{/* <ExampleChart data={genericChartData} /> */}
			</Wrapper>
		</section>
	);
};

const Wrapper = styled.div`
	display: grid;
	justify-items: center;
	gap: 2rem;
	@media (min-width: 800px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 3fr;
	}

	/* div {
		width: 100% !important;
	}
	.fusioncharts-container {
		width: 100% !important;
	}
	svg {
		width: 100% !important;
		border-radius: var(--radius) !important;
	} */
`;

export default Repos;
