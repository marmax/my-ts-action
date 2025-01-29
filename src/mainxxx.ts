import { JSONSchemaType } from 'ajv'
import Ajv from 'ajv/dist/2020'

interface Foo {
  foo: number
}

const FooSchema: JSONSchemaType<Foo> = {
  type: "object",
  properties: {foo: {type: "number"}},
  required: ["foo"],
  additionalProperties: false,
}

const ajv = new Ajv()
const validate = ajv.compile<Foo>(FooSchema) // type of validate extends `(data: any) => data is Foo`
const data: any = {foo: 1}
if (validate(data)) {
  // data is Foo here
  console.log(data.foo)
} else {
  console.log(validate.errors)
}

