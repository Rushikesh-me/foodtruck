import { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { motion } from "framer-motion";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Register(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			props.history.push("/redirect/register");
		},
		onError(err) {
			setErrors(
				err.graphQLErrors[0]?.extensions?.exception?.errors || {
					general: "An error occured, please try again",
				}
			);
		},
		variables: values,
	});

	function registerUser() {
		addUser();
	}

	return (
		<div className="flex flex-col md:flex-row h-screen w-screen justify-center">
			<div className="flex items-center justify-center h-screen w-screen md:w-2/4 px-8 md:px-0">
				<div className="w-full top-25">
					<form onSubmit={onSubmit} className={loading ? "loading" : ""}>
						<div className="flex-col">
							<div className="flex justify-center  py-4">
								<h2 className="w-96 h-12 px-4 font-poppins font-semibold text-4xl">Register</h2>
							</div>
							<div className="flex justify-center pt-2">
								<input className="w-96 h-12 bg-white60 px-4 rounded-xl text-xl outline-none focus:bg-white" label="Username" placeholder="Username.." name="username" type="text" value={values.username} error={errors.username ? true : false} onChange={onChange} />
							</div>
							<div className="flex justify-center py-2">
								<input className="w-96 h-12 bg-white60 px-4 rounded-xl text-xl outline-none focus:bg-white" label="Email" placeholder="Email.." name="email" type="email" value={values.email} error={errors.email ? true : false} onChange={onChange} />
							</div>
							<div className="flex justify-center py-2">
								<input className="w-96 h-12 bg-white60 px-4 rounded-xl text-xl outline-none focus:bg-white" label="Password" placeholder="Password.." name="password" type="password" value={values.password} error={errors.password ? true : false} onChange={onChange} />
							</div>
							<div className="flex justify-center py-2">
								<input className="w-96 h-12 bg-white60 px-4 rounded-xl text-xl outline-none focus:bg-white" label="Confirm Password" placeholder="Confirm Password.." name="confirmPassword" type="password" value={values.confirmPassword} error={errors.confirmPassword ? true : false} onChange={onChange} />
							</div>
							<div className="flex justify-center items-center pt-8 pb-4 focus:outline-none">
								<button type="submit" className="w-96 h-12 bg-night px-4 rounded-xl focus:outline-none">
									<motion.p className="font-mulish font-bold text-white text-xl focus:outline-none" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
										Register
									</motion.p>
								</button>
							</div>
						</div>
					</form>
					{Object.keys(errors).length > 0 && (
						<div className="flex justify-center pr-16">
							<ul className="w-96 text-center">
								{Object.values(errors).map((value) => (
									<span key={value} className="flex justify-center py-1 font-poppins text-base">
										{value}
									</span>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
			<div className="hidden md:flex h-2/4 sm:h-screen w-screen md:w-2/4 items-center bg-pink">
				<h2 className="px-16 font-poppins font-black text-4xl">
					Welcome Back. <br />
					Sign in to your Account
				</h2>
			</div>
		</div>
	);
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
