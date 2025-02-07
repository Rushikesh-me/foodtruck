const webpack = require("webpack")

module.exports = {
	webpack: {
		plugins: {
			add: [
				new webpack.DefinePlugin({
					process: { env: {} },
				}),
				new webpack.ProvidePlugin({
					process: "process/browser",
				}),
			],
		},
	},
	style: {
		postcss: {
			plugins: [require("tailwindcss"), require("autoprefixer")],
		},
	},
};
