import SignupForm from "../components/SignupForm";

type Props = {};

const HomePage = (props: Props) => {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<SignupForm />
		</div>
	);
};

export default HomePage;
