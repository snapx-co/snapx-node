import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
const CopyWebpackPlugin = require('copy-webpack-plugin');

const assets = ['assets'];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
	new ForkTsCheckerWebpackPlugin({
		logger: 'webpack-infrastructure',
	}),
	new CopyWebpackPlugin({
		patterns: assets.map((asset) => ({
			from: path.resolve(__dirname, 'src', asset),
			to: path.resolve(__dirname, '.webpack/renderer', asset),
		})),
	}),
];
