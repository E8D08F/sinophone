import { OutputOptions, RollupBuild, RollupOptions, rollup } from 'https://esm.sh/rollup@3.23.0'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import shebang from 'rollup-plugin-preserve-shebang'

const options: RollupOptions = {
    input: './src/index.ts',
    output: {
        dir: './dist',
        format: 'es'
    },
    plugins: [ 
        typescript(),
        resolve(),
        shebang(),
    ]
}

const build = async () => {
    let bundle: RollupBuild | undefined
    let buildFailed = false

    try {
        bundle = await rollup(options)
        await bundle.write(options.output as OutputOptions)
    } catch (error) {
        buildFailed = true
        console.log(error)
    }

    if (bundle) await bundle.close()

    Deno.exit(buildFailed ? 1 : 0)
}

await build()
