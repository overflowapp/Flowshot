const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        popup: path.join(__dirname, 'src/Popup.tsx'),
        client: path.join(__dirname, 'src/scripts/Client.ts'),
        content: path.join(__dirname, 'src/scripts/Content.ts'),
        main: path.join(__dirname, 'src/scripts/Main.ts'),
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
                test: /\.(png|eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=[name].[ext]',
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
};
