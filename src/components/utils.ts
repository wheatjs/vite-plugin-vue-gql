import { promises as fs } from 'fs'
import { inspect } from 'util'
import fetch from 'node-fetch'
import { buildClientSchema, buildSchema, parse, printSchema, GraphQLSchema, getIntrospectionQuery, ObjectTypeDefinitionNode, FieldDefinitionNode, DocumentNode, ScalarTypeDefinitionNode } from 'graphql'
import { codegen } from '@graphql-codegen/core'
import * as typescriptPlugin from '@graphql-codegen/typescript'

export async function downloadSchema(url: string) {
  const query = getIntrospectionQuery()
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName: 'IntrospectionQuery', query }),
  })

  const data = (await response.json()).data
  return buildClientSchema(data)
}

export async function generateTypesFromSchema(schema: GraphQLSchema) {
  return await codegen({
    filename: '',
    documents: [],
    config: {},
    schema: parse(printSchema(schema)),
    plugins: [{ typescript: {} }],
    pluginMap: { typescript: typescriptPlugin },
  })
}

export async function openSchema(path: string) {
  const data = await fs.readFile(path, 'utf-8')
  return buildSchema(data)
}

export function extractArgumentsFromQuery(query: FieldDefinitionNode) {
  if (!query.arguments)
    return []

  return query.arguments.map((arg) => {
    const name = arg.name.value
    const defaultValue = arg.defaultValue
    const required = arg.type.kind === 'NonNullType'
    let type

    if (arg.type.kind === 'NamedType') { type = arg.type.name.value }
    else if (arg.type.kind === 'NonNullType') {
      if (arg.type.type.kind === 'NamedType')
        type = arg.type.type.name.value
    }

    return {
      name,
      type,
      required,
      defaultValue,
    }
  })
}

export function getScalars(ast: DocumentNode) {
  return [
    'Int',
    'Float',
    'String',
    'Boolean',
    'ID',
    ...ast.definitions
      .filter((node): node is ScalarTypeDefinitionNode => node.kind === 'ScalarTypeDefinition')
      .map(node => node.name.value),
  ]
}

export function resolveFieldKind(node: FieldDefinitionNode) {
  const name = node.name.value
  const type: string | null = null
  const isList = false
  const isRequired = false

  // if (node.type.kind === 'NamedType') {
  //   type = node.type.name.value
  // }
  // else if (node.type.kind === 'NonNullType') {
  //   isRequired = true
  //   if (node.type.type.kind === 'NamedType')
  //     type = node.type.type.name.value
  // }
  // else if (node.type.kind === 'ListType') {
  //   isList = true
  //   if (node.type.type.kind === '')
  // }

  return {
    name,
    type,
    isRequired,
    isList,
  }
}

export function resolveType(name: string, ast: DocumentNode, scalars: string[]) {
  const definition = ast.definitions.find((node) => {
    if ('name' in node) {
      if (node.name?.value === name)
        return node
    }

    return false
  })
  let fields = definition?.kind === 'ObjectTypeDefinition' ? definition.fields : []

  if (definition && definition.kind === 'ObjectTypeDefinition' && definition.fields) {
    fields = definition.fields.map((field) => {
      const fieldName = field.name.value

      // if (field.type.kind === 'NamedType') {
      //   const fieldType = field.type.name.value
      //   const fieldName = field.name.value
      // }

      return field
    })
  }

  return {
    ...definition,
    fields,
  }
}

export async function generateSDLQueryFromSchema(schema: GraphQLSchema) {
  const ast = parse(printSchema(schema))
  const query = ast.definitions.find((node): node is ObjectTypeDefinitionNode => node.kind === 'ObjectTypeDefinition' && node.name.value === 'Query')

  if (!query || !query.fields)
    return

  const scalars = getScalars(ast)

  resolveType('PhysicalFile', ast, scalars)

  // console.log(inspect(resolveType('PhysicalFile', ast), false, null, true))

  // console.log(inspect(ast, false, 3, true))

  // const queries = query.fields.map((q) => {
  //   const args = extractArgumentsFromQuery(q)

  //   if (q.type.kind === 'NamedType') {
  //     const type = q.type.name.value
  //     resolveType(type, ast)
  //   }
  //   else if (q.type.kind === 'ListType') {

  //   }

  //   console.log(q.name.value, q.type)

  //   return null
  // })
}
