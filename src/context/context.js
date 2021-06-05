import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provide, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
	const [ githubUser, setGithubUser ] = useState(mockUser);
	const [ repos, setRepos ] = useState(mockRepos);
	const [ followers, setFollowers ] = useState(mockFollowers);

	// Request Loading Error States
	const [ requests, setRequests ] = useState(0);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState({ show: false, msg: '' });

	const searchGithubUser = async (user) => {
		toggleError(); // Default values created sets to False
		setLoading(true);
		const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
			console.log(err)
		);
		if (response) {
			setGithubUser(response.data);
			const { login, followers_url } = response.data;
			// Repos
			const reposData = `${rootUrl}/users/${login}/repos?per_page=100`;
			const followersData = `${followers_url}?per_page=100`;

			await Promise.allSettled([ axios(reposData), axios(followersData) ])
				.then((results) => {
					const [ repos, followers ] = results;
					const status = 'fulfilled';
					if (repos.status === status) {
						setRepos(repos.value.data);
					}
					if (followers.status === status) {
						setFollowers(followers.value.data);
					}
				})
				.catch((err) => console.log(err));
		} else {
			// if response is undefined
			toggleError(true, 'user not found with that username');
		}

		// if (response) {
		// 	setGithubUser(response.data);
		// 	const { login, followers_url } = response.data;
		// 	// Repos
		// 	axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) => {
		// 		setRepos(response.data);
		// 	});
		// 	// Followers
		// 	axios(`${rootUrl}/users/${followers_url}/?per_page=100`).then((response) => {
		// 		setFollowers(response.data);
		// 	});
		// }

		checkRequests();
		setLoading(false);
	};

	// Check Rate
	const checkRequests = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let { rate: { remaining } } = data;
				// Error Test
				// remaining = 0;
				setRequests(remaining);
				if (remaining === 0) {
					toggleError(
						true,
						'sorry you have exceeded your hourly request rate limit!'
					);
				} else {
				}
			})
			.catch((err) => console.log(err));
	};

	function toggleError(show = false, msg = '') {
		setError({ show, msg });
	}

	useEffect(() => {
		checkRequests();
		console.log('app loaded');
	}, []);

	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				requests,
				error,
				searchGithubUser,
				loading
			}}
		>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubProvider, GithubContext };
