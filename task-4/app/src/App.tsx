import "./App.css";
import Router, { Switch, Route } from "crossroad";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" component={HomePage} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
			</Switch>
		</Router>
	);
}

export default App;
