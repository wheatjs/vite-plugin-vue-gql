import { GenerationModule } from '../properties'
import { defineModule, getPossiblePrototypes } from '../util'
import { parse } from '../ast/parser'
import { useImportsFromScript, useNodesWithCallOf, usePropsWithPropertyOf } from '../ast/scriptAST'
import { useTemplateProps } from '../ast/templateAST'
import { convertPathsToObject, removePrototypesFromPaths } from './util'

export const generationModule = defineModule({
  id: GenerationModule.id,
  async load() {
    return `
      export { useQuery, useMutation, useSubscription, useClientHandle } from '@urql/vue'
    `
  },
  async transform(source) {
    const { scriptAST, scriptSetup, template } = parse(source)

    if (scriptAST && template) {
      const imports = useImportsFromScript(scriptAST.program.body).filter(({ packageName }) => packageName === GenerationModule.id)
      if (imports.length > 0) {
        const nodes = useNodesWithCallOf(imports, scriptAST.program.body)
        const paths = [
          // @ts-expect-error
          ...useTemplateProps(template).filter((path) => {
            if (nodes.map(({ variableName }) => variableName).includes(path.split('.')[0]))
              return path

            return null
          }).filter(x => x),
          ...usePropsWithPropertyOf(nodes, scriptAST),
        ]

        /**
         * In it's current state we have an issue where if you use something
         * on the object prototype, like .length, this will interpert it as
         * a query instead of a property accessor. To get around this we can use
         * some of the following methods.
         *
         * Best Soluiton:
         * If the user provides the graphql schmea, then we can compare
         * it to the graphql schema and determine which proerpties we want
         * to keep
         *
         * Okay Solution:
         * We can get common object prototypes and remove them from the gql
         * paths we have generated thus far, this could cause problems though,
         * so we want to push users to provide a schema.
         */

        // Normalized Paths
        const _normalizedPaths = removePrototypesFromPaths(paths, getPossiblePrototypes())
        const normalizedPaths = _normalizedPaths.filter((c, i) => _normalizedPaths.indexOf(c) === i)

        convertPathsToObject(normalizedPaths)
      }
    }

    return source
  },
})
