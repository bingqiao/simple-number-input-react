const { nodeExternalsPlugin } = require('esbuild-node-externals');
const {sassPlugin} = require('esbuild-sass-plugin');

const pkg = require('./package.json');
const publishing = process.env.BUILD_MODE === "publish";

require('esbuild').build({
    entryPoints: publishing ? [
        "./src/index.ts"
    ] : [
        "./src/test.tsx"
    ],
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ["chrome89", "firefox91", "safari15", "ios15"],
    outdir: publishing ? './lib' : './test',
    loader: { '.eot': 'file', '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.svg': 'file' },
    plugins: publishing ? [nodeExternalsPlugin(), sassPlugin()] : [sassPlugin()],
    format: 'esm',
    external: publishing ? [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies || {})
    ] : [],
}).catch(() => process.exit(1))