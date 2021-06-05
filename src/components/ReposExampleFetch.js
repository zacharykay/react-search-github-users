import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
	const { repos } = React.useContext(GithubContext);

	let languages = repos.reduce((total, item) => {
		const { language} = item;
		if (!language) return total;

		if (!total[language]) {
			total[language] = { label: language, value: 1};
		} else {
			total[language] = { ...total[language], value: total[language].value + 1};
		}
		return total;
	}, {});
	// .reduce((total, item) => {}, {}) | Second Arg {} will set total = an object where you can set properties dynamically
	// total starts as an object {}, returns that object each time with return total
	// Dynamically set properties onto object with total[property]
	// Set each property equal to an object with sub-properties
	// When an existing property is encountered, gather existing sub-properties within the object and then change desired properties
	// Set values of sub properties on each run through, each time returning total with updated properties (total + 1)

	languages = Object.values(languages)
		// Object syntax allows access to methods on all JS Objects to be used on the object languages {}
		// .values Method converts object to an array, changing the total[language] keys into array indexes
		// Sets languages variable = array version of the languages object
		.sort((a, b) => {
			return b.value - a.value;
		})
		// Function in .sort() is used to determine the order of elements
		// Using b - a will sort array in descending order (highest to lowest), as opposed to the standard a - b (ascending order)
		// * Technically the values are still sorted in ascending order but the returns for the values are reversed so that the highest values return the smallest values, effectively sorting in descending order
		.slice(0, 5);
	// Slices only the first 5 items returned in the array created from .sort()

	const chartData = [
		{
			label: 'HTML',
			value: '13'
		},
		{
			label: 'CSS',
			value: '23'
		},
		{
			label: 'JavaScript',
			value: '80'
		}
	];

	return (
		<section className="section">
			<Wrapper className="section-center">
				<Pie3D data={languages} />
				<div />
				<Doughnut2D data={chartData} />
				{/* <ExampleChart data={chartData} /> */}
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
