import { parse as _sfcParse, SFCBlock, SFCDescriptor, SFCScriptBlock } from '@vue/compiler-sfc'
import { baseParse, transform, transformExpression, transformBind, RootNode } from '@vue/compiler-core'
import { parserOptions } from '@vue/compiler-dom'
import { parse as _babelParse } from '@babel/parser'
import { File } from '@babel/types'
import { babelParserDefaultPlugins } from '@vue/shared'

export interface SFCParsedResult {
  template: RootNode | null
  script: SFCScriptBlock | null
  scriptSetup: SFCScriptBlock | null
  scriptAST: File | null
  customBlocks: SFCBlock[]
}

export type QueryType = 'useQuery' | 'useSubscription' | 'useMutation'

export interface Query {
  name: string
  type: QueryType
  content: string
}

export function parse(source: string): SFCParsedResult {
  const { descriptor: { template, script, scriptSetup, customBlocks } } = _sfcParse(source)

  let _template = null
  let _scriptAST = null

  if (template) {
    const ast = baseParse(template.content, parserOptions)
    transform(ast, {
      nodeTransforms: [transformExpression],
      prefixIdentifiers: true,
      directiveTransforms: {
        bind: transformBind,
      },
    })

    _template = ast
  }

  if (scriptSetup) {
    const ast = _babelParse(scriptSetup.content, {
      sourceType: 'module',
      plugins: [
        ...babelParserDefaultPlugins,
        'typescript',
        'topLevelAwait',
      ],
    })

    _scriptAST = ast
  }

  return {
    customBlocks,
    script,
    scriptSetup,
    scriptAST: _scriptAST,
    template: _template,
  }
}

export function useGQLBlocksFromCustomBlocks(blocks: SFCBlock[]): Query[] {
  return blocks
    .filter(({ type }) => type === 'gql')
    .map(({ content, attrs }) => {
      let name = 'default'
      let type: QueryType = 'useQuery'

      if (attrs.name)
        name = attrs.name.toString()

      if (attrs.mutation)
        type = 'useMutation'
      else if (attrs.subscription)
        type = 'useSubscription'

      return {
        name,
        type,
        content,
      }
    })
}
