import applyPreset from './presets'
import postProcess from './postProcessor'
import schemaDrivenParser from 'jargon-parser'
import defaultArgumentSchema from './argumentSchema.json'
import * as extend from '../extensible'

function mergeSchemas(base, subSchemas){
  Object.assign(base.definitions, subSchemas)
  Object.keys(subSchemas).forEach(
    module => base.allOf.push({ "$ref": `#/definitions/${module}` }))
  return base
}

export const argumentSchema = extend.byRequireMap({
  merger: mergeSchemas,
  defaults: defaultArgumentSchema,
  path: ['parser', 'argumentSchema']
})

const parseArgs = schemaDrivenParser({
  name: 'polypacker',
  description: '\ncontext-driven js distribution tool for multiple environments\n',
  schema: argumentSchema
})

export default function parse(argstring){
  let options = Object.assign(
    extend.byLiteral({ defaults: {}, path: ['arguments'] }),
    parseArgs(argstring && argstring.trim().split(/ +/))
  )
  return {
    config: postProcess(applyPreset(options)),
    unknown: {}
  }
}
