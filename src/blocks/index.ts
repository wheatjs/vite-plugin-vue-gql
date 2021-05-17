import { BlockModule } from '../properties'
import { defineModule } from '../util'
import { parse, useGQLBlocksFromCustomBlocks } from '../shared/parser'
import { useImportsFromScript, useNodesWithCallOf } from '../shared/scriptAST'
import { compile } from '../shared/compile'

export const blockModule = defineModule({
  id: BlockModule.id,
  async load() {
    return `
      export { useQuery, useMutation, useSubscription } from '@urql/vue'
    `
  },
  async transform(source) {
    const { scriptAST, customBlocks, scriptSetup } = parse(source)
    const queries = useGQLBlocksFromCustomBlocks(customBlocks)

    if (scriptAST && scriptSetup && queries.length > 0) {
      const imports = useImportsFromScript(scriptAST.program.body).filter(({ packageName }) => packageName === BlockModule.id)
      const nodes = useNodesWithCallOf(imports, scriptAST.program.body)
      const compiled = compile(scriptSetup!.content, nodes, queries)

      return source.replace(scriptSetup.content, compiled)
    }

    return source
  },
})
