const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        popup: path.join(__dirname, 'src/Popup.tsx'),
        background: path.join(__dirname, 'src/scripts/Background.ts'),
        client: path.join(__dirname, 'src/scripts/Client.ts'),
        content: path.join(__dirname, 'src/scripts/Content.ts'),
    },
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, 'plugin/js'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: { sourceMap: false },
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: false },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.(png|eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=[name].[ext]',
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
};
