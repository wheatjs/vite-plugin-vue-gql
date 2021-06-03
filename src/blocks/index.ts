import { BlockModule } from '../properties'
import { defineModule } from '../util'
import { parse, useGQLBlocksFromCustomBlocks } from '../ast/parser'
import { useImportsFromScript, useNodesWithCallOf } from '../ast/scriptAST'
import { compile } from '../ast/compile'
import { generateFragmentImports } from '../fragments/fragments'

export const blockModule = defineModule({
  id: BlockModule.id,
  async load() {
    return `
      export { useQuery, useMutation, useSubscription, useClientHandle } from '@urql/vue'
    `
  },
  async transform(source) {
    const { scriptAST, customBlocks, scriptSetup } = parse(source)
    const queries = useGQLBlocksFromCustomBlocks(customBlocks)

    if (scriptAST && scriptSetup && queries.length > 0) {
      const imports = useImportsFromScript(scriptAST.program.body)
        .filter(({ packageName }) => packageName === BlockModule.id)
        .filter(({ imported }) => imported !== 'useClientHandle')
      const nodes = useNodesWithCallOf(imports, scriptAST.program.body)
      const compiled = compile(scriptSetup!.content, nodes, queries)
      const final = generateFragmentImports(queries, compiled)

      return source.replace(scriptSetup.content, final)
    }

    return source
  },
})
