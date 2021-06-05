import React from 'react';
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
	return (
		<AuthWrapper>
			<Router>
				{/* Switch renders the first child component that matches path, allowing Error "*" and "/" Homepage/Dashboard page */}
				<Switch>
					<PrivateRoute path="/" exact={true}>
						<Dashboard />
					</PrivateRoute>
					<Route path="/login">
						<Login />
					</Route>
					<Route>
						<Error path="*" />
					</Route>
				</Switch>
			</Router>
		</AuthWrapper>
	);
}

export default App;
