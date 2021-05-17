/**
 * I wrote all this at 3AM and have no idea what is even going on anymore
 * so I need to come back and clean this up at some point
 */

import { SFCDescriptor } from '@vue/compiler-sfc'
import { baseParse, transformExpression, transform, transformBind, transformElement } from '@vue/compiler-core'
import * as CompilerDom from '@vue/compiler-dom'
import { set } from 'lodash'
import { ExpressionNode, TemplateChildNode, NodeTypes, SimpleExpressionNode, CompoundExpressionNode, InterpolationNode, TextNode } from './compiler-core'
import { NodeMetadata } from './util'

export interface TemplateCalls {
  name: string
}

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isObject = (val: any): val is object => toString.call(val) === '[object Object]'

/**
 * Get the context for the current node
 */
function getContext(exp: ExpressionNode, name: string, ctx: [string, string] | null): [string, string] | null {
  if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
    if (name === 'for') {
      const [bound, binder] = exp.content.includes('in') ? exp.content.split('in') : exp.content.includes('of') ? exp.content.split('of') : ['', '']

      if (ctx) {
        return [
          binder.trim().replace(ctx[1], ctx[0]),
          bound.trim(),
        ]
      }

      return [binder.trim(), bound.trim()]
    }
  }

  return ctx
}

function mapCompound(nodes: (string | symbol | SimpleExpressionNode | CompoundExpressionNode | InterpolationNode | TextNode)[]): string[] {
  const data = ['']
  const whitelist = ['.', '].', '?.']

  nodes.forEach((node, i) => {
    if (isObject(node)) {
      if (node.type === NodeTypes.SIMPLE_EXPRESSION) {
        data[data.length - 1] += node.content

        if (isString(nodes[i + 1])) {
          if (whitelist.includes((nodes[i + 1] as string).trim()))
            data[data.length - 1] += '.'
          else
            data.push('')
        }
      }
    }
  })

  return data.filter(i => i)
}

function addExpression(exp: ExpressionNode, name: string, context: [string, string] | null): any {
  if (exp.type === NodeTypes.COMPOUND_EXPRESSION) {
    const nodes = mapCompound(exp.children)
    return nodes.map(n => context ? n.replace(context[1], context[0]) : n)
  }
  else if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
    if (name === 'for') {

    }
    else { return [exp.content].map(n => context ? n.replace(context[1], context[0]) : n) }
  }

  return []
}

function compileChild(child: TemplateChildNode, ctx: [string, string] | null = null): any[] {
  const data = []

  if ('props' in child) {
    child.props.forEach((prop) => {
      if (prop.type === NodeTypes.DIRECTIVE && prop.exp) {
        ctx = getContext(prop.exp, prop.name, ctx)
        data.push(...addExpression(prop.exp, prop.name, ctx))
      }
    })
  }

  if (child.type === NodeTypes.INTERPOLATION) {
    ctx = getContext(child.content, 'INTERPOLATION', ctx)
    data.push(...addExpression(child.content, 'INTERPOLATION', ctx))
  }

  if (child.type === NodeTypes.ELEMENT || child.type === NodeTypes.IF_BRANCH || child.type === NodeTypes.FOR)
    child.children.forEach(children => data.push(...compileChild(children, ctx)))

  return data
}

function processChildren(children: TemplateChildNode[], ctx: [string, string] | null = null) {
  const data: any[] = []

  children.forEach((child) => {
    data.push(...compileChild(child))
  })

  return data.filter(x => x)
}

export function processDescriptor(descriptor: SFCDescriptor) {
  const { template } = descriptor

  if (template?.content) {
    const ast = baseParse(template.content, {
      ...CompilerDom.parserOptions,
    })
    transform(ast, {
      nodeTransforms: [transformExpression],

      // For some reason some of the transforms won't work without this
      prefixIdentifiers: true,

      directiveTransforms: {
        bind: transformBind,
      },
    })

    return processChildren(ast.children as any).map(i => i.replace('_ctx.', ''))
  }

  return []
}

function toNested(x: string[]) {
  let nested: any = {}

  x
    .sort((a, b) => a.split('.').length - b.split('.').length)
    .forEach((y: string) => nested = set(nested, y, '\'VQL_REPLACE\''))

  return nested
}

export function genGQL(props: string[], imports: NodeMetadata[]): string[] {
  const queries: string[] = []

  const usedVariables = imports
    .filter(({ variableName }) => variableName)
    .map(({ variableName, callType }) => ({ variableName: variableName!, callType }))

  usedVariables.forEach((x) => {
    if (x.callType === 'useQuery') {
      const statements = props
        .filter(y => y.startsWith(x.variableName))
        .map(z => z.replace(`${x.variableName}.`, ''))
        .map(z => z.replace(`${x.variableName}`, ''))
        .filter(z => z)

      const output = JSON.stringify(toNested(statements), null, '  ')
        .replaceAll(':', '')
        .replaceAll(/'VQL_REPLACE'/g, '')
        .replaceAll(',', '')
        .replaceAll('"', '')

      queries.push(output)
    }
  })

  return queries
}
